import { useEffect, useState } from "react";
import api from "../services/api";

interface SavedJob {
  saved_id: number;
  job_id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_min: string | null;
  salary_max: string | null;
  employment_type: string;
  job_url?: string | null;
}

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [trackingJobId, setTrackingJobId] =
    useState<number | null>(null);

  const [removingJobId, setRemovingJobId] =
    useState<number | null>(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/users/saved-jobs"
      );

      setSavedJobs(
        response.data.jobs || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch saved jobs:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeSavedJob = async (
    jobId: number
  ) => {
    try {
      setRemovingJobId(jobId);

      await api.delete(
        `/jobs/${jobId}/save`
      );

      setSavedJobs((previousJobs) =>
        previousJobs.filter(
          (job) =>
            job.job_id !== jobId
        )
      );
    } catch (error: any) {
      console.error(
        "REMOVE SAVED JOB ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove saved job."
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  const trackApplication = async (
    job: SavedJob
  ) => {
    try {
      setTrackingJobId(
        job.job_id
      );

      const response = await api.post(
        "/applications",
        {
          job_id: job.job_id,
          status: "Applied",
        }
      );

      alert(
        response.data.message ||
          "Application added successfully."
      );
    } catch (error: any) {
      console.error(
        "TRACK APPLICATION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add application."
      );
    } finally {
      setTrackingJobId(null);
    }
  };

  const formatSalary = (
    minimum: string | null,
    maximum: string | null
  ) => {
    if (!minimum && !maximum) {
      return "Salary not specified";
    }

    if (minimum && maximum) {
      return `R${Number(
        minimum
      ).toLocaleString()} - R${Number(
        maximum
      ).toLocaleString()}`;
    }

    if (minimum) {
      return `From R${Number(
        minimum
      ).toLocaleString()}`;
    }

    if (maximum) {
      return `Up to R${Number(
        maximum
      ).toLocaleString()}`;
    }

    return "Salary not specified";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-8">
        <p
          style={{
            color: "#111827",
          }}
        >
          Loading saved jobs...
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
          Saved Jobs
        </h1>

        <p
          className="mt-2"
          style={{
            color: "#374151",
          }}
        >
          Jobs you saved for later.
        </p>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <div
              key={job.saved_id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >
              <h2
                className="text-xl font-bold"
                style={{
                  color: "#111827",
                }}
              >
                {job.title}
              </h2>

              <p
                className="font-semibold mt-1"
                style={{
                  color: "#2563eb",
                }}
              >
                {job.company}
              </p>

              <p
                className="mt-2"
                style={{
                  color: "#374151",
                }}
              >
                {job.location ||
                  "Location not specified"}
              </p>

              {job.employment_type && (
                <p
                  className="mt-2 text-sm font-medium"
                  style={{
                    color: "#6b7280",
                  }}
                >
                  {
                    job.employment_type
                  }
                </p>
              )}

              <p
                className="mt-4"
                style={{
                  color: "#374151",
                }}
              >
                {job.description ||
                  "No description available."}
              </p>

              {job.requirements && (
                <>
                  <p
                    className="mt-4 font-semibold"
                    style={{
                      color:
                        "#111827",
                    }}
                  >
                    Requirements
                  </p>

                  <p
                    className="mt-1"
                    style={{
                      color:
                        "#374151",
                    }}
                  >
                    {
                      job.requirements
                    }
                  </p>
                </>
              )}

              <p
                className="mt-4 font-medium"
                style={{
                  color: "#111827",
                }}
              >
                {formatSalary(
                  job.salary_min,
                  job.salary_max
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    trackApplication(
                      job
                    )
                  }
                  disabled={
                    trackingJobId ===
                    job.job_id
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  {trackingJobId ===
                  job.job_id
                    ? "Adding..."
                    : "Track Application"}
                </button>

                {job.job_url && (
                  <a
                    href={
                      job.job_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    View Job
                  </a>
                )}

                <button
                  onClick={() =>
                    removeSavedJob(
                      job.job_id
                    )
                  }
                  disabled={
                    removingJobId ===
                    job.job_id
                  }
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  {removingJobId ===
                  job.job_id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p
            style={{
              color: "#6b7280",
            }}
          >
            You have no saved jobs yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;