import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Clock3, MapPin } from "lucide-react";
import Tracking from "./Tracking";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(true);

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
        "http://127.0.0.1:8000/api/staff/stafftasks/",
        { headers }
      );
      const taskData = await taskRes.json();
      setTasks(Array.isArray(taskData) ? taskData : []);

      // NOTIFICATIONS
      const notifyRes = await fetch(
        "http://127.0.0.1:8000/api/staff/notifications/",
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
        `http://127.0.0.1:8000/api/staff/stafftasks/${id}/start/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "in-progress" } : t
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
        `https://preethu17.pythonanywhere.com/api/staff/stafftasks/${id}/complete/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "completed" } : t
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
    if (window.confirm("Logout?")) {
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-black min-h-screen text-white px-10 py-8 mt-16">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 border-b border-[#0f2b26] pb-6">
        <div>
          <h1 className="text-4xl font-bold">Staff Portal</h1>
          <p className="text-gray-400">
            Active collection routes & task management
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* TABS */}
          <div className="flex gap-2 bg-[#07110f] p-1 rounded-full">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-6 py-2 ${activeTab === "tasks" ? "bg-green-600 rounded-full" : ""}`}
            >
              TASKS
            </button>

            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-6 py-2 ${activeTab === "tracking" ? "bg-green-600 rounded-full" : ""}`}
            >
              TRACKING
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* TASKS */}
      {activeTab === "tasks" && (
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10">

          {/* TASK LIST */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock3 /> Today Tasks
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : tasks.length === 0 ? (
              <p>No Tasks Available</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#07110f] p-6 rounded-2xl mb-4"
                >
                  <h3 className="text-xl font-bold">{task.type}</h3>
                  <p className="text-gray-400">{task.customer}</p>

                  <p className="flex items-center gap-2 mt-2">
                    <MapPin size={16} />
                    {task.address}
                  </p>

                  <div className="mt-4 flex gap-3">

                    {task.status === "pending" && (
                      <button
                        onClick={() => startTask(task.id)}
                        className="bg-green-500 px-4 py-2 rounded"
                      >
                        Start
                      </button>
                    )}

                    {task.status === "in-progress" && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="bg-yellow-500 px-4 py-2 rounded"
                      >
                        Complete
                      </button>
                    )}

                    {task.status === "completed" && (
                      <button className="bg-gray-600 px-4 py-2 rounded">
                        Done
                      </button>
                    )}

                  </div>
                </div>
              ))
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-[#07110f] p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Bell /> Notifications
            </div>

            {notifications.length === 0 ? (
              <p>No Notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="mb-4 border-b border-gray-700 pb-2">
                  <h4 className="font-bold">{n.title}</h4>
                  <p className="text-gray-400">{n.text}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TRACKING */}
      {activeTab === "tracking" && (
        <div className="bg-[#07110f] p-6 rounded-2xl">
          <Tracking />
        </div>
      )}

    </div>
  );
};

export default StaffDashboard;