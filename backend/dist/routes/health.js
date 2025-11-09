"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /api/health (To get server status)
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Expo Notification Backend Server is running!',
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
