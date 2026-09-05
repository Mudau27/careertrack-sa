const pool = require("../config/database");

// Get logged-in user's profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 
                u.id,
                u.name,
                u.email,
                u.role,
                p.bio,
                p.location,
                p.phone,
                p.skills,
                p.linkedin_url,
                p.github_url,
                p.cv_url,
                p.created_at,
                p.updated_at
             FROM users u
             LEFT JOIN profiles p ON u.id = p.user_id
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "User not found."
            });
        }

        res.json({
            status: "success",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while retrieving profile."
        });
    }
};

// Update logged-in user's profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            bio,
            location,
            phone,
            skills,
            linkedin_url,
            github_url,
            cv_url
        } = req.body;

        const result = await pool.query(
            `INSERT INTO profiles
                (user_id, bio, location, phone, skills, linkedin_url, github_url, cv_url)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (user_id)
             DO UPDATE SET
                bio = EXCLUDED.bio,
                location = EXCLUDED.location,
                phone = EXCLUDED.phone,
                skills = EXCLUDED.skills,
                linkedin_url = EXCLUDED.linkedin_url,
                github_url = EXCLUDED.github_url,
                cv_url = EXCLUDED.cv_url,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                userId,
                bio || null,
                location || null,
                phone || null,
                skills || null,
                linkedin_url || null,
                github_url || null,
                cv_url || null
            ]
        );

        res.json({
            status: "success",
            message: "Profile updated successfully.",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Update profile error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Server error while updating profile."
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};