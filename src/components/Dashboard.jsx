import React, { useState, useEffect } from "react";
import Request from "./Request";
import Payment from "./Payment";
import Feedback from "./Feedback";
import History from "./History";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BarChart3,
  PlusCircle,
  History as HistoryIcon,
  CreditCard,
  MessageSquare,
  LogOut,
  Menu,
  X,
  PhoneCall,
  Clock,
  CheckCircle,
  Star
} from "lucide-react";

const Card = ({ title, value, gradientClass, icon: Icon }) => (
  <div className={`p-6 rounded-2xl shadow-lg flex items-center justify-between text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${gradientClass}`}>
    <div>
      <h2 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h2>
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
    </div>
    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
      {Icon && <Icon size={24} className="text-white" />}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

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

        const BASE_URL = "https://preethu17.pythonanywhere.com";

        const response = await fetch(
          `${BASE_URL}/api/dasboardwaste/`,
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

  // ================= PAYMENT STATUS CHECK =================
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const response = await fetch(
          "https://preethu17.pythonanywhere.com/api/payment/payments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const paid = Array.isArray(data) && data.some(p => p.status === 'PAID');
          setHasPaid(paid);
        }
      } catch (error) {
        console.log("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();
  }, []);

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
        navigate("/home");
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

  // ================= SIDEBAR TABS =================
  const sidebarTabs = [
    { id: "OVERVIEW", name: "Overview", icon: BarChart3 },
    { id: "REQUEST", name: "New Request", icon: PlusCircle },
    { id: "HISTORY", name: "History", icon: HistoryIcon },
    { id: "PAYMENT", name: "Payment", icon: CreditCard },
  ];

  if (hasPaid) {
    sidebarTabs.push({ id: "FEEDBACK", name: "Feedback", icon: MessageSquare });
  }

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
        className={`fixed top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-[#113723] text-white z-40 flex flex-col justify-between border-r border-green-800 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Navigation items */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* User Section */}
          <div className="border-b border-green-800 pb-4 mb-2">
            <p className="text-xs text-white/60 font-bold tracking-wider uppercase">Welcome back,</p>
            <h2 className="text-xl font-bold text-white truncate mt-1">
              {user || "User"}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {sidebarTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${isActive
                      ? "bg-white text-[#14532D] shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Support & Logout Section */}
        <div className="p-6 border-t border-green-800 flex flex-col gap-3">
          {/* Help Desk Link */}
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20EcoCollect%20Waste%20Management%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-lg shadow-[#25D366]/20 hover:bg-[#20ba5a] active:scale-[0.98] transition-all"
          >
            <PhoneCall size={18} />
            <span>Help Desk</span>
          </a>

          {/* Logout Button */}
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
        <div className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">

          {/* Active Tab Screen Title */}
          <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 text-left pl-16 md:pl-0 w-full">
              {activeTab === "OVERVIEW" ? "Dashboard Overview" :
                activeTab === "REQUEST" ? "New Request" :
                  activeTab === "HISTORY" ? "Request History" :
                    activeTab === "PAYMENT" ? "Payment History" :
                      activeTab === "FEEDBACK" ? "Feedback Form" : ""}
            </h1>
          </div>

          {/* OVERVIEW */}
          {activeTab === "OVERVIEW" && (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card
                  title="TOTAL"
                  value={stats.total}
                  gradientClass="bg-gradient-to-br from-[#14532D] to-[#113723]"
                  icon={BarChart3}
                />
                <Card
                  title="PENDING"
                  value={stats.pending}
                  gradientClass="bg-gradient-to-br from-[#14532D] to-[#113723]"
                  icon={Clock}
                />
                <Card
                  title="COMPLETED"
                  value={stats.completed}
                  gradientClass="bg-gradient-to-br from-[#14532D] to-[#113723]"
                  icon={CheckCircle}
                />
                <Card
                  title="POINTS"
                  value={stats.points}
                  gradientClass="bg-gradient-to-br from-[#14532D] to-[#113723]"
                  icon={Star}
                />
              </div>

              {/* RECENT ACTIVITY */}
              <div className="bg-[#14532D] p-6 rounded-2xl w-full overflow-hidden shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-white">
                  Recent Activity
                </h2>

                {activities.length === 0 ? (
                  <p className="text-white/80 py-4 text-center font-normal">No activity found</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#113723] p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border border-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        <div className="break-all">
                          <h3 className="font-bold text-white text-lg">
                            {item.type || "Request"}
                          </h3>

                          <p className="text-white/60 text-sm font-medium mt-1">
                            {item.date || ""}
                          </p>
                        </div>

                        <span className="text-xs font-bold px-3 py-1.5 bg-white text-[#14532D] rounded-lg w-fit shadow-md">
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
      </div>
    </div>
  );
};

export default Dashboard;