import React, { useState, useEffect } from "react";
import { Search, Check, X } from "lucide-react";

const Booking = () => {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const API = "http://127.0.0.1:8000/api/booking/bookings/";
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetch(`${API}/bookings/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.log(err));
  }, []);

  // ---------------- APPROVE ----------------
  const approveBooking = (id) => {
    fetch(`${API}/bookings/${id}/approve/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
        );
      });
  };

  // ---------------- REJECT ----------------
  const rejectBooking = (id) => {
    fetch(`${API}/bookings/${id}/reject/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((updated) => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
        );
      });
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-12 bg-[#030707] border border-[#062b24] rounded-[35px] overflow-hidden">

      {/* TOP */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-8 py-8 border-b border-[#062b24]">

        <h2 className="text-3xl font-bold">
          All Booking Requests
        </h2>

        {/* SEARCH */}
        <div className="bg-black rounded-2xl px-5 py-3 flex items-center gap-3 border border-[#071311] w-full md:w-[320px]">

          <Search size={20} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-white"
          />

        </div>

      </div>

      {/* BODY */}
      {filteredBookings.map((booking, index) => (

        <div
          key={booking.id}
          className="grid grid-cols-1 md:grid-cols-5 gap-5 px-8 py-8 border-b border-[#071311] items-center"
        >

          <div>
            <h2 className="text-2xl font-bold">
              {booking.user}
            </h2>

            <p className="text-gray-500 mt-1">
              ID: {booking.id}
            </p>
          </div>

          <div className="text-2xl font-bold">
            {booking.type}
          </div>

          <div className="text-gray-400 text-lg">
            {booking.address}
          </div>

          <div>

            <span className="px-5 py-2 rounded-full text-sm font-bold bg-yellow-900/40 text-yellow-400">
              {booking.status.toUpperCase()}
            </span>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => approveBooking(booking.id)}
              className="w-12 h-12 rounded-xl bg-[#002f25] flex items-center justify-center"
            >
              <Check className="text-[#00d084]" size={20} />
            </button>

            <button
              onClick={() => rejectBooking(booking.id)}
              className="w-12 h-12 rounded-xl bg-[#2d0808] flex items-center justify-center"
            >
              <X className="text-red-500" size={20} />
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

export default Booking;