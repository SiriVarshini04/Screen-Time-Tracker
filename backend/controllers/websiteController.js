const db = require('../config/db');

// @route POST /add-website
exports.addWebsite = async (req, res) => {
    try {
        const { name, url } = req.body;
        const userId = req.user.id;

        if (!name || !url) return res.status(400).json({ message: 'Name and URL are required' });

        await db.query('INSERT INTO Websites (user_id, name, url) VALUES (?, ?, ?)', [userId, name, url]);
        res.status(201).json({ message: 'Website added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route GET /get-websites
exports.getWebsites = async (req, res) => {
    try {
        const [websites] = await db.query('SELECT * FROM Websites WHERE user_id = ?', [req.user.id]);
        res.json(websites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route DELETE /delete-website/:id
exports.deleteWebsite = async (req, res) => {
    try {
        const websiteId = req.params.id;
        await db.query('DELETE FROM Websites WHERE id = ? AND user_id = ?', [websiteId, req.user.id]);
        res.json({ message: 'Website deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
