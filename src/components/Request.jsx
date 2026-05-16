import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Request = ({ addRequest }) => {

  const [type, setType] = useState("organic");

  const [date, setDate] = useState("");

  const [address, setAddress] = useState("");

  const [fee, setFee] = useState(0);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // AUTO FEE CALCULATION
  // =========================
  useEffect(() => {

    if (
      type === "organic" ||
      type === "Electronic" ||
      type === "Hazardous"
    ) {

      setFee(15);

    } else if (
      type === "plastic" ||
      type === "paper/cardboard"
    ) {

      setFee(20);

    }

  }, [type]);

  // =========================
  // SUBMIT REQUEST API
  // =========================
  const handleSubmit = async () => {

    if (!date || !address) {

      alert("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

      const newRequest = {
        id: Date.now(),
        type,
        date,
        address,
        fee,
        status: "PENDING",
      };

      // =========================
      // API CALL
      // =========================
      const response = await fetch(
        "http://127.0.0.1:8000/api/requestrequests/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(newRequest),
        }
      );

      const savedRequest =
        await response.json();

      console.log(savedRequest);

      // =========================
      // UPDATE DASHBOARD
      // =========================
      if (addRequest) {

        addRequest(savedRequest);

      }

      // =========================
      // REDIRECT PAYMENT
      // =========================
      navigate("/pay", {
        state: { fee },
      });

    } catch (error) {

      console.log(
        "Request API Error:",
        error
      );

      alert("Request Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto">

      {/* HEADER */}
      <h2 className="text-xl mb-4 font-bold">
        New Waste Pickup Request
      </h2>

      {/* FORM GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* WASTE TYPE */}
        <div>

          <label className="text-gray-400 text-sm">
            WASTE TYPE
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full mt-2 p-4 bg-black text-white rounded-xl outline-none border border-gray-800 focus:border-green-500"
          >

            <option value="organic">
              Organic
            </option>

            <option value="plastic">
              Plastic
            </option>

            <option value="Electronic">
              Electronic
            </option>

            <option value="Hazardous">
              Hazardous
            </option>

          </select>

        </div>

        {/* DATE */}
        <div>

          <label className="text-gray-400 text-sm">
            PREFERRED DATE
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full mt-2 p-4 bg-black text-white rounded-xl outline-none border border-gray-800 focus:border-green-500"
          />

        </div>

      </div>

      {/* ADDRESS */}
      <div className="mt-4">

        <label className="text-gray-600">
          Pickup Address
        </label>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="w-full p-2 mb-3 bg-black rounded border border-gray-800 outline-none focus:border-green-500"
        />

      </div>

      {/* FEE */}
      <p className="mb-3 text-green-400">
        Fee: ${fee}
      </p>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-emerald-500 text-black px-4 py-2 rounded w-full"
      >

        {loading
          ? "Processing..."
          : "SUBMIT & PAY"}

      </button>

    </div>
  );
};

export default Request;