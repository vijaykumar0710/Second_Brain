import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import {
  Sparkles,
  ExternalLink,
  Share2,
  Trash2,
  Copy,
  MessageCircle,
  X,
} from "lucide-react";

export default function LinkCard({ link, token, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [localSummary, setLocalSummary] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target))
        setShowShare(false);
    };
    if (showShare) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showShare]);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/links/${link._id}/summarize`,
        {},
        { headers: { Authorization: token } },
      );
      setLocalSummary(res.data.aiSummary);
      setIsModalOpen(true);
    } catch (e) {
      alert("AI error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-fit flex flex-col">
        <div className="relative h-40 bg-slate-50 border-b">
          <img
            src={link.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={async () => {
              if (window.confirm("Delete?")) {
                await axios.delete(
                  `http://localhost:5000/api/links/${link._id}`,
                  { headers: { Authorization: token } },
                );
                onUpdate();
              }
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 text-red-500 shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-slate-800 text-[14px] mb-1 line-clamp-1">
            {link.title}
          </h3>
          <p className="text-slate-500 text-[11px] mb-4 line-clamp-2 leading-relaxed">
            {link.description}
          </p>

          {/* FIX: Button color changed to Gray-Slate style */}
          <button
            onClick={
              localSummary ? () => setIsModalOpen(true) : handleSummarize
            }
            disabled={loading}
            className={`w-full mb-3 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${localSummary ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-slate-700 text-white hover:bg-slate-800"}`}
          >
            {loading ? (
              <Sparkles size={14} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={14} />{" "}
                {localSummary ? "View Insights" : "AI Summarize"}
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-3 border-t mt-auto">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600"
            >
              <ExternalLink size={18} />
            </a>
            <div className="relative" ref={shareRef}>
              <button
                onClick={() => setShowShare(!showShare)}
                className={`p-1.5 rounded-full ${showShare ? "bg-slate-100 text-slate-600" : "text-slate-400 hover:bg-slate-50"}`}
              >
                <Share2 size={18} />
              </button>
              {showShare && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(link.url);
                      alert("Copied");
                      setShowShare(false);
                    }}
                    className="w-full px-3 py-2 text-[11px] hover:bg-slate-50 flex items-center gap-2 border-b"
                  >
                    <Copy size={14} /> Copy
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/?text=${link.url}`);
                      setShowShare(false);
                    }}
                    className="w-full px-3 py-2 text-[11px] hover:bg-slate-50 text-green-600 flex items-center gap-2"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FIX: Modal background and header color changed to Grayish */}
      {isModalOpen &&
        localSummary &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b bg-slate-50 text-slate-700 font-bold">
                <span className="flex items-center gap-2 text-slate-600">
                  <Sparkles size={18} /> AI Insights
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-slate-200 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {localSummary.split("\n").map((line, i) =>
                  line.trim().startsWith("-") ? (
                    <div
                      key={i}
                      className="flex gap-2 mb-2 items-start text-slate-700 text-[13px] leading-relaxed"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <p>{line.replace(/^-/, "").trim()}</p>
                    </div>
                  ) : line.trim() ? (
                    <p
                      key={i}
                      className="mb-4 font-bold text-slate-900 text-sm border-b pb-2 border-dashed border-slate-200"
                    >
                      {line}
                    </p>
                  ) : null,
                )}
              </div>
              <div className="p-4 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-1.5 bg-slate-600 text-white font-bold rounded-lg text-xs hover:bg-slate-700 transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
