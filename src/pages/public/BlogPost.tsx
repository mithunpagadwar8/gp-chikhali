import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoredData } from '../../services/storage';
import { BlogPost } from '../../types';
import { Calendar, Tag, User, ArrowLeft, Share2 } from 'lucide-react';

const BlogPostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const data = getStoredData();
    const found = data.posts.find(p => p.id === id);
    setPost(found || null);
  }, [id]);

  if (!post) return <div className="p-20 text-center">Loading or Post not found...</div>;

  // Simple parser for YouTube URL to Embed URL
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const youtubeEmbed = post.youtubeUrl ? getEmbedUrl(post.youtubeUrl) : null;

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-[#0A4275] mb-6 font-medium">
          <ArrowLeft size={18} className="mr-2" /> Back to News
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header Image */}
          <div className="h-[300px] md:h-[400px] w-full overflow-hidden">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
              <span className="bg-blue-100 text-[#0A4275] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">{post.category}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
              <span className="flex items-center gap-2"><User size={16} /> Posted by {post.author}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A4275] mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
              {post.content}
            </div>

            {/* Media Gallery */}
            {post.images.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#FFC107] pl-3">Photo Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-lg w-full h-64 object-cover shadow-sm hover:shadow-md transition" />
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {(post.videoUrl || youtubeEmbed) && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-[#FFC107] pl-3">Video Highlights</h3>
                {youtubeEmbed && (
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <iframe src={youtubeEmbed} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-96 rounded-lg shadow-lg"></iframe>
                  </div>
                )}
                {post.videoUrl && (
                  <video controls className="w-full rounded-lg shadow-lg">
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-500 mr-2 flex items-center"><Tag size={16}/> Tags:</span>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 cursor-default">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostView;
