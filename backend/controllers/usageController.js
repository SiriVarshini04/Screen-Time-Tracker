const db = require('../config/db');

// @route POST /track-usage
// Called periodically by the frontend. duration is the amount tracked in the last interval (e.g., 1 min)
exports.trackUsage = async (req, res) => {
    try {
        const { website_id, duration } = req.body;
        const userId = req.user.id;

        if (!website_id || duration === undefined) {
            return res.status(400).json({ message: 'Website ID and duration required' });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if record exists for today
        const [existing] = await db.query('SELECT * FROM Usage_Data WHERE user_id = ? AND website_id = ? AND date = ?', [userId, website_id, today]);
        
        if (existing.length > 0) {
            await db.query('UPDATE Usage_Data SET duration = duration + ? WHERE id = ?', [duration, existing[0].id]);
        } else {
            await db.query('INSERT INTO Usage_Data (user_id, website_id, duration, date) VALUES (?, ?, ?, ?)', [userId, website_id, duration, today]);
        }

        res.json({ message: 'Usage tracked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route GET /get-reports
// return usage per website for today and this week
exports.getReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate start of week (7 days ago for simplicity, or Sunday)
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const startOfWeek = d.toISOString().split('T')[0];

        // Daily usage
        const [dailyUsage] = await db.query(`
            SELECT u.duration, w.name, w.url 
            FROM Usage_Data u
            JOIN Websites w ON u.website_id = w.id
            WHERE u.user_id = ? AND u.date = ?
        `, [userId, today]);

        // Weekly usage
        const [weeklyUsage] = await db.query(`
            SELECT SUM(u.duration) as total_duration, w.name, w.url 
            FROM Usage_Data u
            JOIN Websites w ON u.website_id = w.id
            WHERE u.user_id = ? AND u.date >= ? AND u.date <= ?
            GROUP BY u.website_id
        `, [userId, startOfWeek, today]);

        // Total numbers
        const totalDaily = dailyUsage.reduce((acc, curr) => acc + curr.duration, 0);
        const totalWeekly = weeklyUsage.reduce((acc, curr) => acc + Number(curr.total_duration), 0);

        res.json({
            daily: dailyUsage,
            weekly: weeklyUsage,
            totalDaily,
            totalWeekly
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
