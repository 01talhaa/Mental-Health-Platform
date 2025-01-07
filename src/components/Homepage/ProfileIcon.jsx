'use client'
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    HiOutlineViewGrid,
    HiCog,
    HiQuestionMarkCircle,
} from "react-icons/hi";
import { TbLogout, TbUserCircle } from "react-icons/tb";
import { FaFileAlt, FaUserTie } from "react-icons/fa";

const MenuLink = ({ href, icon, label }) => (
    <Link
        href={href}
        className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200"
    >
        <span className="text-blue-500">{icon}</span>
        <span>{label}</span>
    </Link>
);

const ProfileMenu = ({ userData }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
    const router = useRouter();

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleLogout = () => {
        setIsProfileMenuOpen(false);
        router.push('/logout');
    };

    return (
        <div className="relative">
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <TbUserCircle
                    className="text-3xl text-blue-500 cursor-pointer"
                    onClick={toggleProfileMenu}
                />
            </motion.div>

            {isProfileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-[1001]"
                >
                    <div className="bg-gradient-to-r from-primary-color to-purple-600 p-6 text-white">
                        {userData ? (
                            <>
                                <h4 className="text-xl font-bold">
                                    Welcome, {userData.first_name}!
                                </h4>
                                <p className="text-sm opacity-80">{userData.email}</p>
                            </>
                        ) : (
                            <h4 className="text-xl font-bold">Welcome!</h4>
                        )}
                    </div>
                    
                    <div className="p-4 space-y-2">
                        {userData ? (
                            <>
                                <MenuLink href="/dashboard" icon={<HiOutlineViewGrid />} label="Dashboard" />
                                <MenuLink href="/userprofile/aboutme" icon={<FaUserTie />} label="Profile" />
                                <MenuLink href="/resumebuilder" icon={<FaFileAlt />} label="Resume Builder" />
                                <MenuLink href="/settings" icon={<HiCog />} label="Settings" />
                                <MenuLink href="/help" icon={<HiQuestionMarkCircle />} label="Help Center" />
                            </>
                        ) : (
                            <>
                                <MenuLink href="/dashboard" icon={<HiOutlineViewGrid />} label="Dashboard" />
                                <MenuLink href="/signup" icon={<FaUserTie />} label="Sign Up" />
                                <MenuLink href="/login" icon={<HiCog />} label="Login" />
                            </>
                        )}
                    </div>

                    {userData && (
                        <div className="px-4 pb-4">
                            <button
                                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors duration-200"
                                onClick={handleLogout}
                            >
                                <TbLogout className="text-xl" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ProfileMenu;