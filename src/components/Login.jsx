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
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN DATA =", data);

      if (!response.ok) {
        alert(data.error || "Invalid Credentials");
        return;
      }

      // =========================
      // SAVE USER
      // =========================
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // =========================
      // SAVE TOKEN (IMPORTANT FIX)
      // =========================
      if (data.access) {
        localStorage.setItem("access", data.access);
      }

      console.log("TOKEN =", localStorage.getItem("access"));
      console.log("USER =", localStorage.getItem("user"));

      alert("Login Successful");

      // =========================
      // ROLE NAVIGATION
      // =========================
      const role = data.user?.role?.toLowerCase();

      if (role === "staff") {
        navigate("/staff");
      } else if (role === "admin") {
        navigate("/admindash");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log("Login Error:", error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

      <div className="w-95 max-w-xl bg-[#0b0f0f] border border-green-900 rounded-3xl p-9 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-center font-bold text-3xl mb-2">
          Account Login
        </h1>

        <p className="text-center text-gray-500 mb-7">
          Enter your credentials to access your dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6">

          {/* EMAIL */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              EMAIL
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full px-5 py-3 rounded-xl bg-black border border-gray-800 text-white focus:border-green-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-2">
              PASSWORD
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-black border border-gray-800 text-white focus:border-green-500 outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* REGISTER */}
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link to="/sign" className="text-emerald-500">
              Register here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;