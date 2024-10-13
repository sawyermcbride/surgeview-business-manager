import { Request, Response} from "express";
import OrdersService from "../../service/OrdersService";

const ordersService = new OrdersService();



const updateOrder = async function(req: Request, res: Response) {
  /**
   * Expected through json not form data type
   */
  const {orderId, youtubeUrl, channelName} = req.body;

  if(!orderId) {
    return res.status(400).json({message: 'Missing orderId field'});
  }
  /**
   * Only one of youtubeUrl or channelName field is required
   */
  if(!youtubeUrl && !channelName) {
    return res.status(400).json({message: 'Invalid parameters'});
  }

  try {
    /**
     * result will be 1 for single record updated, orderId is unique so only 1 per update is expected
     */
    const result = await ordersService.updateOrder(orderId, youtubeUrl || '', channelName || '');

    return res.json({message: `${result} record updated`, orderId});

  } catch(err: any) {
    return res.status(500).json({message: err.message});
  }

}

export default updateOrder;

