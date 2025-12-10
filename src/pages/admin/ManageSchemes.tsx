import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData } from '../../services/storage';
import { AppData, Scheme } from '../../types';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

const ManageSchemes: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [form, setForm] = useState<Scheme>({
    id: '',
    title: '',
    description: '',
    beneficiaries: '',
    link: ''
  });

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.title) return alert('Scheme Title is required');
    
    setData(prev => {
        if (!prev) return null;
        const newScheme = { ...form, id: Date.now().toString() };
        const newData = { ...prev, schemes: [...prev.schemes, newScheme] };
        saveStoredData(newData);
        return newData;
    });
    
    setForm({ id: '', title: '', description: '', beneficiaries: '', link: '' });
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedSchemes = prev.schemes.filter(s => String(s.id) !== String(id));
        const newData = { ...prev, schemes: updatedSchemes };
        saveStoredData(newData);
        return newData;
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Govt Schemes</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Scheme Name</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full border p-2 rounded" 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Beneficiaries (For whom?)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded" 
                value={form.beneficiaries}
                onChange={e => setForm({...form, beneficiaries: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Website Link (Optional)</label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full border p-2 rounded" 
                value={form.link || ''}
                onChange={e => setForm({...form, link: e.target.value})}
              />
            </div>
         </div>
         <button onClick={handleSave} className="mt-4 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
            <Plus size={18}/> Add Scheme
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.schemes.map(s => (
          <div key={s.id} className="bg-white p-4 rounded shadow border-l-4 border-green-500 relative">
             <button 
                type="button"
                onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation(); 
                    handleDelete(s.id); 
                }} 
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                title="Delete Scheme"
             >
                 <Trash2 size={18}/>
             </button>
             <h4 className="font-bold text-lg text-gray-800 pr-6">{s.title}</h4>
             <p className="text-sm text-gray-600 mb-2">{s.description}</p>
             <div className="flex justify-between items-center text-xs mt-3">
               <span className="bg-green-50 text-green-700 px-2 py-1 rounded">For: {s.beneficiaries}</span>
               {s.link && (
                 <a href={s.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                   <LinkIcon size={12}/> Visit Site
                 </a>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSchemes;