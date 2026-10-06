import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";
import CVAnalyzer from "./pages/CVAnalyzer";
import AdminDashboard from "./pages/AdminDashboard";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            PUBLIC AUTHENTICATION ROUTES
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />


        {/* =====================================
            PROTECTED APPLICATION
        ====================================== */}

        <Route element={<ProtectedRoute />}>

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
              path="/cv-analyzer"
              element={<CVAnalyzer />}
            />

            <Route
              path="/interviews"
              element={<Interviews />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* =============================
                ADMIN ONLY
            ============================== */}

            <Route element={<AdminRoute />}>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

            </Route>

          </Route>

        </Route>


        {/* =====================================
            DEFAULT / UNKNOWN ROUTES
        ====================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

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