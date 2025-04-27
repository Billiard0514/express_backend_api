import { Router } from 'express';
import passport from 'passport';
import { getRoles, addRole, setRoleToUser, deleteRole } from '../controllers/roleController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/getRoles', asyncHandler(getRoles));
router.post('/addRole', asyncHandler(addRole));
router.post('/setRole', passport.authenticate('jwt', { session: false }), asyncHandler(setRoleToUser));
router.post('/deleteRole', passport.authenticate('jwt', { session: false }), asyncHandler(deleteRole));

export default router;