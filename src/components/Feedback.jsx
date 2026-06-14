import React, { useState } from "react";
import Swal from "sweetalert2";

const Feedback = () => {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const token = localStorage.getItem("access");

      if (!token) {
        Swal.fire({
          title: "Access Denied",
          text: "Please login first",
          icon: "warning",
          confirmButtonColor: "#14532D",
        });
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/feedback/feedbacks/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject,
            message,
          }),
        }
      );

      const text = await response.text();

      console.log(text);

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      Swal.fire({
        title: "Success",
        text: "Feedback submitted ✅",
        icon: "success",
        confirmButtonColor: "#14532D",
      });

      setSubject("");
      setMessage("");

    } catch (error) {

      console.log(error);

      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#14532D",
      });

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-[#14532D] p-6 rounded-xl max-w-xl mx-auto">

      <h2 className="text-xl mb-4 text-white">
        Feedback
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter Subject"
          className="w-full p-3 mb-3 bg-white text-slate-900 border rounded"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Message"
          className="w-full p-3 mb-3 bg-white text-slate-900 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-[#14532D] font-bold p-3 rounded hover:bg-green-100 transition"
        >
          {loading ? "Sending..." : "Submit"}
        </button>

      </form>

    </div>
  );
};

export default Feedback;