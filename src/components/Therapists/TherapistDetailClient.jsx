"use client";
import React,
{
  useEffect,
  useState
}
from "react";
import {
  useRouter,
  useSearchParams
}
from "next/navigation";
import Header from "@/components/Homepage/Header";

const TherapistDetailClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [meetingLink, setMeetingLink] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchTherapist = async () => {
      setLoading(true);
      setError("");
      try {
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (
          typeof window !== "undefined" &&
          !baseUrl &&
          window.env &&
          window.env.NEXT_PUBLIC_API_BASE_URL
        ) {
          baseUrl = window.env.NEXT_PUBLIC_API_BASE_URL;
        }
        if (!baseUrl) throw new Error("API base URL not set");
        const response = await fetch(
          `${baseUrl}/api/therapists/user/${userId}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch therapist");
        }
        const data = await response.json();
        setTherapist(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapist();
  }, [userId]);

  // Fetch therapist appointments
  useEffect(() => {
    // Only fetch appointments if therapist is loaded and has an id
    if (!therapist || !therapist.therapist_id) return;
    const fetchAppointments = async () => {
      setAppointmentsLoading(true);
      setAppointmentsError("");
      try {
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (
          typeof window !== "undefined" &&
          !baseUrl &&
          window.env &&
          window.env.NEXT_PUBLIC_API_BASE_URL
        ) {
          baseUrl = window.env.NEXT_PUBLIC_API_BASE_URL;
        }
        if (!baseUrl) throw new Error("API base URL not set");
        const response = await fetch(
          `${baseUrl}/api/appointments/therapist/${therapist.therapist_id}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        setAppointmentsError(err.message || "Unknown error");
        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAppointments();
  }, [therapist]);

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-20">
        No therapist selected.
      </div>
    );
  }

  const Toast = ({
    message,
    onClose
  }) => (
    <div className="fixed top-8 right-8 z-[9999]">
      <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="font-semibold">{message}</span>
        <button
          className="ml-4 text-white hover:text-slate-200 text-lg"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <style>{`.animate-slide-in { animation: slide-in 0.4s cubic-bezier(.4,0,.2,1); } @keyframes slide-in { from { opacity:0; transform:translateY(-20px);} to { opacity:1; transform:translateY(0);} }`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <Header />
      <div className="container mx-auto max-w-6xl mt-14">
        <button
          className="mb-8 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Search
        </button>

        {loading ? (
          <div className="text-center text-slate-500 animate-pulse text-lg">
            Loading therapist details...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold bg-red-50 p-8 rounded-lg">
            {error}
          </div>
        ) : therapist ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Therapist Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-md flex-shrink-0">
                  {therapist.profile_picture_url ? (
                    <img
                      src={therapist.profile_picture_url}
                      alt={therapist.full_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <span className="text-6xl font-bold text-slate-600">
                        {therapist.full_name ? therapist.full_name[0] : "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-4xl font-bold text-slate-800">
                    {therapist.full_name}
                  </h2>
                  <p className="text-lg text-slate-500 font-medium mt-1">
                    {therapist.specialization}
                  </p>
                  <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a1 1 0 011 1v1.586l3.293-3.293a1 1 0 111.414 1.414L12.414 5.586 15 8.172a1 1 0 01-1.414 1.414L10 6.414l-3.586 3.586a1 1 0 01-1.414-1.414L8 5.586 4.707 2.293a1 1 0 011.414-1.414L9.414 4.586 10 3a1 1 0 011-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                      {therapist.years_of_experience} years experience
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.003 5.884L10 2.25l7.997 3.634A1 1 0 0119 6.81V17a1 1 0 01-1 1H2a1 1 0 01-1-1V6.81a1 1 0 011.003-.926zM17 8.11l-7-3.182-7 3.182V16h14V8.11z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {therapist.email || "No email"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  About Me
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {therapist.bio}
                </p>
              </div>
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Details & Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Therapist ID</span>
                    <span className="font-semibold text-slate-700">
                      {therapist.therapist_id}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">User ID</span>
                    <span className="font-semibold text-slate-700">
                      {therapist.user_id}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">License</span>
                    <span className="font-semibold text-slate-700">
                      {therapist.license_number}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Documents</span>
                    <span className="font-semibold text-slate-700">
                      {therapist.verification_documents_url ? (
                        <a
                          href={therapist.verification_documents_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Documents
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking and Appointments */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  Ready to talk?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Schedule your session now
                </p>
                <button
                  className="mt-4 w-full px-6 py-3 bg-mint-500 text-white rounded-lg shadow-md hover:bg-mint-600 transition font-bold text-lg"
                  onClick={() => setShowBooking(true)}
                >
                  Book This Therapist
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
                  Upcoming Appointments
                </h3>
                {appointmentsLoading ? (
                  <div className="text-center text-slate-500 animate-pulse">
                    Loading appointments...
                  </div>
                ) : appointmentsError ? (
                  <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                    {appointmentsError}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <svg
                      className="w-12 h-12 mx-auto text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="mt-2 text-sm">No appointments found.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {appointments.map((app) => (
                      <div
                        key={app.appointment_id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:shadow-md"
                      >
                        <p className="font-bold text-slate-700">
                          {app.client_name || "Client"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(app.appointment_time).toLocaleString()}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-slate-500">
                            {app.duration_minutes} min
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              app.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in-up">
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-3xl"
                onClick={() => {
                  setShowBooking(false);
                  setBookingError("");
                  setBookingSuccess("");
                }}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">
                Book an Appointment
              </h2>
              {bookingError && (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 text-center">
                  {bookingError}
                </div>
              )}
              {bookingSuccess && (
                <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 text-center">
                  {bookingSuccess}
                </div>
              )}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBookingLoading(true);
                  setBookingError("");
                  setBookingSuccess("");
                  let userId = null;
                  if (typeof window !== "undefined") {
                    try {
                      const user = JSON.parse(localStorage.getItem("user"));
                      userId = user?.user_id || user?.id || null;
                    } catch {}
                  }
                  if (!userId) {
                    setBookingError("User not logged in.");
                    setBookingLoading(false);
                    return;
                  }
                  if (!appointmentTime || !duration || !meetingLink) {
                    setBookingError("Please fill all fields.");
                    setBookingLoading(false);
                    return;
                  }
                  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                  if (
                    typeof window !== "undefined" &&
                    !baseUrl &&
                    window.env &&
                    window.env.NEXT_PUBLIC_API_BASE_URL
                  ) {
                    baseUrl = window.env.NEXT_PUBLIC_API_BASE_URL;
                  }
                  try {
                    const res = await fetch(`${baseUrl}/api/appointments/`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        therapist_id: therapist.therapist_id,
                        user_id: userId,
                        appointment_time: appointmentTime,
                        duration_minutes: Number(duration),
                        meeting_link: meetingLink,
                      }),
                    });
                    if (!res.ok) {
                      const errorText = await res.text();
                      throw new Error(
                        errorText || "Failed to book appointment"
                      );
                    }
                    setBookingSuccess("Appointment booked successfully!");
                    setBookingError("");
                    setTimeout(() => {
                      setShowBooking(false);
                      setBookingSuccess("");
                    }, 1800);
                    setAppointmentTime("");
                    setDuration(60);
                    setMeetingLink("");
                  } catch (err) {
                    setBookingError(err.message || "Unknown error");
                    setBookingSuccess("");
                  } finally {
                    setBookingLoading(false);
                  }
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="font-medium text-slate-700 text-sm">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={appointmentTime}
                    onChange={(e) =>
                      setAppointmentTime(e.target.value.replace("T", " "))
                    }
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 text-sm">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={15}
                    max={180}
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 text-sm">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="https://meet.example.com/session123"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-bold text-lg disabled:bg-slate-400"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Toast for booking success */}
        {bookingSuccess && (
          <Toast
            message={bookingSuccess}
            onClose={() => setBookingSuccess("")}
          />
        )}
      </div>
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* You can define your mint color in your tailwind.config.js */
        /* For this example, we'll just use a style tag */
        .bg-mint-500 {
            background-color: #6ee7b7; /* Example mint color */
        }
        .hover\\:bg-mint-600:hover {
            background-color: #34d399; /* Darker mint for hover */
        }
      `}</style>
    </div>
  );
};

export default TherapistDetailClient;