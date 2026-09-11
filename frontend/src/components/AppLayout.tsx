import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">

      <Sidebar />

      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
};

export default AppLayout;