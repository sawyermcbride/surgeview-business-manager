import {jest} from '@jest/globals';

const findUnique = jest.fn()
const findFirst = jest.fn();
const create = jest.fn();
const findMany = jest.fn();
const update = jest.fn();
const updateMany = jest.fn();

export class PrismaClient {
  public employees = {
    findUnique,
    findFirst,
    create,
    findMany,
    update,
    updateMany

  }

  public orders = {
    updateMany,
    findUnique,
    findFirst,
    create,
    findMany,
    update
  }

  
  public customers = {
    findUnique,
    findFirst,
    create,
    findMany,
    update,
    updateMany

  }
  public verifications = {
    findUnique,
    findFirst,
    create,
    findMany,
    update,
    updateMany

  }
}