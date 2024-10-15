import {jest, test, describe, beforeAll, expect, beforeEach} from '@jest/globals';

import { PrismaClient } from '@prisma/client';
import CustomersService from '../../service/CustomersService';


jest.mock('@prisma/client');


const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;
const customersService = new CustomersService();

const mockUser = {
  username: 'admin',
  password: 'testpassword',
  id: 2,
  createdAt: new Date(),
  email: 'test@surgeviewmarketing.com',
  name: 'Name',
  role: 'Admin'
}

const mockOrders = [
  { id: 1, youtubeUrl: 'https://www.youtube.com/watch?v=w8FO9cMKyOU', channelName: 'SurgeView Marketing',
    customerEmail: 'SurgeView Marketing', createdAt: new Date()}
]

describe('Customers Service tests', () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  })


  test('getCustomerData throws error for no customer found', async() => {
    prismaMock.customers.findUnique.mockResolvedValueOnce(null);

    
    await expect(customersService.getCustomerData(2)).rejects.toThrowError('NoCustomer');

    expect(prismaMock.customers.findUnique).toHaveBeenCalledWith({where:{ id: 2}});
  })

  test('getCustomer data returns expected combined object for found customer and orders', async() => {
    prismaMock.customers.findUnique.mockResolvedValue(mockUser);
    prismaMock.orders.findMany.mockResolvedValueOnce(mockOrders);

    const result = await customersService.getCustomerData(2);

    expect(result).toBeTruthy();
    expect(result).toHaveProperty('customer');
    expect(result).toHaveProperty('orders');

    expect(prismaMock.customers.findUnique).toHaveBeenCalledWith({where:{ id: 2}});
    expect(prismaMock.customers.findMany).toHaveBeenCalledWith({where:{ customerEmail: 'test@surgeviewmarketing.com'},
    orderBy: {createdAt: 'desc'}});

  });

  test('should return a list of customers matching the search term', async () => {
    const mockCustomers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', createdAt: new Date() },
      { id: 2, name: 'Bob', email: 'bob@example.com', createdAt: new Date() },
    ];

    // Mock the findMany method to return the mock customers
    prismaMock.customers.findMany.mockResolvedValue(mockCustomers);

    const searchText = 'ali'; // Partial name
    const result = await customersService.searchCustomers(searchText);

    expect(result).toEqual(mockCustomers);
    expect(prismaMock.customers.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            email: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  });

  test('should throw NoCustomer error if no customers are found', async () => {
    // Mock the findMany method to return an empty array
    prismaMock.customers.findMany.mockResolvedValue([]);

    const searchText = 'nonexistent@example.com';
    const result = await customersService.searchCustomers(searchText);

    expect(result).toHaveLength(0);

    expect(prismaMock.customers.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            email: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  });

  test('createCustomer returns expected value for existing customer', async() => {
    const mockedCustomer = {id: 1, email: 'user@example.com', name: 'SurgeView Customer', createdAt: new Date()};
    
    prismaMock.customers.findUnique.mockResolvedValueOnce(mockedCustomer);

    const result = await customersService.createCustomer('SurgeView Customer', 'user@example.com');

    expect(result.created).toBe(false);
    expect(result.customer).toHaveProperty('name', 'SurgeView Customer');

    expect(prismaMock.customers.findUnique).toHaveBeenNthCalledWith(1, {where: {email: 'user@example.com'}})

  })

  test('createCustomer returns expected value for new customer creation', async() => {

    const mockedCustomer = {id: 1, email: 'user@example.com', name: 'SurgeView Customer', createdAt: new Date()};

    prismaMock.customers.findUnique.mockResolvedValueOnce(null);
    prismaMock.customers.create.mockResolvedValueOnce(mockedCustomer);

    const result = await customersService.createCustomer('SurgeView Customer', 'user@example.com');

    expect(result.created).toBe(true);
    expect(result.customer).toEqual(mockedCustomer);

    expect(prismaMock.customers.findUnique).toHaveBeenNthCalledWith(1, {where: {email: 'user@example.com'}});
    expect(prismaMock.customers.create).toHaveBeenNthCalledWith(1, {data: {name: 'SurgeView Customer', email: 'user@example.com'}});

  })
  
})