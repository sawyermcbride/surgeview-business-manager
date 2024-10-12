import e, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { plans } from '../config/product_details';
import VerificationService from '../service/VerificationService';

const router = Router();

const prisma = new PrismaClient();
const verificationService = new VerificationService();


router.get('/', async (req: Request, res: Response) => {
  const {planName, email} = req.session;


  if(!email || !planName || !plans.includes(planName)) {
    return res.redirect('/');
  }
  try {
    
    const verification = await verificationService.generateCode(email);
    return res.render('verification.ejs', {email, isInvalid: false, isValid: false});

  } catch(err) {

    return res.render('verification.ejs', {email, isInvalid: false, isValid: false});
  
  }
  


  
});

router.post('/', async (req: Request, res: Response) => {
  const email = req.session.email;
  const code = req.body.verificationcode

  if(!email || !code) {
    return res.redirect('/');
  }

  try {
    
    const verification = await verificationService.getCode(email); 
    
    if(verification && parseInt(code) === verification.code) {
      
      return res.render('verification', {email, isInvalid: false, isValid: true});
    } else {
      return res.render('verification', {email, isInvalid: true, isValid: false})
    }

  } catch(err) {
    return res.render('verification', {email, isInvalid: true, isValid: false})
  }


})
export default router;