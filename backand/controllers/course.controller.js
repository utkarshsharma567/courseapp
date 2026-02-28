import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';
import { Purchase } from "../models/purchase.model.js";

//course create
export const createCourse = async (req, resp) => {
  const adminId = req.adminId
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return resp.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || !req.files.image) {
      return resp.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const image = req.files.image; //yai file ko variable me store kar liya h

    if (!image.mimetype.startsWith("image/")) {
      //yai sarre image types ko allow karega or check karega ki file image hi hai ya nahi
      return resp.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    //cloudinary code
    // cloudinary upload

    // Create course with cloudinary URL
    let cloud_response;
    try {
      cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return resp.status(500).json({
        success: false,
        message: "Error uploading image to Cloudinary",
      });
    }

    // For beginners: storing image object temporarily
    // Industry: usually upload to S3/Cloudinary and store URL
    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url || cloud_response.url,
      }, // ideally store image.url or path
      creatorId:adminId
    });

    return resp.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return resp.status(500).json({
      success: false,
      message: "Server error while creating course",
    });
  }
};

//update course
export const updateCourse = async (req, resp) => {
  const adminId = req.adminId; // token se
  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    // ✅ Find course that belongs to this admin
    const course = await Course.findOneAndUpdate({
      _id: id,
      creatorId: adminId
    });

    if (!course) {
      return resp.status(404).json({
        success: false,
        message: "Access denied. You can only update your own courses.",
      });
    }

    // Update only fields that exist
    if (title) course.title = title;
    if (description) course.description = description;
    if (price) course.price = price;

    await course.save();

    return resp.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return resp.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// export const updateCourse = async (req, resp) => {
//   const adminId = req.adminId
//   const { id } = req.params;
//   const { title, description, price, image } = req.body;

//   try {
//     const course = await Course.findById(id);

//     if (!course) {
//       return resp.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     // Update only fields that exist
//     if (title) course.title = title;// agar title exist karta h to hi update karega
//     if (description) course.description = description;
//     if (price) course.price = price;

//     // Optional image update
//     if (image && image.public_id && image.url) {
//       course.image = {
//         public_id: image.public_id,
//         url: image.url,
//       };
//     }

//     await course.save(); // save changes

//     return resp.status(200).json({
//       success: true,
//       message: "Course updated successfully",
//       data: course,
//     });
//   } catch (error) {
//     console.error("Error updating course:", error);
//     return resp.status(500).json({
//       success: false,
//       message: "Server error while updating course",
//     });
//   }
// };

//delete course
export const deleteCourse = async (req, resp) => {
  const adminId = req.adminId;   // ✅ middleware se
  const { id } = req.params;

  try {
    // ✅ check both course id and creator/admin id
    const course = await Course.findOneAndDelete({
      _id: id,
      creatorId: adminId
    });

    if (!course) {
      return resp.status(404).json({
        success: false,
        message: "Access denied. You can only delete your own courses.",
      });
    }

    return resp.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.log("Error deleting course:", error);
    return resp.status(500).json({
      success: false,
      message: "Server error while deleting course",
    });
  }
};

//get all courses
export const getAllCourses = async (req,resp)=>{
  try {
    const courses = await Course.find({})
    resp.status(200).json({
      success:true,
      message:"Courses fetched successfully",
      data:courses,
    });
  } catch (error) {
    console.log("Error fetching courses:", error);
    return resp.status(500).json({
      success:false,
      message:"Server error while fetching courses",
    });
  }
}

//single course details
export const getCourseDetails = async (req,resp)=>{
  const {id} = req.params;
  try {
    const course = await Course.findById(id);

    if(!course){//yai error handling h ki agar course nahi mila to 404 error dega
      return resp.status(404).json({
        success:false,
        message:"Course not found",
      });
    }
    return resp.status(200).json({
      success:true,
      message:"Course details fetched successfully",
      data:course,
    });
  } catch (error) {
    console.log("Error fetching course details:", error);
    return resp.status(500).json({
      success:false,
      message:"Server error while fetching course details",
    });
  }
}


import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("Stripe initialized with key:", process.env.STRIPE_SECRET_KEY);
//usercourse buy 
export const buyCourses = async (req, resp) => {
  const { id } = req.params;//yaha se course id ko params se le raha h, url me 
  const userId = req.userId;//yaha se user id ko middleware se le raha h

  try {
    const course = await Course.findById(id);//course ko database se find kar raha h id ke basis pe

    if (!course) {
      return resp.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isAlreadyPurchased = await Purchase.findOne({//agar user ne already course kharida h to usko dobara kharidne se roke
      courseId: id,
      userid: userId,
    });

    if (isAlreadyPurchased) {//agar course already purchase ho chuka h to error dega
      return resp.status(400).json({
        success: false,
        message: "Course already purchased",
      });
    }

    // strip payment code goes here (e.g., Stripe, PayPal)
    const amount = course.price;
     const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    payment_method_types: ['card'],
  });


    const newPurchase = await Purchase.create({//new course purchase create kar raha h
      courseId: id,
      userid: userId,
    });

    return resp.status(200).json({
      success: true,
      message: "Course purchased successfully",
      newPurchase,
         clientSecret: paymentIntent.client_secret, // Send client secret to frontend
      course,
    });

  } catch (error) {
    console.log("Error buying course:", error);
    return resp.status(500).json({
      success: false,
      message: "Server error while buying course",
    });
  }
};
