import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  Clock,
  MapPin,
  Video,
  Bell,
  ExternalLink,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";

/* =====================================================
   TYPES
===================================================== */

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

/* =====================================================
   STATUS COLOURS
===================================================== */

const STATUS_STYLES: Record<
  string,
  {
    dot: string;
    badge: string;
  }
> = {
  applied: {
    dot: "#2563eb",
    badge:
      "bg-blue-50 text-blue-700 ring-blue-600/20",
  },

  interview: {
    dot: "#d97706",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
  },

  offer: {
    dot: "#059669",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },

  rejected: {
    dot: "#dc2626",
    badge:
      "bg-red-50 text-red-700 ring-red-600/20",
  },
};

const FALLBACK_STYLE = {
  dot: "#64748b",
  badge:
    "bg-slate-100 text-slate-700 ring-slate-500/20",
};

const getStatusStyle = (status: string) => {
  const key = status.toLowerCase();

  const match = Object.keys(
    STATUS_STYLES
  ).find((statusName) =>
    key.includes(statusName)
  );

  return match
    ? STATUS_STYLES[match]
    : FALLBACK_STYLE;
};

/* =====================================================
   HELPERS
===================================================== */

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString(
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

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  const days = Math.floor(
    difference /
      (1000 * 60 * 60 * 24)
  );

  const tomorrow =
    new Date(now);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  if (minutes < 60) {
    return `Starts in ${minutes} minute${
      minutes === 1 ? "" : "s"
    }`;
  }

  if (
    interview.toDateString() ===
    now.toDateString()
  ) {
    return `Today at ${formatTime(
      interviewDate
    )}`;
  }

  if (
    interview.toDateString() ===
    tomorrow.toDateString()
  ) {
    return `Tomorrow at ${formatTime(
      interviewDate
    )}`;
  }

  if (days <= 7) {
    return `In ${days} days`;
  }

  return null;
};

const isLink = (
  value: string | null
): value is string => {
  return Boolean(
    value &&
      value.startsWith("http")
  );
};

/* =====================================================
   CARD
===================================================== */

const Card = ({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        ${className}
      `}
    >
      <div className="mb-5">

        {/* FORCE TITLE TO BLACK */}

        <h2
          className="text-lg font-bold"
          style={{
            color: "#000000",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="mt-1 text-sm"
            style={{
              color: "#475569",
            }}
          >
            {subtitle}
          </p>
        )}

      </div>

      {children}
    </section>
  );
};

/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) => {

  const getTextColor = () => {
    switch (label) {
      case "Applications":
        return "#2563eb"; // Blue

      case "Interviews":
        return "#d97706"; // Amber / Yellow

      case "Offers":
        return "#059669"; // Green

      case "Rejected":
        return "#dc2626"; // Red

      default:
        return "#000000";
    }
  };

  const textColor = getTextColor();

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Card name */}
      <p
        className="text-sm font-bold"
        style={{
          color: textColor,
        }}
      >
        {label}
      </p>

      {/* Number */}
      <p
        className="mt-2 text-3xl font-bold tabular-nums"
        style={{
          color: "#000000",
        }}
      >
        {loading ? (
          <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-100" />
        ) : (
          value
        )}
      </p>
    </div>
  );
};

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = ({
  message,
}: {
  message: string;
}) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">

      <p
        className="text-sm"
        style={{
          color: "#475569",
        }}
      >
        {message}
      </p>

    </div>
  );
};

/* =====================================================
   DASHBOARD
===================================================== */

const Dashboard = () => {

  const [
    statistics,
    setStatistics,
  ] = useState<Statistics | null>(
    null
  );

  const [
    applications,
    setApplications,
  ] = useState<Application[]>([]);

  const [
    interviews,
    setInterviews,
  ] = useState<Interview[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =====================================================
     FETCH DASHBOARD DATA

     These are your ORIGINAL working API calls.
     Nothing new has been added.
  ===================================================== */

  useEffect(() => {

    const fetchDashboardData =
      async () => {

        try {

          const [
            statisticsResponse,
            applicationsResponse,
            interviewsResponse,
          ] = await Promise.all([

            api.get(
              "/dashboard/statistics"
            ),

            api.get(
              "/applications"
            ),

            api.get(
              "/interviews"
            ),

          ]);

          setStatistics(
            statisticsResponse.data
              .statistics
          );

          setApplications(
            applicationsResponse.data
              .applications || []
          );

          setInterviews(
            interviewsResponse.data
              .interviews || []
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

  /* =====================================================
     CHART DATA
  ===================================================== */

  const chartData =
    statistics
      ? Object.entries(
          statistics.applications_by_status
        ).map(
          ([name, value]) => ({
            name,
            value,
          })
        )
      : [];

  const totalInChart =
    chartData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  /* =====================================================
     UPCOMING INTERVIEWS
  ===================================================== */

  const upcomingInterviews =
    interviews
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

  const nearestInterview =
    upcomingInterviews[0] ??
    null;

  const nearestReminder =
    nearestInterview
      ? getInterviewReminder(
          nearestInterview.interview_date
        )
      : null;

  const today =
    new Date().toLocaleDateString(
      "en-ZA",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-8">

          <p
            className="text-sm font-semibold"
            style={{
              color: "#4f46e5",
            }}
          >
            {today}
          </p>

          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{
              color: "#000000",
            }}
          >
            Welcome back
          </h1>

          <p
            className="mt-2 text-base"
            style={{
              color: "#334155",
            }}
          >
            Here's an overview of your
            job search and upcoming
            career activity.
          </p>

        </header>

        {/* =================================================
            NEXT INTERVIEW
        ================================================= */}

        {!loading &&
          nearestInterview &&
          nearestReminder && (

            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100">

                  <Bell
                    size={20}
                    className="text-amber-700"
                  />

                </div>

                <div>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "#92400e",
                    }}
                  >
                    Next interview ·{" "}
                    {nearestReminder}
                  </p>

                  <p
                    className="mt-1 font-bold"
                    style={{
                      color: "#000000",
                    }}
                  >
                    {nearestInterview.title}{" "}
                    at{" "}
                    {nearestInterview.company}
                  </p>

                  <p
                    className="text-sm"
                    style={{
                      color: "#475569",
                    }}
                  >
                    {nearestInterview.interview_type ||
                      "Interview"}
                  </p>

                </div>

              </div>

              {isLink(
                nearestInterview.location
              ) && (

                <a
                  href={
                    nearestInterview.location
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Join meeting

                  <ExternalLink
                    size={14}
                  />
                </a>

              )}

            </div>

          )}

        {/* =================================================
            STAT CARDS
            NO ICONS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Applications"
            value={
              statistics
                ?.total_applications ??
              0
            }
            loading={loading}
          />

          <StatCard
            label="Interviews"
            value={
              statistics?.interviews ??
              0
            }
            loading={loading}
          />

          <StatCard
            label="Offers"
            value={
              statistics?.offers ??
              0
            }
            loading={loading}
          />

          <StatCard
            label="Rejected"
            value={
              statistics?.rejected ??
              0
            }
            loading={loading}
          />

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* ===============================================
                UPCOMING INTERVIEWS
            =============================================== */}

            <Card
              title="Upcoming interviews"
              subtitle="Your next scheduled interviews."
            >

              {loading ? (

                <div className="space-y-3">

                  {[0, 1, 2].map(
                    (number) => (

                      <div
                        key={number}
                        className="h-20 animate-pulse rounded-xl bg-slate-100"
                      />

                    )
                  )}

                </div>

              ) : upcomingInterviews.length >
                0 ? (

                <ul className="divide-y divide-slate-100">

                  {upcomingInterviews.map(
                    (interview) => {

                      const date =
                        new Date(
                          interview.interview_date
                        );

                      const reminder =
                        getInterviewReminder(
                          interview.interview_date
                        );

                      return (

                        <li
                          key={
                            interview.id
                          }
                          className="flex gap-4 py-4 first:pt-0 last:pb-0"
                        >

                          {/* DATE */}

                          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50">

                            <span
                              className="text-lg font-bold leading-none"
                              style={{
                                color:
                                  "#000000",
                              }}
                            >
                              {date.toLocaleDateString(
                                "en-ZA",
                                {
                                  day:
                                    "2-digit",
                                }
                              )}
                            </span>

                            <span
                              className="mt-1 text-xs font-semibold"
                              style={{
                                color:
                                  "#4f46e5",
                              }}
                            >
                              {date.toLocaleDateString(
                                "en-ZA",
                                {
                                  month:
                                    "short",
                                }
                              )}
                            </span>

                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3
                                className="truncate font-bold"
                                style={{
                                  color:
                                    "#000000",
                                }}
                              >
                                {
                                  interview.title
                                }
                              </h3>

                              {reminder && (

                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                  {
                                    reminder
                                  }
                                </span>

                              )}

                            </div>

                            <p
                              className="text-sm font-semibold"
                              style={{
                                color:
                                  "#4f46e5",
                              }}
                            >
                              {
                                interview.company
                              }
                            </p>

                            <div
                              className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"
                              style={{
                                color:
                                  "#475569",
                              }}
                            >

                              <span className="inline-flex items-center gap-1.5">

                                <Clock
                                  size={14}
                                />

                                {formatTime(
                                  interview.interview_date
                                )}

                              </span>

                              <span className="inline-flex items-center gap-1.5">

                                <Video
                                  size={14}
                                />

                                {interview.interview_type ||
                                  "Type not specified"}

                              </span>

                              <span className="inline-flex items-center gap-1.5">

                                <MapPin
                                  size={14}
                                />

                                {isLink(
                                  interview.location
                                ) ? (

                                  <a
                                    href={
                                      interview.location
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-indigo-600 hover:underline"
                                  >
                                    Meeting link
                                  </a>

                                ) : (

                                  interview.location ||
                                  "Location not specified"

                                )}

                              </span>

                            </div>

                          </div>

                        </li>

                      );
                    }
                  )}

                </ul>

              ) : (

                <EmptyState message="No upcoming interviews. They'll appear here once you schedule one." />

              )}

            </Card>

            {/* ===============================================
                RECENT APPLICATIONS
            =============================================== */}

            <Card
              title="Recent applications"
              subtitle="Your latest job applications."
            >

              {applications.length >
              0 ? (

                <ul className="divide-y divide-slate-100">

                  {applications
                    .slice(0, 5)
                    .map(
                      (
                        application
                      ) => {

                        const style =
                          getStatusStyle(
                            application.status
                          );

                        return (

                          <li
                            key={
                              application.id
                            }
                            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                          >

                            <div className="min-w-0">

                              <h3
                                className="truncate font-bold"
                                style={{
                                  color:
                                    "#000000",
                                }}
                              >
                                {
                                  application.title
                                }
                              </h3>

                              <p
                                className="truncate text-sm"
                                style={{
                                  color:
                                    "#475569",
                                }}
                              >
                                {
                                  application.company
                                }

                                {application.location &&
                                  ` · ${application.location}`}

                              </p>

                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-1">

                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.badge}`}
                              >
                                {
                                  application.status
                                }
                              </span>

                              <span
                                className="text-xs"
                                style={{
                                  color:
                                    "#64748b",
                                }}
                              >
                                {new Date(
                                  application.applied_date
                                ).toLocaleDateString(
                                  "en-ZA",
                                  {
                                    day:
                                      "numeric",
                                    month:
                                      "short",
                                    year:
                                      "numeric",
                                  }
                                )}
                              </span>

                            </div>

                          </li>

                        );
                      }
                    )}

                </ul>

              ) : (

                <EmptyState message="No applications yet. Add your first application to start tracking your progress." />

              )}

            </Card>

          </div>

          {/* =================================================
              APPLICATION STATUS
          ================================================= */}

          <Card
            title="Application status"
            subtitle="Breakdown of your applications."
            className="h-fit lg:sticky lg:top-24"
          >

            {chartData.length >
            0 ? (

              <>

                <div className="relative h-56">

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
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                      >

                        {chartData.map(
                          (item) => (

                            <Cell
                              key={
                                item.name
                              }
                              fill={
                                getStatusStyle(
                                  item.name
                                ).dot
                              }
                            />

                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                  {/* TOTAL */}

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                    <span
                      className="text-3xl font-bold tabular-nums"
                      style={{
                        color:
                          "#000000",
                      }}
                    >
                      {
                        totalInChart
                      }
                    </span>

                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          "#475569",
                      }}
                    >
                      total
                    </span>

                  </div>

                </div>

                <ul className="mt-5 space-y-3">

                  {chartData.map(
                    (item) => (

                      <li
                        key={
                          item.name
                        }
                        className="flex items-center justify-between text-sm"
                      >

                        <span
                          className="inline-flex items-center gap-2 font-medium"
                          style={{
                            color:
                              "#334155",
                          }}
                        >

                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                getStatusStyle(
                                  item.name
                                ).dot,
                            }}
                          />

                          {
                            item.name
                          }

                        </span>

                        <span
                          className="font-bold tabular-nums"
                          style={{
                            color:
                              "#000000",
                          }}
                        >
                          {
                            item.value
                          }
                        </span>

                      </li>

                    )
                  )}

                </ul>

              </>

            ) : (

              <EmptyState message="No applications yet." />

            )}

          </Card>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;