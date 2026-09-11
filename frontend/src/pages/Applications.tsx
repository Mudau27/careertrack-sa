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

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
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
      await api.put(`/applications/${applicationId}`, {
        status: newStatus,
      });

      await fetchApplications();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to update application."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-8">
        <p style={{ color: "#111827" }}>
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
          style={{ color: "#111827" }}
        >
          Applications
        </h1>

        <p
          className="mt-2"
          style={{ color: "#374151" }}
        >
          Track and update your job applications.
        </p>
      </div>

      <div className="space-y-5">

        {applications.length > 0 ? (
          applications.map((application) => (

            <div
              key={application.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "#111827" }}
                  >
                    {application.title}
                  </h2>

                  <p
                    className="font-medium mt-1"
                    style={{ color: "#2563eb" }}
                  >
                    {application.company}
                  </p>

                  <p
                    className="mt-2"
                    style={{ color: "#374151" }}
                  >
                    {application.location}
                  </p>

                  <p
                    className="text-sm mt-3"
                    style={{ color: "#6b7280" }}
                  >
                    Applied:{" "}
                    {new Date(
                      application.applied_date
                    ).toLocaleDateString("en-ZA")}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "#111827" }}
                  >
                    Application Status
                  </label>

                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatus(
                        application.id,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                    style={{ color: "#111827" }}
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

            </div>

          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p style={{ color: "#6b7280" }}>
              You have no applications yet.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Applications;