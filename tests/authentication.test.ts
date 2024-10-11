import {jest, beforeEach, describe, test, afterEach, expect, beforeAll} from '@jest/globals';
import request from 'supertest';
import app from '../index';
import passport, { authenticate } from 'passport';
import { Request,  Response, NextFunction} from 'express';
import EmployeesService from '../service/EmployeesService';
import signature from 'cookie-signature'

jest.mock('../service/EmployeesService');

const mockedEmployeesService = new EmployeesService() as jest.Mocked<EmployeesService>;


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

describe('POST /employees/login', () => {
  beforeEach( () => {
    jest.resetAllMocks();
  })

  afterEach(() => {
  
  })

  test('should redirect to dasboard on successful login', async() => {
    mockedEmployeesService.login.mockResolvedValueOnce(generateUserObject('manager', 1));

    mockedEmployeesService.getUserById.mockResolvedValueOnce(generateUserObject('manager', 1));

    const response = await request(app)
    .post('/employee/login')
    .send({username: 'admin', password: 'password'});

    expect(response.headers['location']).toBe('/business-manager/dashboard');
    expect(response.status).toEqual(302);

  });

  test('should redirect to login on failed login', async() => {
    mockedEmployeesService.login.mockRejectedValueOnce({message: 'InvalidPassword'});


    const response = await request(app)
    .post('/employee/login')
    .send({username: 'admin', password: 'password'});

    expect(response.headers['location']).toBe('/business-manager/login?error=true');
    expect(response.status).toEqual(302);
  });
  
})

describe('GET /create-login (Admin only)', () => {

  beforeEach( () => {
    jest.resetAllMocks();
  })

  test('should allow Admin to access /create-login', async() => {

    mockedEmployeesService.getUserById.mockResolvedValue(generateUserObject('Admin', 2));

    /**
     * Get session to use in request
     */

    const sessionData = await getSession('Admin');

    const response = await request(app)
    .get('/create-login')
    .set('Cookie', sessionData);

    expect(response.status).toBe(200);
    expect(response.text).toContain('create-login');

  });

  test('should return 403 for non-Admin when accessing /create-login', async() => {

    const sessionData = await getSession('manager');

    console.log('sessionData', sessionData);

    const response = await request(app)
    .get('/create-login')
    .set('Cookie', sessionData);

    expect(response.status).toBe(403);
    expect(response.text).toContain('Forbidden');

  });
})

describe('POST /create-login', () => {
  beforeEach( () => {
    jest.resetAllMocks();
  })

  test('should return 403 non-Admin attempting to submit data to /create-login', async() => {

    const sessionData = await getSession('manager');

    console.log('sessionData', sessionData);

    //name, username, email, password, role}

    const response = await request(app)
    .post('/create-login')
    .send({name: 'test', username: 'test', email: 'test', password: 'test', role: 'manager'})
    .set('Cookie', sessionData);

    expect(response.status).toBe(403);
    expect(response.text).toContain('Forbidden');
  });

  test('should return valid page with "manager role created" text for Admin creating login', async() => {

    mockedEmployeesService.getUserById.mockResolvedValue(generateUserObject('Admin', 3));

    mockedEmployeesService.createLogin.mockResolvedValue(generateUserObject('manager', 2));

    const sessionData = await getSession('Admin');

    console.log('sessionData', sessionData);

    const response = await request(app)
    .post('/create-login')
    .send({name: 'test', username: 'test', email: 'test', password: 'test', role: 'manager'})
    .set('Cookie', sessionData);

    expect(response.status).toBe(201);
    expect(response.text).toContain('User admin with manager role created');
  });

});

describe('/business-manager', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  })

  test('/business-manager/login renders expected login page', async() => {
    const response = await request(app)
    .get('/business-manager/login');

    expect(response.status).toBe(200);
    expect(response.text).toContain('SurgeView Marketing Business Manager')
  })

  test('/business-manager/login returns 403 for unauthenticated user', async () => {
    const response = await request(app)
    .get('/business-manager/dashboard');

    expect(response.status).toBe(302);
    expect(response.header['location']).toContain('/manager-login');

  });

  test('/business-manager/login returns 403 for unauthorized role', async () => {


    const sessionData = await getSession('Staff');
    
    const response = await request(app)
    .get('/business-manager/dashboard')
    .set('Cookie', sessionData);

    expect(response.status).toBe(403);
    expect(response.text).toContain('Forbidden')
  });

  test('renders dashboard for authenticated user', async() => {
    const sessionData = await getSession('manager');

    const response = await request(app)
    .get('/business-manager/dashboard')
    .set('Cookie', sessionData);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Dashboard');
  })

  

})