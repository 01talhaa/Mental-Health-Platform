'use client'

import { useState } from 'react';
import { RiFacebookFill, RiTwitterFill, RiInstagramFill, RiYoutubeFill, RiMailFill, RiArrowUpSLine } from 'react-icons/ri';
import Link from 'next/link';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Handle subscription logic (API call, etc.)
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6">
        {/* Left Column */}
        <div>
          <h2 className="text-3xl font-bold">MindfulHealth</h2>
          <p className="mt-4 text-sm text-gray-400">Your path to mental wellness and personal growth.</p>
          <div className="flex space-x-4 mt-6">
            <RiFacebookFill className="text-2xl cursor-pointer hover:text-blue-500" />
            <RiTwitterFill className="text-2xl cursor-pointer hover:text-blue-400" />
            <RiInstagramFill className="text-2xl cursor-pointer hover:text-pink-500" />
            <RiYoutubeFill className="text-2xl cursor-pointer hover:text-red-500" />
          </div>
          <div className="mt-6 text-sm">
            <p>Contact: contact@mindspace.com</p>
            <p>Phone: +880 1234 567 890</p>
          </div>
        </div>

        {/* Center Columns */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {['About Us', 'Services', 'Resources', 'Support Groups', 'Career', 'Press'].map((item) => (
              <li key={item}><Link href={`/${item.toLowerCase().replace(/ /g, '-')}`}>{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            {['Help Center', 'FAQs', 'Contact Us', 'Report Issue', 'Feedback'].map((item) => (
              <li key={item}><Link href={`/${item.toLowerCase().replace(/ /g, '-')}`}>{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col">
            <input
              type="email"
              className="px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            >
              Subscribe
            </button>
            {subscribed && <p className="text-sm text-green-400 mt-2">Thanks for subscribing!</p>}
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 py-6 text-center text-sm text-gray-500">
        <div className="flex justify-center space-x-6 mb-4">
          {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility', 'Site Map'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`}>{item}</Link>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} MindSpace. All rights reserved.</p>
      </div>

      {/* Back to Top */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <RiArrowUpSLine className="text-white text-2xl" />
      </button>
    </footer>
  );
};

export default Footer;
