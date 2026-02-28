import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admintoken = localStorage.getItem("admintoken");

  // ✅ Protect Route
  useEffect(() => {
    if (!admintoken) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [admintoken, navigate]);

  // ✅ Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://courseapp-br7n.onrender.com/courses/getcourses",
          { withCredentials: true }
        );

        setCourses(response?.data?.data || []);
      } catch (error) {
        console.log("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Delete Course
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://courseapp-br7n.onrender.com/courses/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);

      const updatedCourses = courses.filter(
        (course) => course._id !== id
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(
        error.response?.data?.message || "Error in deleting course"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-white">
          Our Courses
        </h1>

        <Link
          to="/admin/dashboard"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg transition duration-300"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center text-slate-400 text-lg">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center text-slate-500 text-lg">
          No courses available
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition duration-300"
            >
              {/* Image */}
              <img
                src={course?.image?.url || "https://via.placeholder.com/300"}
                alt={course.title}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />

              {/* Title */}
              <h2 className="text-xl font-semibold text-white mb-2">
                {course.title}
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4">
                {course.description?.length > 150
                  ? `${course.description.slice(0, 150)}...`
                  : course.description}
              </p>

              {/* Price */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-indigo-400 font-bold text-lg">
                  ₹{course.price}
                </div>
                <div className="text-green-400 text-sm">
                  10% off
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Link
                  to={`/admin/update-course/${course._id}`}
                  className="flex-1 text-center bg-orange-500 hover:bg-orange-400 py-2 rounded-lg transition"
                >
                  Update
                </Link>

                <button
                  onClick={() => handleDelete(course._id)}
                  className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OurCourses;
