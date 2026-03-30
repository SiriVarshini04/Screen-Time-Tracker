const db = require('../config/db');

// @route POST /set-limits
exports.setLimits = async (req, res) => {
    try {
        const { daily_limit, weekly_limit } = req.body;
        const userId = req.user.id;

        if (!daily_limit || !weekly_limit) return res.status(400).json({ message: 'Missing limits' });

        // Update if exists, otherwise insert (though user creation inserts default)
        const [limits] = await db.query('SELECT * FROM Limits WHERE user_id = ?', [userId]);
        if (limits.length > 0) {
            await db.query('UPDATE Limits SET daily_limit = ?, weekly_limit = ? WHERE user_id = ?', [daily_limit, weekly_limit, userId]);
        } else {
            await db.query('INSERT INTO Limits (user_id, daily_limit, weekly_limit) VALUES (?, ?, ?)', [userId, daily_limit, weekly_limit]);
        }

        res.json({ message: 'Limits updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route GET /get-limits
exports.getLimits = async (req, res) => {
    try {
        const userId = req.user.id;
        const [limits] = await db.query('SELECT * FROM Limits WHERE user_id = ?', [userId]);
        if (limits.length > 0) {
            res.json(limits[0]);
        } else {
            res.json({ daily_limit: 120, weekly_limit: 600 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
