import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, UserCircle, LogOut } from 'lucide-react';
import { getStoredData, getPublicUser } from '../services/storage';
import { signInWithGoogle, publicSignOut } from '../services/firebase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg');
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

 useEffect(() => {
  const data = getStoredData();

  if (data && data.logo) {
    setLogo(data.logo);
  }

  const currentUser = getPublicUser();
  setUser(currentUser);
}, [location]);

  const handleLogin = async () => {
      const u = await signInWithGoogle();
      if (u) {
          setUser(u);
          window.location.reload(); // Refresh to show tabs
      }
  };

  const handleLogout = async () => {
      await publicSignOut();
      setUser(null);
  };

  const isActive = (path: string) => location.pathname === path ? 'bg-[#FFC107] text-black font-bold' : 'text-white hover:bg-white/10';

  // Base Links (Always Visible)
  const baseLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // Restricted Links (Only Visible if Logged In)
  const restrictedLinks = [
    { name: 'Tax List', path: '/tax-list' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Tenders', path: '/tenders' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const navLinks = user ? [...baseLinks, ...restrictedLinks] : baseLinks;

  return (
    <header className="font-sans">
      {/* Top Bar */}
      <div className="bg-[#f2f2f2] text-xs py-1 border-b border-gray-300">
        <div className="container mx-auto px-4 flex justify-between items-center text-gray-700">
          <div className="hidden md:flex gap-4">
            <span>GOVERNMENT OF INDIA</span>
            <span>|</span>
            <span>MINISTRY OF PANCHAYATI RAJ</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:underline">Skip to Main Content</span>
            <span>|</span>
            <div className="flex items-center gap-1 cursor-pointer">
              <Globe size={14} />
              <select className="bg-transparent border-none outline-none">
                <option>English</option>
                <option>मराठी</option>
                <option>हिंदी</option>
              </select>
            </div>
            <span>|</span>
            <Link to="/admin/login" className="font-bold text-blue-800 hover:underline">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Emblem & Logo Section */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Emblem" className="h-16 md:h-24 w-auto object-contain" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-bold text-[#0A4275] uppercase leading-tight">Gram Panchayat Chikhali</h1>
              <p className="text-sm text-gray-600 font-medium">District: Pune, State: Maharashtra</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" alt="Digital India" className="h-12 w-auto grayscale opacity-80 hover:grayscale-0 transition" />
              </div>
              
              {/* Login/User Button for Desktop */}
              <div className="hidden md:block">
                  {user ? (
                      <div className="flex items-center gap-3">
                          <div className="text-right">
                              <p className="text-sm font-bold text-[#0A4275]">{user.displayName}</p>
                              <button onClick={handleLogout} className="text-xs text-red-600 hover:underline flex items-center justify-end gap-1">
                                  <LogOut size={10}/> Logout
                              </button>
                          </div>
                          {user.photoURL ? (
                              <img src={user.photoURL} className="w-10 h-10 rounded-full border border-gray-300" alt="Profile"/>
                          ) : (
                              <UserCircle size={40} className="text-gray-400"/>
                          )}
                      </div>
                  ) : (
                      <button 
                        onClick={handleLogin}
                        className="bg-[#0A4275] text-white px-4 py-2 rounded shadow hover:bg-blue-900 transition flex items-center gap-2 text-sm font-bold"
                      >
                          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G"/>
                          Citizen Login
                      </button>
                  )}
              </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#0A4275] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Menu */}
            <div className="hidden md:flex w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 h-14 flex items-center transition-colors ${isActive(link.path)} uppercase text-sm tracking-wide`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-between w-full text-white">
              <span className="font-bold uppercase tracking-widest">Menu</span>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-[#08355e] text-white border-t border-blue-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 border-b border-blue-800 hover:bg-[#FFC107] hover:text-black"
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
                <button 
                    onClick={() => { handleLogin(); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 border-b border-blue-800 bg-blue-900 hover:bg-blue-800 flex items-center gap-2"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G"/>
                    Citizen Login
                </button>
            ) : (
                <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 border-b border-blue-800 text-red-300 hover:bg-red-900"
                >
                    Logout ({user.displayName})
                </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
