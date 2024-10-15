//Mock Customers Service Class

import {jest} from "@jest/globals";

//getCustomerData searchCustomers createCustomer

const getCustomerData = jest.fn();
const searchCustomers = jest.fn();
const createCustomer = jest.fn();


export default class CustomersService {
  getCustomerData = getCustomerData;
  searchCustomers = searchCustomers;
  createCustomer = createCustomer;
}


