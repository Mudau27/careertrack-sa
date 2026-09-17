import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";

import AppLayout from "./components/AppLayout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Main application */}
       <Route element={<AppLayout />}>

  <Route
    path="/dashboard"
    element={<Dashboard />}
  />

  <Route
    path="/jobs"
    element={<Jobs />}
  />

  <Route
    path="/saved-jobs"
    element={<SavedJobs />}
  />

  <Route
    path="/applications"
    element={<Applications />}
  />

  <Route
    path="/interviews"
    element={<Interviews />}
  />

  <Route
    path="/profile"
    element={<Profile />}
  />

  <Route element={<AdminRoute />}>
    <Route
      path="/admin"
      element={<AdminDashboard />}
    />
  </Route>

</Route>

        {/* Unknown URLs */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;