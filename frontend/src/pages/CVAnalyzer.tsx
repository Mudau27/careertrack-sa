import { useState } from "react";

import {
  FileSearch,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";


// ==========================================
// TYPES
// ==========================================

interface AnalysisResult {
  matchScore: number;
  rating: string;
  cvSkills: string[];
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}


// ==========================================
// CV ANALYZER
// ==========================================

const CVAnalyzer = () => {
  const [jobDescription, setJobDescription] =
    useState("");

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // ANALYZE CV
  // ==========================================

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


      if (
        !response.data ||
        !response.data.analysis
      ) {
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
        "CV Analyzer full error:",
        error
      );

      console.error(
        "Response:",
        error.response
      );

      console.error(
        "Request:",
        error.request
      );


      // Backend responded with an error

      if (error.response) {

        const status =
          error.response.status;

        const message =
          error.response.data?.message ||
          "CV analysis request failed.";


        setError(
          `${status}: ${message}`
        );

      }

      // Request was sent but backend
      // could not be reached

      else if (error.request) {

        setError(
          "Cannot connect to the CareerTrack backend. Make sure the backend is running on port 5000."
        );

      }

      // Other error

      else {

        setError(
          error.message ||
          "Failed to analyze your CV."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // SCORE STYLE
  // ==========================================

  const getScoreStyle = (
    score: number
  ) => {

    if (score >= 80) {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }


    if (score >= 60) {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }


    if (score >= 40) {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }


    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    };
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f1f5f9]">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="bg-white border-b border-gray-200 px-8 py-6">

        <div className="flex items-center gap-3">

          <div className="bg-blue-100 p-3 rounded-xl">

            <FileSearch
              size={26}
              className="text-blue-600"
            />

          </div>


          <div>

            <h1
              className="text-3xl font-bold"
              style={{
                color: "#111827",
              }}
            >
              CV Analyzer
            </h1>


            <p
              className="mt-1"
              style={{
                color: "#4b5563",
              }}
            >
              Compare your uploaded CV with
              a job description.
            </p>

          </div>

        </div>

      </header>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="p-8">


        {/* ====================================
            JOB DESCRIPTION
        ==================================== */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <div className="flex items-center gap-2">

            <Target
              size={22}
              className="text-blue-600"
            />


            <h2
              className="text-xl font-bold"
              style={{
                color: "#111827",
              }}
            >
              Job Description
            </h2>

          </div>


          <p
            className="mt-2"
            style={{
              color: "#6b7280",
            }}
          >
            Paste the job description you
            want to compare with your
            uploaded CV.
          </p>


          <textarea
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(
                event.target.value
              );

              if (error) {
                setError("");
              }
            }}
            placeholder="Paste the full job description here..."
            rows={12}
            disabled={loading}
            className="w-full mt-5 border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-100"
            style={{
              color: "#111827",
              backgroundColor:
                loading
                  ? "#f3f4f6"
                  : "#ffffff",
            }}
          />


          {/* Error */}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">

              <div className="flex items-start gap-2">

                <XCircle
                  size={20}
                  className="text-red-600 mt-0.5"
                />


                <div>

                  <p
                    className="font-semibold"
                    style={{
                      color: "#991b1b",
                    }}
                  >
                    CV Analysis Failed
                  </p>


                  <p
                    className="mt-1"
                    style={{
                      color: "#991b1b",
                    }}
                  >
                    {error}
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* Analyze Button */}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >

            {loading ? (
              <>

                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />

                Analyzing...

              </>
            ) : (
              <>

                <FileSearch
                  size={20}
                />

                Analyze My CV

              </>
            )}

          </button>

        </div>


        {/* ====================================
            ANALYSIS RESULTS
        ==================================== */}

        {analysis && (
          <div className="mt-8 space-y-6">


            {/* ==================================
                MATCH SCORE
            ================================== */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-2">

                <Target
                  size={22}
                  className="text-blue-600"
                />


                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  CV Match Result
                </h2>

              </div>


              <div className="mt-6 flex flex-col md:flex-row md:items-center gap-6">


                {/* Score Circle */}

                <div
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center flex-shrink-0"
                  style={
                    getScoreStyle(
                      analysis.matchScore
                    )
                  }
                >

                  <span className="text-4xl font-bold">

                    {analysis.matchScore}%

                  </span>


                  <span className="text-sm font-semibold">

                    Match

                  </span>

                </div>


                {/* Rating */}

                <div>

                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: "#111827",
                    }}
                  >
                    {analysis.rating}
                  </p>


                  <p
                    className="mt-2"
                    style={{
                      color: "#6b7280",
                    }}
                  >

                    {
                      analysis
                        .matchedSkills
                        .length
                    }

                    {" "}of{" "}

                    {
                      analysis
                        .requiredSkills
                        .length
                    }

                    {" "}detected job skills
                    were found in your CV.

                  </p>

                </div>

              </div>

            </div>


            {/* ==================================
                MATCHED + MISSING SKILLS
            ================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


              {/* Matched Skills */}

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                <div className="flex items-center gap-2">

                  <CheckCircle
                    size={22}
                    className="text-green-600"
                  />


                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#111827",
                    }}
                  >
                    Matched Skills
                  </h2>

                </div>


                <p
                  className="mt-2"
                  style={{
                    color: "#6b7280",
                  }}
                >
                  Skills required by the job
                  that were detected in your
                  CV.
                </p>


                <div className="mt-5 flex flex-wrap gap-2">

                  {analysis.matchedSkills.length > 0 ? (

                    analysis.matchedSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p
                      style={{
                        color: "#6b7280",
                      }}
                    >
                      No matching skills were
                      detected.
                    </p>

                  )}

                </div>

              </div>


              {/* Missing Skills */}

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                <div className="flex items-center gap-2">

                  <XCircle
                    size={22}
                    className="text-red-600"
                  />


                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "#111827",
                    }}
                  >
                    Missing Skills
                  </h2>

                </div>


                <p
                  className="mt-2"
                  style={{
                    color: "#6b7280",
                  }}
                >
                  Skills detected in the job
                  description but not in your
                  CV.
                </p>


                <div className="mt-5 flex flex-wrap gap-2">

                  {analysis.missingSkills.length > 0 ? (

                    analysis.missingSkills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p
                      style={{
                        color: "#166534",
                      }}
                    >
                      No required skills are
                      missing.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================
                SKILLS FOUND IN CV
            ================================== */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-2">

                <FileSearch
                  size={22}
                  className="text-blue-600"
                />


                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  Skills Detected in Your CV
                </h2>

              </div>


              <p
                className="mt-2"
                style={{
                  color: "#6b7280",
                }}
              >
                Technical skills CareerTrack
                detected in your uploaded CV.
              </p>


              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.cvSkills.length > 0 ? (

                  analysis.cvSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    No technical skills were
                    detected in the CV.
                  </p>

                )}

              </div>

            </div>


            {/* ==================================
                JOB SKILLS
            ================================== */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-2">

                <Target
                  size={22}
                  className="text-purple-600"
                />


                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  Skills Detected in Job
                </h2>

              </div>


              <p
                className="mt-2"
                style={{
                  color: "#6b7280",
                }}
              >
                Technical requirements
                detected in the job
                description.
              </p>


              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.requiredSkills.length > 0 ? (

                  analysis.requiredSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <p
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    No recognized technical
                    skills were detected in
                    the job description.
                  </p>

                )}

              </div>

            </div>


            {/* ==================================
                RECOMMENDATIONS
            ================================== */}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

              <div className="flex items-center gap-2">

                <Lightbulb
                  size={22}
                  className="text-orange-500"
                />


                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "#111827",
                  }}
                >
                  Recommendations
                </h2>

              </div>


              <p
                className="mt-2"
                style={{
                  color: "#6b7280",
                }}
              >
                Suggestions for improving
                your CV for this job.
              </p>


              <div className="mt-5 space-y-3">

                {analysis.recommendations.length > 0 ? (

                  analysis.recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (

                      <div
                        key={index}
                        className="bg-orange-50 border border-orange-100 rounded-lg p-4"
                      >

                        <div className="flex items-start gap-3">

                          <Lightbulb
                            size={18}
                            className="text-orange-500 mt-0.5 flex-shrink-0"
                          />


                          <p
                            style={{
                              color:
                                "#78350f",
                            }}
                          >
                            {recommendation}
                          </p>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">

                    <p
                      style={{
                        color: "#166534",
                      }}
                    >
                      Your CV already covers
                      the detected requirements
                      well.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default CVAnalyzer;