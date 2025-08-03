"use client";
import Header from "@/components/Homepage/Header";
import React, { useEffect, useState } from "react";
import { 
  Heart, 
  Users, 
  Award, 
  Shield, 
  Globe, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail,
  BookOpen,
  Clock,
  Star,
  Building,
  HeartHandshake,
  Brain,
  Lightbulb
} from 'lucide-react';
import Link from "next/link";

const TherapistCard = ({ therapist, onClick }) => (
  <div
    className="group bg-white rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 w-64 h-80 flex flex-col items-center justify-between p-6 relative border border-gray-100 hover:border-blue-400"
    onClick={() => onClick(therapist)}
    style={{ minWidth: '16rem', minHeight: '20rem' }}
  >
    <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      {therapist.profile_picture_url ? (
        <img
          src={therapist.profile_picture_url}
          alt={therapist.full_name}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-4xl font-bold text-blue-600">
          {therapist.full_name ? therapist.full_name[0] : "?"}
        </span>
      )}
    </div>
    <div className="flex flex-col items-center text-center flex-1">
      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition">{therapist.full_name}</h3>
      <p className="text-sm text-blue-500 font-semibold mb-1">{therapist.specialization}</p>
      <p className="text-xs text-gray-400 mb-2">{therapist.email || "No email"}</p>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{therapist.license_number}</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{therapist.years_of_experience} yrs</span>
      </div>
    </div>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
    </div>
  </div>
);

const Sidebar = ({ therapist, onClose }) => (
  <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 p-10 flex flex-col border-l border-blue-100">
    <button
      className="self-end text-gray-500 hover:text-red-500 mb-4 text-2xl"
      onClick={onClose}
      aria-label="Close"
    >
      &times;
    </button>
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        {therapist.profile_picture_url ? (
          <img
            src={therapist.profile_picture_url}
            alt={therapist.full_name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-5xl font-bold text-blue-600">
            {therapist.full_name ? therapist.full_name[0] : "?"}
          </span>
        )}
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{therapist.full_name}</h2>
      <p className="text-lg text-blue-500 font-semibold mb-2">{therapist.specialization}</p>
      <p className="text-sm text-gray-400 mb-2">Email: {therapist.email || "No email"}</p>
      <p className="text-sm text-gray-400 mb-2">License: {therapist.license_number}</p>
      <p className="text-sm text-gray-400 mb-2">Experience: {therapist.years_of_experience} years</p>
      <p className="text-base text-gray-600 mt-4 text-center">{therapist.bio}</p>
    </div>
  </div>
);

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [filterExperience, setFilterExperience] = useState("");
  const [searchText, setSearchText] = useState("");

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
        const response = await fetch(`${baseUrl}/api/therapists/`, {
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
        setFilteredTherapists(data);
        // Get unique therapy types for dropdown
        const types = Array.from(new Set(data.map(t => t.specialization).filter(Boolean)));
        setTypeOptions(types);
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
    window.location.href = `/therapists/detail?userId=${therapist.user_id}`;
  };

  // Filtering logic
  useEffect(() => {
    let filtered = therapists;
    if (filterType) {
      filtered = filtered.filter(t => t.specialization?.toLowerCase().includes(filterType.toLowerCase()));
    }
    if (filterExperience) {
      filtered = filtered.filter(t => t.years_of_experience >= Number(filterExperience));
    }
    if (searchText) {
      filtered = filtered.filter(t => t.full_name?.toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilteredTherapists(filtered);
  }, [filterType, filterExperience, searchText, therapists]);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSelectedTherapist(null);
  };

  return (
    <div className="min-h-screen relative bg-white">
      <Header/>
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Sidebar for search/filter */}
        <aside className="w-full lg:w-80 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-6 lg:p-8 h-fit border border-blue-100 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start overflow-auto mt-10 sm:mt-44">
          <h2 className="text-2xl font-extrabold text-blue-600 mb-8 tracking-tight">Find Your Therapist</h2>
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg"
              placeholder="Type name..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-700 mb-2">Therapy Type</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg"
            >
              <option value="">All Types</option>
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-700 mb-2">Minimum Years of Experience</label>
            <input
              type="number"
              value={filterExperience}
              onChange={e => setFilterExperience(e.target.value)}
              className="w-full border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg"
              min={0}
              placeholder="e.g. 5"
            />
          </div>
          <button
            className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition font-extrabold text-lg"
            onClick={() => {
              setFilterType("");
              setFilterExperience("");
              setSearchText("");
            }}
          >
            Clear Filters
          </button>
        </aside>
        <main className="flex-1 flex flex-col items-center mb-10">
          <h1 className="text-5xl font-extrabold mb-10 text-center text-blue-600 tracking-tight drop-shadow-lg mt-24">Meet Our Therapists</h1>
          {loading ? (
            <div className="text-center text-blue-400 animate-pulse text-xl font-semibold">Loading therapists...</div>
          ) : error ? (
            <div className="text-center text-red-500 text-xl font-semibold">{error}</div>
          ) : (
            <div className="grid grid-cols-1 place-items-center sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
              {filteredTherapists.map((therapist) => (
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
        </main>
      </div>
            {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Transforming Mental Health Care</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a mental health professional looking to make a broader impact, 
            or someone passionate about our mission, there are many ways to contribute.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <HeartHandshake className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">For Therapists</h3>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Join a network of elite professionals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Access to cutting-edge therapeutic tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Flexible schedule and competitive compensation</span>
                </li>
              </ul>
              <Link href="/therapist">
  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
    Apply as a Therapist
  </button>
</Link>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <Lightbulb className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-4">For Partners</h3>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Research collaboration opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Corporate wellness programs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Technology integration partnerships</span>
                </li>
              </ul>
              <button className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TherapistsPage;