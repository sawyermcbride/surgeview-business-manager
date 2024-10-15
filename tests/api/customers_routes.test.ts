import {jest, beforeEach, describe, test, afterEach, expect, beforeAll} from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { Request,  Response, NextFunction} from 'express';
import EmployeesService from '../../service/EmployeesService';
import CustomersService from '../../service/CustomersService';

jest.mock('../../service/EmployeesService');
jest.mock('../../service/CustomersService');

const mockedEmployeesService = new EmployeesService() as jest.Mocked<EmployeesService>;
const mockedCustomersService = new CustomersService() as jest.Mocked<CustomersService>;

const mockCustomerData = {
  customer: {
      id: 1,
      name: "Test Customer",
      email: "test@surgeviewmarketing.com",
      createdAt: new Date('2024-10-09T08:58:22.143Z').toISOString() as unknown as Date
  },
  orders: [
    {
        id: 2,
        youtubeUrl: "https://www.youtube.com/watch?v=w8FO9cMKyOU",
        channelName: "SurgeView Marketing",
        customerEmail: "test@surgeviewmarketing.com",
        createdAt: new Date('2024-10-09T08:58:22.272Z').toISOString() as unknown as Date
    }
  ]
};

const mockedCustomerSearch = [
  {
      "id": 2,
      "name": "Test user ",
      "email": "testuser@example.com",
      "createdAt": new Date("2024-10-09T08:58:22.143Z").toISOString() as unknown as Date
  },
  {
      "id": 3,
      "name": "Test user 2",
      "email": "testuser2@example.com",
      "createdAt": new Date("2024-10-09T08:58:22.143Z").toISOString() as unknown as Date
  }
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

describe("Customer routes tests", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  })

  test('/api/customers/:id returns 400 for missing id', async() => {
    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .get('/api/customers/')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: 'Customer id not included in parameters' });

  });

  test('/api/customers/:id returns 400 for non numeric id', async() => {
    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .get('/api/customers/aa')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({message: 'Customer id not included in parameters' });

  });

  test('/api/customers/:id returns 200 and expected data format for found customer', async() => {
   
    mockedCustomersService.getCustomerData.mockResolvedValueOnce(mockCustomerData);

    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .get('/api/customers/2')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(200);

    expect(response.body).toEqual(mockCustomerData);

    expect(mockedCustomersService.getCustomerData).toHaveBeenNthCalledWith(1, 2);

  });

  test('/api/customers/:id returns 400 for no customer found with given id', async() => {
   
    mockedCustomersService.getCustomerData.mockRejectedValueOnce(Error('NoCustomer'));

    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .get('/api/customers/3')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(400);

    expect(response.body).toEqual({message: 'Customer with the provided id not found'});

    expect(mockedCustomersService.getCustomerData).toHaveBeenNthCalledWith(1, 3);
  });

  test('/api/customers/search/:term? returns 400 for no search term', async() => {
  
    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .post('/api/customers/search')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(400);

    expect(response.body).toEqual({message: 'No search term provided'});

    expect(mockedCustomersService.searchCustomers).toHaveBeenCalledTimes(0);
  });

  test('/api/customers/search/:term? returns 200 with data for customer search', async() => {
    mockedCustomersService.searchCustomers.mockResolvedValueOnce(mockedCustomerSearch);

    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .post('/api/customers/search/test')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(200);

    expect(response.body).toEqual(mockedCustomerSearch);

    expect(mockedCustomersService.searchCustomers).toHaveBeenNthCalledWith(1, 'test');
  });

  test('/api/customers/search/:term? returns 200 with data for no results', async() => {
    mockedCustomersService.searchCustomers.mockRejectedValueOnce(Error('NoCustomer'));

    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .post('/api/customers/search/otherterm')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(200);

    expect(response.body).toEqual({message: 'No customer found', customers: []});

    expect(mockedCustomersService.searchCustomers).toHaveBeenNthCalledWith(1, 'otherterm');
  });

  test('/api/customers/search/:term? returns 500 for other error', async() => {
    mockedCustomersService.searchCustomers.mockRejectedValueOnce(Error('OtherError'));

    const sessionData = await getSession('manager');
  
    const response = await request(app)
    .post('/api/customers/search/otherterm')
    .set('Cookie', sessionData);

    expect(response.status).toEqual(500);

    expect(response.body).toEqual({message: 'Error searching for customer'});

    expect(mockedCustomersService.searchCustomers).toHaveBeenNthCalledWith(1, 'otherterm');
  });

});