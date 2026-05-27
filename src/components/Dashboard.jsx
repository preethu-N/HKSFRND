import React, { useState, useEffect } from "react";
import Request from "./Request";
import Payment from "./Payment";
import Feedback from "./Feedback";
import History from "./History";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Card = ({ title, value }) => (
  <div className="bg-[#113723] p-4 rounded-xl w-full">
    <h2 className="text-[#D4AF37] text-sm mb-2">{title}</h2>
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
          "https://preethu17.pythonanywhere.com/api/dashboard/",
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
  }, [navigate]);

  // ================= LOGOUT =================
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
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        navigate("/login");
      }
    });
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
    <div className="p-3 sm:p-6 bg-white text-black font-semibold min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10 mt-20">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold break-all">
            Welcome, {user || "User"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          {["OVERVIEW", "REQUEST", "HISTORY", "PAYMENT", "FEEDBACK"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#D4AF37] text-[#14532D] shadow-lg"
                    : "bg-[#D4AF37] text-[#14532D] opacity-80 hover:opacity-100"
                }`}
              >
                {tab}
              </button>
            )
          )}

          <button
            onClick={handleLogout}
            className="bg-[#D4AF37] text-[#14532D] px-4 py-2 rounded-full text-sm sm:text-base hover:opacity-95"
          >
            Logout
          </button>
        </div>
      </div>

      {/* OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card title="TOTAL" value={stats.total} />
            <Card title="PENDING" value={stats.pending} />
            <Card title="COMPLETED" value={stats.completed} />
            <Card title="POINTS" value={stats.points} />
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-[#D4AF37] p-4 rounded-xl w-full overflow-hidden">
            <h2 className="mb-4 text-lg font-semibold">
              Recent Activity
            </h2>

            {activities.length === 0 ? (
              <p className="text-white">No activity found</p>
            ) : (
              <div className="space-y-3">
                {activities.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#14532D] p-3 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                  >
                    <div className="break-all">
                      <h3 className="font-medium">
                        {item.type || "Request"}
                      </h3>

                      <p className="text-[#D4AF37] text-sm">
                        {item.date || ""}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 bg-[#D4AF37] text-[#14532D] rounded w-fit">
                      {item.status || "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "REQUEST" && (
        <Request addRequest={addRequest} />
      )}

      {activeTab === "HISTORY" && (
        <History activities={activities} />
      )}

      {activeTab === "PAYMENT" && (
        <Payment addPayment={addPayment} />
      )}

      {activeTab === "FEEDBACK" && <Feedback />}
    </div>
  );
};

export default Dashboard;