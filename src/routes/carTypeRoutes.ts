import { Router } from 'express';
import passport from 'passport';
import { addCarType, deleteCarType, getCarTypes } from '../controllers/carTypeController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/getTypes', asyncHandler(getCarTypes));
router.post('/addType', asyncHandler(addCarType));
router.post('/deleteType', passport.authenticate('jwt', { session: false }), asyncHandler(deleteCarType));

export default router;