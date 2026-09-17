// ==========================================
// CV ANALYZER SERVICE
// ==========================================

// Skills that CareerTrack SA can currently detect
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

const findSkills = (text = "") => {

    const normalizedText =
        normalizeText(text);


    const detectedSkills =
        SKILLS.filter((skill) => {

            return normalizedText.includes(
                skill.toLowerCase()
            );

        });


    return cleanSkills(
        detectedSkills
    );

};


// ==========================================
// REMOVE DUPLICATE / OVERLAPPING SKILLS
// ==========================================

const cleanSkills = (skills) => {

    let cleaned =
        [...new Set(skills)];


    // If Node.js exists,
    // don't also display Node

    if (
        cleaned.includes("node.js")
    ) {

        cleaned =
            cleaned.filter(
                (skill) =>
                    skill !== "node"
            );

    }


    // If REST API exists,
    // don't separately display
    // REST and API

    if (
        cleaned.includes("rest api")
    ) {

        cleaned =
            cleaned.filter(
                (skill) =>
                    skill !== "rest" &&
                    skill !== "api"
            );

    }


    return cleaned;

};


// ==========================================
// ANALYZE CV
// ==========================================

const analyzeCV = (
    cvText,
    jobDescription
) => {

    const cvSkills =
        findSkills(cvText);


    const requiredSkills =
        findSkills(
            jobDescription
        );


    // Skills found in both CV
    // and job description

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


    if (
        requiredSkills.length > 0
    ) {

        matchScore =
            Math.round(
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


    if (
        missingSkills.length > 0
    ) {

        recommendations.push(
            `Consider adding evidence of these relevant skills if you have them: ${missingSkills.join(", ")}.`
        );

    }


    const normalizedCV =
        normalizeText(cvText);


    if (
        !normalizedCV.includes(
            "github"
        )
    ) {

        recommendations.push(
            "Consider adding your GitHub profile to your CV."
        );

    }


    if (
        !normalizedCV.includes(
            "project"
        )
    ) {

        recommendations.push(
            "Add a projects section showing practical work and technologies used."
        );

    }


    if (
        !normalizedCV.includes(
            "experience"
        )
    ) {

        recommendations.push(
            "Make your work experience section clear and easy for recruiters to identify."
        );

    }


    if (
        recommendations.length === 0
    ) {

        recommendations.push(
            "Your CV contains the main technical skills detected in this job description. Review the wording and quantify your achievements where possible."
        );

    }


    // ======================================
    // MATCH RATING
    // ======================================

    let rating =
        "Low Match";


    if (
        matchScore >= 80
    ) {

        rating =
            "Strong Match";

    } else if (
        matchScore >= 60
    ) {

        rating =
            "Good Match";

    } else if (
        matchScore >= 40
    ) {

        rating =
            "Moderate Match";

    }


    // ======================================
    // RETURN ANALYSIS
    // ======================================

    return {

        matchScore,

        rating,

        matchedSkills,

        missingSkills,

        cvSkills,

        requiredSkills,

        recommendations

    };

};


module.exports = {
    analyzeCV,
    findSkills
};