import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData, fileToBase64 } from '../../services/storage';
import { AppData, Meeting } from '../../types';
import { Plus, Trash2, Calendar, Upload } from 'lucide-react';

const ManageMeetings: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [form, setForm] = useState<Meeting>({
    id: '',
    title: '',
    type: 'Gram Sabha',
    date: '',
    description: '',
    file: '',
    photos: []
  });

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.title || !form.date) return alert('Title and Date are required');
    
    setData(prev => {
        if (!prev) return null;
        const newMeeting = { ...form, id: Date.now().toString() };
        const newData = { ...prev, meetings: [newMeeting, ...prev.meetings] };
        saveStoredData(newData);
        return newData;
    });

    setForm({ ...form, title: '', date: '', description: '', id: '', photos: [] });
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedMeetings = prev.meetings.filter(m => String(m.id) !== String(id));
        const newData = { ...prev, meetings: updatedMeetings };
        saveStoredData(newData);
        return newData;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const base64 = await fileToBase64(e.target.files[0]);
        setForm(prev => ({ ...prev, photos: [...prev.photos, base64] }));
      }
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Meetings & Sabhas</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="font-bold border-b pb-2 mb-4">Add Meeting Detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Meeting Type</label>
             <select 
               className="w-full border p-2 rounded"
               value={form.type}
               onChange={e => setForm({...form, type: e.target.value as any})}
             >
               <option>Gram Sabha</option>
               <option>Masik Sabha</option>
               <option>Ward Sabha</option>
               <option>Bal Sabha</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
             <input 
               type="date" 
               className="w-full border p-2 rounded"
               value={form.date}
               onChange={e => setForm({...form, date: e.target.value})}
             />
           </div>
           <div className="md:col-span-2">
             <label className="block text-sm font-bold text-gray-700 mb-1">Title / Subject</label>
             <input 
               type="text" 
               placeholder="e.g. Diwali Gram Sabha regarding road construction"
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
               rows={2}
             ></textarea>
           </div>
           
           <div className="md:col-span-2">
             <label className="block text-sm font-bold text-gray-700 mb-2">Upload Meeting Photos</label>
             <div className="flex flex-wrap items-center gap-4">
                {form.photos.map((photo, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border">
                        <img src={photo} alt="Meeting" className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"><Trash2 size={12}/></button>
                    </div>
                ))}
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500">Add</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
             </div>
           </div>

        </div>
        <button onClick={handleSave} className="mt-6 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
          <Plus size={18}/> Schedule/Record Meeting
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm">
             <tr>
               <th className="p-4">Date</th>
               <th className="p-4">Type</th>
               <th className="p-4">Subject</th>
               <th className="p-4">Photos</th>
               <th className="p-4 text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y">
            {data.meetings.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                 <td className="p-4 flex items-center gap-2 font-medium text-gray-800">
                   <Calendar size={16} className="text-[#FFC107]" /> {m.date}
                 </td>
                 <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{m.type}</span></td>
                 <td className="p-4 text-sm">
                   <div className="font-bold">{m.title}</div>
                   <div className="text-gray-500 truncate max-w-xs">{m.description}</div>
                 </td>
                 <td className="p-4">
                    {m.photos && m.photos.length > 0 ? (
                        <div className="flex -space-x-2">
                            {m.photos.slice(0,3).map((p, i) => (
                                <img key={i} src={p} alt="Mini" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                            ))}
                            {m.photos.length > 3 && <span className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+{m.photos.length - 3}</span>}
                        </div>
                    ) : <span className="text-gray-400 text-xs">No photos</span>}
                 </td>
                 <td className="p-4 text-right">
                   <button 
                    type="button"
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        handleDelete(m.id); 
                    }} 
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete Meeting"
                   >
                       <Trash2 size={18}/>
                   </button>
                 </td>
              </tr>
            ))}
             {data.meetings.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No meetings scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMeetings;