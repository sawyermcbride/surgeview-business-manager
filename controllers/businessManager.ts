import express, {Request, Response, Router} from 'express';
import { hasRole } from './localLogin';

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  const {error} = req.query;
  if(error) {
    return res.render('manager-login', {status: 'error', message: 'Login error'});
  } else {
    return res.render('manager-login', {status: 'none'});
  }
});

router.get('/dashboard', hasRole(['Admin', 'manager', 'associate']), (req: Request, res: Response) => {
  return res.render('business_dashboard');
});

export default router;