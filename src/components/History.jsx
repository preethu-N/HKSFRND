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
          "https://preethu17.pythonanywhere.com/api/history/",
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

    <div className="p-3 sm:p-6 bg-black text-white min-h-screen">

      {/* NAVBAR / HEADER */}
      <div className="mb-6">

        <h1 className="text-xl sm:text-2xl font-bold">
          History
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm">
          Track all your past waste
          collection activities
        </p>

      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl overflow-x-auto">

        <table className="w-full min-w-700px text-left">

          {/* TABLE HEADER */}
          <thead className="bg-gray-800 text-gray-400 text-xs sm:text-sm">

            <tr>

              <th className="p-2 sm:p-3">
                ID
              </th>

              <th className="p-2 sm:p-3">
                Type
              </th>

              <th className="p-2 sm:p-3">
                Date
              </th>

              <th className="p-2 sm:p-3">
                Status
              </th>

              <th className="p-2 sm:p-3">
                Payment
              </th>

              <th className="p-2 sm:p-3">
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
                  className="p-4 sm:p-6 text-center text-gray-400 text-sm"
                >
                  Loading history...
                </td>
              </tr>

            ) : activities.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-4 sm:p-6 text-center text-gray-400 text-sm"
                >
                  No history found
                </td>
              </tr>

            ) : (

              activities.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-gray-800 text-xs sm:text-sm"
                >

                  {/* ID */}
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    #{item.id}
                  </td>

                  {/* TYPE */}
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    {item.type}
                  </td>

                  {/* DATE */}
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* STATUS */}
                  <td className="p-2 sm:p-3">

                    <span
                      className={`px-2 py-1 text-[10px] sm:text-xs rounded whitespace-nowrap ${
                        item.status === "PAID"
                          ? "bg-green-600"
                          : item.status === "PENDING"
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  {/* PAYMENT */}
                  <td className="p-2 sm:p-3 whitespace-nowrap">

                    {item.status === "PAID" ? (

                      <span className="text-green-400 text-xs sm:text-sm">
                        PAID
                      </span>

                    ) : (

                      <span className="text-red-400 text-xs sm:text-sm">
                        PENDING
                      </span>

                    )}

                  </td>

                  {/* ACTION */}
                  <td className="p-2 sm:p-3 whitespace-nowrap">

                    <button className="text-emerald-400 text-xs sm:text-sm hover:underline">
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