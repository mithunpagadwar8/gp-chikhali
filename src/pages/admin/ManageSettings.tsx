import React, { useEffect, useState } from "react";
import { AppData, ContactDetails } from "../../types";
import { getStoredData, setStoredData } from "../../services/storage";
import { Trash2, Upload, Eye, Lock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ManageSettings: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [contactForm, setContactForm] = useState<ContactDetails>({ address: '', phone: '', email: '', mapUrl: '' });

  // Security State
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [credMsg, setCredMsg] = useState('');

  useEffect(() => {
    const d = getStoredData();
    setData(d);
    if (d.contact) setContactForm(d.contact);
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      const currentData = getStoredData();
      const newData = { ...currentData, logo: base64 };
      saveStoredData(newData);
      setData(newData);
    }
  };

  const handleSliderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      const currentData = getStoredData();
      const newData = { ...currentData, sliderImages: [...currentData.sliderImages, base64] };
      saveStoredData(newData);
      setData(newData);
    }
  };

  const deleteSliderImage = (index: number) => {
    const currentData = getStoredData();
    const newSlider = currentData.sliderImages.filter((_, i) => i !== index);
    const newData = { ...currentData, sliderImages: newSlider };
    saveStoredData(newData);
    setData(newData);
  };

  const handleChangeCredentials = () => {
    if (!newUser || !newPass) {
      setCredMsg('Username and Password required.');
      return;
    }
    if (newPass !== confirmPass) {
      setCredMsg('Passwords do not match.');
      return;
    }
    updateCredentials(newUser, newPass);
    setCredMsg('Credentials updated successfully! Use these next time.');
    setNewUser('');
    setNewPass('');
    setConfirmPass('');
  };

  const saveContactInfo = () => {
    setData((prev) => {
      if (!prev) return null;
      const newData = { ...prev, contact: contactForm };
      saveStoredData(newData);
      return newData;
    });
    alert('Contact Information Updated!');
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
        <Link
          to="/"
          target="_blank"
          className="bg-[#FFC107] text-black px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-400"
        >
          <Eye size={18} /> View Live Site
        </Link>
      </div>

      {/* Admin Security */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-[#0A4275]">
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
          <Lock size={20} className="text-[#0A4275]" /> Admin Security
        </h3>
        <p className="text-sm text-gray-600 mb-4">Change your login credentials here. Default is (admin / admin123).</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">New Username</label>
            <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleChangeCredentials} className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-black text-sm">
            Update Credentials
          </button>
          {credMsg && (
            <span className={`text-sm font-bold ${credMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{credMsg}</span>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
          <MapPin size={20} className="text-[#0A4275]" /> Contact Information (For Footer & Contact Page)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-600 mb-1">Office Address</label>
            <input type="text" value={contactForm.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label>
            <input type="text" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Email Address</label>
            <input type="text" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full border p-2 rounded" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-600 mb-1">Google Maps Embed URL (src="..." only)</label>
            <input
              type="text"
              value={contactForm.mapUrl}
              onChange={(e) => setContactForm({ ...contactForm, mapUrl: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="https://www.google.com/maps/embed?..."
            />

            {/* FIXED JSX SAFE LINE */}
            <p className="text-xs text-gray-400 mt-1">
              Copy the 'src' link from Google Maps -&gt; Share -&gt; Embed a map.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={saveContactInfo} className="bg-[#0A4275] text-white px-4 py-2 rounded font-bold hover:bg-blue-900 text-sm">
            Save Contact Info
          </button>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Website Logo</h3>

        <div className="flex items-center gap-8">
          <div className="border p-2 rounded bg-gray-50">
            <img src={data.logo} alt="Current Logo" className="h-24 w-auto object-contain" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-600">Upload New Logo</label>

            <label className="inline-flex items-center gap-2 cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded border border-blue-200 hover:bg-blue-100 font-medium">
              <Upload size={18} /> Choose File
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>

            <p className="text-xs text-gray-400 mt-2">Recommended: PNG format, Transparent background.</p>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Homepage Slider Images</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {data.sliderImages.map((img, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border shadow-sm">
              <img src={img} alt={`Slide ${idx}`} className="w-full h-40 object-cover" />

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  deleteSliderImage(idx);
                }}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-700 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-[#0A4275] transition">
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-gray-500 font-medium">Add Slide Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleSliderUpload} />
          </label>
        </div>

        <p className="text-sm text-gray-500">Note: Use landscape images (16:9 aspect ratio) for best results.</p>
      </div>
    </div>
  );
};

export default ManageSettings;
