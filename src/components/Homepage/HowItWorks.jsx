'use client'
import React from 'react';
import { useState } from 'react';
import { 
  UserPlus, 
  Calendar, 
  Users, 
  MessageCircle, 
  Shield, 
  ArrowRight,
  Check
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Take a brief assessment to help us understand your needs and match you with the right support.",
    icon: UserPlus,
    features: [
      "Confidential assessment",
      "Personalized matching",
      "Quick 5-minute process"
    ]
  },
  {
    id: 2,
    title: "Book Your Session",
    description: "Choose from available therapists and schedule your first session at a time that works for you.",
    icon: Calendar,
    features: [
      "24/7 booking availability",
      "Flexible scheduling",
      "Free initial consultation"
    ]
  },
  {
    id: 3,
    title: "Join Support Groups",
    description: "Connect with others who understand your journey in our moderated support groups.",
    icon: Users,
    features: [
      "Themed group sessions",
      "Professional moderators",
      "Safe space guarantee"
    ]
  },
  {
    id: 4,
    title: "Start Your Journey",
    description: "Begin your path to better mental health with ongoing support and resources.",
    icon: MessageCircle,
    features: [
      "Regular check-ins",
      "Progress tracking",
      "Resource library access"
    ]
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your journey to better mental health starts here. We've made the process simple and supportive every step of the way.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="hidden md:flex justify-between mb-12 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-1/4">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  index <= activeStep ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {React.createElement(step.icon, { className: "w-8 h-8" })}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 text-center px-4">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute top-8 left-0 right-0 mx-auto text-gray-300 w-8 h-8" 
                  style={{ left: `${25 + (index * 25)}%` }} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile View - Vertical Steps */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  index <= activeStep ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {React.createElement(step.icon, { className: "w-6 h-6" })}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {step.description}
              </p>
              <ul className="space-y-2">
                {step.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-md">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your Privacy & Security Matter
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All sessions are encrypted and confidential. We follow strict HIPAA guidelines 
            and industry best practices to ensure your information stays private and secure.
          </p>
        </div>
      </div>
    </section>
  );
}