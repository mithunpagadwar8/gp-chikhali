import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { Download, FileText, Users } from 'lucide-react';

const Tenders: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Tenders & Contracts</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Transparency in village development works. View active tenders and applicant details below.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#0A4275] text-white uppercase text-sm">
                 <tr>
                   <th className="p-4 border-b">Ref No.</th>
                   <th className="p-4 border-b w-1/3">Work Description</th>
                   <th className="p-4 border-b">Closing Date</th>
                   <th className="p-4 border-b">Status</th>
                   <th className="p-4 border-b">Applications Received</th>
                   <th className="p-4 border-b text-center">Download</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                 {data.tenders.map(t => (
                   <tr key={t.id} className="hover:bg-gray-50">
                     <td className="p-4 text-sm font-bold text-gray-600">{t.refNumber}</td>
                     <td className="p-4 font-medium text-gray-800">{t.title}</td>
                     <td className="p-4 text-sm text-gray-600">{t.closingDate}</td>
                     <td className="p-4">
                        {new Date(t.closingDate) >= new Date() ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">ACTIVE</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">CLOSED</span>
                        )}
                     </td>
                     <td className="p-4">
                        <div className="text-sm">
                            <div className="flex items-center gap-1 font-bold text-[#0A4275] mb-1">
                                <Users size={14} /> {t.applicants.length} Applicants
                            </div>
                            {t.applicants.length > 0 ? (
                                <ul className="list-disc list-inside text-xs text-gray-500">
                                    {t.applicants.map(app => (
                                        <li key={app.id}>{app.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-xs text-gray-400 italic">No applicants yet</span>
                            )}
                        </div>
                     </td>
                     <td className="p-4 text-center">
                        <a href={t.downloadLink} className="inline-flex flex-col items-center text-gray-500 hover:text-[#FFC107] transition">
                           <FileText size={20} />
                           <span className="text-[10px] uppercase font-bold mt-1">PDF</span>
                        </a>
                     </td>
                   </tr>
                 ))}
                 {data.tenders.length === 0 && (
                     <tr><td colSpan={6} className="p-8 text-center text-gray-500">No tenders available at the moment.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Tenders;