import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Toaster, toast } from "react-hot-toast";

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

      toast.error("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "https://preethu17.pythonanywhere.com/api/login/",
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

        toast.error(
          data.error || "Invalid Credentials"
        );

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
      toast.success("Login is Successful");

      // =========================
      // ROLE NAVIGATION
      // =========================
      const role =
        data.user?.role?.toLowerCase();

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

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center px-4 text-[#D4AF37] border-2 border-green-900">

      {/* TOASTER */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#14532D",
            color: "#D4AF37",
            border: "2px solid #D4AF37",
            borderRadius: "12px",
            fontWeight: "bold",
          },
        }}
      />

      <div className="w-95 max-w-xl bg-[#14532D] border-2 border-[#D4AF37] rounded-3xl p-9 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-center font-bold text-4xl mb-2 border-[#D4AF37] border-b-2 pb-3">

          Account Login

        </h1>

        <p className="text-center text-white mb-7">

          Enter your credentials to access your dashboard

        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          {/* EMAIL */}
          <div className="mb-6">

            <label className="block text-sm text-[#D4AF37] font-bold mb-2">

              EMAIL

            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-800 text-black focus:border-green-500 outline-none"
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-8">

            <label className="block text-sm text-[#D4AF37] font-bold mb-2">

              PASSWORD

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
            className="w-full bg-[#D4AF37] hover:bg-[#14532D] text-[#14532D] hover:text-[#D4AF37] font-extrabold py-3 rounded-xl border-2 border-emerald-900"
          >

            {loading
              ? "Logging in..."
              : "LOGIN"}

          </button>

          {/* REGISTER */}
          <p className="text-center mt-3">

            Don't have an account?{" "}

            <Link
              to="/sign"
              className="text-[#D4AF37] font-bold hover:underline"
            >

              Register here

            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;