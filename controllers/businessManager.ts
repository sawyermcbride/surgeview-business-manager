import express, {NextFunction, Request, Response, Router} from 'express';
import { hasRole } from './localLogin';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  const {error} = req.query;
  if(error) {
    return res.render('manager-login', {status: 'error', message: 'Login error'});
  } else {
    return res.render('manager-login', {status: 'none'});
  }
});

router.get('/dashboard', hasRole(['Admin', 'manager', 'associate']), (req: Request, res: Response) => {
  return res.render('business_dashboard');
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if(err) return next(err);
    
    return res.json({message: "Logged out"});;
  })
})

export default router;