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

      setFee(50);

    } else if (
      type === "plastic" ||
      type === "paper/cardboard"
    ) {

      setFee(50);

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
        "http://127.0.0.1:8000/api/request/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newRequest),
        }
      );

      let savedRequest;
      if (!response.ok) {
        const text = await response.text();
        let errMsg = "Failed to submit request to server";
        
        // Extract Django exception description
        const exceptionMatch = text.match(/<pre class="exception_value">([\s\S]*?)<\/pre>/i);
        const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i);
        
        if (exceptionMatch && exceptionMatch[1]) {
          errMsg = exceptionMatch[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
        } else if (titleMatch && titleMatch[1]) {
          errMsg = titleMatch[1].trim();
        } else {
          errMsg = `Server Error: ${response.status} ${response.statusText}`;
        }
        
        console.error("Server 500 error content:", text);
        throw new Error(errMsg);
      } else {
        savedRequest = await response.json();
      }

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
        text: error.message || "Request Failed",
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-[#14532D] text-white p-6 rounded-xl max-w-xl mx-auto">

      {/* HEADER */}
      <h2 className="text-xl mb-4 font-bold">
        New Waste Pickup Request
      </h2>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* WASTE TYPE */}
        <div>

          <label className="text-white text-xs font-bold uppercase tracking-wider">
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

          <label className="text-white text-xs font-bold uppercase tracking-wider">
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

        <label className="text-white text-xs font-bold uppercase tracking-wider block mb-1">
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
      <p className="mb-3 text-white text-lg font-bold">
        Fee: <span className="text-green-300">₹{fee}</span>
      </p>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-white text-[#14532D] px-4 py-2 rounded w-full font-bold hover:bg-green-100 transition"
      >

        {loading
          ? "Processing..."
          : "SUBMIT & PAY"}

      </button>

    </div>
  );
};

export default Request;