import { Router } from 'express';
import passport from 'passport';
import { addBrand, deleteBrand, getBrands } from '../controllers/brandController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/getBrands', asyncHandler(getBrands));
router.post('/addBrand', asyncHandler(addBrand));
router.post('/deleteBrand', passport.authenticate('jwt', { session: false }), asyncHandler(deleteBrand));

export default router;