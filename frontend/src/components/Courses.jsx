import React, { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    try {
      await axios.get("https://courseapp-br7n.onrender.com/users/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error?.response?.data);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://courseapp-br7n.onrender.com/api/courses/getcourses",
          { withCredentials: true },
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Optional: lock body scroll when sidebar open
    if (!isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex bg-slate-900 text-slate-200 min-h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl text-white"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 p-6 transform transition-transform duration-300 z-40 shadow-xl overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center mb-10">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxkcWDD5ZBp2006yu0HN4l67niOVRVLzDmEQ&s"
            alt="Logo"
            className="h-12 w-12 rounded-full border border-slate-600"
          />
          <h2 className="ml-3 font-bold text-lg">Dashboard</h2>
        </div>

        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center hover:text-white">
              <RiHome2Fill className="mr-3" /> Home
            </Link>
          </li>
          <li className="flex items-center text-indigo-400 cursor-default">
            <FaDiscourse className="mr-3" /> Courses
          </li>
          <li>
            <Link
              to="/purchases"
              className="flex items-center hover:text-white"
            >
              <FaDownload className="mr-3" /> Purchases
            </Link>
          </li>
          <li className="flex items-center hover:text-white cursor-pointer">
            <IoMdSettings className="mr-3" /> Settings
          </li>
          <li>
            {isLoggedIn ? (
              <Link
                to="/"
                onClick={handleLogout}
                className="flex items-center hover:text-red-400"
              >
                <IoLogOut className="mr-3" /> Logout
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center hover:text-green-400"
              >
                <IoLogIn className="mr-3" /> Login
              </Link>
            )}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Courses</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-full px-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="bg-transparent py-2 px-2 focus:outline-none text-slate-200"
              />
              <FiSearch className="text-slate-400" />
            </div>
            <FaCircleUser className="text-4xl text-indigo-400 cursor-pointer" />
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-400 text-lg">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-400 text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={course?.image?.url || "https://via.placeholder.com/300"}
                  alt={course?.title}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-white mb-2">
                  {course?.title}
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  {course?.description?.length > 100
                    ? `${course.description.slice(0, 100)}...`
                    : course?.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-indigo-400">
                    ₹{course?.price}
                  </span>
                  <span className="text-green-400 text-sm">20% off</span>
                </div>
                <Link
                  to={`/buy/${course._id}`}
                  className="block text-center bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-white transition"
                >
                  Buy Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
