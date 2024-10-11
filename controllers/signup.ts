
// signup.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { plans, pricing } from '../config/product_details';
import CustomersService from '../service/CustomersService';
import OrdersService from '../service/OrdersService';

const prisma = new PrismaClient();
const customersService = new CustomersService();
const ordersService = new OrdersService();


const router = Router();


// POST route for handling sign-up submission
router.post('/', async (req: Request, res: Response) => {
    const { name, email, channelName, videoLink } = req.body as {
        name: string;
        email: string;
        channelName: string;
        videoLink: string;
    };

    const plan = req.session.planName;

    if (!plan || !plans.includes(plan as string)) {
        return res.redirect('/'); 
    }

    req.session.email = email;
    req.session.videoLink = videoLink;
    

    console.log('Form data:', { name, email, channelName, videoLink });

    try {
        // Check if customer exists, if it does it will use existing customer

        let createdCustomer = await customersService.createCustomer(name, email);

        const createdOrder = await ordersService.createOrder(videoLink, channelName, createdCustomer.customer.email);

        return res.redirect(`/verification`);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
});

export default router;
