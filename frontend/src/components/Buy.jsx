import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

const Buy = () => {
  const { courseId } = useParams(); // ✅ should match the route param
  const [loading, setLoading] = useState(false);
  const [course,setCourse] = useState({})
  const [clientSecret,setClientSecret] = useState("")
  const [error,setError] = useState("");
  const [cardError,setCardError] = useState("");
  const navigate = useNavigate();


  const stripe = useStripe();
  const elements = useElements();
  useEffect(()=>{
   const fetchBuyCourseData = async()=>{
      const token = localStorage.getItem("token"); // ✅ just use token string
    if (!token) {
      setError("Please login to purchase the course");
      return;
    }

    if (!courseId) {
      setError("Course ID is missing");
      return;
    }

    try {
      
      const response = await axios.post(
        `https://courseapp-br7n.onrender.com/courses/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
  console.log(response.data)
      setCourse(response.data.course)
      setClientSecret(response.data.clientSecret)
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to purchase course"
        );
      }
    } finally {
      setLoading(false);
    }
   }
   fetchBuyCourseData();
  },[courseId])
const handlePurchase = async (event) => {
  event.preventDefault();

  if (!stripe || !elements) {
    console.log("Stripe not loaded");
    return;
  }

  setLoading(true);

  const card = elements.getElement(CardElement);

  if (!card) {
    console.log("Card element not found");
    setLoading(false);
    return;
  }

  if (!clientSecret) {
    console.log("No client secret");
    setLoading(false);
    return;
  }

  const { paymentIntent, error } = await stripe.confirmCardPayment(
    clientSecret,
    {
      payment_method: {
        card: card,
        billing_details: {
          name: "Customer",
        },
      },
    }
  );

  if (error) {
    console.log("Payment error:", error);
    setCardError(error.message);
    setLoading(false);
  } else if (paymentIntent.status === "succeeded") {
    console.log("Payment successful:", paymentIntent);
    toast.success("Payment Successful 🎉");
    navigate("/purchases");
  }

  setLoading(false);
};

  return (
    
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
    <div className="bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl border border-slate-700 p-8">

      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Complete Your Purchase
      </h2>

      {/* Course Info */}
      <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white">
          {course?.title || "Course Name"}
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          {course?.description?.slice(0, 100)}...
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-slate-400">Price</span>
          <span className="text-xl font-bold text-indigo-400">
            ₹{course?.price}
          </span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePurchase}>

        {/* Card Element */}
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#94a3b8",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>

        {/* Card Error */}
        {cardError && (
          <p className="text-red-500 text-sm mb-4">{cardError}</p>
        )}

        {/* General Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Pay Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-lg text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Processing Payment..." : `Pay ₹${course?.price || ""}`}
        </button>
      </form>
    </div>
  </div>

  );
};

export default Buy;
