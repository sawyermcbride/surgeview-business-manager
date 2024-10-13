import { Request, Response } from "express";
import OrdersService from "../../service/OrdersService";

const ordersService = new OrdersService();

const getOrders = async function(req: Request, res: Response) {
  
  const {start, end} = req.query;
    
  let startDate, endDate;

  if(start && end) {
    startDate = new Date(`${start}T00:00:00Z`);
    endDate = new Date(`${end}T00:00:00Z`);
  }


  try {
  
    const orders = await ordersService.getOrders(startDate || null, endDate || null);
    
    return res.json(orders);

  } catch(err: any) {
    if(err.message === 'InvalidDate') {
      return res.status(400).json({message: 'Invalid date provided'});
    } else {
      return res.status(500).json({message: err.message})
    }
  }
  
}

export default getOrders;