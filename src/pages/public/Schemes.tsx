import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { Link as LinkIcon, CheckCircle } from 'lucide-react';

const Schemes: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Government Schemes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Beneficial schemes launched by Central & State Government for villagers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.schemes.map(scheme => (
                <div key={scheme.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-4">{scheme.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle size={14}/> Beneficiaries: {scheme.beneficiaries}
                        </span>
                    </div>

                    {scheme.link && (
                        <a 
                            href={scheme.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 text-[#0A4275] font-bold hover:underline"
                        >
                            <LinkIcon size={16}/> Visit Official Website
                        </a>
                    )}
                </div>
            ))}
             {data.schemes.length === 0 && (
               <div className="col-span-2 text-center py-10 bg-white rounded shadow text-gray-500">
                   No schemes listed currently.
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Schemes;