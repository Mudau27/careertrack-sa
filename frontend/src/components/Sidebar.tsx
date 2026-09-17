import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  CalendarDays,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";



const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

    const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const payloadPart = token.split(".")[1];

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (char) =>
              "%" +
              (
                "00" +
                char.charCodeAt(0).toString(16)
              ).slice(-2)
          )
          .join("")
      )
    );

    return payload.role;
  } catch {
    return null;
  }
};
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          CareerTrack SA
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Your career journey
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          <LayoutDashboard
            size={20}
          />

          <span>
            Dashboard
          </span>
        </NavLink>


        {/* Jobs */}
        <NavLink
          to="/jobs"
          className={linkClass}
        >
          <Briefcase
            size={20}
          />

          <span>
            Jobs
          </span>
        </NavLink>


        {/* Saved Jobs */}
        <NavLink
          to="/saved-jobs"
          className={linkClass}
        >
          <Bookmark
            size={20}
          />

          <span>
            Saved Jobs
          </span>
        </NavLink>


        {/* Applications */}
        <NavLink
          to="/applications"
          className={linkClass}
        >
          <FileText
            size={20}
          />

          <span>
            Applications
          </span>
        </NavLink>


        {/* Interviews */}
        <NavLink
          to="/interviews"
          className={linkClass}
        >
          <CalendarDays
            size={20}
          />

          <span>
            Interviews
          </span>
        </NavLink>


        {/* Profile */}
        <NavLink
          to="/profile"
          className={linkClass}
        >
          <User
            size={20}
          />

          <span>
            Profile
          </span>
        </NavLink>

      </nav>


      {/* Logout */}
      <div className="px-4 py-6 border-t border-slate-700">
        <button
          onClick={
            handleLogout
          }
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-left text-gray-300 hover:text-white"
        >
          <LogOut
            size={20}
          />

          <span>
            Logout
          </span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;