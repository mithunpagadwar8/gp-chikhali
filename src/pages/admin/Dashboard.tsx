import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FileText, Users, Megaphone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    posts: 0,
    schemes: 0,
    notices: 0,
    officials: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const postsSnap = await getDocs(collection(db, "posts"));
        const schemesSnap = await getDocs(collection(db, "schemes"));
        const noticesSnap = await getDocs(collection(db, "notices"));
        const officialsSnap = await getDocs(collection(db, "officials"));

        setStats({
          posts: postsSnap.size,
          schemes: schemesSnap.size,
          notices: noticesSnap.size,
          officials: officialsSnap.size,
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  const data = [
    { label: "Total Blogs", value: stats.posts, color: "bg-blue-500", icon: FileText },
    { label: "Published Schemes", value: stats.schemes, color: "bg-green-500", icon: CheckCircle },
    { label: "Active Notices", value: stats.notices, color: "bg-amber-500", icon: Megaphone },
    { label: "Officials", value: stats.officials, color: "bg-purple-500", icon: Users },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 flex items-center justify-between"
          >
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
    </div>
  );
};

export default Dashboard;
