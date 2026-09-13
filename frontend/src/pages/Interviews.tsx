import { useEffect, useState } from "react";
import api from "../services/api";

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

const Interviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchInterviews = async () => {
    try {
      const response = await api.get("/interviews");

      setInterviews(
        response.data.interviews || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch interviews:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const deleteInterview = async (
    interviewId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(interviewId);

      const response = await api.delete(
        `/interviews/${interviewId}`
      );

      alert(
        response.data.message ||
          "Interview deleted successfully."
      );

      await fetchInterviews();
    } catch (error: any) {
      console.error(
        "DELETE INTERVIEW ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete interview."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (
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

  const formatTime = (
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

  const isUpcoming = (
    interviewDate: string
  ) => {
    return (
      new Date(interviewDate) >=
      new Date()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-8">
        <p
          style={{
            color: "#111827",
          }}
        >
          Loading interviews...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{
            color: "#111827",
          }}
        >
          Interviews
        </h1>

        <p
          className="mt-2"
          style={{
            color: "#374151",
          }}
        >
          View and manage your scheduled interviews.
        </p>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-5">
          {interviews.map(
            (interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2
                        className="text-xl font-bold"
                        style={{
                          color:
                            "#111827",
                        }}
                      >
                        {
                          interview.title
                        }
                      </h2>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isUpcoming(
                            interview.interview_date
                          )
                            ? "bg-green-100"
                            : "bg-gray-200"
                        }`}
                        style={{
                          color:
                            "#111827",
                        }}
                      >
                        {isUpcoming(
                          interview.interview_date
                        )
                          ? "Upcoming"
                          : "Past"}
                      </span>
                    </div>

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

                    <p
                      className="mt-2"
                      style={{
                        color:
                          "#374151",
                      }}
                    >
                      Job location:{" "}
                      {
                        interview.job_location
                      }
                    </p>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Date
                        </p>

                        <p
                          className="mt-1"
                          style={{
                            color:
                              "#374151",
                          }}
                        >
                          {formatDate(
                            interview.interview_date
                          )}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Time
                        </p>

                        <p
                          className="mt-1"
                          style={{
                            color:
                              "#374151",
                          }}
                        >
                          {formatTime(
                            interview.interview_date
                          )}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Interview Type
                        </p>

                        <p
                          className="mt-1"
                          style={{
                            color:
                              "#374151",
                          }}
                        >
                          {
                            interview.interview_type ||
                            "Not specified"
                          }
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Location / Link
                        </p>

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
                              className="mt-1 inline-block underline"
                              style={{
                                color:
                                  "#2563eb",
                              }}
                            >
                              Open Meeting Link
                            </a>
                          ) : (
                            <p
                              className="mt-1"
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
                            className="mt-1"
                            style={{
                              color:
                                "#6b7280",
                            }}
                          >
                            Not specified
                          </p>
                        )}
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="mt-5">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Notes
                        </p>

                        <p
                          className="mt-1"
                          style={{
                            color:
                              "#374151",
                          }}
                        >
                          {
                            interview.notes
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        deleteInterview(
                          interview.id
                        )
                      }
                      disabled={
                        deletingId ===
                        interview.id
                      }
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      {deletingId ===
                      interview.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p
            style={{
              color: "#6b7280",
            }}
          >
            You have no scheduled interviews yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Interviews;