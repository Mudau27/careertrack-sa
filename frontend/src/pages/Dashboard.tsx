import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
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

const Dashboard = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("/dashboard/statistics");

        setStatistics(response.data.statistics);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard statistics:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Track and manage your job search journey.
        </p>
      </header>

      {/* Main content */}
      <main className="p-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Applications
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Interviews
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Offers
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
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

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Application Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">

            <h2 className="text-xl font-semibold text-slate-900">
              Application Status
            </h2>

            <p className="text-slate-500 mt-2">
              Your application statistics will appear here.
            </p>

            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">
                No applications yet
              </p>
            </div>

          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">

            <h2 className="text-xl font-semibold text-slate-900">
              Recent Applications
            </h2>

            <p className="text-slate-500 mt-2">
              Your latest applications will appear here.
            </p>

            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">
                No applications yet
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;