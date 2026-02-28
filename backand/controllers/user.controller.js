import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { ZodError } from "zod";
import { z } from "zod";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
//user signup
export const signup = async (req, resp) => {
  const userSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  try {
    // 1️⃣ Validate request body
    const validatedData = userSchema.parse(req.body);

    const { firstName, lastName, email, password } = validatedData;

    // 2️⃣ Check existing user
    const existUser = await User.findOne({ email });

    if (existUser) {
      return resp.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password,10)
    // 3️⃣ Save user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword,
    });

    await newUser.save();

    return resp.status(201).json({
      message: "User created successfully",
      newUser
    });
  } catch (error) {
    // 4️⃣ Handle Zod errors
    if (error instanceof ZodError) {
  return resp.status(400).json({
    message: "Validation failed",
    errors: error.issues.map(err => ({
      field: err.path[0],
      message: err.message
    }))
  });
}

    console.log("Error in signup", error);
    return resp.status(500).json({ message: "Server error" });
  }
};

//user login
export const login = async (req, resp) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resp.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return resp.status(401).json({ message: "Invalid credentials" });
    }

    // jwt token generate
    const token = jwt.sign({
        id:user._id,
        },process.env.JWT_USER_PASSWORD, 
        { expiresIn: "1d" } )

        const cookieOptions = {
           expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict", 
        };
    resp.cookie("jwt-token",token,cookieOptions) 

    return resp.status(200).json({
      message: "Login successful",
      user,
      token
    });

  } catch (error) {
    console.log("Error in login:", error);
    return resp.status(500).json({ message: "Server error" });
  }
};

//user logout
// export const logout = async (req, resp) => {
//   try {
//     if (!req.cookies["jwt-token"]) {
//       return resp.status(400).json({
//         message: "No token found first login",
//       });
//     }

//     resp.clearCookie("jwt-token"); // yai jwt token clear kardega or logout nevigate kardega
//     return resp.status(200).json({
//       message: "Logout successful",
//     });
//   } catch (error) {
//     console.log("Error in logout:", error);
//     return resp.status(500).json({ message: "Server error" });
//   }
// };
export const logout = async (req, res) => {
  try {
    if (!req.cookies["jwt-token"]) {
      return res.status(400).json({
        message: "No token found first login",
      });
    }

    res.clearCookie("jwt-token");

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//user purchases courses
export const purchases = async(req,resp)=>{
  const {userId} = req.userId;
  try {
    const purchased = await Purchase.find({userId})

    let purchasedCourse = []

    for(let i = 0 ; i < purchased.length; i++){
      purchasedCourse.push(purchased[i].courseId)

    }
      const courseData = await Course.find({
        _id:{$in:purchasedCourse}
      })
    resp.status(200).json({purchased,courseData})
  } catch (error) {
    console.log("Error in purchase fetched:",error);
            return resp.status(500).json({ message: "Server error" });

  }
}
