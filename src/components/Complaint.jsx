import React, { useEffect, useState } from "react";

const Complaint = () => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {

      setLoading(true);

      const response = await fetch(
        "https://preethu17.pythonanywhere.com/api/complaint/"
      );

      const data = await response.json();

      setComplaints(data);

    } catch (error) {

      console.log("Error fetching complaints", error);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // RESOLVE COMPLAINT
  // =========================
  const resolveComplaint = async (id) => {

    try {

      await fetch(
        `https://preethu17.pythonanywhere.com/api/complaints/${id}/resolve`,
        {
          method: "PUT",
        }
      );

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status: "resolved" }
            : complaint
        )
      );

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // DELETE COMPLAINT
  // =========================
  const deleteComplaint = async (id) => {

    try {

      await fetch(
        `https://preethu17.pythonanywhere.com/api/complaints/${id}`,
        {
          method: "DELETE",
        }
      );

      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="mt-12 bg-[#030707] border border-[#062b24] rounded-[35px] overflow-hidden">

      {/* HEADER */}
      <div className="px-8 py-8 border-b border-[#062b24]">

        <h2 className="text-3xl font-bold">
          User Complaints
        </h2>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="p-8 text-gray-400">
          Loading complaints...
        </div>

      ) : complaints.length === 0 ? (

        <div className="p-8 text-gray-400">
          No complaints found
        </div>

      ) : (

        complaints.map((complaint) => (

          <div
            key={complaint.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-5 px-8 py-8 border-b border-[#071311]"
          >

            {/* USER */}
            <div>

              <h2 className="text-2xl font-bold">
                {complaint.user}
              </h2>

            </div>

            {/* SUBJECT */}
            <div>
              {complaint.subject}
            </div>

            {/* MESSAGE */}
            <div>
              {complaint.message}
            </div>

            {/* STATUS */}
            <div>

              <span
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  complaint.status === "resolved"
                    ? "bg-green-900 text-green-300"
                    : "bg-yellow-900 text-yellow-300"
                }`}
              >
                {complaint.status}
              </span>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">

              <button
                onClick={() => resolveComplaint(complaint.id)}
                className="px-5 py-2 bg-green-900 hover:bg-green-800 rounded-xl"
              >
                Resolve
              </button>

              <button
                onClick={() => deleteComplaint(complaint.id)}
                className="px-5 py-2 bg-red-900 hover:bg-red-800 rounded-xl"
              >
                Delete
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default Complaint;