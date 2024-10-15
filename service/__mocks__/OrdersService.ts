import {jest} from "@jest/globals";


const getOrders = jest.fn();
const createOrder = jest.fn();
const updateOrder = jest.fn();


export default class OrdersService {
  getOrders = getOrders;
  createOrder = createOrder;
  updateOrder = updateOrder;
}