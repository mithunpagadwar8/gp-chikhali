import React, { useEffect, useState } from 'react';
import { getStoredData, setStoredData } from '../../services/storage';
import { AppData, FirebaseConfig } from '../../types';
import { KeyRound, Save, AlertTriangle, ExternalLink } from 'lucide-react';

const ManageGoogleAuth: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [config, setConfig] = useState<FirebaseConfig>({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
  });

  useEffect(() => {
    const d = getStoredData();
    setData(d);
    if(d.firebaseConfig) {
        setConfig(d.firebaseConfig);
    }
  }, []);

  const handleSave = () => {
    if (!config.apiKey || !config.authDomain) {
        alert("API Key and Auth Domain are minimal requirements.");
        return;
    }
    
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev, firebaseConfig: config };
        saveStoredData(newData);
        return newData;
    });
    alert("Google Sign-In Configuration Saved Successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Google Sign-In Configuration</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
         <div className="flex items-start gap-4 mb-6 bg-yellow-50 p-4 rounded border border-yellow-200">
             <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
             <div className="text-sm text-gray-700">
                 <p className="font-bold mb-1">Why do I need this?</p>
                 <p>To restrict access to Services, Taxes, and Tenders for registered citizens only, you must configure Firebase Authentication. </p>
                 <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 mt-2 font-bold">
                    Go to Firebase Console <ExternalLink size={14}/>
                 </a>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">API Key</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
                placeholder="AIzaSy..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Auth Domain</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.authDomain}
                onChange={e => setConfig({...config, authDomain: e.target.value})}
                placeholder="project-id.firebaseapp.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Project ID</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.projectId}
                onChange={e => setConfig({...config, projectId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Storage Bucket</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.storageBucket}
                onChange={e => setConfig({...config, storageBucket: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Messaging Sender ID</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.messagingSenderId}
                onChange={e => setConfig({...config, messagingSenderId: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">App ID</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded bg-gray-50" 
                value={config.appId}
                onChange={e => setConfig({...config, appId: e.target.value})}
              />
            </div>
         </div>
         
         <button onClick={handleSave} className="mt-8 bg-[#0A4275] text-white px-8 py-3 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
            <Save size={18}/> Save Configuration
         </button>
      </div>
    </div>
  );
};

export default ManageGoogleAuth;
