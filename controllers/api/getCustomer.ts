import { Request, Response } from "express";

import CustomersService from '../../service/CustomersService'

const customersService = new CustomersService();


const getCustomer = async function(req: Request, res: Response) {
  const customerId = req.params.id;

  if(!customerId || Number.isNaN(Number(customerId))) {
    return res.status(400).json({message: 'Customer id not included in parameters' });
  }

  try {
    console.log('customerId = ', Number.parseInt(customerId));
    const data = await customersService.getCustomerData(Number.parseInt(customerId));

    return res.json(data);
  } catch(err: any) {
  
    if(err.message === 'NoCustomer') {
      return res.status(400).json({message: 'Customer with the provided id not found'});
    } else {
      return res.status(500).json({message: 'an error occured'});
    }
  }

}

export default getCustomer;