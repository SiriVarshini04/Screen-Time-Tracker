const db = require('../config/db');

// @route GET /get-badges
exports.getBadges = async (req, res) => {
    try {
        const userId = req.user.id;
        const [badges] = await db.query('SELECT * FROM Rewards WHERE user_id = ?', [userId]);

        // Logic check: Let's give them a "Good Start" badge if they don't have any
        if (badges.length === 0) {
            const today = new Date().toISOString().split('T')[0];
            await db.query('INSERT INTO Rewards (user_id, badge_name, date) VALUES (?, ?, ?)', [userId, 'Good Start', today]);
            const [newBadges] = await db.query('SELECT * FROM Rewards WHERE user_id = ?', [userId]);
            return res.json(newBadges);
        }

        res.json(badges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
