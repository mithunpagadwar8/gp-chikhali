import React, { useEffect, useState } from 'react';
import { getStoredData } from '../../services/storage';
import { AppData, BlogPost, CATEGORIES } from '../../types';
import { Link } from 'react-router-dom';
import { Search, Calendar, Tag, User } from 'lucide-react';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const data = getStoredData();
    const published = data.posts.filter(p => p.status === 'published').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPosts(published);
    setFilteredPosts(published);
  }, []);

  useEffect(() => {
    let result = posts;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPosts(result);
  }, [category, searchTerm, posts]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A4275] mb-4">Village News & Updates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay informed about the latest development works, announcements, and events happening in Gram Panchayat Chikhali.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
             <button 
                onClick={() => setCategory('All')} 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${category === 'All' ? 'bg-[#0A4275] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)} 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${category === cat ? 'bg-[#0A4275] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A4275]"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full border border-gray-100">
                <Link to={`/blog/${post.id}`} className="block h-56 overflow-hidden relative group">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-[#FFC107] text-black text-xs font-bold px-3 py-1 rounded shadow">
                    {post.category}
                  </div>
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-[#0A4275] transition line-clamp-2">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                    {post.content}
                  </p>
                  <Link to={`/blog/${post.id}`} className="text-center w-full py-2 border border-[#0A4275] text-[#0A4275] font-semibold rounded hover:bg-[#0A4275] hover:text-white transition">
                    Read Full Story
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
