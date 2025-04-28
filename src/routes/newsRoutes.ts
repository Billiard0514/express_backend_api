import { Router } from 'express';
import passport from 'passport';
import { addNews, getNews, upload } from '../controllers/newsController';

const router = Router();

// Utility to handle async route handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/getNews', asyncHandler(getNews));
router.post('/add', asyncHandler(addNews));

export default router;