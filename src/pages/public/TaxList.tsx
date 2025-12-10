import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData, TaxRecord } from '../../types';
import { Search, IndianRupee, Home, AlertCircle } from 'lucide-react';

const TaxList: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<TaxRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleSearch = () => {
    if (!data) return;
    if (!searchTerm.trim()) return;

    const results = data.taxes.filter(t => 
        t.houseNo.toLowerCase() === searchTerm.toLowerCase() ||
        t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(results);
    setHasSearched(true);
  };

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0A4275] mb-4">Property & Water Tax List</h1>
          <p className="text-gray-600">Search your tax details by entering your <span className="font-bold">House Number</span> or <span className="font-bold">Name</span>.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Enter House Number or Owner Name..." 
                  className="flex-1 p-4 border border-gray-300 rounded text-lg focus:ring-2 focus:ring-[#FFC107] outline-none"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-[#0A4275] text-white px-8 py-4 rounded font-bold text-lg hover:bg-blue-900 transition flex items-center justify-center gap-2"
                >
                    <Search size={24}/> Search
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Data is updated as per Gram Panchayat records.</p>
        </div>

        {/* Results */}
        {hasSearched && (
            <div className="space-y-6">
                {searchResult.length > 0 ? (
                    searchResult.map(record => (
                        <div key={record.id} className="bg-white border-l-8 border-[#FFC107] rounded shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{record.ownerName}</h3>
                                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                                            <Home size={16}/> House No: <span className="font-bold text-black">{record.houseNo}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{record.address}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm font-bold ${record.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {record.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">House Tax</p>
                                        <p className="text-lg font-bold">₹{record.houseTax}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Water Tax</p>
                                        <p className="text-lg font-bold">₹{record.waterTax}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-2 md:pt-0">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Total Due</p>
                                        <p className="text-xl font-bold text-[#0A4275]">₹{Number(record.houseTax) + Number(record.waterTax)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Due Date</p>
                                        <p className="text-sm font-medium text-red-500">{record.dueDate}</p>
                                    </div>
                                </div>
                                
                                {record.status === 'Pending' && (
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Please pay at Gram Panchayat Office before due date.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-8 rounded shadow text-center">
                        <AlertCircle size={48} className="mx-auto text-gray-300 mb-4"/>
                        <h3 className="text-xl font-bold text-gray-600">No Records Found</h3>
                        <p className="text-gray-500">No tax record found for "{searchTerm}". Please check the spelling or contact the Panchayat office.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default TaxList;