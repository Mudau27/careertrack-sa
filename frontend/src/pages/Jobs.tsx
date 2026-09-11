import { useEffect, useState } from "react";
import api from "../services/api";

interface LocalJob {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_min: string;
  salary_max: string;
  employment_type: string;
}

interface ExternalJob {
  external_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  created: string | null;
  redirect_url: string | null;
  category: string | null;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<LocalJob[]>([]);
  const [externalJobs, setExternalJobs] =
    useState<ExternalJob[]>([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [savingExternalJobId, setSavingExternalJobId] =
    useState<string | null>(null);

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");

        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error(
          "Failed to fetch jobs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (
    jobId: number
  ) => {
    try {
      const response = await api.post(
        "/applications",
        {
          job_id: jobId,
          notes:
            "Applied from CareerTrack SA frontend",
        }
      );

      alert(
        response.data.message ||
          "Application submitted successfully."
      );
    } catch (error: any) {
      console.error(
        "APPLY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to apply for this job."
      );
    }
  };

  const handleSave = async (
    jobId: number
  ) => {
    try {
      const response = await api.post(
        `/jobs/${jobId}/save`
      );

      alert(
        response.data.message ||
          "Job saved successfully."
      );
    } catch (error: any) {
      console.error(
        "SAVE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save job."
      );
    }
  };

  const handleExternalSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSearching(true);

      const response = await api.get(
        "/external-jobs/search",
        {
          params: {
            what,
            where,
          },
        }
      );

      setExternalJobs(
        response.data.jobs || []
      );
    } catch (error: any) {
      console.error(
        "EXTERNAL JOB SEARCH ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to search external jobs."
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSaveExternalJob = async (
    job: ExternalJob
  ) => {
    try {
      setSavingExternalJobId(
        job.external_id
      );

      const response = await api.post(
        "/external-jobs/save",
        {
          external_id:
            job.external_id,

          title:
            job.title,

          company:
            job.company,

          location:
            job.location,

          description:
            job.description,

          salary_min:
            job.salary_min,

          salary_max:
            job.salary_max,

          redirect_url:
            job.redirect_url,

          category:
            job.category,
        }
      );

      alert(
        response.data.message ||
          "External job saved successfully."
      );

    } catch (error: any) {
      console.error(
        "SAVE EXTERNAL JOB ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save external job."
      );

    } finally {
      setSavingExternalJobId(null);
    }
  };

  const formatSalary = (
    minimum: number | null,
    maximum: number | null
  ) => {
    if (!minimum && !maximum) {
      return "Salary not provided";
    }

    if (minimum && maximum) {
      return `R${Math.round(
        minimum
      ).toLocaleString()} - R${Math.round(
        maximum
      ).toLocaleString()}`;
    }

    if (minimum) {
      return `From R${Math.round(
        minimum
      ).toLocaleString()}`;
    }

    return `Up to R${Math.round(
      maximum || 0
    ).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-8">
        <p
          className="text-lg"
          style={{ color: "#111827" }}
        >
          Loading jobs...
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
          Jobs
        </h1>

        <p
          className="mt-2 font-medium"
          style={{ color: "#374151" }}
        >
          Browse CareerTrack SA jobs and
          search live opportunities.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">

        <h2
          className="text-xl font-bold"
          style={{ color: "#111827" }}
        >
          Search Live Jobs
        </h2>

        <p
          className="mt-2"
          style={{ color: "#6b7280" }}
        >
          Search current job listings from
          external job providers.
        </p>

        <form
          onSubmit={handleExternalSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5"
        >

          <input
            type="text"
            value={what}
            onChange={(e) =>
              setWhat(e.target.value)
            }
            placeholder="Job title, e.g. Software Developer"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
            style={{ color: "#111827" }}
          />

          <input
            type="text"
            value={where}
            onChange={(e) =>
              setWhere(e.target.value)
            }
            placeholder="Location, e.g. Johannesburg"
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
            style={{ color: "#111827" }}
          />

          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg px-5 py-3 font-semibold"
          >
            {searching
              ? "Searching..."
              : "Search Jobs"}
          </button>

        </form>
      </div>

      {externalJobs.length > 0 && (
        <div className="mb-10">

          <div className="mb-5">

            <h2
              className="text-2xl font-bold"
              style={{ color: "#111827" }}
            >
              Live Job Results
            </h2>

            <p
              className="mt-1"
              style={{ color: "#6b7280" }}
            >
              {externalJobs.length} jobs found
              on this page.
            </p>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {externalJobs.map((job) => (

              <div
                key={job.external_id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >

                <h3
                  className="text-xl font-bold"
                  style={{ color: "#111827" }}
                >
                  {job.title}
                </h3>

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

                {job.category && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: "#6b7280" }}
                  >
                    {job.category}
                  </p>
                )}

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
                  {formatSalary(
                    job.salary_min,
                    job.salary_max
                  )}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  {job.redirect_url && (
                    <a
                      href={job.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      View Job
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleSaveExternalJob(
                        job
                      )
                    }
                    disabled={
                      savingExternalJobId ===
                      job.external_id
                    }
                    className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    {savingExternalJobId ===
                    job.external_id
                      ? "Saving..."
                      : "Save Job"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

      <div className="mb-5">

        <h2
          className="text-2xl font-bold"
          style={{ color: "#111827" }}
        >
          CareerTrack SA Jobs
        </h2>

        <p
          className="mt-1"
          style={{ color: "#6b7280" }}
        >
          Jobs stored in your CareerTrack SA
          database.
        </p>

      </div>

      {jobs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p style={{ color: "#6b7280" }}>
            No internal jobs are currently
            available.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {jobs.map((job) => (

          <div
            key={job.id}
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
              className="text-sm mt-2"
              style={{ color: "#6b7280" }}
            >
              {job.employment_type}
            </p>

            <p
              className="mt-4"
              style={{ color: "#374151" }}
            >
              {job.description}
            </p>

            <div className="mt-4">

              <p
                className="text-sm font-bold"
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

            </div>

            <div
              className="mt-4 font-medium"
              style={{ color: "#111827" }}
            >
              R{job.salary_min} - R
              {job.salary_max}
            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  handleApply(job.id)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Apply
              </button>

              <button
                onClick={() =>
                  handleSave(job.id)
                }
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Save Job
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Jobs;