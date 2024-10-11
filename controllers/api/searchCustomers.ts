
import { Request, Response } from "express";
import CustomersService from "../../service/CustomersService";

const customersService = new CustomersService();

const searchCustomers = async function(req: Request, res: Response) {
  const searchText = req.params.text

  if(!searchText) {
    return res.status(400).json({message: 'No search term provided'});
  }

  try {
    const customers = await customersService.searchCustomers(searchText);

    return res.json(customers);

  } catch (error: any) {
    
    if(error.message === 'NoCustomer') {

      return res.status(200).json({message: 'No customer found', customers: []});
    }

    return res.status(500).json({message: 'Error searching for customer'});
      
  }
}
export default searchCustomers;