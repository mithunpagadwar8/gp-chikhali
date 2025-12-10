import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Image, Users, LogOut, Settings, Briefcase, FileSpreadsheet, Megaphone, Link as LinkIcon, Download, Calendar, ExternalLink, IndianRupee, KeyRound } from 'lucide-react';
import { publicSignOut } from '../services/firebase';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

 const handleLogout = async () => {
  await publicSignOut();
  navigate('/');
};

  const isActive = (path: string) => location.pathname === path ? 'bg-[#0A4275] text-white' : 'text-gray-600 hover:bg-gray-100';

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Google Sign-In Setup', path: '/admin/google-auth', icon: KeyRound }, // Added
    { name: 'Manage Taxes', path: '/admin/taxes', icon: IndianRupee },
    { name: 'Manage Services', path: '/admin/services', icon: Briefcase },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    { name: 'Manage Team', path: '/admin/team', icon: Users },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Manage Schemes', path: '/admin/schemes', icon: LinkIcon },
    { name: 'Manage Meetings', path: '/admin/meetings', icon: Calendar },
    { name: 'Manage Notices', path: '/admin/notices', icon: Megaphone },
    { name: 'Manage Projects', path: '/admin/projects', icon: FileSpreadsheet },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Tenders & Forms', path: '/admin/tenders', icon: Download },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl fixed h-full z-10 hidden md:flex flex-col overflow-y-auto">
        <div className="p-6 border-b flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-[#0A4275] rounded-full flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive(item.path)}`}>
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t shrink-0 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-6 py-3 w-full text-[#0A4275] hover:bg-blue-50 rounded transition-colors font-medium text-sm"
          >
            <ExternalLink size={18} />
            View Live Site
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-red-600 hover:bg-red-50 rounded transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
            <span className="font-bold">Admin Panel</span>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-[#0A4275]" title="View Live Site">
                  <ExternalLink size={20}/>
                </Link>
                <button onClick={handleLogout} title="Logout">
                  <LogOut size={20} className="text-red-600"/>
                </button>
            </div>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
