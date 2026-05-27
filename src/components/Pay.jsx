import React from "react";

import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import Swal from "sweetalert2";

const Pay = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const fee = location.state?.fee || 0;
  const type = location.state?.type || "PayPal";

  // =========================
  // PAYMENT SUCCESS
  // =========================
  const handleApprove = async (
    data,
    actions
  ) => {

    try {

      // Capture PayPal payment
      const details =
        await actions.order.capture();

      console.log(details);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem("access");

      // =========================
      // PAYMENT DATA
      // =========================
      const paymentData = {
        user: user?.id,
        payment_type: type,
        amount: fee,
        card_number: "PAYPAL",
        expiry: "N/A",
        cvc: "N/A",
        status: "PAID",
      };

      // =========================
      // SAVE TO DJANGO
      // =========================
      const response = await fetch(
        "https://preethu17.pythonanywhere.com/api/payment/payments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(paymentData),
        }
      );

      // Check backend response
      if (!response.ok) {

        const error =
          await response.text();

        console.log(error);

        Swal.fire({
          title: "Error",
          text: "Payment saved failed",
          icon: "error",
          confirmButtonColor: "#14532D",
        });

        return;
      }

      const result =
        await response.json();

      console.log(result);

      Swal.fire({
        title: "Success",
        text: "Payment Successful",
        icon: "success",
        confirmButtonColor: "#14532D",
      });

      // Redirect
      navigate("/dashboard");

    } catch (error) {

      console.log(
        "Payment Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: "Payment Failed",
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    }

  };

  return (

    <div className="min-h-screen bg-white text-[#D4AF37] flex items-center justify-center px-4 py-10">

      {/* CARD */}
      <div className="w-full max-w-md bg-[#14532D] rounded-3xl p-6 shadow-2xl border border-gray-800">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold text-white">
            Secure Payment
          </h1>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="text-sm text-white hover:text-white"
          >
            Back
          </button>

        </div>

        {/* SUMMARY */}
        <div className="bg-[#D4AF37] rounded-2xl p-5 mt-7 border border-gray-800">

          <div className="flex justify-between items-center">

            <span className="text-white text-lg font-semibold">
              Service Fee
            </span>

            <span className="font-semibold">
              ${fee}
            </span>

          </div>

          <div className="flex justify-between items-center mt-5">

            <span className="text-xl font-bold">
              Total
            </span>

            <span className="text-2xl font-bold text-[#14532D]">
              ${fee}
            </span>

          </div>

        </div>

        {/* PAYPAL BUTTON */}
        <div className="mt-8">

          <PayPalScriptProvider
            options={{
              "client-id":"AZUsvstrvuqxep6tI0yquzfgqpxwdJf74Nb1CV6apndm-ehRS1l-HoC4QlrRQ9ivqpWDEXWVIf1AnHL2"
                ,
            }}
          >

            <PayPalButtons

              style={{
                layout: "vertical",
                color: "gold",
                shape: "pill",
                label: "paypal",
              }}

              // =========================
              // CREATE ORDER
              // =========================
              createOrder={(
                data,
                actions
              ) => {

                return actions.order.create({

                  purchase_units: [
                    {
                      amount: {
                        value: fee,
                      },
                    },
                  ],

                });

              }}

              // =========================
              // PAYMENT SUCCESS
              // =========================
              onApprove={handleApprove}

              // =========================
              // PAYMENT ERROR
              // =========================
              onError={(err) => {

                console.log(err);

                Swal.fire({
                  title: "Error",
                  text: "Payment Failed",
                  icon: "error",
                  confirmButtonColor: "#14532D",
                });

              }}

            />

          </PayPalScriptProvider>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-white mt-5">

          Encrypted & Secure
          Payment using PayPal

        </p>

      </div>

    </div>

  );

};

export default Pay;