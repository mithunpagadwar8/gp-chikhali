import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { uploadFile, deleteFile } from "../../services/firebaseStorage";
import { Plus, Edit, Trash2, X, Upload, Video } from "lucide-react";

/* ================= TYPES ================= */

export type BlogPost = {
  id?: string;
  title: string;
  category: string;
  content: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  status: "draft" | "published";
  date: string;
  author?: string;
  youtubeUrl?: string;
  videoUrl?: string;
};

export const CATEGORIES = [
  "General",
  "Announcements",
  "Government Schemes",
  "Projects",
  "Agriculture",
  "Health",
  "Education",
  "Events",
];

/* ================= COMPONENT ================= */

const ManageBlogs: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const initialForm: BlogPost = {
    title: "",
    category: CATEGORIES[0],
    content: "",
    thumbnail: "",
    images: [],
    tags: [],
    status: "draft",
    date: new Date().toISOString().split("T")[0],
    author: "Admin",
    youtubeUrl: "",
    videoUrl: "",
  };

  const [form, setForm] = useState<BlogPost>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);

  /* ================= FETCH BLOGS ================= */

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));

    getDocs(q)
      .then((snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as BlogPost),
        }));
        setPosts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= UPLOADS ================= */

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const url = await uploadFile(file, "thumbnails", setUploadProgress);
      setForm((f) => ({ ...f, thumbnail: url }));
    } finally {
      setTimeout(() => setUploadProgress(null), 800);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(0, 6);
    const urls: string[] = [];

    try {
      setUploadProgress(0);
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], "images");
        urls.push(url);
      }
      setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }));
    } finally {
      setTimeout(() => setUploadProgress(null), 800);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setVideoUploadProgress(0);
      const url = await uploadFile(file, "videos", setVideoUploadProgress);
      setForm((f) => ({ ...f, videoUrl: url }));
    } finally {
      setTimeout(() => setVideoUploadProgress(null), 800);
    }
  };

  /* ================= SAVE / DELETE ================= */

  const handleSave = async () => {
    if (isEditing && form.id) {
      await updateDoc(doc(db, "blogs", form.id), form);
    } else {
      await addDoc(collection(db, "blogs"), {
        ...form,
        createdAt: Timestamp.now(),
      });
    }
    window.location.reload();
  };

  const handleDelete = async (post: BlogPost) => {
    if (!post.id) return;
    await deleteDoc(doc(db, "blogs", post.id));

    if (post.thumbnail) await deleteFile(post.thumbnail);
    if (post.videoUrl) await deleteFile(post.videoUrl);
  };

  /* ================= UI (MINIMAL) ================= */

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>

      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2">
        Save Blog
      </button>

      <input type="file" onChange={handleThumbnailUpload} />
      <input type="file" multiple onChange={handleGalleryUpload} />
      <input type="file" accept="video/*" onChange={handleVideoUpload} />

      {posts.map((p) => (
        <div key={p.id} className="border p-2 mt-2 flex gap-2">
          <span>{p.title}</span>
          <button onClick={() => handleDelete(p)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageBlogs;
