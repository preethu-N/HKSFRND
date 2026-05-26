import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

    if (!form.email || !form.password) {
      console.log("Please fill all fields");
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

      if (!response.ok) {
        console.log(data.error || "Invalid Credentials");
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

      console.log("Login Successful");

      // =========================
      // ROLE NAVIGATION
      // =========================
      const role =
        data.user?.role?.toLowerCase();

      if (role === "staff") {

        navigate("/staff");

      } else if (role === "admin") {

        navigate("/admindash");

      } else {

        navigate("/dashboard");

      }

    } catch (error) {

      console.log("Login Error:", error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center px-4 text-[#D4AF37] border-2 border-green-900">

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

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-white border border-gray-800 text-black focus:border-green-500 outline-none"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#14532D] text-[#14532D] hover:text-[#D4AF37] font-extrabold py-3 rounded-xl border-2 border-emerald-900"
          >

            {loading ? "Logging in..." : "LOGIN"}

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