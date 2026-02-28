import React, { useEffect } from "react";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";



import axios from "axios";
import { toast } from "react-toastify";
import Section2 from "./Section2";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token"), //yaha pe token check karna hai ki user login hai ya nahi, agar token hai to true hoga aur agar nahi hai to false hoga
  );

  const [courses, setCourses] = useState([]);

  const handleLogout = async () => {
    try {
      await axios.get("https://courseapp-br7n.onrender.com/users/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error.response?.data);
    }

    // ⭐ always logout from frontend
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://courseapp-br7n.onrender.com/courses/getcourses",
          { withCredentials: true },
        );
        console.log(response.data); // check the response
        setCourses(response.data.data || []); // <-- set the array here
      } catch (error) {
        console.log("error in fetchCourses", error);
      }
    };

    fetchCourses();
  }, []);

 var settings = {
  dots: true,
  infinite: true,        // keep consistent
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,    // smoother scrolling
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,        // better for mobile UX

  responsive: [
    {
      breakpoint: 1280, // small desktop
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1024, // tablet
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640, // mobile
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold tracking-wide group"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxkcWDD5ZBp2006yu0HN4l67niOVRVLzDmEQ&s"
                alt="InnovateDev Logo"
                className="h-10 w-10 object-contain group-hover:scale-110 transition duration-300"
              />
              <span>
                <span className="text-white">Innovate</span>
                <span className="text-indigo-500 group-hover:text-indigo-400 transition">
                  Dev
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-white"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition shadow-lg shadow-indigo-600/30"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-800 px-4 py-4 space-y-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-slate-300 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-slate-300 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1669023414180-4dcf35d943e1?q=80&w=1600&auto=format&fit=crop')",
          }}
        ></div>

        {/* Dark Base */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950/80 to-black"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Innovate.
            </span>{" "}
            Build. Succeed.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8">
            Learn modern programming skills and build real-world projects with
            <span className="text-indigo-400 font-semibold"> InnovateDev</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="https://www.youtube.com/@CodeWithHarry"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              Explore Free Videos
            </Link>
            <Link
              to="/courses"
              className="px-8 py-3 border border-slate-500 hover:bg-slate-800 rounded-lg font-semibold transition"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
      {/* Hero section 2 */}
      <Section2 courses={courses} settings={settings} />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                <span className="text-white">Innovate</span>
                <span className="text-indigo-500">Dev</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Learn modern programming skills, build real-world projects, and
                accelerate your developer journey with InnovateDev.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h3 className="text-white font-semibold mb-4">Popular Courses</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    React JS
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Node JS
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Python
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Java + spring boot
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Full Stack
                  </a>
                </li>
              </ul>
            </div>

            {/* Social / Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
              <p className="text-sm text-slate-400 mb-3">
                Email: support@innovatedev.com
              </p>

              <div className="flex gap-4 mt-3">
                <a href="/" className="hover:text-indigo-500 transition">
                  Facebook
                </a>
                <a href="/" className="hover:text-indigo-500 transition">
                  Twitter
                </a>
                <a href="/" className="hover:text-indigo-500 transition">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} InnovateDev. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
