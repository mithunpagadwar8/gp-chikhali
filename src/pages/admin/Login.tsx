import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle } from '../../services/firebase';
import { Lock, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    await signInWithGoogle();
    navigate('/admin');
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-[#0A4275] flex items-center justify-center px-4 relative">
      
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 left-6 text-white flex items-center gap-2 hover:underline opacity-80 hover:opacity-100 transition">
        <ArrowLeft size={20} /> Back to Home Website
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0A4275]">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Portal Login</h2>
          <p className="text-gray-500 text-sm mt-2">Gram Panchayat Chikhali</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A4275] focus:border-transparent outline-none transition"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0A4275] focus:border-transparent outline-none transition"
              placeholder="Enter password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#0A4275] text-white py-3 rounded font-bold hover:bg-blue-900 transition duration-300 shadow-lg"
          >
            Secure Login
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          Unauthorized access is prohibited.
        </div>
      </div>
    </div>
  );
};

export default Login;
