const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Animal = require('../models/Animal');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const Media = require('../models/Media');
// Note: We do NOT use apiKeyMiddleware here because dashboard should work with JWT only

router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let whereClause = {};
        if (role !== 'admin') {
            whereClause.owner_id = userId;
        }

        // Count Animals
        const totalAnimals = await Animal.count({ where: whereClause });

        // Count Records (need to filter by animals owned by user)
        // This is slightly more complex in Sequelize without associations loaded, 
        // but we can query records where animal_id in (user's animals)
        const userAnimals = await Animal.findAll({
            where: whereClause,
            attributes: ['id']
        });
        const animalIds = userAnimals.map(a => a.id);

        const totalRecords = await MedicalRecord.count({
            where: {
                animal_id: animalIds
            }
        });

        // Count Media? Media table is not standard in models yet in my context (controller used file system?)
        // Wait, mediaController used 'Media' model? I need to check if Media model exists.
        // I viewed mediaController, but didn't check Media model file. 
        // Assuming Media model exists and follows similar pattern.
        // Let's check mediaController imports first to be safe, or just skip media count if complex.
        // Actually, mediaController uses `const Media = require('../models/Media');`
        // So I can count it.
        // Count Media
        const totalMedia = await Media.count({
            where: {
                animal_id: animalIds
            }
        });

        res.json({
            totalAnimals,
            totalRecords,
            totalMedia
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Gagal memuat statistik" });
    }
});

module.exports = router;
