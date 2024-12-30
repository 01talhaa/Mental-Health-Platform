'use client'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, Heart, Building } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "This platform changed my life. The support I received helped me overcome my anxiety and build healthy coping mechanisms.",
    role: "Member since 2023",
    rating: 5
  },
  {
    id: 2,
    text: "The therapists here are incredibly understanding and professional. I feel heard and supported in every session.",
    role: "Member since 2022",
    rating: 5
  },
  {
    id: 3,
    text: "Having 24/7 access to support has been crucial for my mental health journey. I'm grateful for this community.",
    role: "Member since 2023",
    rating: 5
  }
];

const statistics = [
  { id: 1, value: "95%", label: "Recovery Rate", icon: Heart },
  { id: 2, value: "50k+", label: "People Helped", icon: Users },
  { id: 3, value: "24/7", label: "Support Available", icon: Building }
];

const partners = [
  "Mental Health Association",
  "Wellness Institute",
  "Healthcare Partners",
  "Community Care Network"
];

export default function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Testimonial Carousel */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Community Says
          </h2>
          
          <div className="relative bg-white rounded-xl shadow-lg p-8 mx-4 md:mx-auto max-w-3xl">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <blockquote className="text-center mb-6">
              <p className="text-xl text-gray-700 italic mb-4">
                "{testimonials[currentTestimonial].text}"
              </p>
              <footer className="text-gray-500">
                {testimonials[currentTestimonial].role}
              </footer>
            </blockquote>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {statistics.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Partners */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-8">
            Trusted By Leading Organizations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-gray-600 font-medium">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}