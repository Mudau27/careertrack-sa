const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

const {
    analyzeCV
} = require("../services/cvAnalyzerService");


// ==========================================
// ANALYZE USER CV
// ==========================================

const analyzeUserCV = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            jobDescription
        } = req.body;


        // ======================================
        // VALIDATE JOB DESCRIPTION
        // ======================================

        if (
            !jobDescription ||
            !jobDescription.trim()
        ) {

            return res.status(400).json({
                status: "error",
                message:
                    "Job description is required."
            });

        }


        // ======================================
        // GET USER PROFILE
        // ======================================

        const profileResult =
            await pool.query(
                `SELECT *
                 FROM profiles
                 WHERE user_id = $1`,
                [userId]
            );


        if (
            profileResult.rows.length === 0
        ) {

            return res.status(404).json({
                status: "error",
                message:
                    "Profile not found. Please complete your profile first."
            });

        }


        const profile =
            profileResult.rows[0];


        // ======================================
        // FIND CV PATH
        // ======================================

        const cvPath =
            profile.cv_path ||
            profile.cv_url ||
            profile.cv;


        if (!cvPath) {

            return res.status(400).json({
                status: "error",
                message:
                    "Please upload your CV before using the CV Analyzer."
            });

        }


        // ======================================
        // BUILD FILE PATH
        // ======================================

        let cleanPath =
            String(cvPath)
                .replace(/\\/g, "/")
                .replace(/^\/+/, "");


        // If database contains:
        // uploads/cv.pdf
        //
        // use it directly.
        //
        // If database only contains:
        // cv.pdf
        //
        // automatically add uploads/

        if (
            !cleanPath.startsWith(
                "uploads/"
            )
        ) {

            cleanPath =
                `uploads/${cleanPath}`;

        }


        const absolutePath =
            path.resolve(
                __dirname,
                "..",
                cleanPath
            );


        console.log(
            "Analyzing CV:",
            absolutePath
        );


        // ======================================
        // CHECK FILE EXISTS
        // ======================================

        if (
            !fs.existsSync(
                absolutePath
            )
        ) {

            console.error(
                "CV file not found:",
                absolutePath
            );


            return res.status(404).json({
                status: "error",
                message:
                    "Your uploaded CV file could not be found. Please upload your CV again."
            });

        }


        // ======================================
        // PDF ONLY FOR NOW
        // ======================================

        const extension =
            path.extname(
                absolutePath
            ).toLowerCase();


        if (extension !== ".pdf") {

            return res.status(400).json({
                status: "error",
                message:
                    "The CV Analyzer currently supports PDF CV files only."
            });

        }


        // ======================================
        // READ PDF FILE
        // ======================================

        const pdfBuffer =
            fs.readFileSync(
                absolutePath
            );


        // ======================================
        // LOAD PDF-PARSE
        // ======================================

        const pdfParseModule =
            require("pdf-parse");


        let cvText = "";


        // pdf-parse versions expose slightly
        // different CommonJS APIs.
        //
        // Try the traditional function API first.

        if (
            typeof pdfParseModule ===
            "function"
        ) {

            const pdfData =
                await pdfParseModule(
                    pdfBuffer
                );

            cvText =
                pdfData.text || "";

        }

        // Some versions expose the function
        // through .default

        else if (
            typeof pdfParseModule.default ===
            "function"
        ) {

            const pdfData =
                await pdfParseModule.default(
                    pdfBuffer
                );

            cvText =
                pdfData.text || "";

        }

        // Newer versions may expose PDFParse

        else if (
            pdfParseModule.PDFParse
        ) {

            const parser =
                new pdfParseModule.PDFParse({
                    data: pdfBuffer
                });


            try {

                const result =
                    await parser.getText();

                cvText =
                    result.text || "";

            } finally {

                if (
                    typeof parser.destroy ===
                    "function"
                ) {

                    await parser.destroy();

                }

            }

        }

        else {

            console.error(
                "Unsupported pdf-parse API:",
                Object.keys(
                    pdfParseModule
                )
            );


            return res.status(500).json({
                status: "error",
                message:
                    "The installed PDF reader is not compatible with the CV Analyzer."
            });

        }


        // ======================================
        // CHECK EXTRACTED TEXT
        // ======================================

        if (
            !cvText ||
            !cvText.trim()
        ) {

            return res.status(400).json({
                status: "error",
                message:
                    "No readable text was found in your CV. Please upload a text-based PDF."
            });

        }


        // ======================================
        // ANALYZE CV
        // ======================================

        const analysis =
            analyzeCV(
                cvText,
                jobDescription
            );


        // ======================================
        // SUCCESS
        // ======================================

        return res.json({

            status: "success",

            message:
                "CV analysis completed successfully.",

            analysis

        });


    } catch (error) {

        console.error(
            "CV Analyzer error:",
            error
        );


        return res.status(500).json({

            status: "error",

            message:
                "Server error while analyzing your CV."

        });

    }

};


module.exports = {
    analyzeUserCV
};