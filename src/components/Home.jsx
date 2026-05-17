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
    <div className="bg-black text-white">

      {/* HERO SECTION */}
      <div
        className="h-screen flex items-center px-20 relative"
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
        <div className="relative z-10">

          {/* BACKEND MESSAGE */}
          <p className="text-emerald-400 font-semibold mb-4">
            {message}
          </p>

          <p className="text-green-400 tracking-widest mb-7">
            PREMIUM ENVIRONMENT CARE
          </p>

          <h1 className="text-6xl font-bold">
            {slides[current].title}
          </h1>

          <p className="text-gray-300 mt-7 max-w-xl">
            {slides[current].desc}
          </p>

          <div className="mt-18 flex gap-4">

            <Link
              to="/sign"
              className="bg-emerald-500 text-black font-bold px-6 py-3 rounded-full"
            >
              Get Started
            </Link>

            <button className="border border-gray-300 font-bold px-6 py-3 rounded-full">
              Learn More
            </button>

          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-6">

            {slides.map((_, index) => (

              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full cursor-pointer w-3 h-3 ${
                  current === index
                    ? "bg-green-400"
                    : "bg-gray-500"
                }`}
              ></div>

            ))}

          </div>

        </div>
      </div>

      {/* WHY CHOOSE SECTION */}
      <section className="clre py-16 text-center border border-emerald-500">

        <h2 className="text-5xl font-bold mt-15">
          Why Choose <span className="text-emerald-500">EcoCollect?</span>
        </h2>

        <p className="text-gray-400 mt-5">
          We provide the most advanced waste management infrastructure
          for modern cities and conscious citizens.
        </p>

        <div className="grid md:grid-cols-3 gap-12 mt-26 px-34 pb-17">

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
              className="bg-black border border-gray-800 p-8 rounded-xl 
              hover:border-emerald-500 transition-all duration-100 
              hover:-translate-y-2 hover:shadow-lg"
            >

              {/* ICON */}
              <div
                className="w-12 h-12 flex items-center justify-center 
                bg-emerald-500/10 backdrop-blur-md 
                text-emerald-400 rounded-lg mb-4 
                border border-emerald-500/20"
              >
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-extrabold text-white">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-gray-400 mt-2 text-sm">
                {item.desc}
              </p>

            </div>

          ))}

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-emerald-500 text-black py-24">

        <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 mt-5">

          <div>
            <h3 className="text-5xl font-extrabold">10k+</h3>
            <p className="text-m">Happy Clients</p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold">50t</h3>
            <p className="text-m">Waste Collected</p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold">15</h3>
            <p className="text-m">Cities Covered</p>
          </div>

          <div>
            <h3 className="text-5xl font-extrabold">24/7</h3>
            <p className="text-m">Support</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 border-t border-gray-800">

        <div className="flex justify-between items-center pb-25">

          {/* LEFT */}
          <div className="flex items-center gap-3 mt-15">

            <img
              className="w-15 h-15 object-contain -mt-4"
              src={img3}
              alt="logo"
            />

            <div className="flex flex-col">

              <h1 className="text-green-400 font-bold">
                ECOCOLLECT
              </h1>

              <p className="text-gray-400 text-m">
                Leading the way in sustainable urban waste
                management solutions.
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex gap-8 mr-2.5 text-m text-gray-400 mt-15">

            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>

          </div>

        </div>

      </footer>
    </div>
  );
};

export default Home;