import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

interface Statistics {
  total_applications: number;
  recent_applications: number;
  interviews: number;
  offers: number;
  rejected: number;
  interview_rate: number;
  applications_by_status: Record<string, number>;
}

interface Application {
  id: number;
  job_id: number;
  title: string;
  company: string;
  location: string;
  status: string;
  applied_date: string;
}

const Dashboard = () => {
  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statisticsResponse = await api.get(
          "/dashboard/statistics"
        );

        setStatistics(
          statisticsResponse.data.statistics
        );

        const applicationsResponse = await api.get(
          "/applications"
        );

        setApplications(
          applicationsResponse.data.applications
        );
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = statistics
    ? Object.entries(
        statistics.applications_by_status
      ).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const chartColors = [
    "#2563eb",
    "#f59e0b",
    "#16a34a",
    "#dc2626",
    "#7c3aed",
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "#111827" }}
        >
          Dashboard
        </h1>

        <p
          className="mt-1 font-medium"
          style={{ color: "#374151" }}
        >
          Track and manage your job search journey.
        </p>
      </header>

      {/* Main */}
      <main className="p-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#374151" }}
                >
                  Total Applications
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#111827" }}
                >
                  {loading
                    ? "..."
                    : statistics?.total_applications ?? 0}
                </h2>
              </div>

              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase
                  className="text-blue-600"
                  size={24}
                />
              </div>

            </div>
          </div>

          {/* Interviews */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#374151" }}
                >
                  Interviews
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#111827" }}
                >
                  {loading
                    ? "..."
                    : statistics?.interviews ?? 0}
                </h2>
              </div>

              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock
                  className="text-yellow-600"
                  size={24}
                />
              </div>

            </div>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#374151" }}
                >
                  Offers
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#111827" }}
                >
                  {loading
                    ? "..."
                    : statistics?.offers ?? 0}
                </h2>
              </div>

              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle
                  className="text-green-600"
                  size={24}
                />
              </div>

            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#374151" }}
                >
                  Rejected
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{ color: "#111827" }}
                >
                  {loading
                    ? "..."
                    : statistics?.rejected ?? 0}
                </h2>
              </div>

              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle
                  className="text-red-600"
                  size={24}
                />
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Application Status Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <h2
              className="text-xl font-bold"
              style={{ color: "#111827" }}
            >
              Application Status
            </h2>

            <p
              className="mt-2"
              style={{ color: "#374151" }}
            >
              Breakdown of your job applications.
            </p>

            <div className="h-64 mt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    No applications yet
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <h2
              className="text-xl font-bold"
              style={{ color: "#111827" }}
            >
              Recent Applications
            </h2>

            <p
              className="mt-2"
              style={{ color: "#374151" }}
            >
              Your latest job applications.
            </p>

            <div className="mt-6 space-y-4">

              {applications.length > 0 ? (
                applications
                  .slice(0, 5)
                  .map((application) => (

                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >

                      <div className="flex justify-between items-start gap-4">

                        <div>
                          <h3
                            className="font-bold"
                            style={{
                              color: "#111827",
                            }}
                          >
                            {application.title}
                          </h3>

                          <p
                            className="text-sm mt-1"
                            style={{
                              color: "#374151",
                            }}
                          >
                            {application.company}
                          </p>

                          <p
                            className="text-sm mt-1"
                            style={{
                              color: "#6b7280",
                            }}
                          >
                            {application.location}
                          </p>
                        </div>

                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                          {application.status}
                        </span>

                      </div>

                      <p
                        className="text-sm mt-3"
                        style={{
                          color: "#6b7280",
                        }}
                      >
                        Applied:{" "}
                        {new Date(
                          application.applied_date
                        ).toLocaleDateString(
                          "en-ZA"
                        )}
                      </p>

                    </div>

                  ))
              ) : (
                <p
                  style={{
                    color: "#6b7280",
                  }}
                >
                  No recent applications.
                </p>
              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;