import React, { useEffect, useState } from 'react';
import { getStoredData, saveStoredData, fileToBase64 } from '../../services/storage';
import { AppData } from '../../types';
import { Trash2, Upload, Image } from 'lucide-react';

const ManageGallery: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      
      const currentData = getStoredData();
      const newData = { ...currentData, gallery: [base64, ...(currentData.gallery || [])] };
      
      saveStoredData(newData);
      setData(newData);
    }
  };

  const handleDelete = (index: number) => {
    // Popup removed to ensure deletion works immediately like Slider
    setData(prev => {
        if (!prev) return null;
        const updatedGallery = prev.gallery.filter((_, i) => i !== index);
        const newData = { ...prev, gallery: updatedGallery };
        saveStoredData(newData);
        return newData;
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Photo Gallery</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
         <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-blue-300 rounded cursor-pointer hover:bg-blue-50 transition">
             <Upload size={32} className="text-[#0A4275] mb-2" />
             <span className="text-gray-600 font-medium">Click to Upload New Photo</span>
             <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
         </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {(data.gallery || []).map((img, idx) => (
             <div key={idx} className="relative group rounded overflow-hidden shadow border">
                 <img src={img} alt="Gallery" className="w-full h-40 object-cover" />
                 <button 
                    type="button"
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        handleDelete(idx); 
                    }} 
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded shadow opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Delete Image"
                >
                    <Trash2 size={16}/>
                 </button>
             </div>
         ))}
         {(!data.gallery || data.gallery.length === 0) && <p className="col-span-4 text-center text-gray-400">Gallery is empty.</p>}
      </div>
    </div>
  );
};

export default ManageGallery;