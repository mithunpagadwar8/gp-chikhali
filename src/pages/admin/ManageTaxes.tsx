import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData } from '../../services/storage';
import { AppData, TaxRecord } from '../../types';
import { Plus, Trash2, Search, Save, AlertCircle } from 'lucide-react';

const ManageTaxes: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialForm: TaxRecord = {
    id: '',
    houseNo: '',
    ownerName: '',
    address: '',
    mobile: '',
    houseTax: 0,
    waterTax: 0,
    dueDate: '',
    status: 'Pending'
  };

  const [form, setForm] = useState<TaxRecord>(initialForm);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSave = () => {
    if (!form.houseNo || !form.ownerName) return alert('House No and Owner Name are required');
    
    setData(prev => {
        if (!prev) return null;
        const newRecord: TaxRecord = { 
            ...form, 
            id: Date.now().toString(),
            houseTax: Number(form.houseTax),
            waterTax: Number(form.waterTax)
        };
        const newData = { ...prev, taxes: [newRecord, ...(prev.taxes || [])] };
        saveStoredData(newData);
        return newData;
    });

    setForm(initialForm);
  };

  const handleDelete = (id: string) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedTaxes = (prev.taxes || []).filter(t => String(t.id) !== String(id));
        const newData = { ...prev, taxes: updatedTaxes };
        saveStoredData(newData);
        return newData;
    });
  };

  // Filter taxes based on search
  const filteredTaxes = (data?.taxes || []).filter(t => 
    t.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.houseNo.includes(searchTerm)
  );

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage House & Water Tax</h2>

      {/* Add New Record Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h3 className="font-bold border-b pb-2 mb-4 text-[#0A4275] flex items-center gap-2">
            <Plus size={18}/> Add New Tax Record
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">House Number *</label>
             <input type="text" className="w-full border p-2 rounded text-sm" value={form.houseNo} onChange={e => setForm({...form, houseNo: e.target.value})} placeholder="e.g. 104/A" />
           </div>
           <div className="md:col-span-2">
             <label className="block text-xs font-bold text-gray-700 mb-1">Owner Full Name *</label>
             <input type="text" className="w-full border p-2 rounded text-sm" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="e.g. Shri. Ramesh Patil" />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
             <input type="text" className="w-full border p-2 rounded text-sm" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="+91..." />
           </div>
           
           <div className="md:col-span-2">
             <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
             <input type="text" className="w-full border p-2 rounded text-sm" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="e.g. Near Maruti Temple, Ward 2" />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">House Tax (₹)</label>
             <input type="number" className="w-full border p-2 rounded text-sm" value={form.houseTax} onChange={e => setForm({...form, houseTax: Number(e.target.value)})} />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Water Tax (₹)</label>
             <input type="number" className="w-full border p-2 rounded text-sm" value={form.waterTax} onChange={e => setForm({...form, waterTax: Number(e.target.value)})} />
           </div>

           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Due Date</label>
             <input type="date" className="w-full border p-2 rounded text-sm" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
             <select className="w-full border p-2 rounded text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                <option>Pending</option>
                <option>Paid</option>
             </select>
           </div>
        </div>
        <div className="mt-4 flex justify-end">
            <button onClick={handleSave} className="bg-[#0A4275] text-white px-6 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2">
                <Save size={18}/> Save Record
            </button>
        </div>
      </div>

      {/* Tax List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Tax Records Database</h3>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Name or House No" 
                    className="pl-9 pr-4 py-2 border rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#0A4275]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b-2 border-gray-200">
                <tr>
                    <th className="p-3">House No</th>
                    <th className="p-3">Owner Name</th>
                    <th className="p-3">House Tax</th>
                    <th className="p-3">Water Tax</th>
                    <th className="p-3">Total Due</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {filteredTaxes.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#0A4275]">{t.houseNo}</td>
                    <td className="p-3">
                        <div className="font-medium text-gray-800">{t.ownerName}</div>
                        <div className="text-xs text-gray-500">{t.mobile}</div>
                    </td>
                    <td className="p-3">₹{t.houseTax}</td>
                    <td className="p-3">₹{t.waterTax}</td>
                    <td className="p-3 font-bold text-red-600">₹{Number(t.houseTax) + Number(t.waterTax)}</td>
                    <td className="p-3 text-gray-500">{t.dueDate}</td>
                    <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {t.status}
                        </span>
                    </td>
                    <td className="p-3 text-right">
                        <button 
                            type="button"
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                handleDelete(t.id); 
                            }} 
                            className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded transition cursor-pointer z-10 relative"
                            title="Delete Record"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </td>
                </tr>
                ))}
                {filteredTaxes.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-gray-400 flex flex-col items-center">
                        <AlertCircle size={32} className="mb-2"/>
                        No records found.
                    </td></tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTaxes;