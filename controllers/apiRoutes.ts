import express, { Request, Response, Router } from 'express';
import viewSettings from '../config/viewSettings';
import { PrismaClient } from '@prisma/client';
import getCustomer from './api/getCustomer';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Example route
router.get('/get-view-settings', (req: Request, res: Response) => {
  const {role} = req.user;

  if(role in viewSettings) {
    return res.json(viewSettings[role])

  } else {
    return res.status(400).json({message: 'Invalid role'})
  }
});

/**
 * Returns customer by search of email or username
 */
router.post('/customers/search/:text', async (req: Request, res: Response) => {

  const searchText = req.params.text;

  try {
    const customers = await prisma.customers.findMany({
        where: {
            OR: [
                {
                    email: {
                        contains: searchText, // Matches if email contains searchText
                        mode: 'insensitive',  // Case insensitive
                    },
                },
                {
                    name: {
                        contains: searchText, // Matches if name contains searchText
                        mode: 'insensitive',  // Case insensitive
                    },
                },
            ],
        },
    });

    return res.json(customers);
  } catch (error) {
      console.error('Error searching for customers:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }

})

router.get('/customers/:id', getCustomer);

export default router;