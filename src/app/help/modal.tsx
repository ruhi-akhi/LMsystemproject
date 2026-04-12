"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePhotograph } from "react-icons/hi";
import { FiX, FiChevronDown, FiAlertCircle } from "react-icons/fi";
import { MdCheckCircleOutline } from "react-icons/md";

type PostType = "Course Topics" | "Bug Report" | "Feature Request" | "Announcement" | "Other";

type MediaPreview = {
  file: File;
  url: string;
};

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postType, setPostType] = useState<PostType>("Course Topics");
  const [tags, setTags] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);

  const postTypes: PostType[] = ["Course Topics", "Bug Report", "Feature Request", "Announcement", "Other"];

  const postTypeColors: Record<PostType, { bg: string; text: string; icon: string }> = {
    "Course Topics": { bg: "bg-blue-500/20", text: "text-blue-400", icon: "📚" },
    "Bug Report": { bg: "bg-red-500/20", text: "text-red-400", icon: "🐛" },
    "Feature Request": { bg: "bg-green-500/20", text: "text-green-400", icon: "✨" },
    "Announcement": { bg: "bg-purple-500/20", text: "text-purple-400", icon: "📢" },
    "Other": { bg: "bg-gray-500/20", text: "text-gray-400", icon: "💬" },
  };

  const createPreview = (file: File): MediaPreview => {
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.push(url);
    return { file, url };
  };

  const getValidFiles = (files: File[]): File[] => files.filter((f) => {
    const maxSize = f.type.startsWith("image/") ? 5 * 1024 * 1024 : 30 * 1024 * 1024;
    return f.size <= maxSize;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    const validFiles = getValidFiles(files);
    if (!validFiles.length) return;

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews((prev) => [...prev, ...validFiles.map(createPreview)]);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const pastedFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    const validFiles = getValidFiles(pastedFiles);
    if (!validFiles.length) return;

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews((prev) => [...prev, ...validFiles.map(createPreview)]);
  };

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  const handleSubmit = async (): Promise<void> => {
    if (!content.trim() || !title.trim()) {
      return;
    }

    setSubmitting(true);
    const postData = {
      title: title.trim(),
      content: content.trim(),
      postType,
      tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
      mediaFiles,
      createdAt: new Date().toISOString(),
    };

    console.log("Submitting Post Data:", postData);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে! 🎉");
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const removeMedia = (idx: number): void => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setMediaPreviews((prev) => {
      const removed = prev[idx];
      if (removed) URL.revokeObjectURL(removed.url);
      previewUrlsRef.current = prev.filter((_, i) => i !== idx).map((item) => item.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const charCount = content.length;
  const titleCharCount = title.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.3s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Create a New Post</h2>
            <p className="text-sm text-gray-400">Share your thoughts, questions, or ideas with the community</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-2 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Post Type Selection */}
          <div>
            <label className="text-xs font-bold text-gray-300 mb-2 block uppercase tracking-wider">
              Post Category
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown((p) => !p)}
                className={`w-full px-4 py-3 rounded-lg font-bold text-sm flex justify-between items-center transition border ${postTypeColors[postType].bg
                  } ${postTypeColors[postType].text} border-white/10 hover:border-white/20`}
              >
                <span className="flex items-center gap-2">
                  {postTypeColors[postType].icon} {postType}
                </span>
                <FiChevronDown
                  className={`transition-transform ${showTypeDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full mt-2 w-full bg-slate-700/80 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden z-10 shadow-xl">
                  {postTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setPostType(t);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-white/10 transition flex items-center gap-2 ${postType === t ? "bg-white/20 text-white" : "text-gray-300"
                        }`}
                    >
                      {postTypeColors[t].icon} {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Title</label>
              <span className={`text-xs font-semibold ${titleCharCount > 100 ? "text-yellow-400" : "text-gray-500"}`}>
                {titleCharCount}/120
              </span>
            </div>
            <input
              type="text"
              placeholder="What's your post about? Be clear and specific..."
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 120))}
              className="w-full bg-slate-600/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-500/50 focus:bg-slate-600/50 transition"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-gray-300 mb-2 block uppercase tracking-wider">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., inventory, ui, bug, feature..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-600/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-500/50 focus:bg-slate-600/50 transition"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Description</label>
              <span className={`text-xs font-semibold ${charCount > 1000 ? "text-yellow-400" : "text-gray-500"}`}>
                {charCount}/2000
              </span>
            </div>
            <textarea
              placeholder="Provide detailed information about your post. Include what you tried, what happened, and what you expected..."
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 2000))}
              onPaste={handlePaste}
              rows={7}
              className="w-full bg-slate-600/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-purple-500/50 focus:bg-slate-600/50 transition resize-none"
            />
          </div>

          {/* Info Messages */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-2 text-sm">
            <FiAlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-blue-200">
              You can paste images directly from your clipboard (Ctrl+V or Cmd+V). Max 5MB per image, 30MB per video.
            </p>
          </div>

          {/* Media Preview */}
          {mediaPreviews.length > 0 && (
            <div className="bg-slate-600/20 border border-white/10 rounded-lg p-4">
              <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">Attached Media ({mediaPreviews.length})</h4>
              <div className="flex flex-wrap gap-3">
                {mediaPreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative group w-24 h-24 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition"
                  >
                    {preview.file.type.startsWith("image/") ? (
                      <img
                        src={preview.url}
                        alt={`${preview.file.name} preview`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">Video</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      aria-label="Remove media"
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-700/30 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition"
          >
            <HiOutlinePhotograph size={20} /> Add Media
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() || !title.trim() || submitting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${submitted
              ? "bg-green-600 text-white"
              : content.trim() && title.trim()
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                : "bg-slate-600/50 text-gray-400 cursor-not-allowed"
              }`}
          >
            {submitted ? (
              <>
                <MdCheckCircleOutline size={18} /> Posted Successfully!
              </>
            ) : submitting ? (
              <>
                <span className="inline-block animate-spin">⏳</span> Publishing...
              </>
            ) : (
              <>Published Post</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CreatePostModal;