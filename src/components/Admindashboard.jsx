import React, { useState, useEffect } from "react";
import { LogOut, Search, Check, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  // ✅ FIX 1: REMOVE EXTRA /notifications/
  const API = "http://127.0.0.1:8000/api/adminpanel/";

  // ✅ FIX 2: TOKEN FROM access (NOT user.token)
  const token = localStorage.getItem("access");

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [staffReport, setStaffReport] = useState([]);
  const [loadingStaffReport, setLoadingStaffReport] = useState(false);
  const [expandedStaff, setExpandedStaff] = useState({});
  const [adminName, setAdminName] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  const toggleExpand = (id) => {
    setExpandedStaff((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchStaffReport = () => {
    setLoadingStaffReport(true);
    fetch("http://127.0.0.1:8000/api/tracking/sessions/admin_report/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => setStaffReport(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setStaffReport([]);
      })
      .finally(() => setLoadingStaffReport(false));
  };

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

  // ---------------- FETCH LEAVES ----------------
  const fetchLeaves = () => {
    setLoadingLeaves(true);
    fetch("http://127.0.0.1:8000/api/staff/leave/list/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => setLeaves(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setLeaves([]);
      })
      .finally(() => setLoadingLeaves(false));
  };

  // ✅ REFACTORED: FETCH DATA ----------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setAdminName(u.name || "Admin");
      } catch (e) {
        console.log(e);
        setAdminName("Admin");
      }
    } else {
      setAdminName("Admin");
    }

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

    // STAFF REPORT
    fetchStaffReport();

    // LEAVES
    fetchLeaves();

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

  // ---------------- LEAVE ACTIONS ----------------
  const approveLeave = (id) => {
    fetch(`http://127.0.0.1:8000/api/staff/leave/${id}/approve/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Approval failed");
        return res.json();
      })
      .then(() => {
        Swal.fire({
          title: "Approved!",
          text: "Leave request approved successfully.",
          icon: "success",
          confirmButtonColor: "#14532D",
        });
        fetchLeaves();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to approve leave.",
          icon: "error",
          confirmButtonColor: "#14532D",
        });
      });
  };

  const rejectLeave = (id) => {
    fetch(`http://127.0.0.1:8000/api/staff/leave/${id}/reject/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Rejection failed");
        return res.json();
      })
      .then(() => {
        Swal.fire({
          title: "Rejected!",
          text: "Leave request rejected.",
          icon: "success",
          confirmButtonColor: "#14532D",
        });
        fetchLeaves();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to reject leave.",
          icon: "error",
          confirmButtonColor: "#14532D",
        });
      });
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.user || "")
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#14532D] text-white overflow-x-hidden pt-16 md:pt-20">

      {/* NAVBAR */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-5 md:px-10 py-7 border-b border-[#0b826c] text-center md:text-left">

        <h1 className="text-2xl md:text-3xl font-bold text-white w-full md:w-auto">
          Admin: <span className="text-green-300">{adminName}</span>
        </h1>

        <button
          onClick={() => {
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
                localStorage.removeItem("access");
                localStorage.removeItem("user");
                navigate("/home");
              }
            });
          }}
          className="flex items-center justify-center gap-2 hover:text-red-400 transition mx-auto md:mx-0"
        >
          <LogOut size={16} />
          LOGOUT
        </button>
      </div>

      <div className="px-5 md:px-10 py-10">

        {/* TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "users"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            USERS
          </button>

          <button
            onClick={() => {
              setActiveTab("staff");
              fetchStaffReport();
            }}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "staff"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            STAFF
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "admins"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            ADMINS
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "bookings"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            BOOKINGS
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "complaints"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            COMPLAINTS
          </button>

          <button
            onClick={() => {
              setActiveTab("leaves");
              fetchLeaves();
            }}
            className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeTab === "leaves"
                ? "bg-white text-[#14532D] shadow-md scale-105"
                : "bg-[#071311] text-white/80 hover:text-white"
            }`}
          >
            LEAVES
          </button>

        </div>

        {/* USERS */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {users
              .filter((user) => (user.role || "").toUpperCase() === "USER")
              .map((user) => (
                <div
                  key={user.id}
                  className="border border-[#1dab91] p-6 sm:p-8 rounded-3xl flex flex-col gap-4 w-full text-center md:text-left"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
                  <p className="text-white">{user.email}</p>

                  <div className="mt-3 flex justify-center md:justify-start">
                    <span className="bg-[#071311] px-4 py-2 rounded-full text-green-300 text-sm font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            {users.filter((user) => (user.role || "").toUpperCase() === "USER").length === 0 && (
              <p className="text-gray-400 py-4 col-span-full text-center">No normal users registered.</p>
            )}
          </div>
        )}

        {/* STAFF REPORT & TRACKING */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Staff Performance & Attendance</h2>
              <button
                onClick={fetchStaffReport}
                disabled={loadingStaffReport}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#14532D] rounded-full hover:bg-green-100 transition font-bold text-sm"
              >
                <RefreshCw size={14} className={loadingStaffReport ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {loadingStaffReport ? (
              <p className="text-center text-gray-400 py-10 font-medium">Loading reports...</p>
            ) : staffReport.length === 0 ? (
              <p className="text-center text-gray-400 py-12 bg-[#113723] rounded-3xl border border-green-800 font-medium">
                No staff members found.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {staffReport.map((staff) => {
                  const isExpanded = !!expandedStaff[staff.id];
                  return (
                    <div
                      key={staff.id}
                      className="bg-[#113723] p-6 rounded-3xl border border-green-800 shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold text-white">{staff.name}</h3>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                staff.is_online
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full ${staff.is_online ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
                              {staff.is_online ? "Online" : "Offline"}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm mt-2">
                            Email: {staff.email} {staff.phone && `| Phone: ${staff.phone}`}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-6 md:text-right">
                          <div className="bg-[#071311]/40 border border-green-800/40 px-4 py-2.5 rounded-2xl">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Hours Worked</p>
                            <p className="text-xl font-black text-green-300">{staff.total_hours} hrs</p>
                          </div>
                          <div className="bg-[#071311]/40 border border-green-800/40 px-4 py-2.5 rounded-2xl">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Last Login</p>
                            <p className="text-sm font-semibold text-white mt-1">
                              {staff.last_login
                                ? new Date(staff.last_login).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "Never"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Session History */}
                      <div className="mt-4 pt-4 border-t border-green-800/40">
                        <button
                          onClick={() => toggleExpand(staff.id)}
                          className="text-xs text-green-300 hover:text-white font-extrabold flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                        >
                          {isExpanded ? "Hide Attendance History" : "View Attendance History"} ({staff.sessions?.length || 0})
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 overflow-x-auto bg-[#071311]/50 rounded-2xl border border-green-800/40 p-4">
                          {(!staff.sessions || staff.sessions.length === 0) ? (
                            <p className="text-xs text-white/40 text-center py-4">No login history recorded.</p>
                          ) : (
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-green-800 text-green-300 font-bold uppercase tracking-wider">
                                  <th className="pb-2">Session ID</th>
                                  <th className="pb-2">Login Time</th>
                                  <th className="pb-2">Last Active Ping</th>
                                  <th className="pb-2">Logout Time</th>
                                  <th className="pb-2 text-right">Hours Worked</th>
                                </tr>
                              </thead>
                              <tbody>
                                {staff.sessions.map((session) => (
                                  <tr key={session.id} className="border-b border-green-800/10 text-white/80 hover:bg-white/5 transition-colors">
                                    <td className="py-2.5 font-mono">#{session.id}</td>
                                    <td className="py-2.5">
                                      {new Date(session.login_time).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })}
                                    </td>
                                    <td className="py-2.5">
                                      {new Date(session.last_active).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })}
                                    </td>
                                    <td className="py-2.5">
                                      {session.logout_time ? (
                                        new Date(session.logout_time).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })
                                      ) : (
                                        <span className="text-emerald-400 font-bold">Active Now</span>
                                      )}
                                    </td>
                                    <td className="py-2.5 text-right font-bold text-green-300">
                                      {session.hours_worked} hrs
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ADMINS */}
        {activeTab === "admins" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {users
              .filter((user) => (user.role || "").toUpperCase() === "ADMIN")
              .map((user) => (
                <div
                  key={user.id}
                  className="border border-[#1dab91] p-6 sm:p-8 rounded-3xl flex flex-col gap-4 w-full text-center md:text-left"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
                  <p className="text-white">{user.email}</p>

                  <div className="mt-3 flex justify-center md:justify-start">
                    <span className="bg-[#071311] px-4 py-2 rounded-full text-green-300 text-sm font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            {users.filter((user) => (user.role || "").toUpperCase() === "ADMIN").length === 0 && (
              <p className="text-gray-400 py-4 col-span-full text-center">No admin users registered.</p>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="bg-[#14532D] rounded-3xl border border-[#062b24] overflow-hidden">

            <div className="p-6 md:p-8 border-b border-green-800 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0 bg-[#071311] rounded-full px-4 py-3">
                <Search size={20} className="text-white/60" />

                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-white/40"
                />
              </div>

              <button
                onClick={fetchBookings}
                disabled={loadingBookings}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#14532D] rounded-full hover:bg-green-100 transition font-bold disabled:opacity-50 w-full md:w-auto"
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
                  className="grid grid-cols-1 md:grid-cols-5 gap-5 p-6 md:p-8 border-b border-green-800 items-center"
                >
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">User</p>
                    <p className="font-bold ">{booking.user}</p>
                    <p className="text-white text-sm">ID: {booking.id}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Type</p>
                    <p>{booking.type}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Address</p>
                    <p className="">{booking.address}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Status</p>
                    <span className="inline-flex px-3 py-1 bg-orange-950/40 text-orange-300 rounded-full text-sm font-bold">
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                    <button
                      onClick={() => approveBooking(booking.id)}
                      className="bg-white text-[#14532D] hover:bg-green-100 p-3 rounded-xl transition flex-1 md:flex-none shadow"
                    >
                      <Check size={18} />
                    </button>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="bg-[#14532D] rounded-3xl border border-green-800 overflow-hidden">

            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-5 p-6 md:p-8 border-b border-green-800 items-center min-w-0"
              >
                <div className="space-y-2 min-w-0 break-words">
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">User</p>
                  <p className="text-white font-bold">{complaint.user}</p>
                </div>
                <div className="space-y-2 min-w-0 break-words">
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Subject</p>
                  <p className="text-white font-semibold">{complaint.subject}</p>
                </div>
                <div className="space-y-2 min-w-0 break-words">
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Message</p>
                  <p className="text-white text-sm whitespace-pre-wrap">{complaint.message}</p>
                </div>
                <div className="space-y-2 min-w-0 break-words">
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] md:hidden">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    complaint.status?.toLowerCase() === "resolved"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-amber-950 text-amber-300 border border-amber-800"
                  }`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                  <button
                    onClick={() => resolveComplaint(complaint.id)}
                    className="bg-white text-[#14532D] hover:bg-green-100 px-4 py-2 rounded-xl flex-1 md:flex-none text-center font-bold transition duration-300"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => deleteComplaint(complaint.id)}
                    className="bg-red-900 text-white px-4 py-2 rounded-xl flex-1 md:flex-none text-center font-bold hover:bg-red-800 transition duration-300"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* LEAVES */}
        {activeTab === "leaves" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Staff Leave Requests</h2>
              <button
                onClick={fetchLeaves}
                disabled={loadingLeaves}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#14532D] rounded-full hover:bg-green-100 transition font-bold text-sm"
              >
                <RefreshCw size={14} className={loadingLeaves ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {loadingLeaves ? (
              <p className="text-center text-gray-400 py-10 font-medium">Loading leaves...</p>
            ) : leaves.length === 0 ? (
              <p className="text-center text-gray-400 py-12 bg-[#113723] rounded-3xl border border-green-800 font-medium">
                No leave requests found.
              </p>
            ) : (
              <div className="bg-[#113723] rounded-3xl border border-green-800 overflow-hidden">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-5 p-6 md:p-8 border-b border-green-800 items-center hover:bg-[#14532D]/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-white/50 text-xs uppercase tracking-wider md:hidden">Staff Member</p>
                      <p className="font-bold text-white text-lg">{leave.staff_name}</p>
                      <p className="text-white/60 text-xs truncate">{leave.staff_email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/50 text-xs uppercase tracking-wider md:hidden">Leave Date</p>
                      <p className="text-white font-semibold">
                        {new Date(leave.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-white/50 text-xs uppercase tracking-wider md:hidden">Reason</p>
                      <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{leave.reason}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4">
                      <div className="space-y-1">
                        <p className="text-white/50 text-xs uppercase tracking-wider md:hidden">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          leave.status === "APPROVED" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                          leave.status === "REJECTED" ? "bg-red-950 text-red-300 border border-red-900" :
                          "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      
                      {leave.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveLeave(leave.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition shadow flex items-center justify-center"
                            title="Approve Leave"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => rejectLeave(leave.id)}
                            className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-xl transition shadow flex items-center justify-center"
                            title="Reject Leave"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;