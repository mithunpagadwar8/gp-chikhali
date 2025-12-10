import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { FileText, Users, Megaphone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div>Loading...</div>;

  const stats = [
    { label: 'Total Blogs', value: data.posts.length, color: 'bg-blue-500', icon: FileText },
    { label: 'Published Schemes', value: data.schemes.length, color: 'bg-green-500', icon: CheckCircle },
    { label: 'Active Notices', value: data.notices.length, color: 'bg-amber-500', icon: Megaphone },
    { label: 'Officials', value: data.officials.length, color: 'bg-purple-500', icon: Users },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.color} text-white p-3 rounded-full shadow-md`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Recent Activities</h3>
          <ul className="space-y-4">
             {data.posts.slice(0, 3).map(post => (
               <li key={post.id} className="flex gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                 <div>
                   <p className="text-sm font-bold text-gray-700">{post.title}</p>
                   <p className="text-xs text-gray-500">Blog Posted on {post.date}</p>
                 </div>
               </li>
             ))}
             <li className="flex gap-4">
               <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
               <div>
                 <p className="text-sm font-bold text-gray-700">System Backup</p>
                 <p className="text-xs text-gray-500">Performed automatically via LocalStorage</p>
               </div>
             </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/admin/blogs')} className="p-4 border rounded hover:bg-gray-50 text-left">
              <span className="block font-bold text-[#0A4275]">+ New Blog</span>
              <span className="text-xs text-gray-500">Write an update</span>
            </button>
             <button onClick={() => navigate('/admin/notices')} className="p-4 border rounded hover:bg-gray-50 text-left">
              <span className="block font-bold text-[#0A4275]">+ Add Notice</span>
              <span className="text-xs text-gray-500">Urgent announcement</span>
            </button>
             <button onClick={() => navigate('/admin/gallery')} className="p-4 border rounded hover:bg-gray-50 text-left">
              <span className="block font-bold text-[#0A4275]">Upload Media</span>
              <span className="text-xs text-gray-500">Gallery management</span>
            </button>
             <button onClick={() => navigate('/')} className="p-4 border rounded hover:bg-gray-50 text-left">
              <span className="block font-bold text-[#0A4275]">View Site</span>
              <span className="text-xs text-gray-500">Open frontend</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;