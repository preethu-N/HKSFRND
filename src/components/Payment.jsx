import React, { useState, useEffect } from "react";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch("https://preethu17.pythonanywhere.com/api/payment/payments/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("API failed");
        
        const data = await response.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Payment fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="bg-[#14532D] p-6 rounded-xl max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-white">Payment History</h2>
      
      {loading ? (
        <p className="text-gray-400">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-white">No payment history found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white p-5 rounded-xl flex justify-between items-center border border-gray-800 hover:border-emerald-500 transition-colors">
              <div>
                <h3 className="font-bold text-black text-lg">{payment.payment_type || "Waste Collection Fee"}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
                {payment.card_number && (
                  <p className="text-xs text-gray-500 mt-1">Card: **** {payment.card_number.slice(-4)}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-[#14532D]">₹{payment.amount}</p>
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${payment.status === 'PAID' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payment;