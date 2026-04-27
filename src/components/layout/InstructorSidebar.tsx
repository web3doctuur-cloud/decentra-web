"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  FaTachometerAlt, 
  FaChalkboardTeacher, 
  FaPlus, 
  FaSignOutAlt, 
  FaUser, 
  FaBars,
  FaTimes,
  FaHome
} from "react-icons/fa";

export default function InstructorSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { href: "/instructor/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/instructor/create", label: "Create Course", icon: FaPlus },
    { href: "/profile", label: "Profile", icon: FaUser },
    { href: "/", label: "Back to Site", icon: FaHome },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-slate-900 border-r border-purple-500/20 z-40
        transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/20">
            <Link href="/instructor/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <FaChalkboardTeacher className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-white">
                DECENTRA<span className="text-purple-500">WEB</span>
              </span>
            </Link>
            <p className="text-xs text-purple-400 mt-2">Instructor Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-purple-500/20">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <FaSignOutAlt size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}