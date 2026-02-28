import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setLoading(true);

  try {
    const response = await axios.post(
      "https://courseapp-br7n.onrender.com/api/users/login",
      { email, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast.success("Login successful!");

    // ✅ store token properly
    localStorage.setItem("token", response.data.token);

    navigate("/");

    setEmail("");
    setPassword("");

  } catch (error) {
    if (error.response) {
      const data = error.response.data;

      if (data.errors) {
        const formattedErrors = {};
        data.errors.forEach((err) => {
          formattedErrors[err.field] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: data.message || "Login failed" });
      }
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ✅ Navbar */}
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
              <Link to="/signup" className="text-indigo-500 font-semibold">
                signup
              </Link>
              <Link
                to="/courses"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                Join now
              </Link>
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
            <Link to="/signup" className="block text-indigo-400">
              signup
            </Link>
            <Link
              to="/courses"
              className="block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
            >
              Join now
            </Link>
          </div>
        )}
      </nav>

      {/* ✅ Login Form Section */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-600/20 p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Welcome Back 👋
          </h2>
          <p className="text-center font-bold text-gray-500 mb-3">
            Login to acess paid courses
          </p>

          {errors.general && ( //yaha pe hum check kar rahe hai ki agar general error hai toh usse display karenge
            <p className="text-red-500 text-center mb-4">{errors.general}</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.password ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg font-semibold transition duration-300 shadow-lg shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 hover:text-indigo-400 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
