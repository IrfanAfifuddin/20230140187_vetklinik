require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models'); // Init associations

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();

// Prevent crash on unhandled errors
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR (Uncaught Exception):', err);
    // process.exit(1); // Optional: keep running if safe, or restart
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL ERROR (Unhandled Rejection):', reason);
});
