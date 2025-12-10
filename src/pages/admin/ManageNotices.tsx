import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData, fileToBase64 } from '../../services/storage';
import { AppData, Notice } from '../../types';
import { Plus, Trash2, Megaphone, Upload, X } from 'lucide-react';

const ManageNotices: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [form, setForm] = useState<Notice>({
    id: '',
    text: '',
    date: new Date().toISOString().split('T')[0],
    isNew: true,
    image: ''
  });

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.text) return alert('Notice text is required');
    
    setData(prev => {
        if (!prev) return null;
        const newNotice = { ...form, id: Date.now().toString() };
        const newData = { ...prev, notices: [newNotice, ...prev.notices] };
        saveStoredData(newData);
        return newData;
    });

    setForm({ id: '', text: '', date: new Date().toISOString().split('T')[0], isNew: true, image: '' });
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedNotices = prev.notices.filter(n => String(n.id) !== String(id));
        const newData = { ...prev, notices: updatedNotices };
        saveStoredData(newData);
        return newData;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm({ ...form, image: base64 });
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Public Notices</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 gap-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Notice Text</label>
             <input type="text" className="w-full border p-2 rounded" value={form.text} onChange={e => setForm({...form, text: e.target.value})} placeholder="e.g. Tax collection camp on Sunday..." />
           </div>
           <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border p-2 rounded" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              <div className="w-1/2 flex items-center pt-6">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} />
                    <span className="text-sm font-bold text-[#0A4275]">Mark as "New"</span>
                 </label>
              </div>
           </div>
           
           {/* Image Upload for Notice */}
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Attach Image (Optional)</label>
              <div className="flex items-center gap-4">
                 {form.image && (
                     <div className="relative">
                        <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                        <button onClick={() => setForm({...form, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                     </div>
                 )}
                 <label className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded hover:bg-gray-200 flex items-center gap-2 text-sm">
                   <Upload size={16}/> Upload Photo
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </label>
              </div>
           </div>
        </div>
        <button onClick={handleSave} className="mt-4 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
          <Plus size={18}/> Publish Notice
        </button>
      </div>

      <div className="space-y-4">
         {data.notices.map(n => (
             <div key={n.id} className="bg-white p-4 rounded shadow flex items-start gap-4 border-l-4 border-[#FFC107]">
                 <Megaphone size={24} className="text-[#0A4275] shrink-0 mt-1" />
                 <div className="flex-1">
                     <div className="flex justify-between items-start">
                         <p className="font-bold text-gray-800">{n.text}</p>
                         <button 
                            type="button"
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                handleDelete(n.id); 
                            }} 
                            className="text-red-400 hover:text-red-600 cursor-pointer"
                            title="Delete Notice"
                        >
                            <Trash2 size={16}/>
                        </button>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">{n.date} {n.isNew && <span className="bg-[#FFC107] text-black px-1.5 rounded ml-2 font-bold text-[10px]">NEW</span>}</p>
                     {n.image && <img src={n.image} alt="Notice attachment" className="mt-2 h-24 rounded border" />}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default ManageNotices;