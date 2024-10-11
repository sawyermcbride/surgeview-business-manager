// paymentRouter.ts
import { Router, Request, Response } from 'express';
import { plans, pricing } from '../config/product_details';

const router = Router();

// GET route for handling payment
router.get('/', (req: Request, res: Response) => {
    const sessionData = req.session;
    console.log(sessionData);
    const { planName: plan, videoLink, email, } = sessionData;


    // Validate parameters
    if (!plan || !plans.includes(plan) || !videoLink || !email) {
        return res.redirect('/'); // Redirect to home if validation fails
    }

    // Render the payment view with the specified parameters
    return res.render('payment.ejs', { plan, price: pricing[plan], videoLink });
});

export default router;
