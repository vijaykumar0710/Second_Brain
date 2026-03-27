import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./components/Auth.jsx";
import Navbar from "./components/Navbar.jsx";
import AddLink from "./components/AddLink.jsx";
import LinkCard from "./components/LinkCard.jsx";
import { Search } from "lucide-react";

const API_URL = "https://second-brain-0nq1.onrender.com/api";

function App() {
  // Direct check from localStorage during initialization
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");

  // Logout Logic
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserName(null);
    setLinks([]);
  };

  // Fetch Links
  const fetchLinks = async (activeToken) => {
    try {
      const res = await axios.get(`${API_URL}/links`, {
        headers: { Authorization: activeToken },
      });
      setLinks(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  // Sync data on mount if token exists
  useEffect(() => {
    if (token) {
      fetchLinks(token);
    }
  }, [token]);

  // Login Success Handler
  const handleLoginSuccess = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", name);
    setToken(newToken);
    setUserName(name);
  };

  // --- THE GATEKEEPER ---
  // Agar token nahi milta, toh seedha AUTH (Landing Page) return karo
  if (!token || token === "undefined" || token === "null") {
    return <Auth setToken={handleLoginSuccess} />;
  }

  // Dashboard Logic
  const filteredLinks = links.filter(
    (l) =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.url?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-slate-200/60 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onLogout={handleLogout} userName={userName} />

        <main className="max-w-7xl mx-auto p-6 w-full">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-10 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
            <div className="w-full lg:flex-1">
              <AddLink token={token} onLinkAdded={() => fetchLinks(token)} />
            </div>
            <div className="w-full lg:w-72 relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-2xl outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                token={token}
                onUpdate={() => fetchLinks(token)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
