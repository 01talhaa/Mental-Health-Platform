"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Homepage/Header";

const TherapistDetailClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  
  // Booking states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [meetingLink, setMeetingLink] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

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
        
        // Fetch existing appointments for this therapist
        await fetchExistingAppointments(data.therapist_id, baseUrl);
      } catch (err) {
        setError(err.message || "Unknown error");
        setTherapist(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapist();
  }, [userId]);

  const fetchExistingAppointments = async (therapistId, baseUrl) => {
    setAppointmentsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/appointments/therapist/${therapistId}`);
      if (response.ok) {
        const appointments = await response.json();
        setExistingAppointments(appointments);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Get minimum date (today) in YYYY-MM-DDTHH:MM format for datetime-local input
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Check if a time slot conflicts with existing appointments
  const isTimeSlotBooked = (selectedDateTime, selectedDuration) => {
    if (!selectedDateTime || !existingAppointments.length) return false;

    const selectedStart = new Date(selectedDateTime);
    const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60000);

    return existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.appointment_time);
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);

      // Check if there's any overlap
      return (selectedStart < appointmentEnd && selectedEnd > appointmentStart);
    });
  };

  // Get conflicting appointment details
  const getConflictingAppointment = (selectedDateTime, selectedDuration) => {
    if (!selectedDateTime || !existingAppointments.length) return null;

    const selectedStart = new Date(selectedDateTime);
    const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60000);

    return existingAppointments.find(appointment => {
      const appointmentStart = new Date(appointment.appointment_time);
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);

      return (selectedStart < appointmentEnd && selectedEnd > appointmentStart);
    });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      // Check for time slot conflicts
      if (isTimeSlotBooked(appointmentTime, duration)) {
        const conflictingAppointment = getConflictingAppointment(appointmentTime, duration);
        const conflictDate = new Date(conflictingAppointment.appointment_time);
        const conflictEndTime = new Date(conflictDate.getTime() + conflictingAppointment.duration_minutes * 60000);
        
        throw new Error(
          `This time slot conflicts with an existing appointment (${conflictDate.toLocaleDateString()} ${conflictDate.toLocaleTimeString()} - ${conflictEndTime.toLocaleTimeString()}). Please choose a different time.`
        );
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error("Please log in to book an appointment");
      }

      const userId = userData.user_id || userData.id;
      const token = userData.token || userData.refreshToken || userData.refresh_token;

      if (!userId || !token) {
        throw new Error("Authentication required");
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

      if (!baseUrl) throw new Error("API base URL not set");

      // Format datetime for API (convert to YYYY-MM-DD HH:MM:SS format)
      const formattedDateTime = appointmentTime.replace('T', ' ') + ':00';

      const response = await fetch(`${baseUrl}/api/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          therapist_id: therapist.therapist_id,
          user_id: userId,
          appointment_time: formattedDateTime,
          duration_minutes: Number(duration),
          meeting_link: meetingLink
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to book appointment");
      }

      setBookingSuccess("Appointment booked successfully!");
      setAppointmentTime("");
      setDuration(60);
      setMeetingLink("");
      
      // Refresh existing appointments
      await fetchExistingAppointments(therapist.therapist_id, baseUrl);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess("");
      }, 2000);

    } catch (err) {
      setBookingError(err.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-20">
        No therapist selected.
      </div>
    );
  }



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
          <div className="max-w-4xl">
            {/* Therapist Details - Single Column Layout */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
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
              
              {/* Book Appointment Button */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Appointment
                </button>
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
          </div>
        ) : null}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-bold"
              onClick={() => {
                setShowBookingModal(false);
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
            
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Therapist:</span> {therapist.full_name}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Specialization:</span> {therapist.specialization}
              </p>
              {appointmentsLoading ? (
                <p className="text-xs text-slate-500 mt-2">
                  Loading existing appointments...
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  {existingAppointments.length} existing appointments found
                </p>
              )}
            </div>

            {bookingError && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-center text-sm">
                {bookingError}
              </div>
            )}
            
            {bookingSuccess && (
              <div className="text-green-600 bg-green-50 p-3 rounded-lg mb-4 text-center text-sm">
                {bookingSuccess}
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
                    appointmentTime && isTimeSlotBooked(appointmentTime, duration)
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                  required
                  min={getMinDateTime()}
                />
                {appointmentTime && isTimeSlotBooked(appointmentTime, duration) && (
                  <div className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    ⚠️ This time slot is already booked. Please choose a different time.
                    {(() => {
                      const conflict = getConflictingAppointment(appointmentTime, duration);
                      if (conflict) {
                        const startTime = new Date(conflict.appointment_time);
                        const endTime = new Date(startTime.getTime() + conflict.duration_minutes * 60000);
                        return (
                          <div className="text-xs mt-1 text-slate-600">
                            Existing appointment: {startTime.toLocaleDateString()} {startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
                    appointmentTime && isTimeSlotBooked(appointmentTime, duration)
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                  required
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
                {appointmentTime && isTimeSlotBooked(appointmentTime, duration) && (
                  <div className="mt-1 text-sm text-red-600">
                    ⚠️ This duration conflicts with existing appointments
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://meet.google.com/your-meeting-link"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Please provide a video meeting link (Google Meet, Zoom, etc.)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingError("");
                    setBookingSuccess("");
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || (appointmentTime && isTimeSlotBooked(appointmentTime, duration))}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
                    bookingLoading || (appointmentTime && isTimeSlotBooked(appointmentTime, duration))
                      ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {bookingLoading ? "Booking..." : 
                   (appointmentTime && isTimeSlotBooked(appointmentTime, duration)) ? "Time Unavailable" : 
                   "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
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
      `}</style>
    </div>
  );
};

export default TherapistDetailClient;