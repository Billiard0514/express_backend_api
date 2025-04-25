import { Router } from 'express';
import passport from 'passport';
import { register, login, profile, verifyLoginOTP, verifyRegisterOTP, forgotPassword, resetPassword, verifyForgotPasswordOTP } from '../controllers/authController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/login', asyncHandler(login));
router.post('/loginVerify', asyncHandler(verifyLoginOTP));
router.post('/register', asyncHandler(register));
router.post('/registerVerify', asyncHandler(verifyRegisterOTP));
router.get('/profile', passport.authenticate('jwt', { session: false }), asyncHandler(profile));
router.post('/forgotPassword', asyncHandler(forgotPassword));
router.post('/forgotPasswordVerify', asyncHandler(verifyForgotPasswordOTP));
router.post('/resetPassword', asyncHandler(resetPassword));

export default router;