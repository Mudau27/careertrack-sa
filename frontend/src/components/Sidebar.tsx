import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">CareerTrack SA</h1>
        <p className="text-sm text-slate-400 mt-1">
          Your career journey
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          <Briefcase size={20} />
          <span>Jobs</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          <Bookmark size={20} />
          <span>Saved Jobs</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          <FileText size={20} />
          <span>Applications</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          <User size={20} />
          <span>Profile</span>
        </a>

      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-slate-700">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-left"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;