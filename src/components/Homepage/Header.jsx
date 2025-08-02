"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProfileMenu from "./ProfileMenu";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Function to sync user info from localStorage
    const syncUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem('user');
      let parsedUser = null;
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (e) {
          parsedUser = null;
          localStorage.removeItem('user');
        }
      }
      if (parsedUser) {
        setUser(parsedUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    syncUserFromLocalStorage();
    // Listen for localStorage changes (e.g., login/logout in other tabs)
    window.addEventListener('storage', syncUserFromLocalStorage);
    // Listen for route changes to re-check localStorage
    const handleRouteChange = () => {
      syncUserFromLocalStorage();
    };
    router.events?.on?.('routeChangeComplete', handleRouteChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', syncUserFromLocalStorage);
      router.events?.off?.('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest(".profile-menu")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Therapists", href: "/therapists" },
    { name: "Services", href: "/services" },
    { name: "Resources", href: "/resources" },
    { name: "Support Groups", href: "/groups" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">MH</span>
              </div>
              <span className="hidden md:block text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                MindfulHealth
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-600 hover:text-blue-600 transition-colors relative px-3 py-1 ${
                    pathname === item.href ? "text-blue-600" : ""
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="box"
                      className="absolute inset-0 border-2 border-blue-600 rounded-md"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* If logged in, show user info and logout */}
              {isLoggedIn && user ? (
                <>
                  <div className="relative profile-menu flex items-center space-x-2">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Profile"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 min-w-[220px] z-50 border border-gray-200">
                          <div className="mb-2">
                            <span className="block font-semibold text-blue-600">{user.full_name}</span>
                            <span className="block text-xs text-gray-500">{user.email}</span>
                            <span className="block text-xs text-gray-400">Type: {user.user_type}</span>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.removeItem('user');
                              localStorage.removeItem('refreshToken');
                              setUser(null);
                              setIsLoggedIn(false);
                              setIsProfileMenuOpen(false);
                              router.push('/login');
                            }}
                            className="w-full px-3 py-2 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  {/* If not logged in, show login and signup buttons */}
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-6 py-2 rounded-full bg-gray-200 text-blue-600 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Signup
                  </Link>
                </>
              )}
              {/* Get Help Button */}
              <Link
                href="/book-therapist"
                className="hidden md:inline-flex items-center px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Book Therapist
              </Link>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Menu"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>{isMobileMenuOpen && <MobileMenu navItems={navItems || []}/>}</AnimatePresence>
    </>
  );
};

export default Header;
