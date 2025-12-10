import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { Image as ImageIcon } from 'lucide-react';

const Gallery: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Photo Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Glimpses of development works, events, and village life.</p>
        </div>

        {data.gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.gallery.map((img, idx) => (
                    <div 
                        key={idx} 
                        className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square bg-gray-200"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img 
                            src={img} 
                            alt={`Gallery ${idx}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="text-white" size={32}/>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500 bg-white rounded shadow">
                Gallery is empty.
            </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                <div className="relative max-w-5xl max-h-screen">
                    <img src={selectedImage} alt="Full View" className="max-w-full max-h-[90vh] rounded shadow-2xl" />
                    <button 
                        className="absolute -top-10 right-0 text-white font-bold text-xl hover:text-gray-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        Close [X]
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;