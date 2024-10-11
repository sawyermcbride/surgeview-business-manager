import { PrismaClient } from '@prisma/client'; 
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import EmployeesService from '../service/EmployeesService';

const prisma = new PrismaClient();
const employeesService = new EmployeesService();

export const localLogin = async function(username: string, password: string, done: Function) {

  
  try {
    const user = await employeesService.login(username, password);  
    console.log('User', user)
    return done(null, user);

  } catch(err: any) {
    if(err.message === 'InvalidPassword') {
      return done(null, false, {message: 'Incorrect password'});
    } else if(err.message === 'NoUser') {
      return done(null, false, {message: 'Incorrect username'});
    }

    return done(err);
  }
}

export const userFromId = async function(id, done) {
  try {
    
    const user = await employeesService.getUserById(id);
    
    console.log('Getting user from id = ', user);
    
    done(null, user);

  } catch(err) {
    done(err);
  }
}


export const hasRole = function(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {

    if(req.isAuthenticated() ) {
      console.log('Checking user role = ', req.user);
      if(roles.includes(req.user.role)) {
        return next();
      } else {
        res.status(403).send('Forbidden'); 
        return;
      }
    } else {
      return res.redirect('/manager-login');
    }
  }
}