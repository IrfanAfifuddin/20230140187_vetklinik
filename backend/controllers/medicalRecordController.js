const { MedicalRecord, Animal, User } = require('../models');

// ADMIN ONLY
exports.createRecord = async (req, res) => {
    try {
        const { animal_id, diagnosis, treatment, visit_date, vet_name, notes } = req.body;

        const animal = await Animal.findByPk(animal_id);
        if (!animal) {
            return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        }

        const record = await MedicalRecord.create({
            animal_id,
            diagnosis,
            treatment,
            visit_date,
            vet_name,
            notes
        });

        res.status(201).json({
            message: 'Rekam medis berhasil ditambahkan',
            record
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal menambahkan rekam medis' });
    }
};

// ADMIN & OWNER
exports.getRecordsByAnimal = async (req, res) => {
    try {
        const animalId = req.params.animal_id;

        const animal = await Animal.findByPk(animalId);
        if (!animal) {
            return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        }

        // user hanya boleh akses hewan miliknya
        if (req.user.role !== 'admin' && animal.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const records = await MedicalRecord.findAll({
            where: { animal_id: animalId },
            include: [{
                model: Animal,
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }],
            order: [['visit_date', 'DESC']]
        });

        res.json(records);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil rekam medis' });
    }
};
// UPDATE (Admin)
exports.updateRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
        }

        await record.update(req.body);

        res.json({
            message: 'Rekam medis berhasil diperbarui',
            record
        });
    } catch (err) {
        res.status(500).json({ message: 'Gagal memperbarui rekam medis' });
    }
};

// DELETE (Admin)
exports.deleteRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
        }

        await record.destroy();

        res.json({ message: 'Rekam medis berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus rekam medis' });
    }
};
