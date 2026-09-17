import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";

import api from "../services/api";

interface AdminStatistics {
  total_users: number;
  total_admins: number;
  total_jobs: number;
  total_applications: number;
  total_interviews: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  employment_type: string | null;
  created_at: string;
}

interface Application {
  id: number;
  status: string;
  applied_date: string;
  user_id: number;
  user_name: string;
  user_email: string;
  job_id: number;
  title: string;
  company: string;
  location: string;
}

type Tab =
  | "users"
  | "jobs"
  | "applications";

const AdminDashboard = () => {
  const [statistics, setStatistics] =
    useState<AdminStatistics | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [activeTab, setActiveTab] =
    useState<Tab>("users");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD ADMIN DATA
  // ==========================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statisticsResponse,
        usersResponse,
        jobsResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get(
          "/admin/statistics"
        ),

        api.get(
          "/admin/users"
        ),

        api.get(
          "/admin/jobs"
        ),

        api.get(
          "/admin/applications"
        ),
      ]);

      setStatistics(
        statisticsResponse.data.statistics
      );

      setUsers(
        usersResponse.data.users || []
      );

      setJobs(
        jobsResponse.data.jobs || []
      );

      setApplications(
        applicationsResponse.data
          .applications || []
      );
    } catch (error: any) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const changeUserRole = async (
    userId: number,
    role: string
  ) => {
    const newRole =
      role === "admin"
        ? "user"
        : "admin";

    const confirmed =
      window.confirm(
        `Change this user's role to ${newRole}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await api.put(
          `/admin/users/${userId}/role`,
          {
            role: newRole,
          }
        );

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? response.data.user
            : user
        )
      );

      await refreshStatistics();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser = async (
    userId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== userId
        )
      );

      await refreshStatistics();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const deleteJob = async (
    jobId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/admin/jobs/${jobId}`
      );

      setJobs((current) =>
        current.filter(
          (job) =>
            job.id !== jobId
        )
      );

      await refreshStatistics();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  // ==========================================
  // REFRESH STATISTICS
  // ==========================================

  const refreshStatistics =
    async () => {
      try {
        const response =
          await api.get(
            "/admin/statistics"
          );

        setStatistics(
          response.data.statistics
        );
      } catch (error) {
        console.error(
          "Failed to refresh statistics:",
          error
        );
      }
    };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <p
          style={{
            color: "#374151",
          }}
        >
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="p-8">

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <h2
            className="font-bold text-lg"
            style={{
              color: "#991b1b",
            }}
          >
            Admin Dashboard Error
          </h2>

          <p
            className="mt-2"
            style={{
              color: "#7f1d1d",
            }}
          >
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">

      {/* Header */}

      <header className="bg-white border-b border-gray-200 px-8 py-6">

        <div className="flex items-center gap-3">

          <div className="bg-purple-100 p-3 rounded-xl">

            <ShieldCheck
              size={26}
              className="text-purple-600"
            />

          </div>

          <div>

            <h1
              className="text-3xl font-bold"
              style={{
                color: "#111827",
              }}
            >
              Admin Dashboard
            </h1>

            <p
              className="mt-1"
              style={{
                color: "#374151",
              }}
            >
              Manage CareerTrack SA users,
              jobs and applications.
            </p>

          </div>

        </div>

      </header>

      <main className="p-8">

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

          <StatCard
            title="Users"
            value={
              statistics?.total_users || 0
            }
            icon={
              <Users
                size={22}
                className="text-blue-600"
              />
            }
          />

          <StatCard
            title="Admins"
            value={
              statistics?.total_admins || 0
            }
            icon={
              <ShieldCheck
                size={22}
                className="text-purple-600"
              />
            }
          />

          <StatCard
            title="Jobs"
            value={
              statistics?.total_jobs || 0
            }
            icon={
              <BriefcaseBusiness
                size={22}
                className="text-green-600"
              />
            }
          />

          <StatCard
            title="Applications"
            value={
              statistics?.total_applications ||
              0
            }
            icon={
              <FileText
                size={22}
                className="text-orange-600"
              />
            }
          />

          <StatCard
            title="Interviews"
            value={
              statistics?.total_interviews ||
              0
            }
            icon={
              <CalendarDays
                size={22}
                className="text-pink-600"
              />
            }
          />

        </div>

        {/* Tabs */}

        <div className="bg-white border border-gray-200 rounded-xl mt-8 shadow-sm">

          <div className="border-b border-gray-200 px-6 pt-5 flex gap-2 overflow-x-auto">

            <TabButton
              label="Users"
              active={
                activeTab === "users"
              }
              onClick={() =>
                setActiveTab("users")
              }
            />

            <TabButton
              label="Jobs"
              active={
                activeTab === "jobs"
              }
              onClick={() =>
                setActiveTab("jobs")
              }
            />

            <TabButton
              label="Applications"
              active={
                activeTab ===
                "applications"
              }
              onClick={() =>
                setActiveTab(
                  "applications"
                )
              }
            />

          </div>

          {/* Users */}

          {activeTab === "users" && (
            <div className="p-6">

              <h2
                className="text-xl font-bold"
                style={{
                  color: "#111827",
                }}
              >
                User Management
              </h2>

              <p
                className="mt-1"
                style={{
                  color: "#6b7280",
                }}
              >
                Manage registered users and
                administrator roles.
              </p>

              <div className="overflow-x-auto mt-6">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-200 text-left">

                      <th className="py-3 px-3">
                        Name
                      </th>

                      <th className="py-3 px-3">
                        Email
                      </th>

                      <th className="py-3 px-3">
                        Role
                      </th>

                      <th className="py-3 px-3">
                        Joined
                      </th>

                      <th className="py-3 px-3">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map(
                      (user) => (
                        <tr
                          key={
                            user.id
                          }
                          className="border-b border-gray-100"
                        >

                          <td
                            className="py-4 px-3 font-semibold"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            {
                              user.name
                            }
                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#374151",
                            }}
                          >
                            {
                              user.email
                            }
                          </td>

                          <td className="py-4 px-3">

                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full ${
                                user.role ===
                                "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {
                                user.role
                              }
                            </span>

                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#6b7280",
                            }}
                          >
                            {formatDate(
                              user.created_at
                            )}
                          </td>

                          <td className="py-4 px-3">

                            <div className="flex gap-2">

                              <button
                                onClick={() =>
                                  changeUserRole(
                                    user.id,
                                    user.role
                                  )
                                }
                                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-semibold"
                                style={{
                                  color:
                                    "#1d4ed8",
                                }}
                              >
                                <UserCog
                                  size={
                                    16
                                  }
                                />

                                {user.role ===
                                "admin"
                                  ? "Make User"
                                  : "Make Admin"}

                              </button>

                              <button
                                onClick={() =>
                                  deleteUser(
                                    user.id
                                  )
                                }
                                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-semibold"
                                style={{
                                  color:
                                    "#b91c1c",
                                }}
                              >
                                <Trash2
                                  size={
                                    16
                                  }
                                />

                                Delete

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

          {/* Jobs */}

          {activeTab === "jobs" && (
            <div className="p-6">

              <h2
                className="text-xl font-bold"
                style={{
                  color: "#111827",
                }}
              >
                Job Management
              </h2>

              <p
                className="mt-1"
                style={{
                  color: "#6b7280",
                }}
              >
                View and remove jobs stored
                in CareerTrack SA.
              </p>

              <div className="overflow-x-auto mt-6">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-200 text-left">

                      <th className="py-3 px-3">
                        Job
                      </th>

                      <th className="py-3 px-3">
                        Company
                      </th>

                      <th className="py-3 px-3">
                        Location
                      </th>

                      <th className="py-3 px-3">
                        Type
                      </th>

                      <th className="py-3 px-3">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {jobs.map(
                      (job) => (
                        <tr
                          key={
                            job.id
                          }
                          className="border-b border-gray-100"
                        >

                          <td
                            className="py-4 px-3 font-semibold"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            {
                              job.title
                            }
                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#374151",
                            }}
                          >
                            {
                              job.company
                            }
                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#374151",
                            }}
                          >
                            {
                              job.location
                            }
                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#6b7280",
                            }}
                          >
                            {job.employment_type ||
                              "Not specified"}
                          </td>

                          <td className="py-4 px-3">

                            <button
                              onClick={() =>
                                deleteJob(
                                  job.id
                                )
                              }
                              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg font-semibold text-sm"
                              style={{
                                color:
                                  "#b91c1c",
                              }}
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />

                              Delete

                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

          {/* Applications */}

          {activeTab ===
            "applications" && (
            <div className="p-6">

              <h2
                className="text-xl font-bold"
                style={{
                  color: "#111827",
                }}
              >
                Applications
              </h2>

              <p
                className="mt-1"
                style={{
                  color: "#6b7280",
                }}
              >
                View applications from all
                CareerTrack SA users.
              </p>

              <div className="overflow-x-auto mt-6">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-200 text-left">

                      <th className="py-3 px-3">
                        User
                      </th>

                      <th className="py-3 px-3">
                        Job
                      </th>

                      <th className="py-3 px-3">
                        Company
                      </th>

                      <th className="py-3 px-3">
                        Status
                      </th>

                      <th className="py-3 px-3">
                        Applied
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {applications.map(
                      (application) => (
                        <tr
                          key={
                            application.id
                          }
                          className="border-b border-gray-100"
                        >

                          <td className="py-4 px-3">

                            <p
                              className="font-semibold"
                              style={{
                                color:
                                  "#111827",
                              }}
                            >
                              {
                                application.user_name
                              }
                            </p>

                            <p
                              className="text-xs mt-1"
                              style={{
                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                application.user_email
                              }
                            </p>

                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            {
                              application.title
                            }
                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#374151",
                            }}
                          >
                            {
                              application.company
                            }
                          </td>

                          <td className="py-4 px-3">

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full font-bold">

                              {
                                application.status
                              }

                            </span>

                          </td>

                          <td
                            className="py-4 px-3"
                            style={{
                              color:
                                "#6b7280",
                            }}
                          >
                            {formatDate(
                              application.applied_date
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p
            className="text-sm font-medium"
            style={{
              color: "#6b7280",
            }}
          >
            {title}
          </p>

          <p
            className="text-3xl font-bold mt-2"
            style={{
              color: "#111827",
            }}
          >
            {value}
          </p>

        </div>

        <div className="bg-gray-50 p-3 rounded-xl">

          {icon}

        </div>

      </div>

    </div>
  );
};


// ==========================================
// TAB BUTTON
// ==========================================

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-semibold border-b-2 transition ${
        active
          ? "border-blue-600"
          : "border-transparent"
      }`}
      style={{
        color: active
          ? "#2563eb"
          : "#6b7280",
      }}
    >
      {label}
    </button>
  );
};

export default AdminDashboard;