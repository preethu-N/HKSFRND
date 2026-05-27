import React, { useState, useEffect } from "react";
import img from "../images/leaf.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#14532D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        setIsLoggedIn(false);
        navigate("/login");
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 bg-[#14532D] border-b border-yellow-300 text-white shadow-lg shadow-black/50">

      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <img  className="w-16 md:w-28 h-auto block opacity-80" src={img}  alt="Logo" />

          <h1 className="text-[#D4AF37] text-xl md:text-3xl font-bold font-[Outfit]">
            ECO<span className="text-white">COLLECT</span>
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
            className="text-[#D4AF37] hover:text-green-400 font-bold transition"
          >
            HOME
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-[#D4AF37] hover:text-green-400 font-bold transition"
              >
                DASHBOARD
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full text-[#D4AF37] hover:text-red-600 font-bold transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#D4AF37] hover:text-green-400 font-bold transition"
              >
                LOGIN
              </Link>

              <Link
                to="/sign"
                className="bg-[#D4AF37] text-[#14532D] px-5 py-2 rounded-full font-bold hover:bg-[#14532D] hover:text-[#D4AF37] transition"
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
            className="text-[#D4AF37] hover:text-green-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            HOME
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-[#D4AF37] hover:text-green-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                DASHBOARD
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-[#D4AF37] hover:text-red-600 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#D4AF37] hover:text-green-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                LOGIN
              </Link>

              <Link
                to="/sign"
                className="bg-[#D4AF37] text-[#14532D] px-5 py-2 rounded-ful font-semibold hover:bg-[#14532D] hover:text-[#D4AF37] transition text-center"
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