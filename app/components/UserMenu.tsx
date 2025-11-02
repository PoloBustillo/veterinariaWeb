"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface UserMenuProps {
  userName: string;
  userEmail: string;
}

export default function UserMenu({ userName, userEmail }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obtener las iniciales del nombre
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
      >
        {/* Avatar con iniciales */}
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-md">
          {getInitials(userName)}
        </div>

        {/* Nombre y flecha */}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/agendar-cita"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition text-gray-700 hover:text-blue-600"
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Agendar Cita</span>
            </Link>

            <Link
              href="/mis-citas"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition text-gray-700 hover:text-blue-600"
            >
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Mis Citas</span>
            </Link>

            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition text-gray-700 hover:text-blue-600"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Mi Perfil</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition text-gray-700 hover:text-red-600"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
