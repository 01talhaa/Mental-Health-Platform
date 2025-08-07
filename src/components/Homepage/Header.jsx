"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// You can create a new file for the MobileMenu or keep it in the same file if you prefer
const MobileMenu = ({ navItems, user, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    onClose();
    router.push("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 bg-white z-50 p-8 md:hidden"
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-slate-800">Menu</span>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-800"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <nav className="mt-8 flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="text-2xl font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-10 border-t border-slate-200 pt-6">
        {user ? (
          <div className="space-y-4">
            <p className="font-semibold">{user.full_name}</p>
            <button
              onClick={handleLogout}
              className="w-full text-left text-slate-700 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="block w-full text-center px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Header Component ---
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const profileMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user state from localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (e) {
        localStorage.removeItem("user");
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("storage", syncUser); // Listen for changes in other tabs
    return () => window.removeEventListener("storage", syncUser);
  }, [pathname]); // Re-check on route change

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Therapists", href: "/therapists" },
    { name: "Resources", href: "/resources" },
    { name: "Groups", href: "/groups" },
    { name: "Contact", href: "/contact" },
  ];

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm"
            : "bg-white/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FB</span>
              </div>
              <span className="hidden md:block text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                FeelBetter
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-slate-600 hover:text-slate-900 transition-colors relative px-4 py-2 text-sm font-medium rounded-full ${
                    pathname === item.href ? "text-slate-900" : ""
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="active-nav-link"
                      className="absolute inset-0 bg-slate-100 rounded-full z-[-1]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-full font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-2 border-green-500"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                  </button>
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-14 w-60 bg-white shadow-lg rounded-xl p-4 z-50 border border-slate-100"
                      >
                        <div className="border-b border-slate-200 pb-3 mb-3">
                          <p className="font-semibold text-slate-800">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                        >
                          Settings
                        </Link>
                        <div className="border-t border-slate-200 mt-3 pt-3">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-50"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // --- Logged Out State ---
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-full font-semibold text-sm border-2 border-red-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
                  </div>
                  <Link
                    href="/login"
                    className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Signup
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Component */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            navItems={navItems}
            user={user}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;