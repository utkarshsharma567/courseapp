import express from 'express';
import { login, logout, purchases, signup } from '../controllers/user.controller.js';
import userMiddleware from '../middlewares/user.mid.js';

const userRouter = express.Router();
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get("/logout", logout);
userRouter.get('/purchase',userMiddleware,purchases)

export default userRouter
