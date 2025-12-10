
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
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../services/firebase"; // <-- adjust path if needed
import { Plus, Edit, Trash2, X, Upload, Video } from "lucide-react";

///// Types & constants (you can move these to src/types.ts if preferred) /////
export type BlogPost = {
  id?: string;
  title: string;
  category: string;
  content: string;
  thumbnail?: string; // URL
  images?: string[]; // gallery URLs
  tags?: string[];
  status: "draft" | "published";
  date: string; // YYYY-MM-DD
  author?: string;
  youtubeUrl?: string;
  videoUrl?: string; // storage URL
};

export type AppData = {
  posts: BlogPost[];
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

///// Component /////
const ManageBlogs: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialForm: BlogPost = {
    title: "",
    category: CATEGORIES[0] || "General",
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

  const [form, setForm] = useState<BlogPost>({ ...initialForm });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");

  // fetch posts from Firestore
  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    getDocs(q)
      .then((snap) => {
        const arr: BlogPost[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title || "",
            category: data.category || CATEGORIES[0],
            content: data.content || "",
            thumbnail: data.thumbnail || "",
            images: data.images || [],
            tags: data.tags || [],
            status: data.status || "draft",
            date: data.date || new Date().toISOString().split("T")[0],
            author: data.author || "Admin",
            youtubeUrl: data.youtubeUrl || "",
            videoUrl: data.videoUrl || "",
          };
        });
        setPosts(arr);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helpers: upload file to firebase storage and return URL
  const uploadFile = (file: File, pathPrefix: string, onProgress?: (p: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileName = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const sRef = storageRef(storage, fileName);
      const uploadTask = uploadBytesResumable(sRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          if (onProgress) onProgress(0);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  };

  // Thumbnail upload (single image)
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // optional: validate size & type
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file for thumbnail.");
      return;
    }
    try {
      setUploadProgress(0);
      const url = await uploadFile(file, "thumbnails", (p) => setUploadProgress(p));
      setForm((f) => ({ ...f, thumbnail: url }));
    } catch (err) {
      console.error(err);
      alert("Thumbnail upload failed.");
    } finally {
      setTimeout(() => setUploadProgress(null), 800);
    }
  };

  // Gallery images upload (multiple)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const filesArr = Array.from(files).slice(0, 6); // limit to 6 images for performance
    try {
      setUploadProgress(0);
      const uploadedUrls: string[] = [];
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        if (!file.type.startsWith("image/")) continue;
        // track individual progress roughly
        const url = await uploadFile(file, "images", (p) => setUploadProgress(Math.round(((i + p / 100) / filesArr.length) * 100)));
        uploadedUrls.push(url);
      }
      setForm((f) => ({ ...f, images: [...(f.images || []), ...uploadedUrls] }));
    } catch (err) {
      console.error(err);
      alert("Gallery upload failed.");
    } finally {
      setTimeout(() => setUploadProgress(null), 800);
    }
  };

  // Video upload (direct to storage)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // validate
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }
    // file size limit (example 1000 MB = 1GB)
    const maxBytes = 1000 * 1024 * 1024;
    if (file.size > maxBytes) {
      const confirmProceed = window.confirm("Selected video is larger than 1000MB. Upload may fail. Continue?");
      if (!confirmProceed) return;
    }
    try {
      setVideoUploadProgress(0);
      const url = await uploadFile(file, "videos", (p) => setVideoUploadProgress(p));
      // Clear youtubeUrl if video uploaded (use either video or youtube)
      setForm((f) => ({ ...f, videoUrl: url, youtubeUrl: "" }));
    } catch (err) {
      console.error(err);
      alert("Video upload failed.");
    } finally {
      setTimeout(() => setVideoUploadProgress(null), 800);
    }
  };

  // Remove image / thumbnail / video from storage optionally
  const deleteStorageObjectByUrl = async (fileUrl?: string) => {
    if (!fileUrl) return;
    try {
      // convert download URL to storage ref path - Firebase doesn't expose direct path in URL reliably
      // Here we attempt to derive path; if not possible, skip deletion.
      const u = new URL(fileUrl);
      const pathSegment = decodeURIComponent(u.pathname || "");
      // NOTE: This method may not work for all hosting setups. If you have the storage path saved separately, use that instead.
      // We'll skip delete if we cannot reliably derive the ref path.
      // For safety: do not attempt unsafe deletions.
    } catch (err) {
      // ignore
    }
  };

  // Add tag
  const addTag = () => {
    const t = (tagInput || "").trim();
    if (!t) return;
    if ((form.tags || []).includes(t)) {
      setTagInput("");
      return;
    }
    setForm((f) => ({ ...f, tags: [...(f.tags || []), t] }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: (f.tags || []).filter((t) => t !== tag) }));
  };

  // Save (create or update) to Firestore
  const handlePublish = async (publishAs: "published" | "draft" = "published") => {
    if (!form.title?.trim()) return alert("Please add a title.");
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        content: form.content,
        thumbnail: form.thumbnail || "",
        images: form.images || [],
        tags: form.tags || [],
        status: publishAs,
        date: form.date || new Date().toISOString().split("T")[0],
        author: form.author || "Admin",
        youtubeUrl: form.youtubeUrl || "",
        videoUrl: form.videoUrl || "",
        updatedAt: Timestamp.now(),
      };

      if (isEditing && form.id) {
        // update existing
        const docRef = doc(db, "blogs", form.id);
        await updateDoc(docRef, payload);
        // update local state
        setPosts((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...payload } as BlogPost : p)));
      } else {
        // create new
        const created = await addDoc(collection(db, "blogs"), payload);
        const newPost: BlogPost = { ...(payload as any), id: created.id } as BlogPost;
        setPosts((prev) => [newPost, ...prev]);
      }

      // reset form
      setForm({ ...initialForm, date: new Date().toISOString().split("T")[0] });
      setIsEditing(false);
      alert("Saved successfully.");
    } catch (err) {
      console.error("Failed to save post:", err);
      alert("Failed to save. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: BlogPost) => {
    setForm({ ...p });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "blogs", id));
      setPosts((prev) => prev.filter((x) => x.id !== id));
      alert("Deleted.");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  // remove gallery image from form (note: does not delete from storage)
  const removeGalleryImageFromForm = (url: string) => {
    setForm((f) => ({ ...f, images: (f.images || []).filter((u) => u !== url) }));
  };

  // Cancel editing/new
  const cancelEdit = () => {
    setForm({ ...initialForm, date: new Date().toISOString().split("T")[0] });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setForm({ ...initialForm });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-[#0A4275] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {isEditing && (
        <section className="bg-white p-6 rounded shadow">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border rounded p-2"
                placeholder="Post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border rounded p-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Content</label>
              <textarea
                rows={8}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full border rounded p-2"
                placeholder="Write content (basic HTML allowed)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail</label>
              <div className="flex gap-3 items-center">
                {form.thumbnail ? (
                  <img src={form.thumbnail} alt="thumb" className="h-20 w-28 object-cover rounded border" />
                ) : (
                  <div className="h-20 w-28 bg-gray-50 flex items-center justify-center rounded border text-sm text-gray-400">No thumb</div>
                )}
                <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
                  <Upload size={16} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </label>
              </div>
              {uploadProgress !== null && <div className="text-xs text-gray-500 mt-1">Upload: {uploadProgress}%</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Images (Gallery)</label>
              <div className="flex gap-3 mb-2">
                <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
                  <Upload size={16} /> Choose Images
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                </label>
                <div className="text-sm text-gray-500 self-center">You can upload up to 6 images.</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(form.images || []).map((u) => (
                  <div key={u} className="relative">
                    <img src={u} className="h-16 w-20 object-cover rounded border" />
                    <button onClick={() => removeGalleryImageFromForm(u)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL (optional)</label>
              <input
                value={form.youtubeUrl}
                onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value, videoUrl: "" }))}
                placeholder="https://youtube.com/..."
                className="w-full border rounded p-2"
              />
              <p className="text-xs text-gray-400 mt-1">If a direct video is uploaded, YouTube URL will be ignored.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Or Upload Video (optional)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
                  <Video size={16} /> Choose Video
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
                {videoUploadProgress !== null && <div className="text-xs text-gray-500">Uploading: {videoUploadProgress}%</div>}
                {form.videoUrl && <div className="text-xs text-green-600">Video uploaded</div>}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  className="border rounded p-1"
                />
                <button type="button" onClick={addTag} className="bg-gray-200 px-3 py-1 rounded text-sm">Add</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(form.tags || []).map((t) => (
                  <span key={t} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-xs">
                    {t}
                    <button onClick={() => removeTag(t)} className="ml-1"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button onClick={cancelEdit} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={() => handlePublish("draft")} className="px-4 py-2 border rounded">Save Draft</button>
            <button onClick={() => handlePublish("published")} className="px-4 py-2 bg-yellow-400 rounded font-bold">Publish</button>
          </div>
        </section>
      )}

      <section>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No posts found.</td></tr>
              ) : posts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-sm text-gray-600">{p.category}</td>
                  <td className="p-3 text-sm text-gray-500">{p.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManageBlogs;
