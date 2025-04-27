import { Router } from 'express';
import passport from 'passport';
import { addService, deleteService, getServices } from '../controllers/serviceController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/getServices', asyncHandler(getServices));
router.post('/addService', asyncHandler(addService));
router.post('/deleteService', passport.authenticate('jwt', { session: false }), asyncHandler(deleteService));

export default router;