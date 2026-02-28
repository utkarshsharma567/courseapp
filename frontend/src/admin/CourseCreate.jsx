import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CourseCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("admintoken");

    if (!token) {
      toast.error("Please login first");
      navigate("/admin/login");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/courses/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.message || "Course created successfully");
      
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setImagePreview("");

      navigate("/admin/our-courses"); // optional redirect
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Error creating course");
    } finally {
      // ✅ always reset loading, whether success or failure
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 ">
      <div className=" relative max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-10">

        {/* Top-right Close Button */}
    <button
      onClick={() => navigate("/admin/dashboard")}
      className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold transition"
      title="Back to Dashboard"
    >
      &times;
    </button>
        {/* Heading */}
        <h3 className="text-3xl font-bold text-white mb-10 text-center">
          Create New Course
        </h3>

        <form onSubmit={handleCreateCourse} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">
              Course Title
            </label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">
              Price (₹)
            </label>
            <input
              type="number"
              placeholder="Enter course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-400">
              Course Image
            </label>

            <div className="flex flex-col items-center justify-center bg-slate-900 border border-dashed border-slate-600 rounded-xl p-6">
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : "https://png.pngtree.com/png-clipart/20230913/original/pngtree-programming-clipart-cartoon-young-man-with-headphones-working-on-computer-illustration-png-image_11063931.png"
                }
                alt="Preview"
                className="w-full max-w-md h-56 object-cover rounded-lg mb-4 shadow-md"
              />

              <input
                type="file"
                onChange={changePhotoHandler}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-indigo-600 file:text-white
                       hover:file:bg-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold text-lg transition duration-300 shadow-lg hover:shadow-indigo-500/30 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating course..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseCreate