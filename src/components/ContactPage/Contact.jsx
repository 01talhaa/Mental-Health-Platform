'use client'

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  AlertTriangle, 
  Heart,
  Loader,
  ChevronRight,
  LifeBuoy,
  Clock,
  Shield,
  HeartPulse,
  BadgeAlert,
  PhoneCall
} from 'lucide-react';
import Footer from '../Homepage/Footer';

const emergencyNumbers = [
  { id: 1, name: 'Emergency Services', number: '911', priority: 1 },
  { id: 2, name: 'Crisis Helpline', number: '1-800-273-8255', priority: 1 },
  { id: 3, name: 'Mental Health Crisis', number: '1-800-950-6264', priority: 2 },
  { id: 4, name: 'Substance Use Helpline', number: '1-800-662-4357', priority: 2 }
];

const EmergencyContact = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsOffline(!navigator.onLine);
    
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleLocationDetection = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
  };

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {isOffline && (
        <div className="bg-red-500 text-white py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>You're offline. Emergency numbers will still work.</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-red-800">Emergency Help</h2>
              <BadgeAlert className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-red-700 mb-6 text-lg">
              If you're experiencing an emergency or are in immediate danger, 
              contact emergency services immediately.
            </p>
            <button 
              onClick={() => handleEmergencyCall('911')}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-xl transition-colors hover:from-red-700 hover:to-red-800 flex items-center justify-center"
            >
              <Phone className="w-7 h-7 mr-2" />
              Call 911 Now
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-blue-800">Crisis Support</h2>
              <HeartPulse className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-blue-700 mb-6 text-lg">
              Trained crisis counselors are available 24/7 to listen and help.
            </p>
            <button 
              onClick={() => handleEmergencyCall('1-800-273-8255')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-xl transition-colors hover:from-blue-700 hover:to-blue-800 flex items-center justify-center mt-12"
            >
              <MessageSquare className="w-7 h-7 mr-2" />
              Talk to Someone Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <PhoneCall className="w-7 h-7 text-blue-600 mr-3" />
              Quick Access Support
            </h3>
            <div className="grid gap-4">
              {emergencyNumbers.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleEmergencyCall(contact.number)}
                  className="flex items-center justify-between w-full bg-gray-50 hover:bg-blue-50 transition-colors rounded-xl p-4"
                >
                  <div className="flex items-center">
                    <PhoneCall className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800 text-lg">{contact.name}</div>
                      <div className="text-blue-600 font-semibold">{contact.number}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Find Nearby Help</h3>
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <button
              onClick={handleLocationDetection}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-colors flex items-center justify-center mb-4"
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <MapPin className="w-6 h-6 mr-2" />
                  Detect Location
                </>
              )}
            </button>
            {location && (
              <iframe
                title="Location Map"
                width="100%"
                height="250"
                frameBorder="0"
                style={{ border: 0, borderRadius: '0.75rem' }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBG_KpmlY_ldrkT1d32Y74Q3i5eQgocNJI&q=${location.lat},${location.lng}`}
                allowFullScreen
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Additional Resources</h3>
            <LifeBuoy className="w-7 h-7 text-blue-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Heart, color: 'rose', title: 'Support Groups', desc: 'Find local and online support groups' },
              { icon: Shield, color: 'blue', title: 'Safety Planning', desc: 'Create a personal safety plan' },
              { icon: Clock, color: 'green', title: '24/7 Resources', desc: 'Access help anytime, anywhere' }
            ].map((resource, idx) => (
              <a 
                key={idx}
                href="#"
                className="block p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <resource.icon className={`w-6 h-6 text-${resource.color}-600 mr-2`} />
                  <h4 className="font-medium text-gray-800">{resource.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{resource.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default EmergencyContact;