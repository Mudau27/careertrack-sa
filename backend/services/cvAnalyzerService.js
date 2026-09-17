// ==========================================
// CAREERTRACK SA - ATS CV ANALYZER
// ==========================================

const SKILLS = [
    // Frontend
    "javascript",
    "typescript",
    "react",
    "angular",
    "vue",
    "html",
    "css",
    "tailwind",
    "bootstrap",

    // Backend
    "node.js",
    "node",
    "express",
    "php",
    "java",
    "spring boot",
    "c#",
    ".net",
    "python",
    "django",
    "flask",

    // Databases
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "oracle",
    "redis",

    // APIs
    "rest api",
    "rest",
    "graphql",

    // Cloud
    "azure",
    "aws",
    "google cloud",

    // DevOps
    "docker",
    "kubernetes",
    "ci/cd",
    "devops",
    "github actions",
    "linux",

    // Version control
    "git",
    "github",
    "gitlab",

    // Data
    "power bi",
    "excel",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "machine learning",
    "data analysis",
    "data science",

    // Cybersecurity
    "cybersecurity",
    "network security",
    "wireshark",
    "snort",

    // General development
    "agile",
    "scrum",
    "testing",
    "unit testing"
];


// ==========================================
// NORMALIZE TEXT
// ==========================================

const normalizeText = (text = "") => {
    return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
};


// ==========================================
// REMOVE DUPLICATE / OVERLAPPING SKILLS
// ==========================================

const cleanSkills = (skills) => {

    let cleaned = [...new Set(skills)];

    if (cleaned.includes("node.js")) {
        cleaned = cleaned.filter(
            (skill) => skill !== "node"
        );
    }

    if (cleaned.includes("rest api")) {
        cleaned = cleaned.filter(
            (skill) => skill !== "rest"
        );
    }

    return cleaned;
};


// ==========================================
// FIND SKILLS
// ==========================================

const findSkills = (text = "") => {

    const normalizedText = normalizeText(text);

    const detectedSkills = SKILLS.filter(
        (skill) =>
            normalizedText.includes(
                skill.toLowerCase()
            )
    );

    return cleanSkills(detectedSkills);
};


// ==========================================
// CHECK CV SECTIONS
// ==========================================

const analyzeSections = (cvText) => {

    const text = normalizeText(cvText);

    return {
        contactInformation:
            text.includes("@") ||
            text.includes("linkedin"),

        professionalSummary:
            text.includes("summary") ||
            text.includes("profile") ||
            text.includes("objective"),

        experience:
            text.includes("experience") ||
            text.includes("employment") ||
            text.includes("work history"),

        education:
            text.includes("education") ||
            text.includes("university") ||
            text.includes("degree"),

        skills:
            text.includes("skills") ||
            text.includes("technical skills"),

        projects:
            text.includes("projects") ||
            text.includes("project"),

        certifications:
            text.includes("certifications") ||
            text.includes("certificates") ||
            text.includes("certification")
    };
};


// ==========================================
// SECTION SCORE
// ==========================================

const calculateSectionScore = (sections) => {

    const values = Object.values(sections);

    const completed =
        values.filter(Boolean).length;

    return Math.round(
        (completed / values.length) * 100
    );
};


// ==========================================
// JOB SKILL MATCH
// ==========================================

const calculateSkillMatch = (
    cvSkills,
    requiredSkills
) => {

    if (requiredSkills.length === 0) {
        return 0;
    }

    const matchedSkills =
        requiredSkills.filter(
            (skill) =>
                cvSkills.includes(skill)
        );

    return Math.round(
        (
            matchedSkills.length /
            requiredSkills.length
        ) * 100
    );
};


// ==========================================
// CV QUALITY CHECKS
// ==========================================

const analyzeQuality = (cvText) => {

    const text = normalizeText(cvText);

    return {
        hasGithub:
            text.includes("github"),

        hasLinkedIn:
            text.includes("linkedin"),

        hasPortfolio:
            text.includes("portfolio"),

        hasProjects:
            text.includes("project"),

        hasExperience:
            text.includes("experience"),

        hasEducation:
            text.includes("education") ||
            text.includes("university"),

        hasMetrics:
            /\b\d+%|\b\d+\+|\b\d{2,}\b/.test(
                cvText
            )
    };
};


// ==========================================
// GENERATE RECOMMENDATIONS
// ==========================================

const generateRecommendations = ({
    missingSkills,
    sections,
    quality
}) => {

    const recommendations = [];

    if (missingSkills.length > 0) {

        recommendations.push(
            `The job description mentions skills not detected in your CV: ${missingSkills.join(", ")}. Add them only if you genuinely have experience with them.`
        );
    }

    if (!sections.professionalSummary) {
        recommendations.push(
            "Add a short professional summary tailored to the role."
        );
    }

    if (!sections.projects) {
        recommendations.push(
            "Add a Projects section showing practical work and the technologies used."
        );
    }

    if (!sections.certifications) {
        recommendations.push(
            "Consider adding a Certifications section if you have relevant certifications."
        );
    }

    if (!quality.hasGithub) {
        recommendations.push(
            "Add your GitHub profile, especially for software development roles."
        );
    }

    if (!quality.hasLinkedIn) {
        recommendations.push(
            "Add your LinkedIn profile."
        );
    }

    if (!quality.hasPortfolio) {
        recommendations.push(
            "Consider adding a portfolio link to demonstrate your work."
        );
    }

    if (!quality.hasMetrics) {
        recommendations.push(
            "Quantify achievements where possible, for example performance improvements, project results, users supported, or percentages."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Your CV contains the major sections and technical keywords detected for this role. Review each achievement and tailor the wording to the job description."
        );
    }

    return recommendations;
};


// ==========================================
// MAIN ATS ANALYSIS
// ==========================================

const analyzeCV = (
    cvText,
    jobDescription
) => {

    // --------------------------------------
    // Skills
    // --------------------------------------

    const cvSkills =
        findSkills(cvText);

    const requiredSkills =
        findSkills(jobDescription);

    const matchedSkills =
        requiredSkills.filter(
            (skill) =>
                cvSkills.includes(skill)
        );

    const missingSkills =
        requiredSkills.filter(
            (skill) =>
                !cvSkills.includes(skill)
        );


    // --------------------------------------
    // Scores
    // --------------------------------------

    const skillMatchScore =
        calculateSkillMatch(
            cvSkills,
            requiredSkills
        );


    const sections =
        analyzeSections(cvText);


    const sectionScore =
        calculateSectionScore(
            sections
        );


    const quality =
        analyzeQuality(cvText);


    // --------------------------------------
    // Quality score
    // --------------------------------------

    const qualityValues =
        Object.values(quality);

    const qualityScore =
        Math.round(
            (
                qualityValues.filter(Boolean).length /
                qualityValues.length
            ) * 100
        );


    // --------------------------------------
    // Overall ATS score
    //
    // Skills = 60%
    // Sections = 25%
    // Quality = 15%
    // --------------------------------------

    const atsScore =
        Math.round(
            (skillMatchScore * 0.60) +
            (sectionScore * 0.25) +
            (qualityScore * 0.15)
        );


    // --------------------------------------
    // Rating
    // --------------------------------------

    let rating = "Needs Improvement";

    if (atsScore >= 80) {
        rating = "Strong Match";
    } else if (atsScore >= 65) {
        rating = "Good Match";
    } else if (atsScore >= 45) {
        rating = "Moderate Match";
    }


    // --------------------------------------
    // Recommendations
    // --------------------------------------

    const recommendations =
        generateRecommendations({
            missingSkills,
            sections,
            quality
        });


    // --------------------------------------
    // Result
    // --------------------------------------

    return {
        // Keep matchScore for compatibility
        // with the existing frontend.
        matchScore: atsScore,

        atsScore,
        rating,

        skillMatchScore,
        sectionScore,
        qualityScore,

        matchedSkills,
        missingSkills,
        cvSkills,
        requiredSkills,

        sections,
        quality,

        recommendations
    };
};


module.exports = {
    analyzeCV,
    findSkills
};