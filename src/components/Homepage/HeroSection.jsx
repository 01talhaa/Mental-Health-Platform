'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, BookOpen } from 'lucide-react';
import { useState } from 'react';

const HeroSection = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      headline: "Your Journey to Wellbeing Starts Here",
      subheadline: "Professional, anonymous support whenever you need it",
      ctaPrimary: "Talk to Counselor",
      ctaSecondary: "Browse Resources",
    },
    bn: {
      headline: "আপনার সুস্থতার যাত্রা এখানে শুরু হয়",
      subheadline: "যখনই প্রয়োজন পেশাদার, বেনামী সহায়তা",
      ctaPrimary: "কাউন্সেলর এর সাথে কথা বলুন",
      ctaSecondary: "রিসোর্স ব্রাউজ করুন",
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden top-20">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 left-20 w-96 h-96 rounded-full bg-blue-200 blur-3xl opacity-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-200 blur-3xl opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Language Toggle */}
          {/* <div className="absolute top-4 right-4 space-x-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1 rounded-full text-sm ${
                language === 'bn' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              বাং
            </button>
          </div> */}

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              {content[language].headline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12">
              {content[language].subheadline}
            </p>

            {/* Trust Indicators */}
            <div className="flex justify-center gap-8 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="p-3 bg-white rounded-full shadow-md mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">100% Anonymous</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="p-3 bg-white rounded-full shadow-md mb-2">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">24/7 Support</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="p-3 bg-white rounded-full shadow-md mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Expert Resources</span>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
              >
                {content[language].ctaPrimary}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-50 transition-colors"
              >
                {content[language].ctaSecondary}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;