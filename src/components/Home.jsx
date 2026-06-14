import React, { useState, useEffect } from "react";
import axios from "axios";

import "../All.css";

import img3 from "../images/leaf.png";

import {
  Truck,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Home = () => {

  // BACKEND MESSAGE
  const [message, setMessage] = useState("");

  // BACKEND FETCH
  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/home/")
      .then((res) => {

        console.log(res.data);

        setMessage(res.data.message);

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* HERO SECTION WITH BACKGROUND VIDEO */}
      <div className="min-h-screen flex items-center justify-center text-center px-5 sm:px-10 lg:px-20 relative overflow-hidden">
        
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">

          {/* Premium Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/45 border border-emerald-500/30 backdrop-blur-md mb-6 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <p className="text-xs sm:text-sm text-emerald-300 font-semibold tracking-wider uppercase">
              Premium Eco-Care Initiative
            </p>
          </div>

          {/* Gorgeous Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Towards a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-[#D4AF37]">Cleaner & Greener</span> Tomorrow
          </h1>

          {/* Catchy Subtitle */}
          <p className="text-gray-200 mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg lg:text-xl font-light leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Join hands with EcoCollect and Haritha Karma Sena to revolutionize waste management. Experience smart pickups, real-time tracking, and a sustainable lifestyle.
          </p>

          {/* Enhanced Action Buttons */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">

            <Link
              to="/sign"
              className="group flex items-center justify-center gap-2 bg-[#14532D] text-white font-extrabold hover:bg-emerald-500 hover:text-white px-8 py-4 rounded-full text-center transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 border border-white/30 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-bold px-8 py-4 rounded-full shadow-lg transform hover:-translate-y-0.5"
            >
              <span>Learn More</span>
            </Link>

            

          </div>

        </div>
      </div>

      {/* WHY CHOOSE SECTION */}
      <section className=" py-16 text-center bg-white border border-black px-5">

        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mt-10 sm:mt-15 text-[#14532D]">
          Why Choose <span className="text-green-400">EcoCollect?</span>
        </h2>

        <p className="text-gray-600 mt-5 max-w-2xl mx-auto text-sm sm:text-base">
          We provide the most advanced waste management infrastructure
          for modern cities and conscious citizens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9 sm:gap-12 mt-16 sm:mt-20 lg:mt-26 px-0 sm:px-6 lg:px-20 pb-10 sm:pb-17 hover:shadow-cyan-600">

          {[
            {
              title: "Smart Pickup",
              desc: "Schedule pickups at your convenience with our intelligent routing system.",
              icon: <Truck size={24} />,
            },
            {
              title: "Verified Staff",
              desc: "All our collection agents are background checked and professionally trained.",
              icon: <ShieldCheck size={24} />,
            },
            {
              title: "Secure Payments",
              desc: "Multiple online payment options with instant digital receipts.",
              icon: <CreditCard size={24} />,
            },
             {
              title: "Secure Payments",
              desc: "Multiple online payment options with instant digital receipts.",
              icon: <CreditCard size={24} />,
            },
          ].map((item, i) => (

            <div
              key={i}
              className="bg-[#14532D] border border-black p-6 sm:p-8 rounded-xl 
              hover:border-emerald-500 transition-all duration-100 
              hover:-translate-y-2 hover:shadow-lg"
            >

              {/* ICON */}
              <div
                className="w-12 h-12 flex items-center justify-center 
                bg-white backdrop-blur-md 
                text-[#14532D] rounded-lg mb-4 
                border border-[#D4AF37]/20 mx-auto md:mx-0"
              >
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-extrabold text-white">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-white mt-2 text-sm">
                {item.desc}
              </p>

            </div>

          ))}

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-green-300 text-black py-16 sm:py-24 px-5">

        <div className="grid grid-cols-2 lg:grid-cols-4 text-center gap-8 mt-5">

          <div>
            <h3 className="text-4xl sm:text-6xl font-extrabold">10k+</h3>
            <p className="text-sm sm:text-base">Happy Clients</p>
          </div>

          <div>
            <h3 className="text-4xl sm:text-6xl font-extrabold">50t</h3>
            <p className="text-sm sm:text-base">Waste Collected</p>
          </div>

          <div>
            <h3 className="text-4xl sm:text-6xl font-extrabold">15</h3>
            <p className="text-sm sm:text-base">Cities Covered</p>
          </div>

          <div>
            <h3 className="text-4xl sm:text-6xl font-extrabold">24/7</h3>
            <p className="text-sm sm:text-base">Support</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-black text-white pt-16 pb-8 border-t border-green-900 px-5 sm:px-10 lg:px-20 font-[Outfit]">
        
        {/* Newsletter / Upper Row */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-green-950">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text  from-emerald-400 to-[#D4AF37]">
              Stay Green, Stay Informed
            </h3>
            <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl text-center ">
              Subscribe to our newsletter for the latest tips on sustainable waste management, recycling updates, and community clean-up drives.
            </p>
          </div>
          
        </div>

        {/* Middle Footer Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                className="w-10 h-10 object-contain"
                src={img3}
                alt="logo"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                ECO<span className="text-green-400">COLLECT</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading the way in sustainable urban waste management solutions. Empowering communities for a clean, green, and circular future.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-green-400 hover:bg-[#14532D] hover:text-white transition-all duration-300">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-green-400 hover:bg-[#14532D] hover:text-white transition-all duration-300">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-green-400 hover:bg-[#14532D] hover:text-white transition-all duration-300">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-green-400 hover:bg-[#14532D] hover:text-white transition-all duration-300">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 border-l-2 border-emerald-500 pl-3">
              Our Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li><Link to="/booking" className="hover:text-emerald-400 transition-colors">Smart Garbage Pickup</Link></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Dry & Wet Waste Sorting</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">E-Waste Disposal</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Hazardous Waste Collection</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Community Cleanups</a></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 border-l-2 border-emerald-500 pl-3">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
              <li><Link to="/home" className="hover:text-emerald-400 transition-colors">Home Page</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">User Dashboard</Link></li>
              <li><Link to="/complaint" className="hover:text-emerald-400 transition-colors">Raise a Complaint</Link></li>
              <li><Link to="/history" className="hover:text-emerald-400 transition-colors">Payment History</Link></li>
              <li><Link to="/track" className="hover:text-emerald-400 transition-colors">Live Tracking</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 border-l-2 border-emerald-500 pl-3">
              Contact Info
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Haritha Karma Sena Central Hub, Main Road, Kerala, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <span>+91 9999999999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>support@ecocollect.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div className="max-w-7xl mx-auto pt-8 mt-4 border-t border-green-950 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} EcoCollect & Haritha Karma Sena. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default Home;