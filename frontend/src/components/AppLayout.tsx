import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">

      <Sidebar />

      <div className="flex-1 min-w-0">

        {/* Global Top Bar */}

        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-end sticky top-0 z-40">

          <NotificationBell />

        </div>

        {/* Page */}

        <Outlet />

      </div>

    </div>
  );
};

export default AppLayout;