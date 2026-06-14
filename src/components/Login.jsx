import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import { Eye, EyeOff } from "lucide-react";

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // =========================
  // AUTH REDIRECT ON MOUNT
  // =========================
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const role = (u.role || "").toLowerCase();
        if (role === "staff") {
          navigate("/staff");
        } else if (role === "admin") {
          navigate("/admindash");
        } else {
          navigate("/dashboard");
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [navigate]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // =========================
  // LOGIN
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (!form.email || !form.password) {

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

      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN DATA =", data);

      // ERROR
      if (!response.ok) {

        Swal.fire({
          title: "Error",
          text: data.error || "Invalid Credentials",
          icon: "error",
          confirmButtonColor: "#14532D",
        });

        return;
      }

      // =========================
      // SAVE USER
      // =========================
      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      }

      // =========================
      // SAVE TOKEN
      // =========================
      if (data.access) {

        localStorage.setItem(
          "access",
          data.access
        );

      }

      // SUCCESS MESSAGE
      Swal.fire({
        title: "Success",
        text: "Login is Successful",
        icon: "success",
        confirmButtonColor: "#14532D",
      });

      // =========================
      // ROLE NAVIGATION
      // =========================
      const role =
        (data.role || data.user?.role || "").toLowerCase();

      setTimeout(() => {

        if (role === "staff") {

          navigate("/staff");

        } else if (role === "admin") {

          navigate("/admindash");

        } else {

          navigate("/dashboard");

        }

      }, 1500);

    } catch (error) {

      console.log("Login Error:", error);

      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center px-4 text-[#14532D] border-2 border-green-900">



      <div className="w-full max-w-sm bg-white border-2 rounded-3xl p-6 sm:p-9 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-center font-bold text-3xl mb-2 border-[#14532D] border-b-2 pb-3">

          Account Login

        </h1>

        <p className="text-center text-gray-500 mb-2">

          Enter your credentials to access your dashboard

        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          {/* EMAIL */}
          <div className="mb-6">

            <label className="block text-sm text-[#14532D] font-bold mb-2">

              Email or Username

            </label>

            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email or Username"
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-800 text-black focus:border-green-500 outline-none"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-8">

            <label className="block text-sm text-[#14532D] font-bold mb-2">

              Password

            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl bg-white border border-gray-800 text-black focus:border-green-500 outline-none pr-14"
              />

              {/* EYE ICON */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
              >

                {showPassword ? (
                  <EyeOff size={22} />
                ) : (
                  <Eye size={22} />
                )}

              </button>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#14532D] hover:bg-green-500 text-white hover:text-[#14532D] font-extrabold py-3 text-xl rounded-xl border-2 border-emerald-900"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

          {/* REGISTER */}
          

        </form>

      </div>

    </div>
  );
};

export default Login;