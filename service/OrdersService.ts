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
    if(!youtubeUrl || !channelName || customerEmail) {
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
}