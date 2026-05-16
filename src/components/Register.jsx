import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "USER",
  });


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

 
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.address
    ) {

      alert("Please fill all fields");
      return;

    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          role: form.role,
        }
      );

      console.log(response.data);

      alert("Registration Successful");

      // =========================
      // SAVE USER
      // =========================
      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      // =========================
      // RESET FORM
      // =========================
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "USER",
      });

      // =========================
      // REDIRECT LOGIN
      // =========================
      navigate("/login");

    } catch (err) {

      console.log(err);

      alert(
        JSON.stringify(err.response?.data)
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4 mt-16">

      <div className="w-full max-w-xl bg-[#0b0f0f] border border-green-900 rounded-3xl p-9 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-white text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Join the EcoCollect community today
        </p>

        {/* FORM */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div>

            <label className="text-gray-400 text-sm">
              NAME
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
            />

          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-2 gap-4">

            {/* EMAIL */}
            <div>

              <label className="text-gray-400 text-sm">
                EMAIL
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
              />

            </div>

            {/* PHONE */}
            <div>

              <label className="text-gray-400 text-sm">
                PHONE
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-gray-400 text-sm">
              PASSWORD
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label className="text-gray-400 text-sm">
              ADDRESS
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              placeholder="Your Address..."
              className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
            />

          </div>

          {/* ROLE */}
          <div>

            <label className="text-gray-400 text-sm">
              ROLE
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-black text-white rounded-xl border border-gray-800 focus:border-green-500 outline-none"
            >

              <option value="USER">
                User
              </option>

              <option value="STAFF">
                Staff
              </option>

              <option value="ADMIN">
                Admin
              </option>

            </select>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black font-semibold py-3 rounded-xl hover:bg-green-600"
          >

            {loading
              ? "Registering..."
              : "REGISTER NOW"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default Register;