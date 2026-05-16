import React, { useState } from "react";

const Feedback = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to submit feedback");
      }

      alert("Feedback submitted ✅");

      setSubject("");
      setMessage("");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f0f] p-6 rounded-xl max-w-xl mx-auto">
      <h2 className="text-xl mb-4">Feedback</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full p-3 mb-3 bg-black border rounded"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full p-3 mb-3 bg-black border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 p-3 rounded"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;