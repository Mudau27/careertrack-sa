import { useState } from "react";
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  FileText,
  Sparkles,
} from "lucide-react";

import api from "../services/api";


// ==========================================
// TYPES
// ==========================================

interface Sections {
  contactInformation: boolean;
  professionalSummary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
}

interface Quality {
  hasGithub: boolean;
  hasLinkedIn: boolean;
  hasPortfolio: boolean;
  hasProjects: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasMetrics: boolean;
}

interface Analysis {
  matchScore: number;
  atsScore: number;
  rating: string;

  skillMatchScore: number;
  sectionScore: number;
  qualityScore: number;

  matchedSkills: string[];
  missingSkills: string[];
  cvSkills: string[];
  requiredSkills: string[];

  sections: Sections;
  quality: Quality;

  recommendations: string[];
}


// ==========================================
// SCORE CARD
// ==========================================

const ScoreCard = ({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description: string;
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p
        className="text-sm font-medium"
        style={{ color: "#64748b" }}
      >
        {title}
      </p>

      <div className="flex items-end gap-1 mt-2">
        <span
          className="text-3xl font-bold"
          style={{ color: "#111827" }}
        >
          {score}
        </span>

        <span
          className="text-lg mb-1"
          style={{ color: "#64748b" }}
        >
          %
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{
            width: `${Math.min(
              Math.max(score, 0),
              100
            )}%`,
          }}
        />
      </div>

      <p
        className="text-xs mt-3"
        style={{ color: "#64748b" }}
      >
        {description}
      </p>
    </div>
  );
};


// ==========================================
// CHECK ITEM
// ==========================================

const CheckItem = ({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span
        className="text-sm font-medium"
        style={{ color: "#374151" }}
      >
        {label}
      </span>

      {passed ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">
            Found
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-500">
          <XCircle size={18} />
          <span className="text-sm font-medium">
            Missing
          </span>
        </div>
      )}
    </div>
  );
};


// ==========================================
// MAIN COMPONENT
// ==========================================

const CVAnalyzer = () => {
  const [jobDescription, setJobDescription] =
    useState("");

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ========================================
  // ANALYZE CV
  // ========================================

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError(
        "Please paste a job description first."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await api.post(
        "/cv-analyzer/analyze",
        {
          jobDescription,
        }
      );

      if (!response.data?.analysis) {
        setError(
          "The server did not return CV analysis results."
        );

        return;
      }

      setAnalysis(
        response.data.analysis
      );
    } catch (error: any) {
      console.error(
        "CV Analyzer error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            `CV analysis failed with status ${error.response.status}.`
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the CareerTrack backend. Make sure the backend is running on port 5000."
        );
      } else {
        setError(
          error.message ||
            "Failed to analyze your CV."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FileSearch
              size={28}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "#111827" }}
            >
              CV Analyzer
            </h1>

            <p
              className="mt-1"
              style={{ color: "#64748b" }}
            >
              Compare your CV against a job
              description and identify areas
              for improvement.
            </p>
          </div>
        </div>
      </div>


      {/* INPUT */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText
            size={20}
            className="text-blue-600"
          />

          <h2
            className="text-lg font-semibold"
            style={{ color: "#111827" }}
          >
            Job Description
          </h2>
        </div>

        <p
          className="text-sm mb-4"
          style={{ color: "#64748b" }}
        >
          Paste the complete job description
          below. CareerTrack will compare it
          with the CV uploaded to your profile.
        </p>

        <textarea
          value={jobDescription}
          onChange={(event) =>
            setJobDescription(
              event.target.value
            )
          }
          placeholder="Paste the job description here..."
          rows={12}
          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          style={{ color: "#111827" }}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-700">
              CV Analysis Failed
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loading
            ? "Analyzing CV..."
            : "Analyze My CV"}
        </button>
      </div>


      {/* RESULTS */}

      {analysis && (
        <div className="mt-8 space-y-6">
          {/* ATS SCORE */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#64748b" }}
                >
                  CareerTrack ATS Score
                </p>

                <div className="flex items-end gap-2 mt-1">
                  <span
                    className="text-5xl font-bold"
                    style={{
                      color: "#111827",
                    }}
                  >
                    {analysis.atsScore}
                  </span>

                  <span
                    className="text-2xl mb-1"
                    style={{
                      color: "#64748b",
                    }}
                  >
                    /100
                  </span>
                </div>

                <p
                  className="mt-3 text-lg font-semibold text-blue-600"
                >
                  {analysis.rating}
                </p>
              </div>

              <div className="max-w-md">
                <div className="flex gap-2 items-start">
                  <Target
                    className="text-blue-600 mt-1"
                    size={20}
                  />

                  <p
                    className="text-sm"
                    style={{
                      color: "#64748b",
                    }}
                  >
                    This score estimates how
                    closely your CV matches the
                    supplied job description
                    using skills, CV sections,
                    and CV quality checks.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* SCORE BREAKDOWN */}

          <div>
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "#111827" }}
            >
              Score Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScoreCard
                title="Skill Match"
                score={
                  analysis.skillMatchScore
                }
                description="How many detected job skills also appear in your CV."
              />

              <ScoreCard
                title="CV Completeness"
                score={
                  analysis.sectionScore
                }
                description="Checks whether important CV sections are present."
              />

              <ScoreCard
                title="CV Quality"
                score={
                  analysis.qualityScore
                }
                description="Checks professional links, projects, experience and measurable achievements."
              />
            </div>
          </div>


          {/* SKILLS */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MATCHED */}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2
                  className="text-green-600"
                  size={22}
                />

                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  Matched Skills
                </h2>
              </div>

              {analysis.matchedSkills.length >
              0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p
                  className="text-sm"
                  style={{
                    color: "#64748b",
                  }}
                >
                  No matching technical skills
                  were detected.
                </p>
              )}
            </div>


            {/* MISSING */}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle
                  className="text-red-500"
                  size={22}
                />

                <h2
                  className="text-lg font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  Missing Skills
                </h2>
              </div>

              {analysis.missingSkills.length >
              0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-green-600">
                  No missing detected skills.
                </p>
              )}
            </div>
          </div>


          {/* SECTION CHECKLIST */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2
                className="text-lg font-bold mb-3"
                style={{
                  color: "#111827",
                }}
              >
                CV Section Checklist
              </h2>

              <CheckItem
                label="Contact Information"
                passed={
                  analysis.sections
                    .contactInformation
                }
              />

              <CheckItem
                label="Professional Summary"
                passed={
                  analysis.sections
                    .professionalSummary
                }
              />

              <CheckItem
                label="Work Experience"
                passed={
                  analysis.sections
                    .experience
                }
              />

              <CheckItem
                label="Education"
                passed={
                  analysis.sections
                    .education
                }
              />

              <CheckItem
                label="Skills"
                passed={
                  analysis.sections.skills
                }
              />

              <CheckItem
                label="Projects"
                passed={
                  analysis.sections.projects
                }
              />

              <CheckItem
                label="Certifications"
                passed={
                  analysis.sections
                    .certifications
                }
              />
            </div>


            {/* QUALITY */}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2
                className="text-lg font-bold mb-3"
                style={{
                  color: "#111827",
                }}
              >
                CV Quality Checks
              </h2>

              <CheckItem
                label="GitHub Profile"
                passed={
                  analysis.quality.hasGithub
                }
              />

              <CheckItem
                label="LinkedIn Profile"
                passed={
                  analysis.quality.hasLinkedIn
                }
              />

              <CheckItem
                label="Portfolio"
                passed={
                  analysis.quality.hasPortfolio
                }
              />

              <CheckItem
                label="Projects"
                passed={
                  analysis.quality.hasProjects
                }
              />

              <CheckItem
                label="Experience"
                passed={
                  analysis.quality
                    .hasExperience
                }
              />

              <CheckItem
                label="Education"
                passed={
                  analysis.quality.hasEducation
                }
              />

              <CheckItem
                label="Measurable Achievements"
                passed={
                  analysis.quality.hasMetrics
                }
              />
            </div>
          </div>


          {/* CV SKILLS */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2
              className="text-lg font-bold mb-4"
              style={{ color: "#111827" }}
            >
              Skills Detected in Your CV
            </h2>

            <div className="flex flex-wrap gap-2">
              {analysis.cvSkills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>


          {/* JOB SKILLS */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2
              className="text-lg font-bold mb-4"
              style={{ color: "#111827" }}
            >
              Skills Detected in Job
              Description
            </h2>

            {analysis.requiredSkills.length >
            0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.requiredSkills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium"
                      style={{
                        color: "#374151",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p
                className="text-sm"
                style={{
                  color: "#64748b",
                }}
              >
                No supported technical skills
                were detected in this job
                description.
              </p>
            )}
          </div>


          {/* RECOMMENDATIONS */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb
                size={22}
                className="text-yellow-500"
              />

              <h2
                className="text-lg font-bold"
                style={{
                  color: "#111827",
                }}
              >
                Recommendations
              </h2>
            </div>

            <div className="space-y-3">
              {analysis.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4"
                  >
                    <Sparkles
                      size={18}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />

                    <p
                      className="text-sm"
                      style={{
                        color: "#374151",
                      }}
                    >
                      {recommendation}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>


          {/* DISCLAIMER */}

          <p
            className="text-xs text-center pb-6"
            style={{ color: "#94a3b8" }}
          >
            CareerTrack's ATS score is an
            internal estimate and does not
            represent the scoring algorithm of
            a specific employer or applicant
            tracking system.
          </p>
        </div>
      )}
    </main>
  );
};

export default CVAnalyzer;
