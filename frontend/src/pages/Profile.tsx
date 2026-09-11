import { useEffect, useState } from "react";
import api from "../services/api";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  location: string | null;
  phone: string | null;
  skills: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
}

const Profile = () => {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    phone: "",
    skills: "",
    linkedin_url: "",
    github_url: "",
    cv_url: "",
  });

  const [cvFile, setCvFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingCV, setUploadingCV] =
    useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get(
        "/users/profile"
      );

      const data = response.data.profile;

      setProfile(data);

      setFormData({
        bio: data.bio || "",
        location: data.location || "",
        phone: data.phone || "",
        skills: data.skills || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        cv_url: data.cv_url || "",
      });

    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put(
        "/users/profile",
        {
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          skills: formData.skills,
          linkedin_url:
            formData.linkedin_url,
          github_url:
            formData.github_url,
        }
      );

      alert(
        response.data.message ||
          "Profile updated successfully."
      );

      await fetchProfile();

    } catch (error: any) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );

    } finally {
      setSaving(false);
    }
  };

  const handleCVChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please select a PDF, DOC or DOCX file."
      );

      e.target.value = "";
      setCvFile(null);

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "CV must be smaller than 5 MB."
      );

      e.target.value = "";
      setCvFile(null);

      return;
    }

    setCvFile(file);
  };

  const handleCVUpload = async () => {
    if (!cvFile) {
      alert("Please select a CV first.");
      return;
    }

    try {
      setUploadingCV(true);

      const uploadData = new FormData();

      uploadData.append("cv", cvFile);

      const response = await api.post(
        "/users/profile/cv",
        uploadData
      );

      alert(
        response.data.message ||
          "CV uploaded successfully."
      );

      setCvFile(null);

      await fetchProfile();

    } catch (error: any) {
      console.error(
        "CV UPLOAD ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to upload CV."
      );

    } finally {
      setUploadingCV(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] p-8">
        <p style={{ color: "#111827" }}>
          Loading profile...
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
          Profile
        </h1>

        <p
          className="mt-2"
          style={{ color: "#374151" }}
        >
          Manage your personal and
          professional information.
        </p>
      </div>

      <div className="max-w-4xl">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2
            className="text-xl font-bold mb-5"
            style={{ color: "#111827" }}
          >
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Name
              </label>

              <input
                value={profile?.name || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                style={{ color: "#111827" }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Email
              </label>

              <input
                value={profile?.email || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                style={{ color: "#111827" }}
              />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2
            className="text-xl font-bold"
            style={{ color: "#111827" }}
          >
            Curriculum Vitae
          </h2>

          <p
            className="mt-2"
            style={{ color: "#6b7280" }}
          >
            Upload your CV in PDF, DOC or DOCX
            format. Maximum size is 5 MB.
          </p>

          <div className="mt-5">

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCVChange}
              className="block w-full border border-gray-300 rounded-lg p-3 bg-white"
              style={{ color: "#111827" }}
            />

          </div>

          {cvFile && (
            <p
              className="mt-3 text-sm"
              style={{ color: "#374151" }}
            >
              Selected: {cvFile.name}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-5">

            <button
              type="button"
              onClick={handleCVUpload}
              disabled={
                !cvFile || uploadingCV
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold"
            >
              {uploadingCV
                ? "Uploading..."
                : "Upload CV"}
            </button>

            {profile?.cv_url && (
              <a
                href={`http://localhost:5000${profile.cv_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
              >
                View CV
              </a>
            )}

          </div>

          {profile?.cv_url && (
            <p
              className="mt-4 text-sm"
              style={{ color: "#16a34a" }}
            >
              ✓ CV uploaded
            </p>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >

          <h2
            className="text-xl font-bold mb-6"
            style={{ color: "#111827" }}
          >
            Professional Profile
          </h2>

          <div className="space-y-5">

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell employers about yourself..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                style={{ color: "#111827" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#374151" }}
                >
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Johannesburg, South Africa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  style={{ color: "#111827" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#374151" }}
                >
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  style={{ color: "#111827" }}
                />
              </div>

            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL, JavaScript"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                style={{ color: "#111827" }}
              />

              <p
                className="text-sm mt-2"
                style={{ color: "#6b7280" }}
              >
                Separate skills using commas.
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                style={{ color: "#111827" }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                GitHub URL
              </label>

              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                style={{ color: "#111827" }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;