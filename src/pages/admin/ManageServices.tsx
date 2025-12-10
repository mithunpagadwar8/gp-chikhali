import React, { useEffect, useState } from 'react';
import { getStoredData, setStoredData } from '../../services/storage';
import { AppData, Service } from '../../types';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const ManageServices: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [form, setForm] = useState<Service>({
    id: '',
    name: '',
    description: '',
    requirements: '',
    fees: ''
  });

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.name) return alert('Service Name is required');
    
    setData(prev => {
        if (!prev) return null;
        const newService = { ...form, id: Date.now().toString() };
        const newData = { ...prev, services: [...prev.services, newService] };
        saveStoredData(newData);
        return newData;
    });
    
    setForm({ id: '', name: '', description: '', requirements: '', fees: '' });
  };

  const handleDelete = (id: string) => {
    setData(prev => {
        if (!prev) return null;
        const updatedServices = prev.services.filter(s => String(s.id) !== String(id));
        const newData = { ...prev, services: updatedServices };
        saveStoredData(newData);
        return newData;
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Citizen Services</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
         <h3 className="font-bold border-b pb-2 mb-4 text-[#0A4275]">Add New Service</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Service Name</label>
              <input 
                type="text" 
                placeholder="e.g. Birth Certificate"
                className="w-full border p-2 rounded" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                placeholder="Short description of the service..."
                className="w-full border p-2 rounded" 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Required Documents</label>
              <input 
                type="text" 
                placeholder="e.g. Aadhaar, Ration Card"
                className="w-full border p-2 rounded" 
                value={form.requirements}
                onChange={e => setForm({...form, requirements: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Govt. Fees</label>
              <input 
                type="text" 
                placeholder="e.g. ₹20 or Free"
                className="w-full border p-2 rounded" 
                value={form.fees}
                onChange={e => setForm({...form, fees: e.target.value})}
              />
            </div>
         </div>
         <button onClick={handleSave} className="mt-4 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
            <Plus size={18}/> Add Service
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.services.map(s => (
          <div key={s.id} className="bg-white p-5 rounded shadow border-l-4 border-[#0A4275] relative hover:shadow-lg transition">
             <button 
                type="button"
                onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation(); 
                    handleDelete(s.id); 
                }} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                title="Delete Service"
             >
                 <Trash2 size={18}/>
             </button>
             <div className="flex items-center gap-2 mb-2">
                 <div className="bg-blue-50 p-2 rounded text-[#0A4275]"><Briefcase size={20}/></div>
                 <h4 className="font-bold text-lg text-gray-800">{s.name}</h4>
             </div>
             <p className="text-sm text-gray-600 mb-3">{s.description}</p>
             <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                <p><span className="font-bold">Documents:</span> {s.requirements}</p>
                <p><span className="font-bold">Fees:</span> {s.fees}</p>
             </div>
          </div>
        ))}
        {data.services.length === 0 && <p className="col-span-2 text-center text-gray-400 py-4">No services listed yet.</p>}
      </div>
    </div>
  );
};

export default ManageServices;
