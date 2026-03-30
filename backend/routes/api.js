const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdminToken } = require('../middleware/auth');

// Controllers
const authCtrl = require('../controllers/authController');
const websiteCtrl = require('../controllers/websiteController');
const limitCtrl = require('../controllers/limitController');
const usageCtrl = require('../controllers/usageController');
const rewardCtrl = require('../controllers/rewardController');
const adminCtrl = require('../controllers/adminController');

// --- Auth Routes ---
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/admin/login', authCtrl.adminLogin);

// --- User Protected Routes ---
// Websites
router.post('/add-website', verifyToken, websiteCtrl.addWebsite);
router.get('/get-websites', verifyToken, websiteCtrl.getWebsites);
router.delete('/delete-website/:id', verifyToken, websiteCtrl.deleteWebsite);

// Limits
router.post('/set-limits', verifyToken, limitCtrl.setLimits);
router.get('/get-limits', verifyToken, limitCtrl.getLimits);

// Usage
router.post('/track-usage', verifyToken, usageCtrl.trackUsage);
router.get('/get-reports', verifyToken, usageCtrl.getReports);

// Rewards
router.get('/get-badges', verifyToken, rewardCtrl.getBadges);

// --- Admin Protected Routes ---
router.get('/admin/users', verifyAdminToken, adminCtrl.getUsers);
router.delete('/admin/delete-user/:id', verifyAdminToken, adminCtrl.deleteUser);
router.get('/admin/usage', verifyAdminToken, adminCtrl.getAllUsage);
router.get('/admin/rewards', verifyAdminToken, adminCtrl.getAllRewards);

module.exports = router;
