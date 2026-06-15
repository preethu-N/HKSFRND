import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  Clock, 
  MapPin, 
  LogOut, 
  Layers, 
  Truck, 
  CheckCircle,
  Menu,
  X,
  Calendar
} from "lucide-react";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [submittingLeave, setSubmittingLeave] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const token = localStorage.getItem("access");
      const res = await fetch("https://preethu17.pythonanywhere.com/api/staff/leave/my-requests/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.log("Failed to fetch leaves:", e);
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) {
      Swal.fire({
        title: "Warning",
        text: "Please select a date and type a reason",
        icon: "warning",
        confirmButtonColor: "#14532D",
      });
      return;
    }

    try {
      setSubmittingLeave(true);
      const token = localStorage.getItem("access");
      const res = await fetch("https://preethu17.pythonanywhere.com/api/staff/leave/request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: leaveDate,
          reason: leaveReason,
        }),
      });

      if (res.ok) {
        Swal.fire({
          title: "Success",
          text: "Leave requested successfully!",
          icon: "success",
          confirmButtonColor: "#14532D",
        });
        setLeaveDate("");
        setLeaveReason("");
        fetchMyLeaves();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#14532D",
      });
    } finally {
      setSubmittingLeave(false);
    }
  };

  const API_BASE = "https://preethu17.pythonanywhere.com/api/staff/";

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!storedUser || storedUser.role?.toLowerCase() !== "staff" || !token) {
      navigate("/login");
      return;
    }

    setUser(storedUser.name);
    fetchDashboardData();
    fetchMyLeaves();
  }, [navigate]);

  // =========================
  // STAFF SESSION TRACKING
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!token || !storedUser || storedUser.role?.toLowerCase() !== "staff") return;

    let intervalId;

    const initSession = async () => {
      let sessionId = localStorage.getItem("staff_session_id");
      if (!sessionId) {
        try {
          const res = await fetch("https://preethu17.pythonanywhere.com/api/tracking/sessions/start/", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (res.ok) {
            const data = await res.json();
            sessionId = data.session_id;
            localStorage.setItem("staff_session_id", sessionId);
          }
        } catch (e) {
          console.log("Start session error:", e);
        }
      }

      if (sessionId) {
        // Setup 30s ping
        intervalId = setInterval(async () => {
          try {
            await fetch("https://preethu17.pythonanywhere.com/api/tracking/sessions/ping/", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ session_id: sessionId })
            });
          } catch (e) {
            console.log("Ping session error:", e);
          }
        }, 30000);
      }
    };

    initSession();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // TASKS
      const taskRes = await fetch(
        `${API_BASE}stafftasks/`,
        { headers }
      );

      const taskData = await taskRes.json();

      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // START TASK
  // =========================
  const startTask = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await fetch(
        `${API_BASE}stafftasks/${id}/start/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: "in-progress" }
            : t
        )
      );
      
      fetchDashboardData();

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // COMPLETE TASK
  // =========================
  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await fetch(
        `${API_BASE}stafftasks/${id}/complete/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: "completed" }
            : t
        )
      );

      fetchDashboardData();

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#14532D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const sessionId = localStorage.getItem("staff_session_id");
        const token = localStorage.getItem("access");
        if (sessionId && token) {
          try {
            await fetch("https://preethu17.pythonanywhere.com/api/tracking/sessions/end/", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ session_id: sessionId })
            });
          } catch (e) {
            console.log("End session error:", e);
          }
        }
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        localStorage.removeItem("staff_session_id");
        navigate("/home");
      }
    });
  };

  // =========================
  // LIST PROCESSOR (FILTER & SORT)
  // =========================
  const getProcessedTasks = (statusFilter) => {
    let list = tasks.filter((t) => t.status === statusFilter);

    if (filterType !== "all") {
      list = list.filter((t) => (t.type || "").toLowerCase() === filterType.toLowerCase());
    }

    list.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  };

  const getTabCount = (statusFilter) => {
    if (statusFilter === "leave") return leaves.length;
    return tasks.filter((t) => t.status === statusFilter).length;
  };

  const sidebarTabs = [
    { id: "available", name: "Available Pickups", icon: Layers, status: "pending" },
    { id: "active", name: "My Collections", icon: Truck, status: "in-progress" },
    { id: "completed", name: "Completed Tasks", icon: CheckCircle, status: "completed" },
    { id: "leave", name: "Request Leave", icon: Calendar, status: "leave" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-semibold flex flex-col md:flex-row pt-16 md:pt-20 overflow-x-hidden">
      
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-18 left-4 z-50 bg-[#14532D] text-white p-3 rounded-full shadow-lg border border-white/20 hover:scale-105 active:scale-95 transition-transform"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
 
      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
        />
      )}
 
      {/* Sidebar */}
      <div
        className={`fixed top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-[#113723] text-white z-40 flex flex-col justify-between border-r border-green-800 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Navigation items */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* User Section */}
          <div className="border-b border-green-800 pb-4 mb-2">
            <p className="text-xs text-white/60 font-bold tracking-wider uppercase">Welcome back,</p>
            <h2 className="text-xl font-bold text-white truncate mt-1">
              {user || "Staff"}
            </h2>
            <span className="inline-block mt-2 text-[10px] bg-green-800 text-green-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
              Staff Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {sidebarTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              const count = getTabCount(tab.status);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? "bg-white text-[#14532D] shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-[#14532D] text-white" : "bg-white/10 text-white"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-6 border-t border-green-800 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-h-screen">
        <div className="p-4 sm:p-8 flex-1 max-w-5xl w-full mx-auto">
          
          {/* Active Tab Screen Title */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 text-left pl-16 md:pl-0 w-full">
              {activeTab === "available" ? "Available Pickups" : 
               activeTab === "active" ? "My Active Collections" : 
               activeTab === "completed" ? "Completed Pickups" :
               "Request Leave"}
            </h1>
          </div>

          {/* FILTER & SORT PANEL (only show if not on leave tab) */}
          {activeTab !== "leave" && (
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 bg-[#14532D] p-5 rounded-2xl border border-white/10 shadow-md">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Search & Filters
              </h2>

              <div className="flex flex-wrap gap-4">
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Type:</span>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[#07110f] border border-white/20 text-white px-3 py-1.5 rounded-xl text-sm outline-none focus:border-white font-semibold"
                  >
                    <option value="all">All Types</option>
                    <option value="organic">Organic</option>
                    <option value="plastic">Plastic</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#07110f] border border-white/20 text-white px-3 py-1.5 rounded-xl text-sm outline-none focus:border-white font-semibold"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TASKS CONTAINER (only show if not on leave tab) */}
          {activeTab !== "leave" && (
            <div className="w-full">
              {loading ? (
                <p className="text-center text-gray-500 py-10 font-medium">Loading tasks...</p>
              ) : (
                (() => {
                  const list = getProcessedTasks(
                    activeTab === "available" ? "pending" : 
                    activeTab === "active" ? "in-progress" : 
                    "completed"
                  );

                  if (list.length === 0) {
                    return (
                      <p className="text-center text-gray-500 py-12 bg-gray-50 border border-gray-200 rounded-3xl font-medium">
                        No tasks found in this category.
                      </p>
                    );
                  }

                  return list.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#14532D] p-6 border border-white/10 rounded-3xl mb-5 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight break-all uppercase">
                            {task.type}
                          </h3>
                          <p className="text-white/80 text-sm font-semibold break-all mt-1">
                            Customer: {task.customer}
                          </p>
                          
                          {/* Time & Date display for Completed tasks */}
                          {task.status === "completed" && task.created_at && (
                            <p className="text-white/90 text-xs font-bold mt-1.5 flex items-center gap-1">
                              <Clock size={12} />
                              <span>Completed: {new Date(task.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </p>
                          )}
                        </div>

                        {/* Google Maps External Connection */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-extrabold text-[#14532D] bg-white hover:bg-white/90 px-4 py-2.5 rounded-2xl transition-all active:scale-[0.98] shadow shadow-black/15"
                        >
                          <MapPin size={14} className="text-[#14532D]" />
                          <span>Open in Maps</span>
                        </a>
                      </div>

                      <p className="flex items-start gap-2 mt-4 text-white font-normal break-all text-sm sm:text-base leading-relaxed">
                        <MapPin size={18} className="mt-1 min-w-[18px] text-white" />
                        <span>{task.address}</span>
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {task.status === "pending" && (
                          <button
                            onClick={() => startTask(task.id)}
                            className="bg-white text-[#14532D] hover:bg-white/90 font-extrabold px-5 py-3 rounded-2xl active:scale-[0.98] transition-all shadow-md"
                          >
                            Accept Collection
                          </button>
                        )}

                        {task.status === "in-progress" && (
                          <button
                            onClick={() => completeTask(task.id)}
                            className="bg-white text-[#14532D] hover:bg-white/90 font-extrabold px-5 py-3 rounded-2xl active:scale-[0.98] transition-all shadow-md"
                          >
                            Mark Complete
                          </button>
                        )}

                        {task.status === "completed" && (
                          <span className="bg-green-800/40 text-green-200 border border-green-700/20 font-bold px-5 py-3 rounded-2xl select-none text-sm">
                            Collection Successful
                          </span>
                        )}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          )}

          {/* LEAVE TAB SCREEN */}
          {activeTab === "leave" && (
            <div className="space-y-8">
              {/* LEAVE FORM */}
              <div className="bg-[#14532D] p-6 rounded-3xl border border-white/10 shadow-lg text-[#14532D] max-w-xl mx-auto">
                <h2 className="text-xl font-bold mb-4 text-white">Request Leave</h2>
                <form onSubmit={handleRequestLeave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={leaveDate}
                      onChange={(e) => setLeaveDate(e.target.value)}
                      className="w-full p-3 bg-white text-[#14532D] rounded-xl outline-none border border-green-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">Reason for Leave</label>
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Type reason here..."
                      rows={4}
                      className="w-full p-3 bg-white text-[#14532D] rounded-xl outline-none border border-green-800 font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLeave}
                    className="w-full bg-white text-[#14532D] py-3 rounded-xl font-extrabold hover:bg-green-100 transition active:scale-[0.98] shadow"
                  >
                    {submittingLeave ? "Submitting..." : "Submit Leave Request"}
                  </button>
                </form>
              </div>

              {/* LEAVE HISTORY TABLE */}
              <div className="bg-[#14532D] p-6 rounded-3xl border border-white/10 shadow-md">
                <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">My Leave History</h2>
                {loadingLeaves ? (
                  <p className="text-center text-white/60 py-6">Loading leaves...</p>
                ) : leaves.length === 0 ? (
                  <p className="text-center text-white/60 py-6 font-medium bg-[#113723] border border-green-800 rounded-3xl">No leave requests found.</p>
                ) : (
                  <div className="overflow-x-auto bg-[#113723] rounded-3xl border border-green-800 p-4">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-green-800 text-green-300 font-bold uppercase text-xs">
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Reason</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.map((l) => (
                          <tr key={l.id} className="border-b border-green-800/10 text-white/80 hover:bg-white/5 transition-all">
                            <td className="py-3.5 font-bold whitespace-nowrap">
                              {new Date(l.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                            </td>
                            <td className="py-3.5 text-white/75 max-w-xs truncate">{l.reason}</td>
                            <td className="py-3.5 text-right whitespace-nowrap">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                l.status === "APPROVED" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                                l.status === "REJECTED" ? "bg-red-950 text-red-300 border border-red-900" :
                                "bg-amber-950 text-amber-300 border border-amber-800"
                              }`}>
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;