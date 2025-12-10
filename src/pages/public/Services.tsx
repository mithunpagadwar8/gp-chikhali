import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { Briefcase, FileText, IndianRupee } from 'lucide-react';

const Services: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Citizen Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">List of services provided by the Gram Panchayat for the convenience of villagers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {data.services.map(s => (
               <div key={s.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-[#FFC107] p-6 flex flex-col">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="bg-blue-50 p-3 rounded-full text-[#0A4275]">
                           <Briefcase size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-800">{s.name}</h3>
                   </div>
                   <p className="text-gray-600 mb-4 flex-1">{s.description}</p>
                   
                   <div className="space-y-2 text-sm bg-gray-50 p-4 rounded border border-gray-100">
                       <div className="flex items-start gap-2">
                           <FileText size={16} className="text-gray-400 mt-1 shrink-0"/>
                           <div>
                               <span className="font-bold text-gray-700 block">Required Documents:</span>
                               <span className="text-gray-600">{s.requirements}</span>
                           </div>
                       </div>
                       <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                           <IndianRupee size={16} className="text-gray-400"/>
                           <span className="font-bold text-gray-700">Govt Fees:</span>
                           <span className="text-green-700 font-bold">{s.fees}</span>
                       </div>
                   </div>
                   
                   <div className="mt-6">
                       <button className="w-full bg-[#0A4275] text-white py-2 rounded font-bold hover:bg-blue-900 transition">
                           Visit Office to Apply
                       </button>
                   </div>
               </div>
           ))}
           {data.services.length === 0 && (
               <div className="col-span-3 text-center py-10 bg-white rounded shadow text-gray-500">
                   No services listed currently. Please contact the office.
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Services;