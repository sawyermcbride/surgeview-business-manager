
import {jest} from '@jest/globals';


const getUserById = jest.fn();
const login = jest.fn();
const createLogin = jest.fn();

class EmployeesService {
  getUserById = getUserById;
  login = login;
  createLogin = createLogin;
}

export default EmployeesService;
