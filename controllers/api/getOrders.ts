import { Request, Response } from "express";
import OrdersService from "../../service/OrdersService";

const ordersService = new OrdersService();

const getOrders = async function(req: Request, res: Response) {
  
  const {start, end} = req.query;
    
  let startDate, endDate;
  try {

    if(start && end) {
      startDate = new Date(`${start}T00:00:00Z`);
      endDate = new Date(`${end}T00:00:00Z`);

      if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('InvalidDate');
      }
    }


  
    const orders = await ordersService.getOrders(startDate || null, endDate || null);
    console.log("orders = ", orders);
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