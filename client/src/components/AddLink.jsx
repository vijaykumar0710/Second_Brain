import React, { useState } from "react";
import axios from "axios";
import { Plus, Link as LinkIcon, Type, AlertCircle } from "lucide-react";

export default function AddLink({ token, onLinkAdded }) {
  const [url, setUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // Error state for invalid URL

  // Naya aur Strict URL Validation Function
  const isValidUrl = (urlString) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol (http ya https)
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name (must have a dot like .com)
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // ya phir ek IP address ho
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port aur path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i", // fragment locator
    );
    return !!urlPattern.test(urlString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();

    // Auto-prepend 'https://' if the user forgot it (e.g., typed 'youtube.com')
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    // Check if it's a valid format
    if (!isValidUrl(finalUrl)) {
      setError(true);
      // Remove error UI after 3 seconds
      setTimeout(() => setError(false), 3000);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      await axios.post(
        "https://second-brain-0nq1.onrender.com/api/links",
        { url: finalUrl, customTitle },
        { headers: { Authorization: token } },
      );
      setUrl("");
      setCustomTitle("");
      onLinkAdded();
    } catch (e) {
      alert("Failed to save link. Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full relative"
    >
      {/* URL INPUT */}
      <div className="flex-2 relative">
        {error ? (
          <AlertCircle
            className="absolute left-3 top-2.5 text-red-500 animate-pulse"
            size={14}
          />
        ) : (
          <LinkIcon
            className="absolute left-3 top-2.5 text-slate-400"
            size={14}
          />
        )}
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(false); // Typing clears the error
          }}
          placeholder={
            error
              ? "Please enter a valid URL!"
              : "Paste URL here (e.g., https://...)"
          }
          className={`w-full pl-9 pr-4 py-2 bg-white border rounded-xl outline-none text-xs font-medium shadow-sm transition-all duration-300 ${
            error
              ? "border-red-500 focus:border-red-500 text-red-600 placeholder-red-400 bg-red-50"
              : "border-slate-200 focus:border-indigo-500"
          }`}
          required
        />
      </div>

      {/* TITLE INPUT (OPTIONAL) */}
      <div className="flex-1 relative">
        <Type className="absolute left-3 top-2.5 text-slate-400" size={14} />
        <input
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Title (Optional)"
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium shadow-sm transition-all"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        disabled={loading || error}
        className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${
          error
            ? "bg-red-500 text-white cursor-not-allowed"
            : "bg-slate-900 hover:bg-black text-white"
        }`}
      >
        {loading ? (
          "Saving..."
        ) : (
          <>
            <Plus size={16} className="inline" /> Save
          </>
        )}
      </button>
    </form>
  );
}
