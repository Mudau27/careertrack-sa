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

interface EditForm {
  interview_date: string;
  interview_type: string;
  location: string;
  notes: string;
}

const Interviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [savingId, setSavingId] =
    useState<number | null>(null);

  const [editForm, setEditForm] =
    useState<EditForm>({
      interview_date: "",
      interview_type: "Online",
      location: "",
      notes: "",
    });

  const fetchInterviews = async () => {
    try {
      const response = await api.get(
        "/interviews"
      );

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
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this interview?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        interviewId
      );

      const response =
        await api.delete(
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

  const convertToDateTimeLocal = (
    interviewDate: string
  ) => {
    const date =
      new Date(interviewDate);

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const startEditing = (
    interview: Interview
  ) => {
    setEditingId(
      interview.id
    );

    setEditForm({
      interview_date:
        convertToDateTimeLocal(
          interview.interview_date
        ),

      interview_type:
        interview.interview_type ||
        "Online",

      location:
        interview.location || "",

      notes:
        interview.notes || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);

    setEditForm({
      interview_date: "",
      interview_type: "Online",
      location: "",
      notes: "",
    });
  };

  const handleEditChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const updateInterview = async (
    interviewId: number
  ) => {
    if (
      !editForm.interview_date
    ) {
      alert(
        "Please select an interview date and time."
      );

      return;
    }

    try {
      setSavingId(
        interviewId
      );

      const response =
        await api.put(
          `/interviews/${interviewId}`,
          {
            interview_date:
              editForm.interview_date,

            interview_type:
              editForm.interview_type,

            location:
              editForm.location,

            notes:
              editForm.notes,
          }
        );

      alert(
        response.data.message ||
          "Interview updated successfully."
      );

      setEditingId(null);

      await fetchInterviews();
    } catch (error: any) {
      console.error(
        "UPDATE INTERVIEW ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update interview."
      );
    } finally {
      setSavingId(null);
    }
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
          View, reschedule and manage your interviews.
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

                    {editingId ===
                    interview.id ? (
                      <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">

                        <h3
                          className="text-lg font-bold"
                          style={{
                            color:
                              "#111827",
                          }}
                        >
                          Edit Interview
                        </h3>

                        <div>
                          <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            Interview Date
                            and Time
                          </label>

                          <input
                            type="datetime-local"
                            name="interview_date"
                            value={
                              editForm.interview_date
                            }
                            onChange={
                              handleEditChange
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                            style={{
                              color:
                                "#111827",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            Interview Type
                          </label>

                          <select
                            name="interview_type"
                            value={
                              editForm.interview_type
                            }
                            onChange={
                              handleEditChange
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            <option value="Online">
                              Online
                            </option>

                            <option value="Phone">
                              Phone
                            </option>

                            <option value="In-person">
                              In-person
                            </option>

                            <option value="Technical">
                              Technical
                            </option>

                            <option value="Assessment">
                              Assessment
                            </option>

                            <option value="Other">
                              Other
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            Location /
                            Meeting Link
                          </label>

                          <input
                            type="text"
                            name="location"
                            value={
                              editForm.location
                            }
                            onChange={
                              handleEditChange
                            }
                            placeholder="Teams link, Zoom link or address"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                            style={{
                              color:
                                "#111827",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            Notes
                          </label>

                          <textarea
                            name="notes"
                            value={
                              editForm.notes
                            }
                            onChange={
                              handleEditChange
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                            style={{
                              color:
                                "#111827",
                            }}
                          />
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              updateInterview(
                                interview.id
                              )
                            }
                            disabled={
                              savingId ===
                              interview.id
                            }
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg font-semibold"
                          >
                            {savingId ===
                            interview.id
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            onClick={
                              cancelEditing
                            }
                            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg font-semibold"
                            style={{
                              color:
                                "#111827",
                            }}
                          >
                            Cancel
                          </button>
                        </div>

                      </div>
                    ) : (
                      <>
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
                              Location /
                              Link
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
                      </>
                    )}
                  </div>

                  {editingId !==
                    interview.id && (
                    <div className="flex flex-wrap lg:flex-col gap-3">
                      <button
                        onClick={() =>
                          startEditing(
                            interview
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                      >
                        Edit
                      </button>

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
                  )}
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