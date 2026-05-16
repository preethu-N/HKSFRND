import React from "react";

import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const Pay = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const fee = location.state?.fee || 0;

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

      // =========================
      // PAYMENT DATA
      // =========================
      const paymentData = {

        transaction_id:
          details.id,

        payer_name:
          details.payer.name.given_name,

        payer_email:
          details.payer.email_address,

        amount: fee,

        status: "PAID",

      };

      // =========================
      // SAVE TO DJANGO
      // =========================
      const response = await fetch(
        "http://127.0.0.1:8000/api/payment/payments/",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            paymentData
          ),

        }
      );

      // Check backend response
      if (!response.ok) {

        const error =
          await response.text();

        console.log(error);

        alert(
          "Payment saved failed"
        );

        return;
      }

      const result =
        await response.json();

      console.log(result);

      alert("Payment Successful");

      // Redirect
      navigate("/dashboard");

    } catch (error) {

      console.log(
        "Payment Error:",
        error
      );

      alert("Payment Failed");

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      {/* CARD */}
      <div className="w-full max-w-md bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Secure Payment
          </h1>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="text-sm text-gray-400 hover:text-white"
          >
            Back
          </button>

        </div>

        {/* SUMMARY */}
        <div className="bg-black rounded-2xl p-5 mt-7 border border-gray-800">

          <div className="flex justify-between items-center">

            <span className="text-gray-400">
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

            <span className="text-2xl font-bold text-green-500">
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

                alert(
                  "Payment Failed"
                );

              }}

            />

          </PayPalScriptProvider>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-600 mt-5">

          Encrypted & Secure
          Payment using PayPal

        </p>

      </div>

    </div>

  );

};

export default Pay;