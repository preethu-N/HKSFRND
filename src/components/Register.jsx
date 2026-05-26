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
        "https://preethu17.pythonanywhere.com/api/register/",
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

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "USER",
      });

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

    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 text-white mt-20">

      <div className="w-full max-w-md bg-[#14532D] border border-green-900 rounded-2xl p-6 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-[#D4AF37] 2 text-4xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-300 text-sm text-center mt-1 mb-5">
          Join the EcoCollect community today
        </p>

        {/* FORM */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div>

            <label className="text-[#D4AF37] text-sm font-bold">
              NAME
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
            />

          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* EMAIL */}
            <div>

              <label className="text-[#D4AF37] text-sm font-bold">
                EMAIL
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full mt-1 p-2.5  bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
              />

            </div>

            {/* PHONE */}
            <div>

              <label className="text-[#D4AF37] text-sm font-bold">
                PHONE
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full mt-1 p-2.5  bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-[#D4AF37] text-sm font-bold">
              PASSWORD
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
            />

          </div>

          {/* ADDRESS */}
          <div>

            <label className="text-[#D4AF37] text-sm font-bold">
              ADDRESS
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="2"
              placeholder="Your Address..."
              className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm resize-none"
            />

          </div>

          {/* ROLE */}
          <div>

            <label className="text-[#D4AF37] text-   font-bold">
              ROLE
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
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
            className="w-full bg-[#D4AF37] text-[#14532D] font-semibold py-3 rounded-xl hover:opacity-95"
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