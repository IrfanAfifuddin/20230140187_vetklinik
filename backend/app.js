const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
// app.use(require('helmet')());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/api-keys", require("./routes/apiKeyRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));


app.get('/', (req, res) => res.send('API is running'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
