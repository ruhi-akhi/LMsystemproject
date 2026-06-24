"use client";
import { useState, useEffect } from "react";
import { Check, Pencil, X, Mail, Phone, Clock } from "lucide-react";

type Role = "staff" | "manager" | "admin" | "instructor" | "user";
interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: Role;
  phone?: string;
  bio?: string;
}

const roleStats: Record<Role, { label: string; value: string; color: string }[]> = {
  staff: [
    { label: "Orders", value: "12", color: "#FF6B35" },
    { label: "Completed", value: "8", color: "#00C48C" },
    { label: "Pending", value: "4", color: "#F89B29" },
    { label: "Total Spent", value: "৳15k", color: "#E55A2B" },
  ],
  manager: [
    { label: "Products", value: "45", color: "#FF6B35" },
    { label: "Orders", value: "320", color: "#E55A2B" },
    { label: "Revenue", value: "৳48k", color: "#F89B29" },
    { label: "Rating", value: "4.8", color: "#00C48C" },
  ],
  admin: [
    { label: "Users", value: "1,278", color: "#FF6B35" },
    { label: "Products", value: "94", color: "#E55A2B" },
    { label: "Revenue", value: "৳4.8L", color: "#F89B29" },
    { label: "Orders", value: "2,450", color: "#00C48C" },
  ],
  instructor: [
    { label: "Products", value: "45", color: "#FF6B35" },
    { label: "Orders", value: "320", color: "#E55A2B" },
    { label: "Revenue", value: "৳48k", color: "#F89B29" },
    { label: "Rating", value: "4.8", color: "#00C48C" },
  ],
  user: [
    { label: "Orders", value: "3", color: "#FF6B35" },
    { label: "Completed", value: "2", color: "#00C48C" },
    { label: "Pending", value: "1", color: "#F89B29" },
    { label: "Savings", value: "৳500", color: "#E55A2B" },
  ],
};

const roleActivity: Record<Role, { text: string; time: string; color: string }[]> = {
  staff: [
    { text: "Placed order for Office Supplies", time: "2 days ago", color: "#FF6B35" },
    { text: "Updated delivery address", time: "5 days ago", color: "#F89B29" },
    { text: "Reviewed purchased items", time: "1 week ago", color: "#00C48C" },
    { text: "Completed payment for Order #1234", time: "2 weeks ago", color: "#E55A2B" },
  ],
  manager: [
    { text: "Added new product: Wireless Mouse", time: "1 day ago", color: "#FF6B35" },
    { text: "Updated inventory for Keyboards", time: "3 days ago", color: "#F89B29" },
    { text: "Processed 15 orders", time: "1 week ago", color: "#00C48C" },
    { text: "Received payment of ৳5,000", time: "2 weeks ago", color: "#E55A2B" },
  ],
  admin: [
    { text: "Approved new supplier registration", time: "2 hours ago", color: "#00C48C" },
    { text: "Updated product categories", time: "1 day ago", color: "#FF6B35" },
    { text: "Processed bulk order import", time: "2 days ago", color: "#F89B29" },
    { text: "Generated monthly inventory report", time: "3 days ago", color: "#E55A2B" },
  ],
  instructor: [
    { text: "Added new product: Wireless Mouse", time: "1 day ago", color: "#FF6B35" },
    { text: "Updated inventory for Keyboards", time: "3 days ago", color: "#F89B29" },
    { text: "Processed 15 orders", time: "1 week ago", color: "#00C48C" },
    { text: "Received payment of ৳5,000", time: "2 weeks ago", color: "#E55A2B" },
  ],
  user: [
    { text: "Joined Smart Inventory", time: "1 month ago", color: "#00C48C" },
    { text: "Purchased first item", time: "3 weeks ago", color: "#FF6B35" },
    { text: "Updated profile photo", time: "2 weeks ago", color: "#F89B29" },
    { text: "Logged in from new device", time: "1 day ago", color: "#E55A2B" },
  ],
};

const roleCfg: Record<Role, { accent: string; label: string; bg: string }> = {
  staff: { accent: "#FF6B35", label: "Staff", bg: "rgba(255,107,53,0.08)" },
  manager: { accent: "#E55A2B", label: "Manager", bg: "rgba(229,90,43,0.08)" },
  admin: { accent: "#F89B29", label: "Admin", bg: "rgba(248,155,41,0.08)" },
  instructor: { accent: "#FF6B35", label: "Manager", bg: "rgba(255,107,53,0.08)" },
  user: { accent: "#00C48C", label: "User", bg: "rgba(0,196,140,0.08)" },
};

function UserIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<Role>("staff");
  const [theme, setTheme] = useState("light");
  const [editMode, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [imgErr, setImgErr] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = (localStorage.getItem("theme") || "light");
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);

    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed: UserData = JSON.parse(raw);
        setUser(parsed);
        setName(parsed.name || "");
        setPhone(parsed.phone || "");
        setBio(parsed.bio || "");
        const r = parsed.role as Role;
        if (["staff", "manager", "admin", "instructor", "user"].includes(r)) setRole(r);
      } catch { }
    }

    const iv = setInterval(() => {
      const ct = localStorage.getItem("theme") || "light";
      if (ct !== theme) {
        setTheme(ct);
        document.documentElement.setAttribute("data-theme", ct);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  const handleSave = () => {
    if (!user) return;
    const updated = { ...user, name, phone, bio };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => { setSaved(false); setEdit(false); }, 1200);
  };

  if (!user) return (
    <div className="flex items-center justify-center h-48 opacity-30 text-sm font-semibold">
      Loading…
    </div>
  );

  const cfg = roleCfg[role];
  const stats = roleStats[role];
  const activity = roleActivity[role];
  const letter = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showPhoto = !!user.photoURL && !imgErr;

  return (
    <div>

      {/* Hero Card */}
      <div className="rounded-3xl border border-base-300 overflow-hidden mb-5 shadow-sm">
        <div className="relative h-36 overflow-hidden" style={{
          background: `linear-gradient(135deg, ${cfg.accent}22 0%, #83238822 50%, #F89B2922 100%)`,
        }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: cfg.accent }} />
          <div className="absolute top-4 right-24 w-16 h-16 rounded-full opacity-10" style={{ background: "#832388" }} />
          <div className="absolute -bottom-4 left-32 w-24 h-24 rounded-full opacity-10" style={{ background: "#F89B29" }} />
          <span className="absolute bottom-3 right-5 text-5xl font-black opacity-5 select-none uppercase tracking-widest">
            {cfg.label}
          </span>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4 flex-wrap gap-3">
            <div className="w-20 h-20 rounded-2xl border-4 border-base-100 flex items-center justify-center text-white text-3xl font-black overflow-hidden shadow-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${cfg.accent}, #F89B29)` }}>
              {showPhoto
                ? <img src={user.photoURL} alt={user.name} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
                : letter}
            </div>
            <button
              onClick={() => setEdit(v => !v)}
              className="btn btn-sm gap-1.5 border-0 cursor-pointer text-white mb-1"
              style={{ backgroundColor: editMode ? "#64748b" : cfg.accent }}>
              {editMode ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Edit Profile</>}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-white"
              style={{ backgroundColor: cfg.accent }}>
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium">
              <Mail size={12} /> {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5 text-xs opacity-50 font-medium">
                <Phone size={12} /> {user.phone}
              </span>
            )}
          </div>
          {user.bio && (
            <p className="text-sm opacity-60 mt-2 max-w-lg leading-relaxed">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-base-100 border border-base-300 p-5 relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: s.color }} />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 pl-2">{s.label}</p>
            <p className="text-3xl font-black pl-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6 mb-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-5">Edit Profile</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="text-xs font-bold opacity-50 block mb-1.5">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="input input-sm w-full bg-base-200 border-base-300 focus:outline-none focus:border-purple-400" />
            </div>
          </div>
          <div className="mb-5">
            <label className="text-xs font-bold opacity-50 block mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="textarea w-full bg-base-200 border-base-300 text-sm focus:outline-none resize-none focus:border-purple-400" />
          </div>
          <button onClick={handleSave}
            className="btn btn-sm gap-2 w-full border-0 text-white cursor-pointer font-bold"
            style={{ backgroundColor: cfg.accent }}>
            {saved ? <><Check size={13} /> Saved!</> : <><Check size={13} /> Save Changes</>}
          </button>
        </div>
      )}

      {/* Info + Activity */}
      {!editMode && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-base-300">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Account Info</p>
            </div>
            {[
              { label: "Full Name", value: user.name, icon: <UserIcon size={13} /> },
              { label: "Email", value: user.email, icon: <Mail size={13} /> },
              { label: "Phone", value: user.phone || "—", icon: <Phone size={13} /> },
              { label: "Role", value: cfg.label, icon: <UserIcon size={13} /> },
              { label: "Bio", value: user.bio || "—", icon: <Clock size={13} /> },
            ].map((item, i, arr) => (
              <div key={item.label}
                className={`flex items-start gap-3 px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-base-300" : ""}`}>
                <span className="opacity-30 mt-0.5 flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold opacity-40 uppercase tracking-wider">{item.label}</p>
                  {item.label === "Role" ? (
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: cfg.accent }}>
                      {cfg.label}
                    </span>
                  ) : (
                    <p className="text-sm font-semibold mt-0.5 break-words">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-base-300 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Recent Activity</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: cfg.bg, color: cfg.accent }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accent, display: "inline-block", boxShadow: `0 0 5px ${cfg.accent}` }} />
                {cfg.label}
              </span>
            </div>
            <div className="p-5 space-y-1">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: a.color, boxShadow: `0 0 6px ${a.color}60` }} />
                    {i < activity.length - 1 && (
                      <div className="w-px bg-base-300 mt-1" style={{ minHeight: 28 }} />
                    )}
                  </div>
                  <div className="pb-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug">{a.text}</p>
                    <p className="text-xs opacity-40 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}