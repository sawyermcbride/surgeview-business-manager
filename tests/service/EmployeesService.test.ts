import {jest, expect, describe, test, beforeEach} from '@jest/globals';
import EmployeesService from '../../service/EmployeesService';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

jest.mock('@prisma/client');
jest.mock('bcrypt');

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

const mockUser = {
    username: 'admin',
    password: 'testpassword',
    id: 2,
    createdAt: new Date(),
    email: 'test@surgeviewmarketing.com',
    name: 'Name',
    role: 'Admin'
  }



describe('Employees Service tests', () => {

  let employeesService: EmployeesService;

  beforeEach(() => {
    employeesService = new EmployeesService();
    jest.clearAllMocks();
  });


  test('should log in successfully with valid credentials', async () => {

    // Mock the return value of prisma.employees.findUnique
    prismaMock.employees.findUnique.mockResolvedValueOnce(mockUser);
    // Mock bcrypt.compare to return true
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const user = await employeesService.login('admin', 'password');
    
    expect(user).toEqual(mockUser);
    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { username: 'admin' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
  });

  test('should throw NoUser error if user is not found', async () => {
    // Mock the return value of prisma.employees.findUnique to return null
    prismaMock.employees.findUnique.mockResolvedValueOnce(null);

    await expect(employeesService.login('nonexistent', 'password'))
      .rejects
      .toThrowError('NoUser');

    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
  });

  test('should throw InvalidPassword error if password is incorrect', async () => {

    // Mock the return value of prisma.employees.findUnique
    prismaMock.employees.findUnique.mockResolvedValueOnce(mockUser);
    // Mock bcrypt.compare to return false
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(employeesService.login('admin', 'wrongpassword'))
      .rejects
      .toThrowError('InvalidPassword');

    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { username: 'admin' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
  });


  test('should return user when found', async () => {

    // Mock the findUnique method to return a user object
    prismaMock.employees.findUnique.mockResolvedValue(mockUser);

    const user = await employeesService.getUserById(1);
    
    expect(user).toEqual(mockUser);
    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test('should throw NoUser error when user not found', async () => {
    prismaMock.employees.findUnique.mockResolvedValue(null); // Simulate no user found

    await expect(employeesService.getUserById(999)).rejects.toThrow('NoUser');
    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  test('should create a new user successfully', async () => {
    
    // Mock the findUnique method to return null (no user found)
    prismaMock.employees.findUnique.mockResolvedValue(null);

    // Mock the bcrypt.hash method to return the hashed password
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);


    // Mock the create method to return the newly created user
    prismaMock.employees.create.mockResolvedValue(mockUser);

    const newUser = await employeesService.createLogin('Admin', 'admin', 'admin@example.com', 'password', 'admin');

    expect(newUser).toEqual(mockUser);
    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { username: 'admin', email: 'admin@example.com' } });
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(prismaMock.employees.create).toHaveBeenCalledWith({
      data: {
        name: 'Admin',
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      }
    });
  });

  test('should throw DuplicateUser error if user already exists', async () => {
    // Mock the findUnique method to return a user object (simulating a user already exists)
    prismaMock.employees.findUnique.mockResolvedValue(mockUser);

    await expect(employeesService.createLogin('Admin', 'admin', 'admin@example.com', 'password', 'admin')).rejects.toThrow('DuplicateUser');
    expect(prismaMock.employees.findUnique).toHaveBeenCalledWith({ where: { username: 'admin', email: 'admin@example.com' } });
    expect(bcrypt.hash).not.toHaveBeenCalled(); // Ensure bcrypt.hash is not called
    expect(prismaMock.employees.create).not.toHaveBeenCalled(); // Ensure create is not called
  });



})