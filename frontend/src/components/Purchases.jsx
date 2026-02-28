

import React, { useEffect, useState } from "react";
import { FaUserCircle, FaDiscourse, FaDownload } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Purchases = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errormsg, setErrormsg] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    document.body.style.overflow = !isSidebarOpen ? "hidden" : "auto";
  };

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
    const fetchPurchases = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrormsg("Please login to view purchases");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://courseapp-br7n.onrender.com/users/purchase",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPurchases(response.data.courseData || []);
        setErrormsg("");
      } catch (error) {
        console.log("Error fetching purchases:", error);
        setErrormsg(
          error?.response?.data?.message || "Failed to fetch purchases"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

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
          <li>
            <Link to="/courses" className="flex items-center hover:text-white">
              <FaDiscourse className="mr-3" /> Courses
            </Link>
          </li>
          <li className="flex items-center text-indigo-400 cursor-default">
            <FaDownload className="mr-3" /> Purchases
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Purchases</h1>
          <div className="flex items-center gap-4">
            
            <FaUserCircle className="text-4xl text-indigo-400 cursor-pointer" />
          </div>
        </div>

        {/* Purchases Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-400 text-lg">Loading purchases...</p>
          </div>
        ) : errormsg ? (
          <div className="text-red-500 text-lg">{errormsg}</div>
        ) : purchases.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-400 text-lg">You have not purchased any courses yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchases.map((course) => (
              <div
                key={course._id}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition duration-300"
              >
                <img
                  src={course?.image?.url || "https://via.placeholder.com/300"}
                  alt={course?.title}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-white mb-2">{course?.title}</h2>
                <p className="text-slate-400 text-sm mb-4">
                  {course?.description?.length > 100
                    ? `${course.description.slice(0, 100)}...`
                    : course?.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-indigo-400">₹{course?.price}</span>
                  <span className="text-green-400 text-sm">Purchased</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Purchases;
