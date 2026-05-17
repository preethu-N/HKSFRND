import React, { useState, useEffect } from "react";
import Request from "./Request";
import Payment from "./Payment";
import Feedback from "./Feedback";
import History from "./History";
import { Link, useNavigate } from "react-router-dom";

const Card = ({ title, value }) => (
  <div className="bg-gray-900 p-4 rounded-xl">
    <h2 className="text-gray-400 text-sm mb-2">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [user, setUser] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    points: 0,
  });

  const [activities, setActivities] = useState([]);

  // ================= USER =================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!storedUser || !token) {
      localStorage.removeItem("access");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    setUser(storedUser.name);
  }, [navigate]);

  // ================= DASHBOARD API =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/api/dasboardwaste/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("access");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error("Dashboard API request failed");
        }

        const data = await response.json();

        setStats({
          total: data.total || 0,
          pending: data.pending || 0,
          completed: data.completed || 0,
          points: data.points || 0,
        });

        setActivities(data.activities || []);
      } catch (error) {
        console.log("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      navigate("/login");
    }
  };

  // ================= REQUEST =================
  const addRequest = async (newRequest) => {
    try {
      setActivities((prev) => [newRequest, ...prev]);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= PAYMENT =================
  const addPayment = async (paymentData) => {
    try {
      setActivities((prev) => [paymentData, ...prev]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 mt-20">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user || "User"}
          </h1>
        </div>

        <div className="flex gap-3">
          {["OVERVIEW", "REQUEST", "HISTORY", "PAYMENT", "FEEDBACK"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full ${
                  activeTab === tab
                    ? "bg-emerald-500 text-black"
                    : "bg-gray-800"
                }`}
              >
                {tab}
              </button>
            )
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card title="TOTAL" value={stats.total} />
            <Card title="PENDING" value={stats.pending} />
            <Card title="COMPLETED" value={stats.completed} />
            <Card title="POINTS" value={stats.points} />
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="mb-4">Recent Activity</h2>

            {activities.length === 0 ? (
              <p className="text-gray-400">No activity found</p>
            ) : (
              activities.map((item, index) => (
                <div
                  key={index}
                  className="bg-black p-3 mb-2 rounded flex justify-between"
                >
                  <div>
                    <h3>{item.type || "Request"}</h3>
                    <p className="text-gray-400 text-sm">
                      {item.date || ""}
                    </p>
                  </div>

                  <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                    {item.status || "PENDING"}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "REQUEST" && <Request addRequest={addRequest} />}
      {activeTab === "HISTORY" && <History activities={activities} />}
      {activeTab === "PAYMENT" && <Payment addPayment={addPayment} />}
      {activeTab === "FEEDBACK" && <Feedback />}
    </div>
  );
};

export default Dashboard;