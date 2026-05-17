import React, { useState, useEffect } from "react";
import img from "../images/leaf.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 bg-black shadow-lg shadow-black/50">

      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <img className="w-16 md:w-28 h-auto block" src={img} alt="" />

          <h1 className="text-white text-xl md:text-3xl font-bold font-[Outfit]">
            ECO<span className="text-green-400">COLLECT</span>
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-300 hover:text-green-400 transition"
          >
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
                className="px-5 py-2 rounded-full text-white hover:text-red-600 transition"
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
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 bg-black p-4 rounded-xl">

          <Link
            to="/"
            className="text-gray-300 hover:text-green-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            HOME
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-green-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                DASHBOARD
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-white hover:text-red-600 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-green-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                LOGIN
              </Link>

              <Link
                to="/sign"
                className="bg-green-500 text-black px-5 py-2 rounded-full font-semibold hover:text-white transition text-center"
                onClick={() => setMenuOpen(false)}
              >
                JOIN NOW
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;