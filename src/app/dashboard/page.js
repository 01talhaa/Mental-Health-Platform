'use client';
import Header from '@/components/Homepage/Header'
import React, { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [therapistData, setTherapistData] = useState(null);
  const [isTherapist, setIsTherapist] = useState(false);
  const [checkingTherapist, setCheckingTherapist] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const getUserFromStorage = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          return parsedUser;
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
      return null;
    };

    const userData = getUserFromStorage();
    setLoading(false);

    // Check if user is therapist first, then fetch appointments
    if (userData) {
      checkIfTherapist(userData);
    }
  }, []);

  // Separate useEffect to fetch appointments after therapist status is determined
  useEffect(() => {
    if (user && !checkingTherapist) {
      fetchAppointments(user);
    }
  }, [user, isTherapist, therapistData, checkingTherapist]);

  const checkIfTherapist = async (userData) => {
    setCheckingTherapist(true);
    try {
      const userId = userData.user_id || userData.id;
      if (!userId) {
        console.log('No user ID found');
        setIsTherapist(false);
        return;
      }

      // Check if user is a therapist using the therapist API
      const response = await fetch(`${API_BASE_URL}/api/therapists/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const therapistInfo = await response.json();
        setTherapistData(therapistInfo);
        setIsTherapist(true);
        console.log('User is a therapist:', therapistInfo);
      } else {
        // User is not a therapist (404 or other error)
        setIsTherapist(false);
        setTherapistData(null);
        console.log('User is not a therapist');
      }
    } catch (err) {
      console.error('Error checking therapist status:', err);
      setIsTherapist(false);
      setTherapistData(null);
    } finally {
      setCheckingTherapist(false);
    }
  };

  const fetchAppointments = async (userData) => {
    setAppointmentsLoading(true);
    try {
      const userId = userData.user_id || userData.id;
      if (!userId) {
        setError('No user ID found');
        return;
      }

      // Get token from user data or localStorage
      let token = userData.token || userData.refreshToken || userData.refresh_token;
      if (!token) {
        // Try to get fresh token from localStorage
        try {
          const freshUserData = JSON.parse(localStorage.getItem('user'));
          token = freshUserData?.token || freshUserData?.refreshToken || freshUserData?.refresh_token;
        } catch (e) {
          console.error('Error getting token:', e);
        }
      }

      // Determine which endpoint to use based on user type
      let endpoint;
      if (isTherapist && therapistData) {
        // Use therapist-specific endpoint with therapist_id
        endpoint = `${API_BASE_URL}/api/appointments/therapist/${therapistData.therapist_id}`;
      } else {
        // Use the unified appointments endpoint for regular users
        endpoint = `${API_BASE_URL}/api/appointments/my-appointments`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const appointmentsData = await response.json();
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch appointments: ${errorText}`);
      }
    } catch (err) {
      setError('Error fetching appointments: ' + err.message);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (!isTherapist) {
      alert('Only therapists can update appointment status.');
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [appointmentId]: true }));
    
    try {
      // Get token from user data or localStorage
      let token = user.token || user.refreshToken || user.refresh_token;
      if (!token) {
        try {
          const freshUserData = JSON.parse(localStorage.getItem('user'));
          token = freshUserData?.token || freshUserData?.refreshToken || freshUserData?.refresh_token;
        } catch (e) {
          console.error('Error getting token:', e);
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (response.ok) {
        // Update the appointment in the local state
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.appointment_id === appointmentId 
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
        
        // Show success message
        alert('Appointment status updated successfully!');
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update appointment status');
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Error updating appointment status: ' + err.message);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div>
        <Header/>
        <div className="min-h-screen bg-slate-50 py-16 px-4">
          <div className="container mx-auto max-w-6xl mt-14">
            <div className="text-center text-slate-500 animate-pulse text-lg">
              Loading dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header/>
        <div className="min-h-screen bg-slate-50 py-16 px-4">
          <div className="container mx-auto max-w-6xl mt-14">
            <div className="text-center text-red-500 text-lg font-semibold bg-red-50 p-8 rounded-lg">
              Please log in to access your dashboard.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl mt-14">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back, {user.full_name || 'User'}!</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-slate-500">
                User Type: {isTherapist ? 'Therapist' : 'Client'}
              </p>
              {checkingTherapist && (
                <span className="text-xs text-blue-500 animate-pulse">Checking therapist status...</span>
              )}
              {isTherapist && therapistData && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Therapist - {therapistData.specialization}
                </div>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {isTherapist ? 'Your Scheduled Sessions' : 'Your Appointments'}
            </h2>
            
            {error && (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {appointmentsLoading ? (
              <div className="text-center text-slate-500 animate-pulse py-8">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <svg
                  className="w-16 h-16 mx-auto text-slate-300 mb-4"
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
                <p className="text-lg">No appointments found.</p>
                <p className="text-sm text-slate-500 mt-1">
                  {isTherapist 
                    ? 'Your scheduled sessions will appear here.' 
                    : 'Book an appointment to see it here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointment_id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-700 text-lg">
                          {isTherapist 
                            ? (appointment.user_name || appointment.client_name || `Client ID: ${appointment.user_id}`)
                            : (appointment.therapist_name || `Therapist ID: ${appointment.therapist_id}`)}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {isTherapist ? 'Client' : 'Therapist'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'COMPLETED' || appointment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'CANCELLED' || appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                        
                        {/* Status Update Buttons - Only for Therapists */}
                        {isTherapist && (
                          <div className="flex gap-1">
                            {appointment.status !== 'COMPLETED' && appointment.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment.appointment_id, 'COMPLETED')}
                                disabled={updatingStatus[appointment.appointment_id]}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                {updatingStatus[appointment.appointment_id] ? '...' : 'Complete'}
                              </button>
                            )}
                            {appointment.status !== 'CANCELLED' && appointment.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment.appointment_id, 'CANCELLED')}
                                disabled={updatingStatus[appointment.appointment_id]}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                {updatingStatus[appointment.appointment_id] ? '...' : 'Cancel'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600">
                          {new Date(appointment.appointment_time).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600">
                          {appointment.duration_minutes} minutes
                        </span>
                      </div>

                      {appointment.meeting_link && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          <a 
                            href={appointment.meeting_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Notes:</p>
                        <p className="text-sm text-slate-600">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard