import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Bell, Clock3, MapPin } from "lucide-react";
import Tracking from "./Tracking";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://preethu17.pythonanywhere.com/api/staff/";

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    console.log("USER =", user);
    console.log("TOKEN =", token);

    if (!user || user.role?.toLowerCase() !== "staff" || !token) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

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

      // NOTIFICATIONS
      const notifyRes = await fetch(
        `${API_BASE}notifications/`,
        { headers }
      );

      const notifyData = await notifyRes.json();

      setNotifications(Array.isArray(notifyData) ? notifyData : []);

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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-white min-h-screen text-[#14532D] px-4 sm:px-6 md:px-10 py-6 md:py-8 mt-16">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10 border-b border-[#0f2b26] pb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Staff Portal
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Active collection routes & task management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

          {/* TABS */}
          <div className="flex flex-wrap gap-2 bg-[#07110f] p-1 rounded-full w-full sm:w-auto">

            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base transition ${
                activeTab === "tasks"
                  ? "bg-green-600 rounded-full"
                  : ""
              }`}
            >
              TASKS
            </button>

            <button
              onClick={() => setActiveTab("tracking")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base transition ${
                activeTab === "tracking"
                  ? "bg-green-600 rounded-full"
                  : ""
              }`}
            >
              TRACKING
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-500 transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TASKS */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-10">

          {/* TASK LIST */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock3 size={22} /> Today Tasks
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : tasks.length === 0 ? (
              <p>No Tasks Available</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#14532D] p-4 sm:p-6 border-2 border-[#D4AF37] rounded-2xl mb-4"
                >
                  <h3 className="text-lg sm:text-xl font-bold break-all">
                    {task.type}
                  </h3>

                  <p className="text-[#D4AF37] text-sm sm:text-base break-all">
                    {task.customer}
                  </p>

                  <p className="flex items-start gap-2 mt-3 text-sm text-[#D4AF37] sm:text-base break-all">
                    <MapPin size={16} className="mt-1 min-w-16px]" />
                    <span>{task.address}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">

                    {task.status === "pending" && (
                      <button
                        onClick={() => startTask(task.id)}
                        className="bg-[#D4AF37] px-4 py-2 rounded w-full sm:w-auto"
                      >
                        Start
                      </button>
                    )}

                    {task.status === "in-progress" && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="bg-blue-200 px-4 py-2 rounded w-full sm:w-auto"
                      >
                        Complete
                      </button>
                    )}

                    {task.status === "completed" && (
                      <button className="bg-green-300 px-4 py-2 rounded w-full sm:w-auto">
                        Done
                      </button>
                    )}

                  </div>
                </div>
              ))
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-[#14532D] p-4 sm:p-6 rounded-2xl h-fit">

            <div className="flex items-center gap-2 mb-4 text-lg sm:text-xl text-white font-bold">
              <Bell size={22} /> Notifications
            </div>

            {notifications.length === 0 ? (
              <p>No Notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="mb-4 border-b border-white pb-3"
                >
                  <h4 className="font-bold text-sm sm:text-base">
                    {n.title}
                  </h4>

                  <p className="text-white text-sm break-all">
                    {n.text}
                  </p>
                </div>
              ))
            )}

          </div>

        </div>
      )}

      {/* TRACKING */}
      {activeTab === "tracking" && (
        <div className="bg-[#14532D] p-4 sm:p-6 rounded-2xl overflow-hidden">
          <Tracking />
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;