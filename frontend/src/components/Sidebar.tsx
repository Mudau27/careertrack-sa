import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          CareerTrack SA
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Your career journey
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className={linkClass}
        >
          <Briefcase size={20} />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/saved-jobs"
          className={linkClass}
        >
          <Bookmark size={20} />
          <span>Saved Jobs</span>
        </NavLink>

        <NavLink
          to="/applications"
          className={linkClass}
        >
          <FileText size={20} />
          <span>Applications</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClass}
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>

      </nav>

      <div className="px-4 py-6 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-left text-gray-300 hover:text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;