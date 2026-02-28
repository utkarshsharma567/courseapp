import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ZodError } from "zod";
import { z } from "zod";

import { Admin } from "../models/admin.model.js";

//user signup
export const signup = async (req, resp) => {
  const adminSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  try {
    // 1️⃣ Validate request body
    const validatedData = adminSchema.parse(req.body);

    const { firstName, lastName, email, password } = validatedData;

    // 2️⃣ Check existing user
    const existUser = await Admin.findOne({ email });

    if (existUser) {
      return resp.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // 3️⃣ Save user
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return resp.status(201).json({
      message: "Admin created successfully",
      newAdmin,
    });
  } catch (error) {
    // 4️⃣ Handle Zod errors
    if (error instanceof ZodError) {
      return resp.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
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
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return resp.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return resp.status(401).json({ message: "Invalid credentials" });
    }

    // jwt token generate
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_ADMIN_PASSWORD,
      { expiresIn: "1d" },
    );

    const cookieOptions = {
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    resp.cookie("jwt-token", token, cookieOptions);

    return resp.status(200).json({
      message: "Login successful",
      admin,
      token,
    });
  } catch (error) {
    console.log("Error in login:", error);
    return resp.status(500).json({ message: "Server error" });
  }
};

//user logout
export const logout = async (req, resp) => {
  try {
    if (!req.cookies["jwt-token"]) {
      return resp.status(400).json({
        message: "No token found first login",
      });
    }

    resp.clearCookie("jwt-token"); // yai jwt token clear kardega or logout nevigate kardega
    return resp.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error in logout:", error);
    return resp.status(500).json({ message: "Server error" });
  }
};
