const db = require('../config/db');

// @route GET /admin/users
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role FROM Users');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route DELETE /admin/delete-user/:id
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (userId == req.user.id) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        const [userCheck] = await db.query('SELECT role FROM Users WHERE id = ?', [userId]);
        if (userCheck.length > 0 && userCheck[0].role === 'admin') {
             return res.status(400).json({ message: 'Cannot delete other admins' });
        }

        await db.query('DELETE FROM Users WHERE id = ?', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route GET /admin/usage
exports.getAllUsage = async (req, res) => {
    try {
        const [usage] = await db.query(`
            SELECT u.id, u.user_id, us.name as user_name, u.duration, u.date, w.name as website_name 
            FROM Usage_Data u
            JOIN Users us ON u.user_id = us.id
            JOIN Websites w ON u.website_id = w.id
            ORDER BY u.date DESC
        `);
        res.json(usage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route GET /admin/rewards
exports.getAllRewards = async (req, res) => {
    try {
        const [rewards] = await db.query(`
            SELECT r.id, r.user_id, us.name as user_name, r.badge_name, r.date
            FROM Rewards r
            JOIN Users us ON r.user_id = us.id
            ORDER BY r.date DESC
        `);
        res.json(rewards);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
