import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData } from '../../services/storage';
import { AppData, Tender } from '../../types';
import { Plus, Trash2, X } from 'lucide-react';

const ManageTenders: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [form, setForm] = useState<Tender>({
    id: '',
    title: '',
    refNumber: '',
    closingDate: '',
    downloadLink: '#',
    applicants: []
  });

  const [applicantName, setApplicantName] = useState('');
  const [activeTenderId, setActiveTenderId] = useState<string | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.title || !form.closingDate) return alert('Title and Date are required');
    
    setData(prev => {
        if (!prev) return null;
        const newTender = { ...form, id: Date.now().toString() };
        const newData = { ...prev, tenders: [newTender, ...prev.tenders] };
        saveStoredData(newData);
        return newData;
    });

    setForm({ id: '', title: '', refNumber: '', closingDate: '', downloadLink: '#', applicants: [] });
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedTenders = prev.tenders.filter(t => String(t.id) !== String(id));
        const newData = { ...prev, tenders: updatedTenders };
        saveStoredData(newData);
        return newData;
    });
  };

  const addApplicant = (tenderId: string) => {
    if (!applicantName) return;
    
    setData(prev => {
        if (!prev) return null;
        const newTenders = prev.tenders.map(t => {
            if (t.id === tenderId) {
                return {
                    ...t,
                    applicants: [
                        ...t.applicants,
                        {
                            id: Date.now().toString(),
                            name: applicantName,
                            applicationDate: new Date().toISOString().split('T')[0]
                        }
                    ]
                };
            }
            return t;
        });
        const newData = { ...prev, tenders: newTenders };
        saveStoredData(newData);
        return newData;
    });

    setApplicantName('');
  };

  const removeApplicant = (tenderId: string, applicantId: string) => {
     setData(prev => {
         if (!prev) return null;
         const newTenders = prev.tenders.map(t => {
             if (t.id === tenderId) {
                 return {
                     ...t,
                     applicants: t.applicants.filter(a => a.id !== applicantId)
                 };
             }
             return t;
         });
         const newData = { ...prev, tenders: newTenders };
         saveStoredData(newData);
         return newData;
     });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Tenders & Contractor Applications</h2>

      {/* Add Tender Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="font-bold border-b pb-2 mb-4">Publish New Tender</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Tender Title</label>
             <input type="text" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
           </div>
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Reference Number</label>
             <input type="text" className="w-full border p-2 rounded" value={form.refNumber} onChange={e => setForm({...form, refNumber: e.target.value})} />
           </div>
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Closing Date</label>
             <input type="date" className="w-full border p-2 rounded" value={form.closingDate} onChange={e => setForm({...form, closingDate: e.target.value})} />
           </div>
        </div>
        <button onClick={handleSave} className="mt-4 bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
          <Plus size={18}/> Publish Tender
        </button>
      </div>

      {/* List Tenders */}
      <div className="space-y-6">
          {data.tenders.map(t => (
              <div key={t.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                  <div className="p-4 bg-gray-50 flex justify-between items-start">
                      <div>
                          <h4 className="font-bold text-lg text-[#0A4275]">{t.title}</h4>
                          <p className="text-sm text-gray-600">Ref: {t.refNumber} | Closing: {t.closingDate}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            handleDelete(t.id); 
                        }} 
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete Tender"
                      >
                          <Trash2 size={18}/>
                      </button>
                  </div>
                  
                  {/* Applicants Section */}
                  <div className="p-4 border-t">
                      <h5 className="font-bold text-sm text-gray-700 mb-3">Contractor Applicants ({t.applicants.length})</h5>
                      
                      {/* Add Applicant Input */}
                      <div className="flex gap-2 mb-4">
                          <input 
                            type="text" 
                            placeholder="Enter Contractor Name" 
                            className="border p-2 rounded text-sm w-full md:w-1/3"
                            value={activeTenderId === t.id ? applicantName : ''}
                            onChange={e => { setActiveTenderId(t.id); setApplicantName(e.target.value); }}
                          />
                          <button 
                            onClick={() => addApplicant(t.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-700"
                          >
                              Add Applicant
                          </button>
                      </div>

                      {/* Applicants List */}
                      {t.applicants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {t.applicants.map(app => (
                                <div key={app.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border">
                                    <span className="text-sm font-medium">{app.name}</span>
                                    <button onClick={() => removeApplicant(t.id, app.id)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                                </div>
                            ))}
                        </div>
                      ) : (
                          <p className="text-sm text-gray-400 italic">No applications received yet.</p>
                      )}
                  </div>
              </div>
          ))}
          {data.tenders.length === 0 && <p className="text-center text-gray-400 py-8">No tenders active.</p>}
      </div>
    </div>
  );
};

export default ManageTenders;