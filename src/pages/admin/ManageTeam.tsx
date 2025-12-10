import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData, fileToBase64 } from '../../services/storage';
import { AppData, Official } from '../../types';
import { Plus, Trash2, Upload, MapPin, Phone } from 'lucide-react';

const ManageTeam: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  
  const initialForm: Official = {
    id: '',
    role: '',
    name: '',
    photo: '',
    phone: '',
    address: '',
    category: 'committee'
  };
  const [form, setForm] = useState<Official>(initialForm);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.role) return alert('Name and Role are required');
    
    setData(prev => {
        if (!prev) return null;
        const newOfficial = { ...form, id: Date.now().toString() };
        const newData = { 
          ...prev, 
          officials: [...prev.officials, newOfficial] 
        };
        saveStoredData(newData);
        return newData;
    });
    
    setForm(initialForm);
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedOfficials = prev.officials.filter(o => String(o.id) !== String(id));
        const newData = { ...prev, officials: updatedOfficials };
        
        saveStoredData(newData);
        return newData;
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm({ ...form, photo: base64 });
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Team (Committee & Staff)</h2>
        
        {/* Add Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="font-bold border-b pb-2 mb-4">Add New Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full border p-2 rounded" 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value as 'committee' | 'staff'})}
                >
                  <option value="committee">Elected Committee (Sarpanch, Member)</option>
                  <option value="staff">Employee Staff (Gram Sevak, Clerk)</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role / Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarpanch, Police Patil" 
                  className="w-full border p-2 rounded"
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shri. Rajesh Kumar" 
                  className="w-full border p-2 rounded"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="+91..." 
                  className="w-full border p-2 rounded"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ward No 3" 
                  className="w-full border p-2 rounded"
                  value={form.address || ''}
                  onChange={e => setForm({...form, address: e.target.value})}
                />
             </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                <div className="flex items-center gap-4">
                  {form.photo && <img src={form.photo} alt="Preview" className="h-16 w-16 rounded-full object-cover border"/>}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-gray-500" />
                </div>
             </div>
          </div>
          <button onClick={handleSave} className="bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
            <Plus size={18}/> Add Member
          </button>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Committee List */}
           <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 font-bold text-gray-700">Panchayat Committee</div>
              <ul className="divide-y">
                {data.officials.filter(o => o.category === 'committee').map(o => (
                  <li key={o.id} className="p-4 flex items-center gap-4">
                     <img src={o.photo} alt={o.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                     <div className="flex-1">
                        <div className="font-bold">{o.name}</div>
                        <div className="text-xs text-[#0A4275] font-bold uppercase">{o.role}</div>
                        <div className="text-xs text-gray-500 flex gap-2 mt-1">
                           {o.phone && <span className="flex items-center gap-1"><Phone size={10}/> {o.phone}</span>}
                           {o.address && <span className="flex items-center gap-1"><MapPin size={10}/> {o.address}</span>}
                        </div>
                     </div>
                     <button 
                        type="button"
                        onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleDelete(o.id); 
                        }} 
                        className="text-red-500 hover:text-red-700 cursor-pointer p-2 z-10"
                        title="Delete Member"
                    >
                        <Trash2 size={18}/>
                    </button>
                  </li>
                ))}
                {data.officials.filter(o => o.category === 'committee').length === 0 && <li className="p-4 text-gray-400 text-center">No members found.</li>}
              </ul>
           </div>

           {/* Staff List */}
           <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 font-bold text-gray-700">Staff Members</div>
              <ul className="divide-y">
                {data.officials.filter(o => o.category === 'staff').map(o => (
                  <li key={o.id} className="p-4 flex items-center gap-4">
                     <img src={o.photo} alt={o.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                     <div className="flex-1">
                        <div className="font-bold">{o.name}</div>
                        <div className="text-xs text-[#0A4275] font-bold uppercase">{o.role}</div>
                        <div className="text-xs text-gray-500 flex gap-2 mt-1">
                           {o.phone && <span className="flex items-center gap-1"><Phone size={10}/> {o.phone}</span>}
                        </div>
                     </div>
                     <button 
                        type="button"
                        onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleDelete(o.id); 
                        }} 
                        className="text-red-500 hover:text-red-700 cursor-pointer p-2 z-10"
                        title="Delete Member"
                    >
                        <Trash2 size={18}/>
                    </button>
                  </li>
                ))}
                 {data.officials.filter(o => o.category === 'staff').length === 0 && <li className="p-4 text-gray-400 text-center">No staff found.</li>}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;