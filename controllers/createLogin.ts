
import { Request, Response } from "express";
import EmployeesService from "../service/EmployeesService";

const employeesService = new EmployeesService();

export const createLogin = async function(req: Request, res: Response) {
  const {name, username, email, password, role} = req.body;

  if(!name || !username || !email || !password || !role) {
    return res.render('create-login', {status: 'error', message: 'Please fill out the required fields'});
  }

  try {
    const newUser = await employeesService.createLogin(name, username, email, password, role);

    return res.status(201).render('create-login', {status: 'success', message: `User ${newUser.username} with ${newUser.role} role created`});

  } catch(err) {

    return res.render('create-login', {status: 'error', message: 'Error occured creating user'});
  }

}