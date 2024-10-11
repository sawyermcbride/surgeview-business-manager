import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { plans, pricing } from '../config/product_details';

const prisma = new PrismaClient();


// signup.ts

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

    console.log("Session data on signup, ", req.session);
  
  

    // Validate plan
    if (!plan || !plans.includes(plan as string)) {
        return res.redirect('/'); // Redirect if plan is invalid
    }

    req.session.email = email;
    req.session.videoLink = videoLink;
    

    console.log('Form data:', { name, email, channelName, videoLink });

    try {
        // Check if customer exists
        let customer = await prisma.customers.findUnique({
            where: {
                email: email,
            },
        });

        // If customer does not exist, create a new customer
        if (!customer) {
            customer = await prisma.customers.create({
                data: {
                    email: email,
                    name: name,
                },
            });
        }

        // Create an order
        const order = await prisma.orders.create({
            data: {
                youtubeUrl: videoLink,
                channelName,
                customerEmail: customer.email,
            },
        });

        // Redirect to payment page
        return res.redirect(`/verification`);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
});

export default router;
