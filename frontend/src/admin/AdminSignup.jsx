import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminSignup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLasttName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        "https://courseapp-br7n.onrender.com/admin/signup",
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Signup successful:", response.data);
      toast("Signup successful!");
      navigate("/admin/login");

      // Clear form after success
      setFirstName("");
      setLasttName("");
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
          toast.error(data.message || "Signup failed");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* navbar */}
      <nav className="bg-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold tracking-wide group"
            >
              {/* Logo Image */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxkcWDD5ZBp2006yu0HN4l67niOVRVLzDmEQ&s"
                alt="InnovateDev Logo"
                className="h-10 w-10 object-contain group-hover:scale-110 transition duration-300"
              />

              {/* Brand Name */}
              <span>
                <span className="text-white">Innovate</span>
                <span className="text-indigo-500 group-hover:text-indigo-400 transition">
                  Dev
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link
                to="/admin/login"
                className="text-slate-300 hover:text-white"
              >
                Login
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
            <Link
              to="/admin/login"
              className="block text-slate-300 hover:text-white"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
      {/* Signup Form */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-600/20 p-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Your Account to mess with dashboard 🚀
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="John"
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.firstName ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Doe"
                onChange={(e) => setLasttName(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.lastName ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">Email</label>
              <input
                type="email"
                placeholder="john@gmail.com"
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
                placeholder="......"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg font-semibold transition duration-300 shadow-lg shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="text-indigo-500 hover:text-indigo-400 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
