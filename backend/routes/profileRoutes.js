const express = require("express");
const multer = require("multer");

const {
    getProfile,
    updateProfile,
    uploadCV
} = require("../controllers/profileController");

const protect = require(
    "../middleware/authMiddleware"
);

const upload = require(
    "../middleware/uploadMiddleware"
);

const router = express.Router();

router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.post(
    "/profile/cv",
    protect,
    (req, res, next) => {

        upload.single("cv")(
            req,
            res,
            (error) => {

                if (error instanceof multer.MulterError) {

                    if (
                        error.code ===
                        "LIMIT_FILE_SIZE"
                    ) {
                        return res.status(400).json({
                            status: "error",
                            message:
                                "CV must be smaller than 5 MB."
                        });
                    }

                    return res.status(400).json({
                        status: "error",
                        message:
                            `Upload error: ${error.message}`
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