import ejs from 'ejs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import signupRoute from './controllers/signup';
import paymentRoute from './controllers/payment';
import verificationRoute from './controllers/verification';

import { swaggerUi, swaggerDocs } from './swagger'; 

import {pricing, plans} from './config/product_details';

import dotenv from 'dotenv';

import express, {Request, Response} from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import { localLogin, userFromId, hasRole } from './controllers/localLogin';
import { createLogin } from './controllers/createLogin';
import businessManager from './controllers/businessManager';
import apiRoutes from './controllers/apiRoutes';

const LocalStrategy = passportLocal.Strategy

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


if(process.env.SESSION_KEY) {
  app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));
} else {
  console.error('Session key missing');
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // This is required for persistent login sessions

// Set the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


passport.use('employee-login', new LocalStrategy(
  localLogin
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(userFromId);




// Define a route
app.get('/', async (req, res) => {
    return res.render("index", { name: "User" });
});

app.post('/employee/login', passport.authenticate('employee-login', {
  successRedirect: '/business-manager/dashboard',
  failureRedirect: '/business-manager/login?error=true'
}));


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/signup-submit', signupRoute);
app.use('/payment', paymentRoute);
app.use('/verification', verificationRoute);
app.use('/business-manager', businessManager);

app.use('/api', hasRole(['Admin', 'manager', 'associate']), apiRoutes);

app.get('/create-login', hasRole(['Admin']), (req: Request, res: Response) => {
  return res.render('create-login', {status: ''});
});

app.post('/create-login', hasRole(['Admin']), createLogin);


app.get('/signup-details', async (req: Request, res: Response) => {
  const queryParams = req.query as {plan: string | undefined}

  console.log("plans, " + plans);
  const {plan} = queryParams;

  if(!plan || !plans.includes(plan as string)) {
    return res.redirect('/');
  }

  req.session.planName = plan;

  console.log("After setting plan: ", req.session);

  return res.render('signup-details', {plan});

})
const validPages = ['create-login', 'verification', 'manager-login', 'payment', 'pricing', 'index', 'signup-details'];

app.get('/:page', (req: Request, res: Response) => {
  const { page } = req.params; // Access route parameters

  try {
      if(validPages.includes(page)) {
        return res.render(`${page}`, { status: ''}); // Dynamically render the EJS file
      } else {
        return res.status(404).send('Page not found');
      }
  
    } catch (err) {
      console.error(err);
      return res.status(404).send('Page not found'); // Handle errors
  }
  

});

// Start the server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;