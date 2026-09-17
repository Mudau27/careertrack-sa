import { Navigate, Outlet } from "react-router-dom";

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
  } catch (error) {
    console.error(
      "Failed to read user role:",
      error
    );

    return null;
  }
};

const AdminRoute = () => {
  const role = getRoleFromToken();

  if (role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;