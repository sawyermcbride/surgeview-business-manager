import {jest, beforeEach, describe, test, afterEach, expect, beforeAll} from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { Request,  Response, NextFunction} from 'express';
import OrdersService from '../../service/OrdersService';
import EmployeesService from '../../service/EmployeesService';

jest.mock('../../service/OrdersService');
jest.mock('../../service/EmployeesService');


const mockedOrdersService = new OrdersService() as jest.Mocked<OrdersService>;

const mockedEmployeesService = new EmployeesService() as jest.Mocked<EmployeesService>;

const mockedOrders = [
  {
    "id": 1,
    "youtubeUrl": "https://youtube.com/example",
    "channelName": "Example Channel",
    "customerEmail": "customer@example.com",
    "createdAt": new Date("2024-10-09T08:58:22.272Z").toISOString() as unknown as Date
  },
]

const generateUserObject = function(role: string, id: number) {
  return {
    id,
    name: 'SurgeView Marketing',
    username: 'admin',
    password: 'password',
    createdAt: new Date(),
    email: 'test@surgeviewmarketing.com',
    role
  }
}

const getSession = async function(role: string, id: number = 2 ) {
  mockedEmployeesService.login.mockResolvedValueOnce(generateUserObject(role, id));
  mockedEmployeesService.getUserById.mockResolvedValue(generateUserObject(role, id));

  const getSessionResponse = await request(app)
  .post('/employee/login')
  .send({username: 'admin', password: 'password'});

  return getSessionResponse.headers['set-cookie'];
}


describe('Orders routes tests: ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('/api/orders returns 400 for invalid date provided', async() => {
    const sessionData = await getSession('manager');

    const response = await request(app)
    .get('/api/orders?start=aaa&end=bbb')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: 'Invalid date provided'});

  });

  test('/api/orders returns 200 with valid data for correct input', async() => {
    mockedOrdersService.getOrders.mockResolvedValueOnce(mockedOrders)

    const sessionData = await getSession('manager');

    const response = await request(app)
    .get('/api/orders?start=2024-10-10&end=2024-10-12')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockedOrders);

    expect(mockedOrdersService.getOrders).toHaveBeenNthCalledWith(1, 
      new Date(`2024-10-10T00:00:00Z`), new Date(`2024-10-12T00:00:00Z`));
  });

  test('/api/orders returns 200 with valid data for default input without dates', async() => {
    mockedOrdersService.getOrders.mockResolvedValueOnce(mockedOrders)

    const sessionData = await getSession('manager');

    const response = await request(app)
    .get('/api/orders')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockedOrders);

    expect(mockedOrdersService.getOrders).toHaveBeenNthCalledWith(1,null, null);
  });

})
