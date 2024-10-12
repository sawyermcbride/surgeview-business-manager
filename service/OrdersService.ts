import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class OrdersService {
  /**
   * Creates order
   * @param youtubeUrl 
   * @param channelName 
   * @param customerEmail 
   * @returns Order Object
   * @throws Error('InvalidParameters') for missing parameters
   */
  public async createOrder(youtubeUrl: string, channelName: string, customerEmail: string) {
    if(!youtubeUrl || !channelName || !customerEmail) {
      throw new Error('InvalidParameters')
    }
    const order = await prisma.orders.create({
      data: {
          youtubeUrl,
          channelName,
          customerEmail
      },
    });

    return order;

  }
  /**
   * Gets recent 100 orders or orders within provided dates, at most 7 days apart 
   * @param start Optional start date
   * @param end Optional end date
   * @throws Error('InvalidDate') if the dates are invalid or more than 7 days apart
   */
  public async getOrders(start?: Date | null, end?: Date | null) {
    if(start && isNaN(start.getTime())) {
      throw new Error('InvalidDate');
    }

    if(end && isNaN(end.getTime())) {
      throw new Error('InvalidDate');
    }

    if(start && end && start > end) {
      throw new Error('InvalidDate');
    }

    const maxRange = 7 * 24 * 60 * 60 * 1000;

    if(start && end && end.getTime() - start.getTime() > maxRange) {
      throw new Error('InvalidDate');
    }

    const query: any = {};

    if(start && end) {
      query.createdAt = {
        gte: start,
        lte: end
      };
    }

    
    let orders = await prisma.orders.findMany({
      where: query,
      orderBy: {createdAt: 'desc'},
      take: query.createdAt ? undefined: 100
    })
    
    

    return orders;

  }
}

export default OrdersService;