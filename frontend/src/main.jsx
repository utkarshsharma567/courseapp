import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51T4dEyAT0Zt6s9qy23ZbJG53qcz2CIvcoUzhaMDPZI99zsv8qUkdaMHxqhDLAQtYKrwFQmm6YjUNzSCRecOT8Wpu00yuXeRnGX",
);

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
