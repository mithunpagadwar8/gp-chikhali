import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getStoredData } from '../services/storage';
import { AppData } from '../types';

const Footer: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  return (
    <footer className="bg-[#1a202c] text-white border-t-4 border-[#FFC107]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFC107] uppercase">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#FFC107] shrink-0" size={18} />
                <p>{data?.contact?.address || 'Gram Panchayat Chikhali, Pune'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[#FFC107] shrink-0" size={18} />
                <p>{data?.contact?.phone || 'Not Available'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[#FFC107] shrink-0" size={18} />
                <p>{data?.contact?.email || 'Not Available'}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFC107] uppercase">Important Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="https://egramswaraj.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">eGramSwaraj Portal</a></li>
              <li><a href="https://panchayat.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">Ministry of Panchayati Raj</a></li>
              <li><a href="https://rural.nic.in/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">Ministry of Rural Development</a></li>
              <li><a href="https://maharashtra.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">Govt of Maharashtra</a></li>
            </ul>
          </div>

          {/* Column 3: Map */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FFC107] uppercase">Locate Us</h3>
            <div className="w-full h-40 bg-gray-700 rounded overflow-hidden">
               <iframe 
                title="Map"
                src={data?.contact?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.273673756286!2d73.8099!3d18.6517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b84576326d97%3A0x6338081604179374!2sChikhali%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1633000000000!5m2!1sen!2sin"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
      <div className="bg-[#0f131a] py-4 text-center text-xs text-gray-500">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Gram Panchayat Chikhali. All Rights Reserved.</p>
          <p className="mt-1">Content Owned by Gram Panchayat Administration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;