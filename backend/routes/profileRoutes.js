const express = require("express");
const multer = require("multer");

const {
    getProfile,
    updateProfile,
    uploadCV
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// GET PROFILE
// ==========================================

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     description: Returns the authenticated user's account and profile information.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Test User
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                       example: Graduate software developer interested in full-stack development.
 *                     location:
 *                       type: string
 *                       nullable: true
 *                       example: Johannesburg, South Africa
 *                     phone:
 *                       type: string
 *                       nullable: true
 *                       example: "+27 00 000 0000"
 *                     skills:
 *                       type: string
 *                       nullable: true
 *                       example: JavaScript, React, Node.js, PostgreSQL, Git
 *                     linkedin_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://www.linkedin.com/in/example"
 *                     github_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://github.com/example"
 *                     cv_url:
 *                       type: string
 *                       nullable: true
 *                       example: "/uploads/cv.pdf"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while retrieving profile
 */
router.get(
    "/profile",
    protect,
    getProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the logged-in user's profile
 *     description: Creates or updates the authenticated user's professional profile information.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: Graduate software developer interested in full-stack and cloud development.
 *               location:
 *                 type: string
 *                 example: Johannesburg, South Africa
 *               phone:
 *                 type: string
 *                 example: "+27 00 000 0000"
 *               skills:
 *                 type: string
 *                 example: JavaScript, React, Node.js, PostgreSQL, Git
 *               linkedin_url:
 *                 type: string
 *                 example: "https://www.linkedin.com/in/example"
 *               github_url:
 *                 type: string
 *                 example: "https://github.com/example"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while updating profile
 */
router.put(
    "/profile",
    protect,
    updateProfile
);


// ==========================================
// UPLOAD OR REPLACE CV
// ==========================================

/**
 * @swagger
 * /api/users/profile/cv:
 *   post:
 *     summary: Upload or replace the user's CV
 *     description: Uploads a CV for the authenticated user. The uploaded file must satisfy the server's CV upload validation and must be smaller than 5 MB.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: CV file to upload
 *     responses:
 *       200:
 *         description: CV uploaded or replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: CV uploaded successfully.
 *                 cv_url:
 *                   type: string
 *                   example: "/uploads/cv.pdf"
 *       400:
 *         description: No CV selected, invalid file, or file exceeds 5 MB
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while uploading CV
 */
router.post(
    "/profile/cv",
    protect,
    (req, res, next) => {

        upload.single("cv")(
            req,
            res,
            (error) => {

                if (error instanceof multer.MulterError) {

                    if (error.code === "LIMIT_FILE_SIZE") {
                        return res.status(400).json({
                            status: "error",
                            message: "CV must be smaller than 5 MB."
                        });
                    }

                    return res.status(400).json({
                        status: "error",
                        message: `Upload error: ${error.message}`
                    });
                }

                if (error) {
                    return res.status(400).json({
                        status: "error",
                        message: error.message
                    });
                }

                next();
            }
        );
    },
    uploadCV
);


module.exports = router;