import React, { useState, useEffect } from "react";
import { LogOut, Search, Check, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  // ✅ FIX 1: REMOVE EXTRA /notifications/
  const API = "https://preethu17.pythonanywhere.com/api/adminpanel/";

  // ✅ FIX 2: TOKEN FROM access (NOT user.token)
  const token = localStorage.getItem("access");

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // ---------------- FETCH BOOKINGS (SEPARATE) ----------------
  const fetchBookings = () => {
    setLoadingBookings(true);
    fetch(`${API}/bookings/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setBookings([]);
      })
      .finally(() => setLoadingBookings(false));
  };

  // ✅ REFACTORED: FETCH DATA ----------------
  useEffect(() => {

    // USERS
    fetch(`${API}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err));

    // BOOKINGS
    fetchBookings();

    // COMPLAINTS
    fetch(`${API}/complaints/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch((err) => console.log(err));

  }, [token]);

  // ---------------- BOOKINGS ACTIONS ----------------
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

  // ---------------- COMPLAINT ACTIONS ----------------
  const resolveComplaint = (id) => {
    fetch(`${API}/complaints/${id}/resolve/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((updated) => {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
      });
  };

  const deleteComplaint = (id) => {
    fetch(`${API}/complaints/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    });
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.user || "")
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <div className="flex items-center justify-between px-10 py-7 border-b border-[#062b24]">

        <h1 className="text-4xl font-bold">
          ECO<span className="text-[#00d084]">COLLECT</span>
        </h1>

        <button
          onClick={() => {
            if (window.confirm("Logout?")) {
              localStorage.removeItem("access");
              localStorage.removeItem("user");
              navigate("/login");
            }
          }}
          className="flex items-center gap-2 hover:text-red-400 transition"
        >
          <LogOut size={16} />
          LOGOUT
        </button>
      </div>

      <div className="px-5 md:px-10 py-10">

        {/* TABS */}
        <div className="flex gap-3 mb-10">

          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-full ${
              activeTab === "users"
                ? "bg-[#00d084] text-black"
                : "bg-[#071311]"
            }`}
          >
            USERS
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 rounded-full ${
              activeTab === "bookings"
                ? "bg-[#00d084] text-black"
                : "bg-[#071311]"
            }`}
          >
            BOOKINGS
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-6 py-3 rounded-full ${
              activeTab === "complaints"
                ? "bg-[#00d084] text-black"
                : "bg-[#071311]"
            }`}
          >
            COMPLAINTS
          </button>

        </div>

        {/* USERS */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {users.map((user) => (
              <div
                key={user.id}
                className="border border-[#062b24] p-8 rounded-3xl"
              >
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-gray-400 mt-3">{user.email}</p>

                <div className="mt-5">
                  <span className="bg-[#071311] px-4 py-2 rounded-full text-[#00d084]">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-[#030707] rounded-3xl border border-[#062b24] overflow-hidden">

            <div className="p-8 border-b border-[#062b24] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search size={20} />

                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full"
                />
              </div>

              <button
                onClick={fetchBookings}
                disabled={loadingBookings}
                className="flex items-center gap-2 px-4 py-2 bg-[#00d084] text-black rounded-full hover:bg-[#00c978] transition disabled:opacity-50"
              >
                <RefreshCw size={16} className={loadingBookings ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {loadingBookings ? (
              <div className="p-8 text-center text-gray-400">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No bookings found.</div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid md:grid-cols-5 gap-5 p-8 border-b border-[#071311]"
                >
                  <div>
                    <p className="font-bold">{booking.user}</p>
                    <p className="text-gray-500 text-sm">ID: {booking.id}</p>
                  </div>
                  <div>{booking.type}</div>
                  <div>{booking.address}</div>
                  <div>
                    <span className="px-3 py-1 bg-yellow-900/40 text-yellow-400 rounded-full text-sm">
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => approveBooking(booking.id)}
                      className="bg-green-900 p-3 rounded-xl hover:bg-green-800 transition"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      onClick={() => rejectBooking(booking.id)}
                      className="bg-red-900 p-3 rounded-xl hover:bg-red-800 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="bg-[#030707] rounded-3xl border border-[#062b24] overflow-hidden">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="grid md:grid-cols-5 gap-5 p-8 border-b border-[#071311]"
              >
                <div>{complaint.user}</div>
                <div>{complaint.subject}</div>
                <div>{complaint.message}</div>
                <div>{complaint.status}</div>

                <div className="flex gap-3">
                  <button
                    onClick={() => resolveComplaint(complaint.id)}
                    className="bg-green-900 px-4 py-2 rounded-xl"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => deleteComplaint(complaint.id)}
                    className="bg-red-900 px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;