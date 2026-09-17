const app = require("./app");

const {
    createInterviewReminders
} = require(
    "./services/interviewReminderService"
);


// ==========================================
// SERVER CONFIGURATION
// ==========================================

const PORT =
    process.env.PORT || 5000;


// ==========================================
// AUTOMATIC INTERVIEW REMINDERS
// ==========================================

const REMINDER_INTERVAL =
    5 * 60 * 1000;


// Run once when backend starts

createInterviewReminders();


// Then check every 5 minutes

setInterval(
    createInterviewReminders,
    REMINDER_INTERVAL
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `CareerTrack SA API running on http://localhost:${PORT}`
        );

        console.log(
            "Interview reminder service is running."
        );

    }
);