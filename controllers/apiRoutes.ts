import express, { Request, Response, Router } from 'express';
import viewSettings from '../config/viewSettings';
import { PrismaClient } from '@prisma/client';
import getCustomer from './api/getCustomer';
import searchCustomers from './api/searchCustomers';

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

router.post('/customers/search/:text', searchCustomers);

/**
 * Get orders and customer data of a given customer id 
 */

router.get('/customers/:id', getCustomer);

export default router;