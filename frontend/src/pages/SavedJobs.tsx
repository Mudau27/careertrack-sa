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
  salary_min: string;
  salary_max: string;
  employment_type: string;
}

const SavedJobs = () => {``
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get("/users/saved-jobs");
      setSavedJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeSavedJob = async (jobId: number) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      await fetchSavedJobs();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to remove saved job."
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p style={{ color: "#111827" }}>
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
          style={{ color: "#111827" }}
        >
          Saved Jobs
        </h1>

        <p
          className="mt-2"
          style={{ color: "#374151" }}
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
                style={{ color: "#111827" }}
              >
                {job.title}
              </h2>

              <p
                className="font-semibold mt-1"
                style={{ color: "#2563eb" }}
              >
                {job.company}
              </p>

              <p
                className="mt-2"
                style={{ color: "#374151" }}
              >
                {job.location}
              </p>

              <p
                className="mt-4"
                style={{ color: "#374151" }}
              >
                {job.description}
              </p>

              <p
                className="mt-4 font-semibold"
                style={{ color: "#111827" }}
              >
                Requirements
              </p>

              <p
                className="mt-1"
                style={{ color: "#374151" }}
              >
                {job.requirements}
              </p>

              <p
                className="mt-4 font-medium"
                style={{ color: "#111827" }}
              >
                R{job.salary_min} - R{job.salary_max}
              </p>

              <button
                onClick={() => removeSavedJob(job.job_id)}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p style={{ color: "#6b7280" }}>
            You have no saved jobs yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;