import express from "express";
import { buyCourses, createCourse, deleteCourse, getAllCourses, getCourseDetails, updateCourse } from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
const courseRouter = express.Router();
courseRouter.post("/create",adminMiddleware, createCourse);
courseRouter.put('/update/:id',adminMiddleware,updateCourse);
courseRouter.delete('/delete/:id',adminMiddleware,deleteCourse);
courseRouter.get('/getcourses',getAllCourses);
courseRouter.get('/single/:id',getCourseDetails);

//user by course route
courseRouter.post("/buy/:id",userMiddleware,buyCourses);

export default courseRouter;
