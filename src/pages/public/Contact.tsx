import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData } from '../../types';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  if (!data) return <div className="p-12 text-center">Loading...</div>;
  const { contact } = data;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Contact Us</h1>
          <p className="text-gray-600">Reach out to the Gram Panchayat for any queries or assistance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Get in Touch</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-[#0A4275] shrink-0">
                            <MapPin size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Office Address</h4>
                            <p className="text-gray-600">{contact?.address || 'Gram Panchayat Office, Chikhali'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-[#0A4275] shrink-0">
                            <Phone size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Phone Number</h4>
                            <p className="text-gray-600">{contact?.phone || 'Not Available'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-[#0A4275] shrink-0">
                            <Mail size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Email Address</h4>
                            <p className="text-gray-600">{contact?.email || 'Not Available'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-[#0A4275] shrink-0">
                            <Clock size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Office Hours</h4>
                            <p className="text-gray-600">Monday - Saturday: 10:00 AM - 5:30 PM</p>
                            <p className="text-gray-500 text-sm">Sunday Closed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden h-[400px] md:h-auto">
                 <iframe 
                    title="Gram Panchayat Map"
                    src={contact?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.273673756286!2d73.8099!3d18.6517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b84576326d97%3A0x6338081604179374!2sChikhali%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1633000000000!5m2!1sen!2sin"}
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy"
                ></iframe>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;