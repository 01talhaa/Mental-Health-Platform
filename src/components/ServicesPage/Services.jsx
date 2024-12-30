'use client'

import React, { useState } from 'react';
import {
  Users,
  User,
  UserPlus,
  Calendar,
  MessageSquare,
  Video,
  BookOpen,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Clock,
  Brain,
  HeartHandshake,
  Building
} from 'lucide-react';

const serviceCategories = [
  {
    id: 'individual',
    name: 'Individual Therapy',
    description: 'One-on-one sessions with licensed therapists',
    Icon: User,
    services: [
      {
        name: 'Initial Consultation',
        duration: '45 minutes',
        description: 'Comprehensive assessment and treatment planning',
        price: 'Free'
      },
      {
        name: 'Individual Session',
        duration: '50 minutes',
        description: 'Personal therapy with a licensed professional',
        price: '$85'
      },
      {
        name: 'Extended Session',
        duration: '80 minutes',
        description: 'In-depth therapy for complex issues',
        price: '$120'
      },
      {
        name: 'Emergency Session',
        duration: '30 minutes',
        description: '24/7 crisis support',
        price: '$60'
      }
    ]
  },
  {
    id: 'group',
    name: 'Group Therapy',
    description: 'Supportive group sessions led by expert facilitators',
    Icon: Users,
    services: [
      {
        name: 'Support Group',
        duration: '60 minutes',
        description: 'Weekly themed group sessions',
        price: '$30'
      },
      {
        name: 'Specialized Workshop',
        duration: '90 minutes',
        description: 'Focused skill-building workshops',
        price: '$45'
      },
      {
        name: 'Teen Group',
        duration: '45 minutes',
        description: 'Age-appropriate group support',
        price: '$25'
      }
    ]
  },
  {
    id: 'couples',
    name: 'Couples Therapy',
    description: 'Relationship counseling and support',
    Icon: HeartHandshake,
    services: [
      {
        name: 'Couples Session',
        duration: '60 minutes',
        description: 'Relationship counseling',
        price: '$100'
      },
      {
        name: 'Intensive Session',
        duration: '90 minutes',
        description: 'In-depth relationship work',
        price: '$140'
      }
    ]
  }
];

const subscriptionPlans = [
  {
    name: 'Basic Care',
    price: '$99/month',
    features: [
      '4 Individual Sessions',
      '2 Group Sessions',
      'Chat Support',
      'Self-Help Resources',
      'Mobile App Access'
    ],
    notIncluded: [
      'Emergency Sessions',
      'Specialized Workshops',
      'Priority Scheduling'
    ],
    recommended: false
  },
  {
    name: 'Complete Care',
    price: '$179/month',
    features: [
      '8 Individual Sessions',
      'Unlimited Group Sessions',
      '24/7 Chat Support',
      'Self-Help Resources',
      'Mobile App Access',
      'Emergency Sessions',
      'Specialized Workshops',
      'Priority Scheduling'
    ],
    notIncluded: [],
    recommended: true
  },
  {
    name: 'Student Plan',
    price: 'Free',
    features: [
      '2 Individual Sessions',
      'Unlimited Group Sessions',
      'Chat Support',
      'Self-Help Resources',
      'Mobile App Access',
      'Peer Support Network'
    ],
    notIncluded: [
      'Emergency Sessions',
      'Specialized Workshops'
    ],
    studentOnly: true,
    recommended: false
  }
];

const specializedPrograms = [
  {
    name: 'Anxiety Management',
    duration: '8 weeks',
    format: 'Group + Individual',
    price: '$399'
  },
  {
    name: 'Depression Support',
    duration: '12 weeks',
    format: 'Group + Individual',
    price: '$499'
  },
  {
    name: 'Stress Reduction',
    duration: '6 weeks',
    format: 'Group',
    price: '$299'
  },
  {
    name: 'Student Success',
    duration: '10 weeks',
    format: 'Group + Individual',
    price: 'Free for Students'
  }
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('individual');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Free Services for Students</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Professional Mental Health Services
            <span className="block text-blue-600 mt-2">Tailored to Your Needs</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Access quality mental health care with flexible plans and special 
            student programs. All services are provided by licensed professionals.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto space-x-4 mb-8 p-2">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <category.Icon className="w-5 h-5 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories
              .find(cat => cat.id === selectedCategory)
              ?.services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                    <span className="text-blue-600 font-bold">{service.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Monthly Care Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden ${
                  plan.recommended ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="bg-blue-500 text-white text-center py-2">
                    <span className="text-sm font-medium">Recommended</span>
                  </div>
                )}
                {plan.studentOnly && (
                  <div className="bg-green-500 text-white text-center py-2">
                    <span className="text-sm font-medium">Student Exclusive</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-6">{plan.price}</p>
                  
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-gray-400">
                        <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full mt-8 px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.recommended
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Programs */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Specialized Programs
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {specializedPrograms.map((program, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{program.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">{program.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">{program.format}</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">{program.price}</span>
                  </div>
                </div>
                <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Support */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Student Mental Health Support</h2>
          <p className="text-xl mb-8 opacity-90">
            We believe in making mental health support accessible to all students. 
            Verify your student status to access free and discounted services.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
            Verify Student Status
          </button>
        </div>
      </section>
    </div>
  );
}