import React, { useState, useEffect } from "react";
import axios from "axios";

import "../All.css";

import img from "../images/wastebin.jpeg";
import img2 from "../images/wst.png";
import img3 from "../images/leaf.png";
import img4 from "../images/ims.jpeg";
import img5 from "../images/grl.jpeg";

import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {

  // BACKEND MESSAGE
  const [message, setMessage] = useState("");

  // SLIDER DATA
  const slides = [
    {
      title: "Smart Collection Systems",
      desc: "Real-time tracking and efficient pickup schedules tailored to your urban lifestyle.",
      img: img,
    },
    {
      title: "Sustainable Waste Solutions",
      desc: "Join the movement towards a cleaner, greener tomorrow with professional waste management.",
      img: img4,
    },
    {
      title: "Premium Service Quality",
      desc: "Experience the highest standards of environmental care and customer satisfaction.",
      img: img2,
    },
    {
      title: "Eco Friendly Future",
      desc: "Building a sustainable and cleaner future through smart waste management solutions.",
      img: img5,
    },
  ];

  // CURRENT SLIDE
  const [current, setCurrent] = useState(0);

  // BACKEND FETCH
  useEffect(() => {

    axios
      .get("https://preethu17.pythonanywhere.com/api/home/")
      .then((res) => {

        console.log(res.data);

        setMessage(res.data.message);

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // AUTO SLIDER
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent((prev) => (prev + 1) % slides.length);

    }, 2500);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* HERO SECTION */}
      <div
        className="min-h-screen flex items-center px-5 sm:px-10 lg:px-20 relative"
        style={{
          backgroundImage: slides[current].img
            ? `url(${slides[current].img})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-3xl">

          <p className="text-[#15ad52] tracking-widest mb-4 sm:mb-7 text-sm sm:text-base">
            PREMIUM ENVIRONMENT CARE
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {slides[current].title}
          </h1>

          <p className="text-gray-300 mt-5 sm:mt-7 max-w-xl text-sm sm:text-base">
            {slides[current].desc}
          </p>

          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4">

            <Link
              to="/sign"
              className="bg-[#D4AF37] text-[#14532D] font-bold hover:bg-[#14532D] hover:text-white px-6 py-3 rounded-full text-center"
            >
              Get Started
            </Link>

            <button className="border border-[#14532D] font-bold px-6 py-3 rounded-full">
              Learn More
            </button>

          </div>

          {/* Dots */}
          <div className="flex gap-3 mt-6">

            {slides.map((_, index) => (

              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={` rounded-full cursor-pointer transition-all duration-300 ${
                  current === index
                    ? "bg-[#D4AF37]"
                    : "bg-gray-500"
                }`}
              ></div>

            ))}

          </div>

        </div>
      </div>

      {/* WHY CHOOSE SECTION */}
      <section className="bg-[#14532D] py-16 text-center border border-black px-5">

        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mt-10 sm:mt-15 text-white">
          Why Choose <span className="text-[#D4AF37]">EcoCollect?</span>
        </h2>

        <p className="text-gray-300 mt-5 max-w-2xl mx-auto text-sm sm:text-base">
          We provide the most advanced waste management infrastructure
          for modern cities and conscious citizens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mt-16 sm:mt-20 lg:mt-26 px-0 sm:px-6 lg:px-20 pb-10 sm:pb-17 hover:shadow-cyan-600">

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
          ].map((item, i) => (

            <div
              key={i}
              className="bg-[#D4AF37] border border-black p-6 sm:p-8 rounded-xl 
              hover:border-emerald-500 transition-all duration-100 
              hover:-translate-y-2 hover:shadow-lg"
            >

              {/* ICON */}
              <div
                className="w-12 h-12 flex items-center justify-center 
                bg-[#14532D] backdrop-blur-md 
                text-[#D4AF37] rounded-lg mb-4 
                border border-[#D4AF37]/20 mx-auto md:mx-0"
              >
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-extrabold text-[#14532D]">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-black mt-2 text-sm">
                {item.desc}
              </p>

            </div>

          ))}

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#D4AF37] text-black py-16 sm:py-24 px-5">

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
      <footer className="py-6 border-t-2 border-black bg-[#14532D] px-5 sm:px-10">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 pb-10 sm:pb-20">

          {/* LEFT */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-10 sm:mt-15 text-center sm:text-left">

            <img
              className="w-14 h-14 sm:w-15 sm:h-15 object-contain"
              src={img3}
              alt="logo"
            />

            <div className="flex flex-col">

              <h1 className="text-[#D4AF37] font-bold">
                ECOCOLLECT
              </h1>

              <p className="text-emerald-100 text-sm sm:text-m max-w-md">
                Leading the way in sustainable urban waste
                management solutions.
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-m text-emerald-200 mt-5 lg:mt-15">

            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>

          </div>

        </div>

      </footer>
    </div>
  );
};

export default Home;