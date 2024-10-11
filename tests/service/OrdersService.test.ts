import {jest, test, describe, beforeAll, expect, beforeEach} from '@jest/globals';

import { PrismaClient } from '@prisma/client';
import OrdersService from '../../service/OrdersService';



jest.mock('@prisma/client');


const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

const ordersService = new OrdersService();

const mockOrder = {id: 1, youtubeUrl: 'https://www.youtube.com/watch?v=w8FO9cMKyOU',
  channelName: 'SurgeView Marketing', customerEmail: 'user@example.com', createdAt: new Date()
}

describe('Orders service tests', () => {
  beforeEach( () => {
    jest.resetAllMocks();
  })

  test('Returns new order when created', async () => {
    console.log(ordersService);
    prismaMock.orders.create.mockResolvedValueOnce(mockOrder);

    const result = await ordersService.createOrder('https://www.youtube.com/watch?v=w8FO9cMKyOU', 
      'SurgeView Marketing','user@example.com')

    expect(result).toEqual(mockOrder);

    expect(prismaMock.orders.create).toHaveBeenNthCalledWith(1, {data: {
      youtubeUrl: 'https://www.youtube.com/watch?v=w8FO9cMKyOU',
      channelName: 'SurgeView Marketing',
      customerEmail: 'user@example.com'
    }});
  })
})