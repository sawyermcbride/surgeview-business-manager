import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { plans } from '../config/product_details';
const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const {planName, email} = req.session;


  if(!email || !planName || !plans.includes(planName)) {
    return res.redirect('/');
  }
  const code = Math.floor(100000 + Math.random() * 900000);

  const newVerification = await prisma.verifications.create({
    data: {
      customerEmail: email,
      code
    }
  });
  

  return res.render('verification.ejs', {email, isInvalid: false, isValid: false});

  
});

router.post('/', async (req: Request, res: Response) => {
  const email = req.session.email;
  const code = req.body.verificationcode
  console.log('Verification submitted');
  console.log('code ', code);

  if(!email || !code) {
    return res.redirect('/');
  }
  const verification = await prisma.verifications.findFirst({
    where: {
      customerEmail: email
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log('code from db ', verification.code);

  if(parseInt(code) === verification.code) {
    
    return res.render('verification', {email, isInvalid: false, isValid: true});
    
  } else {
    return res.render('verification', {email, isInvalid: true, isValid: false})
  }


})
export default router;