const SKILLS = [
    "javascript",
    "typescript",
    "react",
    "node.js",
    "node",
    "express",
    "html",
    "css",
    "tailwind",
    "bootstrap",

    "python",
    "java",
    "c#",
    "c++",
    "php",

    "sql",
    "postgresql",
    "mysql",
    "mongodb",

    "rest api",
    "rest",
    "api",

    "git",
    "github",

    "docker",
    "kubernetes",

    "azure",
    "aws",
    "google cloud",

    "ci/cd",
    "devops",

    "linux",

    "cybersecurity",
    "network security",

    "machine learning",
    "tensorflow",
    "scikit-learn",

    "power bi",
    "excel"
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
// FIND SKILLS
// ==========================================

const findSkills = (text) => {

    const normalizedText =
        normalizeText(text);

    return SKILLS.filter((skill) =>
        normalizedText.includes(
            skill.toLowerCase()
        )
    );
};


// ==========================================
// REMOVE DUPLICATE / OVERLAPPING SKILLS
// ==========================================

const cleanSkills = (skills) => {

    const uniqueSkills = [
        ...new Set(skills)
    ];

    return uniqueSkills.filter(
        (skill) => {

            if (
                skill === "node" &&
                uniqueSkills.includes(
                    "node.js"
                )
            ) {
                return false;
            }

            if (
                skill === "rest" &&
                uniqueSkills.includes(
                    "rest api"
                )
            ) {
                return false;
            }

            if (
                skill === "api" &&
                uniqueSkills.includes(
                    "rest api"
                )
            ) {
                return false;
            }

            return true;
        }
    );
};


// ==========================================
// ANALYZE CV AGAINST JOB
// ==========================================

const analyzeCV = (
    cvText,
    jobDescription
) => {

    const cvSkills =
        cleanSkills(
            findSkills(cvText)
        );

    const requiredSkills =
        cleanSkills(
            findSkills(jobDescription)
        );


    // Skills found in both CV and job

    const matchedSkills =
        requiredSkills.filter(
            (skill) =>
                cvSkills.includes(skill)
        );


    // Skills required by job
    // but missing from CV

    const missingSkills =
        requiredSkills.filter(
            (skill) =>
                !cvSkills.includes(skill)
        );


    // ======================================
    // MATCH SCORE
    // ======================================

    let matchScore = 0;

    if (requiredSkills.length > 0) {

        matchScore = Math.round(
            (
                matchedSkills.length /
                requiredSkills.length
            ) * 100
        );
    }


    // ======================================
    // RECOMMENDATIONS
    // ======================================

    const recommendations = [];


    if (missingSkills.length > 0) {

        recommendations.push(
            `Consider developing or highlighting experience with: ${missingSkills.join(", ")}.`
        );
    }


    if (
        !normalizeText(cvText)
            .includes("github")
    ) {

        recommendations.push(
            "Add your GitHub profile or relevant repositories to demonstrate practical development experience."
        );
    }


    if (
        !normalizeText(cvText)
            .includes("project")
    ) {

        recommendations.push(
            "Add a projects section showing practical work and technologies used."
        );
    }


    if (
        !normalizeText(cvText)
            .includes("experience")
    ) {

        recommendations.push(
            "Clearly describe your professional or practical experience."
        );
    }


    if (requiredSkills.length === 0) {

        recommendations.push(
            "The job description does not contain enough recognizable technical skills for an accurate technical match."
        );
    }


    // ======================================
    // RATING
    // ======================================

    let rating = "Low Match";

    if (matchScore >= 80) {
        rating = "Strong Match";
    }
    else if (matchScore >= 60) {
        rating = "Good Match";
    }
    else if (matchScore >= 40) {
        rating = "Moderate Match";
    }


    return {

        matchScore,

        rating,

        cvSkills,

        requiredSkills,

        matchedSkills,

        missingSkills,

        recommendations
    };
};


module.exports = {
    analyzeCV,
    findSkills
};