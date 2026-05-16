import React, { useEffect, useState } from "react";

const History = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH HISTORY API
  // =========================
  useEffect(() => {

    const fetchHistory = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          "http://127.0.0.1:8000/api/history/"
        );

        const data = await response.json();

        setActivities(data);

      } catch (error) {

        console.log(
          "History fetch error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchHistory();

  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">

      {/* NAVBAR / HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          History
        </h1>

        <p className="text-gray-400 text-sm">
          Track all your past waste
          collection activities
        </p>

      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">

        <table className="w-full text-left">

          {/* TABLE HEADER */}
          <thead className="bg-gray-800 text-gray-400 text-sm">

            <tr>

              <th className="p-3">
                ID
              </th>

              <th className="p-3">
                Type
              </th>

              <th className="p-3">
                Date
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Payment
              </th>

              <th className="p-3">
                Action
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}
          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-400"
                >
                  Loading history...
                </td>
              </tr>

            ) : activities.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-400"
                >
                  No history found
                </td>
              </tr>

            ) : (

              activities.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-gray-800"
                >

                  {/* ID */}
                  <td className="p-3">
                    #{item.id}
                  </td>

                  {/* TYPE */}
                  <td className="p-3">
                    {item.type}
                  </td>

                  {/* DATE */}
                  <td className="p-3">
                    {item.date}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">

                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === "PAID"
                          ? "bg-green-600"
                          : item.status ===
                            "PENDING"
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  {/* PAYMENT */}
                  <td className="p-3">

                    {item.status === "PAID" ? (

                      <span className="text-green-400 text-sm">
                        PAID
                      </span>

                    ) : (

                      <span className="text-red-400 text-sm">
                        PENDING
                      </span>

                    )}

                  </td>

                  {/* ACTION */}
                  <td className="p-3">

                    <button className="text-emerald-400 text-sm">
                      View Details
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default History;