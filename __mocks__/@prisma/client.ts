import {jest} from '@jest/globals';

const findUnique = jest.fn()
const findFirst = jest.fn();
const create = jest.fn();
const findMany = jest.fn();

export class PrismaClient {
  public employees = {
    findUnique,
    findFirst,
    create,
    findMany
  }

  public orders = {
    findUnique,
    findFirst,
    create,
    findMany
  }
  public customers = {
    findUnique,
    findFirst,
    create,
    findMany
  }
}