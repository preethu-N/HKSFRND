import React, { useState } from "react";

const Payment = ({ addPayment }) => {

  const [loading, setLoading] = useState(false);

  // =========================
  // PAYMENT API
  // =========================
  const handleSubmit = async () => {

    try {

      setLoading(true);

      const paymentData = {
        id: Date.now(),
        type: "Waste Payment",
        date: new Date().toLocaleDateString(),
        status: "PAID",
        fee: 100,
      };

      // =========================
      // API CALL
      // =========================
      const response = await fetch(
        "http://127.0.0.1:8000/api/payment/payments/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(paymentData),
        }
      );

      const savedPayment =
        await response.json();

      console.log(savedPayment);

      // =========================
      // UPDATE DASHBOARD STATE
      // =========================
      if (addPayment) {
        addPayment(savedPayment);
      }

      alert("Payment Successful");

    } catch (error) {

      console.log(
        "Payment API Error:",
        error
      );

      alert("Payment Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="bg-emerald-500 text-black px-4 py-2 rounded"
    >

      {loading
        ? "Processing..."
        : "Pay ₹100"}

    </button>
  );
};

export default Payment;