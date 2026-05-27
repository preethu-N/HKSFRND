import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

      Swal.fire({
        title: "Warning",
        text: "Please fill all fields",
        icon: "warning",
        confirmButtonColor: "#14532D",
      });

      return;
    }

    try {

      setLoading(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      const newRequest = {
        user: user?.id,
        waste_type: type,
        date,
        address,
        fee,
        status: "PENDING",
      };

      // =========================
      // API CALL
      // =========================
      const token = localStorage.getItem("access");
      const response = await fetch(
        "https://preethu17.pythonanywhere.com/api/request/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        state: { fee, type },
      });

    } catch (error) {

      console.log(
        "Request API Error:",
        error
      );

      Swal.fire({
        title: "Error",
        text: "Request Failed",
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-[#14532D] text-[#D4AF37] p-6 rounded-xl max-w-xl mx-auto">

      {/* HEADER */}
      <h2 className="text-xl mb-4 font-bold">
        New Waste Pickup Request
      </h2>

      {/* FORM GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* WASTE TYPE */}
        <div>

          <label className="text-[#14532D] text-sm">
            WASTE TYPE
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full mt-2 p-4 bg-white text-[#14532D] rounded-xl outline-none border border-[#14532D] focus:border-[#14532D]"
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

          <label className="text-[#14532D] text-sm">
            PREFERRED DATE
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full mt-2 p-4 bg-white text-[#14532D] rounded-xl outline-none border border-[#14532D] focus:border-[#14532D]"
          />

        </div>

      </div>

      {/* ADDRESS */}
      <div className="mt-4">

        <label className="text-[#14532D]">
          Pickup Address
        </label>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="w-full p-2 mb-3 bg-white text-[#14532D] rounded border border-[#14532D] outline-none focus:border-[#14532D]"
        />

      </div>

      {/* FEE */}
      <p className="mb-3 text-[#14532D]">
        Fee: ${fee}
      </p>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#D4AF37] text-[#14532D] px-4 py-2 rounded w-full hover:opacity-90"
      >

        {loading
          ? "Processing..."
          : "SUBMIT & PAY"}

      </button>

    </div>
  );
};

export default Request;