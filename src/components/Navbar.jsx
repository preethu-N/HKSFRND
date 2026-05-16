import React, { useState, useEffect } from "react";
import img from "../images/leaf.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    navigate("/login"); // 🔥 redirect if not logged in
  }
}, []);


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);


 const handleLogout = () => {
  localStorage.removeItem("user");
  setIsLoggedIn(false);
  navigate("/login");
};

 
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 bg-black flex items-center justify-between shadow-lg shadow-black/50">

      {/* Logo */}
      <div className="flex items-center">
        <img className="w-28 h-15 block" src={img} alt="" />
        <h1 className="text-white text-3xl font-bold font-[Outfit]">
          ECO<span className="text-green-400">COLLECT</span>
        </h1>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-8">

        <Link to="/" className="text-gray-300 hover:text-green-400 transition">
          HOME
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-green-400 transition"
            >
              DASHBOARD
            </Link>

            <button
               onClick={handleLogout}
              className=" px-5 py-2 rounded-full text-white hover:text-red-600 transition"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-green-400 transition"
            >
              LOGIN
            </Link>

            <Link
              to="/sign"
              className="bg-green-500 text-black px-5 py-2 rounded-full font-semibold hover:text-white transition"
            >
              JOIN NOW
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;