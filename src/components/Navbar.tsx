import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ✅ Firebase Auth (Single Source of Truth)
  const { user, loginWithGoogle, logout, isAdmin } = useAuth();

  const logo =
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ✅ LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">Gram Panchayat Chikhali</span>
        </Link>

        {/* ✅ DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/services" className="hover:text-blue-600">
            Services
          </Link>
          <Link to="/meetings" className="hover:text-blue-600">
            Meetings
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>

          {/* ✅ ADMIN ONLY */}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Admin Panel
            </Link>
          )}

          {/* ✅ AUTH */}
          {!user ? (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1 px-3 py-1 border rounded"
            >
              <UserCircle size={18} />
              Admin Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1 border rounded"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </nav>

        {/* ✅ MOBILE MENU TOGGLE */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/services" onClick={toggleMenu}>
            Services
          </Link>
          <Link to="/meetings" onClick={toggleMenu}>
            Meetings
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>

          {isAdmin && (
            <Link to="/admin" onClick={toggleMenu}>
              Admin Panel
            </Link>
          )}

          {!user ? (
            <button onClick={loginWithGoogle} className="block">
              Admin Login
            </button>
          ) : (
            <button onClick={logout} className="block">
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
