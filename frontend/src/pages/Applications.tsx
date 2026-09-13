import { useEffect, useState } from "react";
import api from "../services/api";

interface Application {
  id: number;
  job_id: number;
  title: string;
  company: string;
  location: string;
  status: string;
  applied_date: string;
}

interface InterviewForm {
  application_id: number | null;
  interview_date: string;
  interview_type: string;
  location: string;
  notes: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [showInterviewForm, setShowInterviewForm] =
    useState<number | null>(null);

  const [savingInterview, setSavingInterview] =
    useState(false);

  const [interviewForm, setInterviewForm] =
    useState<InterviewForm>({
      application_id: null,
      interview_date: "",
      interview_type: "Online",
      location: "",
      notes: "",
    });

  const fetchApplications = async () => {
    try {
      const response = await api.get(
        "/applications"
      );

      setApplications(
        response.data.applications || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (
    applicationId: number,
    newStatus: string
  ) => {
    try {
      await api.put(
        `/applications/${applicationId}`,
        {
          status: newStatus,
        }
      );

      await fetchApplications();

      if (
        newStatus === "Interview"
      ) {
        setShowInterviewForm(
          applicationId
        );

        setInterviewForm({
          application_id:
            applicationId,
          interview_date: "",
          interview_type:
            "Online",
          location: "",
          notes: "",
        });
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to update application."
      );
    }
  };

  const openInterviewForm = (
    applicationId: number
  ) => {
    setShowInterviewForm(
      applicationId
    );

    setInterviewForm({
      application_id:
        applicationId,
      interview_date: "",
      interview_type:
        "Online",
      location: "",
      notes: "",
    });
  };

  const closeInterviewForm = () => {
    setShowInterviewForm(null);

    setInterviewForm({
      application_id: null,
      interview_date: "",
      interview_type:
        "Online",
      location: "",
      notes: "",
    });
  };

  const handleInterviewChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement
        >
      | React.ChangeEvent<
          HTMLSelectElement
        >
      | React.ChangeEvent<
          HTMLTextAreaElement
        >
  ) => {
    const {
      name,
      value
    } = e.target;

    setInterviewForm(
      (
        previousForm
      ) => ({
        ...previousForm,
        [name]: value,
      })
    );
  };

  const scheduleInterview = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !interviewForm.application_id
    ) {
      alert(
        "Application is missing."
      );

      return;
    }

    if (
      !interviewForm.interview_date
    ) {
      alert(
        "Please select the interview date and time."
      );

      return;
    }

    try {
      setSavingInterview(true);

      const response = await api.post(
        "/interviews",
        {
          application_id:
            interviewForm.application_id,

          interview_date:
            interviewForm.interview_date,

          interview_type:
            interviewForm.interview_type,

          location:
            interviewForm.location,

          notes:
            interviewForm.notes,
        }
      );

      alert(
        response.data.message ||
          "Interview scheduled successfully."
      );

      closeInterviewForm();

      await fetchApplications();
    } catch (error: any) {
      console.error(
        "SCHEDULE INTERVIEW ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to schedule interview."
      );
    } finally {
      setSavingInterview(false);
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
          Loading applications...
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
          Applications
        </h1>

        <p
          className="mt-2"
          style={{
            color: "#374151",
          }}
        >
          Track your applications
          and schedule interviews.
        </p>
      </div>

      <div className="space-y-5">

        {applications.length > 0 ? (
          applications.map(
            (application) => (

              <div
                key={
                  application.id
                }
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{
                        color:
                          "#111827",
                      }}
                    >
                      {
                        application.title
                      }
                    </h2>

                    <p
                      className="font-medium mt-1"
                      style={{
                        color:
                          "#2563eb",
                      }}
                    >
                      {
                        application.company
                      }
                    </p>

                    <p
                      className="mt-2"
                      style={{
                        color:
                          "#374151",
                      }}
                    >
                      {
                        application.location
                      }
                    </p>

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

                    {application.status ===
                      "Interview" && (
                      <button
                        onClick={() =>
                          openInterviewForm(
                            application.id
                          )
                        }
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold"
                      >
                        Schedule Interview
                      </button>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{
                        color:
                          "#111827",
                      }}
                    >
                      Application Status
                    </label>

                    <select
                      value={
                        application.status
                      }
                      onChange={(e) =>
                        updateStatus(
                          application.id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      style={{
                        color:
                          "#111827",
                      }}
                    >
                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Interview">
                        Interview
                      </option>

                      <option value="Offer">
                        Offer
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </div>

                </div>

                {showInterviewForm ===
                  application.id && (

                  <div className="mt-6 border-t border-gray-200 pt-6">

                    <h3
                      className="text-lg font-bold mb-4"
                      style={{
                        color:
                          "#111827",
                      }}
                    >
                      Schedule Interview
                    </h3>

                    <form
                      onSubmit={
                        scheduleInterview
                      }
                      className="space-y-4"
                    >

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
                            interviewForm.interview_date
                          }
                          onChange={
                            handleInterviewChange
                          }
                          required
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
                            interviewForm.interview_type
                          }
                          onChange={
                            handleInterviewChange
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
                            interviewForm.location
                          }
                          onChange={
                            handleInterviewChange
                          }
                          placeholder="Teams link, Zoom link or physical address"
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
                            interviewForm.notes
                          }
                          onChange={
                            handleInterviewChange
                          }
                          rows={4}
                          placeholder="Interview preparation notes..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                          style={{
                            color:
                              "#111827",
                          }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">

                        <button
                          type="submit"
                          disabled={
                            savingInterview
                          }
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2 rounded-lg font-semibold"
                        >
                          {savingInterview
                            ? "Saving..."
                            : "Save Interview"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            closeInterviewForm
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

                    </form>

                  </div>
                )}

              </div>

            )
          )
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p
              style={{
                color: "#6b7280",
              }}
            >
              You have no applications yet.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Applications;