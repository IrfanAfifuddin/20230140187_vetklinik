const { Animal, MedicalRecord, Media } = require('../models');

exports.getStats = async (req, res) => {
    try {
        const totalAnimals = await Animal.count();
        const totalRecords = await MedicalRecord.count();
        const totalMedia = await Media.count();

        res.json({
            totalAnimals,
            totalRecords,
            totalMedia
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};
