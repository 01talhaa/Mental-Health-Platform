"use client";
import React, { useEffect, useState } from "react";

const TherapistCard = ({ therapist, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md p-6 mb-4 cursor-pointer hover:shadow-lg transition"
    onClick={() => onClick(therapist)}
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
        {therapist.full_name ? therapist.full_name[0] : "?"}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{therapist.full_name}</h3>
        <p className="text-sm text-gray-500">{therapist.specialization}</p>
        <p className="text-xs text-gray-400">{therapist.email || "No email"}</p>
      </div>
    </div>
  </div>
);

const Sidebar = ({ therapist, onClose }) => (
  <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-8 flex flex-col">
    <button
      className="self-end text-gray-500 hover:text-red-500 mb-4"
      onClick={onClose}
    >
      &times;
    </button>
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
        {therapist.full_name ? therapist.full_name[0] : "?"}
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{therapist.full_name}</h2>
      <p className="text-sm text-gray-500 mb-2">{therapist.specialization}</p>
      <p className="text-xs text-gray-400 mb-2">Email: {therapist.email || "No email"}</p>
      <p className="text-xs text-gray-400 mb-2">License: {therapist.license_number}</p>
      <p className="text-xs text-gray-400 mb-2">Experience: {therapist.years_of_experience} years</p>
      <p className="text-xs text-gray-400 mb-2">Bio: {therapist.bio}</p>
    </div>
  </div>
);

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      setError("");
      try {
        // Try to get baseUrl from window.env if available, fallback to process.env
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (typeof window !== "undefined" && !baseUrl && window.env && window.env.NEXT_PUBLIC_API_BASE_URL) {
          baseUrl = window.env.NEXT_PUBLIC_API_BASE_URL;
        }
        if (!baseUrl) throw new Error("API base URL not set");
        const response = await fetch(`${baseUrl}/api/therapists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch therapists");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array of therapists");
        }
        setTherapists(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const handleCardClick = (therapist) => {
    setSelectedTherapist(therapist);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedTherapist(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Therapists</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading therapists...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {therapists.map((therapist) => (
            <TherapistCard
              key={therapist.therapist_id}
              therapist={therapist}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
      {sidebarOpen && selectedTherapist && (
        <Sidebar therapist={selectedTherapist} onClose={handleSidebarClose} />
      )}
    </div>
  );
};

export default TherapistsPage;