"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const health_1 = __importDefault(require("./routes/health"));
const users_1 = __importDefault(require("./routes/users"));
const notifications_1 = __importDefault(require("./routes/notifications"));

dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.use('/', health_1.default);
// API Routes
app.use('/api/users', users_1.default);
app.use('/api/notifications', notifications_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});
// Start server
app.listen(PORT, () => {
    console.log('\n============================================');
    console.log('   Expo Notification Backend Server Started!');
    console.log('============================================\n');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n - Available Endpoints:');
    console.log(`   GET    http://localhost:${PORT}/`);
    console.log(`   POST   http://localhost:${PORT}/api/users/register`);
    console.log(`   GET    http://localhost:${PORT}/api/users/:userId`);
    console.log(`   GET    http://localhost:${PORT}/api/users`);
    console.log(`   POST   http://localhost:${PORT}/api/notifications/send`);
    console.log('\n✅ Backend is ready to accept requests!\n');
});
exports.default = app;
