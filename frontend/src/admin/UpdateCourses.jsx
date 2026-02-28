import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateCourses = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const { data } = await axios.get(
          `https://courseapp-br7n.onrender.com/api/courses/single/${id}`,
          {
            withCredentials: true,
          },
        );
        console.log(data);
        setTitle(data.data.title);
        setDescription(data.data.description);
        setPrice(data.data.price);
        setImagePreview(data.data.image?.url || "");
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("failed to fetched course data");
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
  const handleUpdateCourse = async (e) => {
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
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(
        `https://courseapp-br7n.onrender.com/api/courses/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setImagePreview("");

      navigate("/admin/our-courses"); // optional redirect
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error updating course");
    } finally {
      // ✅ always reset loading, whether success or failure
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 relative">
      <div className="relative max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-10">
        {/* Top-right Close Button */}
        <button
          onClick={() => navigate("/admin/our-courses")}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold transition"
          title="Back to Courses"
        >
          &times;
        </button>

        {/* Heading */}
        <h3 className="text-3xl font-bold text-white mb-10 text-center">
          Update Course
        </h3>

        <form onSubmit={handleUpdateCourse} className="space-y-8">
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
                src={imagePreview ? imagePreview : "/imgPL.webp"}
                alt="Course Preview"
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
            {loading ? "Updating course..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourses;
