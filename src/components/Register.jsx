import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    district: "",
    ward: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDistrictChange = (e) => {
    setForm({
      ...form,
      district: e.target.value,
      ward: "",
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phone ||
      !form.district ||
      !form.ward
    ) {

      Swal.fire({
        title: "Warning",
        text: "Please fill all fields",
        icon: "warning",
        confirmButtonColor: "#14532D",
      });

      return;

    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        title: "Warning",
        text: "Passwords do not match",
        icon: "warning",
        confirmButtonColor: "#14532D",
      });

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
          address: `${form.district} - Ward ${form.ward}`,
          role: form.role,
        }
      );

      console.log(response.data);

      Swal.fire({
        title: "Success",
        text: "Registration Successful",
        icon: "success",
        confirmButtonColor: "#14532D",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        district: "",
        ward: "",
        role: "USER",
      });

      navigate("/login");

    } catch (err) {

      console.log(err);

      Swal.fire({
        title: "Error",
        text: JSON.stringify(err.response?.data || "Registration Failed"),
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 pt-20 text-slate-900">

      <div className="w-full max-w-md bg-white border border-green-900 rounded-2xl p-6 shadow-2xl">

        {/* HEADER */}
        <h1 className="text-black text-4xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-sm text-center mt-1 mb-5">
          Join the EcoCollect community today
        </p>

        {/* FORM */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div>

            <label className="text-black text-sm font-bold">
              Name
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

              <label className="text-black text-sm font-bold">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
              />

            </div>

            {/* PHONE */}
            <div>

              <label className="text-black text-sm font-bold">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-black text-sm font-bold">
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
                placeholder="Enter Password"
                className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm pr-12"
              />

              {/* EYE ICON */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}
          <div>

            <label className="text-black text-sm font-bold">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm pr-12"
              />

              {/* EYE ICON */}
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >

                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          {/* DISTRICT */}
          <div>
            <label className="text-black text-sm font-bold">
              District
            </label>

           <select
             name="district"
             value={form.district}
             onChange={handleDistrictChange}
             className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
           >
             <option value="">Select District</option>
             <option value="Kasaragod">Kasargod</option>
             <option value="Kannur">Kannur</option>
             <option value="Wayanad">Wayanad</option>
             <option value="Kozhikode">Kozhikode</option>
             <option value="Malappuram">Malappuram</option>
             <option value="Palakkad">Palakkad</option>
             <option value="Thrissur">Thrissur</option>
             <option value="Ernakulam">Ernakulam</option>
             <option value="Idukki">Idukki</option>
             <option value="Kottayam">Kottayam</option>
             <option value="Alappuzha">Alappuzha</option>              
             <option value="Pathanamthitta">Pathanamthitta</option>
             <option value="Kollam">Kollam</option>
             <option value="Thiruvananthapuram">Thiruvananthapuram</option>
           </select>

          </div>

          {/* WARD */}
          <div>
            <label className="text-black text-sm font-bold">
              Ward
            </label>

            <input
              type="text"
              name="ward"
              value={form.ward}
              onChange={handleChange}
              placeholder="Enter Ward Number (e.g. 5)"
              className="w-full mt-1 p-2.5 bg-white text-black rounded-lg border border-gray-800 focus:border-green-500 outline-none text-sm"
            />
          </div>

          {/* ROLE */}
          <div>

            <label className="text-black font-bold">
              Role
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

             

            </select>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#14532D] text-[#FFFFFF] font-semibold py-3 rounded-xl hover:opacity-95"
          >

            {loading
              ? "Registering..."
              : "Register Now"}

          </button>

          {/* LOGIN LINK */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-700 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Register;