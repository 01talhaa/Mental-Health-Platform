import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const MobileMenu = ({ navItems }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const { pathname } = useRouter();
  const menuRef = useRef(null);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "tween" }}
      className="fixed inset-0 bg-white z-50 md:hidden"
    >
      <div ref={menuRef} className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-semibold">Menu</span>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-3 text-lg hover:text-blue-600 transition-colors ${
                pathname === item.href ? "text-blue-600 font-medium" : ""
              }`}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/book-therapist"
            className="mt-6 block w-full py-3 text-center text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            onClick={closeMenu}
          >
            Book Therapist
          </Link>
        </nav>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
