import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData, BlogPost, Notice, Official } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Calendar, Tag, ChevronLeft, ChevronRight, Phone, MapPin, FileText } from 'lucide-react';

const Home: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setData(getStoredData());
  }, []);

  // Slider Auto-play
  useEffect(() => {
    if (!data || data.sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data]);

  if (!data) return <div>Loading...</div>;

  const latestPosts = data.posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  const committee = data.officials.filter(o => o.category === 'committee');
  const staff = data.officials.filter(o => o.category === 'staff');
  const activeTenders = data.tenders.filter(t => new Date(t.closingDate) >= new Date()).slice(0, 3);

  return (
    <div className="bg-gray-50 pb-12">
      {/* Hero Slider */}
      <div className="relative h-[300px] md:h-[500px] bg-gray-800 text-white overflow-hidden group">
        {data.sliderImages.length > 0 ? (
          data.sliderImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">No Images</div>
        )}
        
        {/* Slider Controls */}
        {data.sliderImages.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentSlide(prev => (prev === 0 ? data.sliderImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => (prev + 1) % data.sliderImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Notices Marquee */}
      <div className="bg-[#0A4275] text-white py-2 overflow-hidden border-b border-white/20">
        <div className="container mx-auto px-4 flex items-center">
          <span className="bg-[#FFC107] text-black text-xs font-bold px-3 py-1 rounded mr-4 shrink-0 uppercase">Latest Updates</span>
          <div className="marquee-container w-full overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee pl-full">
              {data.notices.map((notice) => (
                <span key={notice.id} className="mr-12 text-sm font-medium">
                  {notice.isNew && <span className="text-[#FFC107] mr-1 animate-pulse">●</span>}
                  {notice.text} <span className="text-gray-400 text-xs">({notice.date})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panchayat Committee Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-[#0A4275]">Panchayat Committee</h3>
          <p className="text-gray-600 mt-2">Elected Members & Representatives</p>
          <div className="w-20 h-1 bg-[#FFC107] mx-auto mt-4 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {committee.map((official) => (
            <div key={official.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col items-center p-6 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 mb-4 shadow-inner">
                 <img src={official.photo} alt={official.name} className="w-full h-full object-cover" />
              </div>
              <span className="bg-blue-50 text-[#0A4275] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">{official.role}</span>
              <h4 className="font-bold text-gray-800 text-lg mb-1">{official.name}</h4>
              {official.phone && (
                <a href={`tel:${official.phone}`} className="text-gray-500 text-sm flex items-center gap-1 hover:text-[#FFC107] transition">
                  <Phone size={14} /> {official.phone}
                </a>
              )}
               {official.address && (
                <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {official.address}
                </p>
              )}
            </div>
          ))}
          {committee.length === 0 && <p className="col-span-4 text-center text-gray-400">No Committee Members Added.</p>}
        </div>
      </section>

      {/* Admin & Staff Section */}
      <section className="bg-[#f2f6fa] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-[#0A4275]">Administrative Staff</h3>
             <div className="w-16 h-1 bg-gray-300 mx-auto mt-3 rounded"></div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((official) => (
              <div key={official.id} className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
                 <img src={official.photo} alt={official.name} className="w-16 h-16 rounded-full object-cover border" />
                 <div>
                    <h5 className="font-bold text-gray-800">{official.name}</h5>
                    <p className="text-sm text-[#0A4275] font-medium">{official.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{official.phone}</p>
                 </div>
              </div>
            ))}
             {staff.length === 0 && <p className="col-span-3 text-center text-gray-400">No Staff Members Added.</p>}
           </div>
        </div>
      </section>

      {/* Schemes & Services Highlight */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left: Schemes Tab */}
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold text-[#0A4275] mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#FFC107] block rounded-sm"></span>
              Key Government Schemes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.schemes.slice(0, 4).map((scheme) => (
                <div key={scheme.id} className="bg-white p-5 rounded border-l-4 border-green-500 shadow-sm hover:shadow-md transition">
                  <h4 className="font-bold text-gray-800 mb-2">{scheme.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{scheme.description}</p>
                  <div className="flex justify-between items-center mt-2">
                     <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">For: {scheme.beneficiaries}</span>
                     {scheme.link && (
                       <a href={scheme.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline">Apply / View</a>
                     )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Active Tenders Preview */}
            {activeTenders.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-[#0A4275] mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#FFC107] block rounded-sm"></span>
                        Open Tenders
                    </h3>
                    <div className="bg-white rounded-lg shadow border border-gray-100 divide-y">
                        {activeTenders.map(t => (
                            <Link to="/tenders" key={t.id} className="flex justify-between items-center p-4 hover:bg-gray-50 group">
                                <div>
                                    <h5 className="font-bold text-gray-800 group-hover:text-[#0A4275]">{t.title}</h5>
                                    <p className="text-xs text-gray-500">Ref: {t.refNumber} | Closing: {t.closingDate}</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#FFC107]"/>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 text-right">
              <Link to="/schemes" className="text-[#0A4275] font-bold hover:underline inline-flex items-center gap-1">View All Schemes <ArrowRight size={16}/></Link>
            </div>
          </div>

          {/* Right: Downloads/Meetings */}
          <div className="w-full md:w-1/3">
             <h3 className="text-2xl font-bold text-[#0A4275] mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#FFC107] block rounded-sm"></span>
              Important Downloads & Meetings
            </h3>
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              {data.meetings.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-bold text-gray-700 border-b pb-2 mb-2">Upcoming/Recent Sabhas</h5>
                  {data.meetings.slice(0,3).map(m => (
                    <div key={m.id} className="py-2 border-b border-gray-100 last:border-0">
                       <div className="flex items-start gap-3">
                         <div className="bg-blue-100 text-[#0A4275] p-2 rounded text-center min-w-[50px]">
                           <span className="block text-xs font-bold">{m.date.split('-')[1]}</span>
                           <span className="block text-lg font-bold leading-none">{m.date.split('-')[2]}</span>
                         </div>
                         <div>
                           <p className="font-bold text-sm">{m.title}</p>
                           <p className="text-xs text-gray-500">{m.type}</p>
                         </div>
                       </div>
                       {/* Show Meeting Photos if any */}
                       {m.photos && m.photos.length > 0 && (
                           <div className="flex gap-1 mt-2 pl-[62px]">
                               {m.photos.slice(0,3).map((p,i) => (
                                   <img key={i} src={p} alt="Meeting" className="w-10 h-10 object-cover rounded border" />
                               ))}
                           </div>
                       )}
                    </div>
                  ))}
                </div>
              )}
              
              <h5 className="font-bold text-gray-700 border-b pb-2 mb-2">Application Forms</h5>
              <div className="divide-y">
                {['Birth Certificate Form', 'Residence Certificate', 'Marriage Registration'].map((item, idx) => (
                  <a key={idx} href="#" className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 group">
                    <span className="text-gray-700 text-sm font-medium group-hover:text-[#0A4275]">{item}</span>
                    <Download size={16} className="text-gray-400 group-hover:text-[#FFC107]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Blog Posts */}
      <div className="bg-white py-12 mt-8">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-bold text-[#0A4275] flex items-center gap-2">
              <span className="w-2 h-8 bg-[#FFC107] block rounded-sm"></span>
              Latest News & Updates
            </h3>
            <Link to="/blog" className="hidden md:block px-4 py-2 border border-[#0A4275] text-[#0A4275] rounded hover:bg-[#0A4275] hover:text-white transition">View All News</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300">
                  <div className="h-48 overflow-hidden">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                      <span className="flex items-center gap-1"><Tag size={12}/> {post.category}</span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-[#0A4275] line-clamp-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
                    <span className="text-[#0A4275] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition">Read More <ArrowRight size={14}/></span>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;