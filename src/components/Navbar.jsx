import React, { useState, useEffect } from "react";
import img from "../images/leaf.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    setIsLoggedIn(!!userStr);
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setIsAdmin((u.role || "").toLowerCase() === "admin");
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isHome = location.pathname === "/home" || location.pathname === "/";
      if (isHome && window.scrollY < 50) {
        setIsTransparent(true);
      } else {
        setIsTransparent(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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
        setMenuOpen(false);
        navigate("/home");
      }
    });
  };

  const getDashboardPath = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "/dashboard";
    try {
      const u = JSON.parse(userStr);
      const role = (u.role || "").toLowerCase();
      if (role === "staff") return "/staff";
      if (role === "admin") return "/admindash";
    } catch (e) {
      console.log(e);
    }
    return "/dashboard";
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent
        ? "bg-transparent border-b border-transparent text-white"
        : "bg-white border-b border-green-300 text-black shadow-lg shadow-black/50"
    }`}>

      <div className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between w-full">

        {/* Logo */}
        <div className="flex items-center gap-1">
          <img  className="w-12 md:w-16 h-auto block opacity-90 -mr-2 md:-mr-3" src={img}  alt="Logo" />

          <h1 className="text-xl md:text-3xl font-bold font-[Outfit] tracking-tight">
            <span className={isTransparent ? "text-white" : "text-black"}>ECO</span>
            <span className={isTransparent ? "text-green-400" : "text-[#14532D]"}>COLLECT</span>
          </h1>
        </div>

        {/* Mobile Navigation Area */}
        <div className="md:hidden flex items-center gap-4">
          <button
            className={`text-3xl ${isTransparent ? "text-white" : "text-black"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className={`font-bold transition ${
              isTransparent
                ? "text-white hover:text-green-400"
                : "text-black hover:text-green-400"
            }`}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to={getDashboardPath()}
                className={`font-bold transition ${
                  isTransparent
                    ? "text-white hover:text-green-400"
                    : "text-black hover:text-green-400"
                }`}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
            

              <Link
                to="/sign"
                className="bg-[#14532D] text-white px-5 py-2 rounded-full font-bold hover:bg-[#14532D] hover:text-green-300 transition"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 bg-[#113723] text-white p-5 border-t border-green-800/50 shadow-inner">

          <Link
            to="/"
            className="text-white hover:text-green-400 font-bold transition text-sm tracking-wide uppercase"
            onClick={() => setMenuOpen(false)}
          >
            HOME
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to={getDashboardPath()}
                className="text-white hover:text-green-400 font-bold transition text-sm tracking-wide uppercase"
                onClick={() => setMenuOpen(false)}
              >
                DASHBOARD
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-green-400 font-bold transition text-sm tracking-wide uppercase"
                onClick={() => setMenuOpen(false)}
              >
                LOGIN
              </Link>

              <Link
                to="/sign"
                className="bg-white text-[#14532D] px-5 py-2 rounded-full font-extrabold hover:bg-green-100 transition text-center text-sm"
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