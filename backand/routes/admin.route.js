import express from 'express';
import { login, logout, signup } from '../controllers/admin.controller.js';
const adminRouter = express.Router()
adminRouter.post('/signup',signup)
adminRouter.post('/login',login);
adminRouter.get('/logout',logout)

export default adminRouter