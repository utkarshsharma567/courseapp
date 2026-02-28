import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import axios from "axios";
const Dashboard = () => {

     const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admintoken");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
  return (
        <div className="flex min-h-screen bg-slate-900 text-slate-200">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between shadow-xl">
        
        {/* Profile Section */}
        <div>
          <div className="flex flex-col items-center mb-12">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxkcWDD5ZBp2006yu0HN4l67niOVRVLzDmEQ&s"
              alt="Admin"
              className="h-24 w-24 rounded-full border-4 border-slate-600 shadow-lg"
            />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Admin Panel
            </h2>
            <p className="text-slate-400 text-sm">Administrator</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-5">
  <Link to="/admin/our-courses" className="w-full">
    <button className="w-full bg-slate-700 hover:bg-indigo-600 transition duration-300 py-3 rounded-lg font-medium tracking-wide">
      📚 Our Courses
    </button>
  </Link>

  <Link to="/admin/create-course" className="w-full">
    <button className="w-full bg-slate-700 hover:bg-green-600 transition duration-300 py-3 rounded-lg font-medium tracking-wide">
      ➕ Create Course
    </button>
  </Link>

  <Link to="/" className="w-full">
    <button className="w-full bg-slate-700 hover:bg-blue-600 transition duration-300 py-3 rounded-lg font-medium tracking-wide">
      🏠 Home
    </button>
  </Link>
</nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-slate-700">
  <Link to="/admin/login" className="w-full">
    <button
     onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-500 transition duration-300 py-3 rounded-lg font-medium tracking-wide"
    >
      🚪 Logout
    </button>
  </Link>
</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="bg-slate-800 border border-slate-700 p-12 rounded-2xl shadow-lg text-center max-w-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome Back, Admin 👋
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your courses, create new content, and monitor your platform
            from this dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard