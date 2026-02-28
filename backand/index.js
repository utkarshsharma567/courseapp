import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser'
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

// Connect Database
connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
 allowedHeaders:['Content-Type','Authorization']
}))
//yai file upload ke liye middleware use karna hoga
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const PORT = process.env.PORT || 5000;

// Define Routes
app.use("/api/courses",courseRouter)
app.use('/api/users',userRouter)
app.use('/api/admin',adminRouter)


//cloudinary //yai cloudinary ke liye configuration h
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
