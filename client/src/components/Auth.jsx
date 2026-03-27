import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Brain,
  Zap,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Sun,
  Moon,
  CloudSun,
  Layers,
  Share2,
  Bookmark,
} from "lucide-react";

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [timePhrase, setTimePhrase] = useState("");
  const [greetIcon, setGreetIcon] = useState(<Sun />);

  // --- 🌟 100% DYNAMIC BACKGROUND STATE (JS Driven) 🌟 ---
  const [animTime, setAnimTime] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animateBlobs = () => {
      setAnimTime((prev) => prev + 0.005); // Speed of the floating blobs
      animationFrameId = requestAnimationFrame(animateBlobs);
    };
    animateBlobs();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- DYNAMIC GREETING LOGIC ---
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimePhrase("Good Morning");
        setGreetIcon(<Coffee className="text-orange-400" size={18} />);
      } else if (hour >= 12 && hour < 17) {
        setTimePhrase("Good Afternoon");
        setGreetIcon(<Sun className="text-yellow-400" size={18} />);
      } else if (hour >= 17 && hour < 21) {
        setTimePhrase("Good Evening");
        setGreetIcon(<CloudSun className="text-indigo-300" size={18} />);
      } else {
        setTimePhrase("Late Night Focus");
        setGreetIcon(<Moon className="text-indigo-400" size={18} />);
      }
    };
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const path = isLogin ? "/auth/login" : "/auth/register";
    try {
      const res = await axios.post(
        `http://localhost:5000/api${path}`,
        formData,
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      setToken(res.data.token, res.data.user.name);
    } catch (err) {
      alert(err.response?.data?.message || "Auth Error");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Bookmark size={20} className="text-indigo-400" />,
      title: "One-Click Capture",
      desc: "Instantly save any URL with automatic image and text fetching.",
    },
    {
      icon: <Sparkles size={20} className="text-purple-400" />,
      title: "AI-Powered Summaries",
      desc: "Our Llama 3 AI reads long articles and extracts key points for you.",
    },
    {
      icon: <Search size={20} className="text-blue-400" />,
      title: "Semantic Search",
      desc: "Forget where you saved it? Search by topics, not just exact titles.",
    },
    {
      icon: <ShieldCheck size={20} className="text-emerald-400" />,
      title: "Private & Secure",
      desc: "Your second brain is personal. We use high-end database security.",
    },
    {
      icon: <Share2 size={20} className="text-pink-400" />,
      title: "Smart Sharing",
      desc: "Easily copy or share your saved wisdom via WhatsApp or X.",
    },
    {
      icon: <Layers size={20} className="text-cyan-400" />,
      title: "Clean Dashboard",
      desc: "Manage everything from a sleek, responsive, ad-free workspace.",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#020617] font-sans relative overflow-hidden">
      {/* --- 🌟 LIVE JS-DRIVEN BACKGROUND 🌟 --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[24px_24px]"></div>

        {/* Orb 1: Indigo (Moves in a wide circle) */}
        <div
          className="absolute top-[10%] left-[10%] w-400px h-400px bg-indigo-600/30 rounded-full blur-[100px] mix-blend-screen"
          style={{
            transform: `translate(${Math.sin(animTime) * 100}px, ${Math.cos(animTime) * 80}px)`,
          }}
        ></div>

        {/* Orb 2: Purple (Moves in an opposite figure-8) */}
        <div
          className="absolute top-[30%] right-[10%] w-450px h-450px bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen"
          style={{
            transform: `translate(${Math.cos(animTime * 1.5) * -120}px, ${Math.sin(animTime * 1.5) * -90}px)`,
          }}
        ></div>

        {/* Orb 3: Cyan (Floats around the bottom center) */}
        <div
          className="absolute bottom-[-10%] left-[30%] w-500px h-500px bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen"
          style={{
            transform: `translate(${Math.sin(animTime * 0.8) * 150}px, ${Math.cos(animTime * 0.8) * 50}px)`,
          }}
        ></div>
      </div>

      {/* --- LEFT SIDE: HERO & ALL FEATURES --- */}
      <div className="lg:w-3/5 flex flex-col justify-center p-8 lg:p-20 z-10 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 bg-white/5 w-fit px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
          {greetIcon}
          <span className="text-indigo-100 font-bold tracking-widest text-[10px] uppercase">
            Good to see you, {timePhrase}!
          </span>
        </div>

        <h1 className="text-white text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-tight drop-shadow-2xl">
          Your Personal <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-cyan-400 to-purple-400">
            Digital Brain.
          </span>
        </h1>

        <p className="text-slate-300 text-lg mb-12 max-w-xl font-medium leading-relaxed drop-shadow-md">
          Capture the web. Simplify the noise. Build your own knowledge vault
          with the help of artificial intelligence.
        </p>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-3xl bg-[#0f172a]/40 border border-white/5 hover:bg-white/0.05 hover:border-white/20 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md group"
            >
              <div className="shrink-0 w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                {f.icon}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                <p className="text-slate-400 text-[12px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- RIGHT SIDE: AUTH BOX --- */}
      <div className="lg:w-2/5 flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="w-full max-w-md bg-white/0.02 backdrop-blur-3xl p-10 lg:p-12 rounded-[40px] border border-white/10 shadow-[0_0_80px_rgba(79,70,229,0.15)] relative">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-600 rounded-[22px] shadow-2xl shadow-indigo-600/30 mb-6 relative overflow-hidden group">
              <Brain size={34} className="text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <h3 className="text-white text-3xl font-black tracking-tight mb-2 uppercase">
              {isLogin ? "Sign In" : "Create Account"}
            </h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              {isLogin
                ? "Access your digital brain"
                : "Start your journey today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input
                className="w-full p-4.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm font-medium"
                placeholder="Full Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            )}
            <input
              className="w-full p-4.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm font-medium"
              type="email"
              placeholder="Email Address"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              className="w-full p-4.5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 text-sm font-medium"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  {isLogin ? "Access Workspace" : "Start Curating"}{" "}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center justify-center gap-2.5">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              {isLogin ? "Don't have an account?" : "Already a member?"}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.15em] hover:text-indigo-300 transition-colors border-b-2 border-indigo-500/30 hover:border-indigo-400 pb-1"
            >
              {isLogin ? "Sign Up Here" : "Sign In Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
