import React from 'react';
import {
  MessageCircle,
  Calendar,
  BookOpen,
  Shield,
  HeartHandshake,
  LineChart
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="space-y-4">
        <div className="inline-block p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "24/7 Online Counseling",
      description: "Connect with licensed therapists anytime, anywhere through secure text, voice, or video sessions. Get support when you need it most."
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with our easy-to-use calendar system. Choose times that work best for your schedule."
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access a comprehensive library of self-help resources, articles, and exercises designed to support your mental health journey."
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Your privacy is our priority. All sessions are encrypted and confidential, ensuring a safe space for your personal growth."
    },
    {
      icon: HeartHandshake,
      title: "Matched Support",
      description: "Get paired with the right therapist for you through our smart matching system, based on your needs and preferences."
    },
    {
      icon: LineChart,
      title: "Progress Tracking",
      description: "Monitor your wellness journey with interactive tools and assessments that help you track your progress over time."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 mt-10">
            Comprehensive Support at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for your mental health journey, accessible whenever you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;