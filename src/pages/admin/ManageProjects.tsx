import React, { useEffect, useState } from 'react';
import { getStoredData, setStoredData, fileToBase64 } from '../../services/storage';
import { AppData, Project } from '../../types';
import { Plus, Trash2, Upload, FileSpreadsheet } from 'lucide-react';

const ManageProjects: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  
  const initialForm: Project = {
    id: '',
    title: '',
    status: 'Planned',
    image: ''
  };
  const [form, setForm] = useState<Project>(initialForm);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.title) return alert('Title required');
    
    setData(prev => {
        if (!prev) return null;
        const newProject = { ...form, id: Date.now().toString() };
        const newData = { ...prev, projects: [...prev.projects, newProject] };
        saveStoredData(newData);
        return newData;
    });
    setForm(initialForm);
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedProjects = prev.projects.filter(p => String(p.id) !== String(id));
        const newData = { ...prev, projects: updatedProjects };
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Projects</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="font-bold border-b pb-2 mb-4">Add Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Project Title</label>
              <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select className="w-full border p-2 rounded" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                  <option>Planned</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Project Image</label>
                <div className="flex items-center gap-4">
                  {form.image && <img src={form.image} alt="Prev" className="h-16 w-16 rounded object-cover border" />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>
        </div>
        <button onClick={handleSave} className="mt-4 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
            <Plus size={18}/> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map(p => (
              <div key={p.id} className="bg-white rounded shadow p-4 border border-gray-100 relative">
                  <button 
                    type="button"
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        handleDelete(p.id); 
                    }} 
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 cursor-pointer"
                    title="Delete Project"
                  >
                      <Trash2 size={16}/>
                  </button>
                  <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded mb-3 bg-gray-100" />
                  <h4 className="font-bold text-gray-800">{p.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : p.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>
                      {p.status}
                  </span>
              </div>
          ))}
          {data.projects.length === 0 && <p className="col-span-3 text-center text-gray-400">No projects added.</p>}
      </div>
    </div>
  );
};

export default ManageProjects;
