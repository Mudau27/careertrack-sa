import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
  MapPin,
  Video,
  Bell,
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

interface Interview {
  id: number;
  application_id: number;
  interview_date: string;
  interview_type: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  status: string;
  job_id: number;
  title: string;
  company: string;
  job_location: string;
}

const Dashboard = () => {
  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [interviews, setInterviews] =
    useState<Interview[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statisticsResponse,
          applicationsResponse,
          interviewsResponse,
        ] = await Promise.all([
          api.get("/dashboard/statistics"),
          api.get("/applications"),
          api.get("/interviews"),
        ]);

        setStatistics(
          statisticsResponse.data.statistics
        );

        setApplications(
          applicationsResponse.data.applications || []
        );

        setInterviews(
          interviewsResponse.data.interviews || []
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

  const upcomingInterviews = interviews
    .filter(
      (interview) =>
        new Date(
          interview.interview_date
        ) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(
          a.interview_date
        ).getTime() -
        new Date(
          b.interview_date
        ).getTime()
    )
    .slice(0, 3);

  const formatInterviewDate = (
    interviewDate: string
  ) => {
    return new Date(
      interviewDate
    ).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatInterviewTime = (
    interviewDate: string
  ) => {
    return new Date(
      interviewDate
    ).toLocaleTimeString(
      "en-ZA",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getInterviewReminder = (
    interviewDate: string
  ) => {
    const now = new Date();
    const interview =
      new Date(interviewDate);

    const difference =
      interview.getTime() -
      now.getTime();

    if (difference <= 0) {
      return null;
    }

    const minutes =
      Math.floor(
        difference /
          (1000 * 60)
      );

    const hours =
      Math.floor(
        difference /
          (1000 * 60 * 60)
      );

    const days =
      Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

    const nowDate =
      now.toDateString();

    const interviewDay =
      interview.toDateString();

    const tomorrow =
      new Date(now);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const tomorrowDate =
      tomorrow.toDateString();

    if (minutes < 60) {
      return `Interview starts in ${minutes} minute${
        minutes === 1 ? "" : "s"
      }`;
    }

    if (
      interviewDay === nowDate
    ) {
      return `Interview today at ${formatInterviewTime(
        interviewDate
      )}`;
    }

    if (
      interviewDay === tomorrowDate
    ) {
      return `Interview tomorrow at ${formatInterviewTime(
        interviewDate
      )}`;
    }

    if (days <= 7) {
      return `Interview in ${days} days`;
    }

    return null;
  };

  const nearestInterview =
    upcomingInterviews.length > 0
      ? upcomingInterviews[0]
      : null;

  const nearestReminder =
    nearestInterview
      ? getInterviewReminder(
          nearestInterview.interview_date
        )
      : null;

  return (
    <div className="min-h-screen bg-[#f1f5f9]">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <h1
          className="text-3xl font-bold"
          style={{
            color: "#111827",
          }}
        >
          Dashboard
        </h1>

        <p
          className="mt-1 font-medium"
          style={{
            color: "#374151",
          }}
        >
          Track and manage your job search journey.
        </p>
      </header>

      <main className="p-8">

        {/* Interview Reminder */}
        {!loading &&
          nearestInterview &&
          nearestReminder && (
            <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-start gap-4">

                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Bell
                      size={24}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "#c2410c",
                      }}
                    >
                      Upcoming Interview
                    </p>

                    <h2
                      className="text-xl font-bold mt-1"
                      style={{
                        color:
                          "#111827",
                      }}
                    >
                      {nearestReminder}
                    </h2>

                    <p
                      className="mt-1"
                      style={{
                        color:
                          "#374151",
                      }}
                    >
                      {
                        nearestInterview.title
                      }{" "}
                      at{" "}
                      {
                        nearestInterview.company
                      }
                    </p>

                    <p
                      className="text-sm mt-1"
                      style={{
                        color:
                          "#6b7280",
                      }}
                    >
                      {
                        nearestInterview.interview_type ||
                        "Interview"
                      }
                    </p>
                  </div>
                </div>

                {nearestInterview.location &&
                  nearestInterview.location.startsWith(
                    "http"
                  ) && (
                    <a
                      href={
                        nearestInterview.location
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-semibold text-center"
                    >
                      Open Meeting
                    </a>
                  )}
              </div>
            </div>
          )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Total Applications
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {loading
                    ? "..."
                    : statistics?.total_applications ??
                      0}
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Interviews
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {loading
                    ? "..."
                    : statistics?.interviews ??
                      0}
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Offers
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {loading
                    ? "..."
                    : statistics?.offers ??
                      0}
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "#374151",
                  }}
                >
                  Rejected
                </p>

                <h2
                  className="text-3xl font-bold mt-2"
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {loading
                    ? "..."
                    : statistics?.rejected ??
                      0}
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

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">

          <div className="flex items-center gap-3">

            <div className="bg-purple-100 p-3 rounded-lg">
              <CalendarDays
                size={24}
                className="text-purple-600"
              />
            </div>

            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  color:
                    "#111827",
                }}
              >
                Upcoming Interviews
              </h2>

              <p
                className="mt-1"
                style={{
                  color:
                    "#374151",
                }}
              >
                Your next scheduled interviews.
              </p>
            </div>

          </div>

          <div className="mt-6">

            {loading ? (
              <p
                style={{
                  color:
                    "#6b7280",
                }}
              >
                Loading interviews...
              </p>
            ) : upcomingInterviews.length >
              0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {upcomingInterviews.map(
                  (interview) => {
                    const reminder =
                      getInterviewReminder(
                        interview.interview_date
                      );

                    return (
                      <div
                        key={
                          interview.id
                        }
                        className="border border-gray-200 rounded-xl p-5"
                      >

                        {reminder && (
                          <div className="mb-4">

                            <span
                              className="inline-block bg-orange-100 px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                color:
                                  "#c2410c",
                              }}
                            >
                              {reminder}
                            </span>

                          </div>
                        )}

                        <h3
                          className="font-bold text-lg"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          {
                            interview.title
                          }
                        </h3>

                        <p
                          className="font-semibold mt-1"
                          style={{
                            color:
                              "#2563eb",
                          }}
                        >
                          {
                            interview.company
                          }
                        </p>

                        <div className="mt-4 space-y-3">

                          <div className="flex items-start gap-2">

                            <CalendarDays
                              size={18}
                              className="mt-0.5 text-gray-500"
                            />

                            <div>
                              <p
                                className="text-sm font-semibold"
                                style={{
                                  color:
                                    "#111827",
                                }}
                              >
                                {formatInterviewDate(
                                  interview.interview_date
                                )}
                              </p>

                              <p
                                className="text-sm"
                                style={{
                                  color:
                                    "#6b7280",
                                }}
                              >
                                {formatInterviewTime(
                                  interview.interview_date
                                )}
                              </p>
                            </div>

                          </div>

                          <div className="flex items-start gap-2">

                            <Video
                              size={18}
                              className="mt-0.5 text-gray-500"
                            />

                            <p
                              className="text-sm"
                              style={{
                                color:
                                  "#374151",
                              }}
                            >
                              {interview.interview_type ||
                                "Not specified"}
                            </p>

                          </div>

                          <div className="flex items-start gap-2">

                            <MapPin
                              size={18}
                              className="mt-0.5 text-gray-500"
                            />

                            {interview.location ? (
                              interview.location.startsWith(
                                "http"
                              ) ? (
                                <a
                                  href={
                                    interview.location
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm underline break-all"
                                  style={{
                                    color:
                                      "#2563eb",
                                  }}
                                >
                                  Open Meeting Link
                                </a>
                              ) : (
                                <p
                                  className="text-sm"
                                  style={{
                                    color:
                                      "#374151",
                                  }}
                                >
                                  {
                                    interview.location
                                  }
                                </p>
                              )
                            ) : (
                              <p
                                className="text-sm"
                                style={{
                                  color:
                                    "#6b7280",
                                }}
                              >
                                Location not specified
                              </p>
                            )}

                          </div>

                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-lg p-6">

                <p
                  style={{
                    color:
                      "#6b7280",
                  }}
                >
                  You have no upcoming interviews.
                </p>

              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

            <h2
              className="text-xl font-bold"
              style={{
                color:
                  "#111827",
              }}
            >
              Application Status
            </h2>

            <p
              className="mt-2"
              style={{
                color:
                  "#374151",
              }}
            >
              Breakdown of your job applications.
            </p>

            <div className="h-64 mt-4">

              {chartData.length >
              0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={
                        chartData
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={
                        90
                      }
                      label
                    >

                      {chartData.map(
                        (
                          _,
                          index
                        ) => (
                          <Cell
                            key={
                              index
                            }
                            fill={
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">

                  <p
                    style={{
                      color:
                        "#6b7280",
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
              style={{
                color:
                  "#111827",
              }}
            >
              Recent Applications
            </h2>

            <p
              className="mt-2"
              style={{
                color:
                  "#374151",
              }}
            >
              Your latest job applications.
            </p>

            <div className="mt-6 space-y-4">

              {applications.length >
              0 ? (
                applications
                  .slice(0, 5)
                  .map(
                    (
                      application
                    ) => (
                      <div
                        key={
                          application.id
                        }
                        className="border border-gray-200 rounded-lg p-4"
                      >

                        <div className="flex justify-between items-start gap-4">

                          <div>

                            <h3
                              className="font-bold"
                              style={{
                                color:
                                  "#111827",
                              }}
                            >
                              {
                                application.title
                              }
                            </h3>

                            <p
                              className="text-sm mt-1"
                              style={{
                                color:
                                  "#374151",
                              }}
                            >
                              {
                                application.company
                              }
                            </p>

                            <p
                              className="text-sm mt-1"
                              style={{
                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                application.location
                              }
                            </p>

                          </div>

                          <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {
                              application.status
                            }
                          </span>

                        </div>

                        <p
                          className="text-sm mt-3"
                          style={{
                            color:
                              "#6b7280",
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
                    )
                  )
              ) : (
                <p
                  style={{
                    color:
                      "#6b7280",
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