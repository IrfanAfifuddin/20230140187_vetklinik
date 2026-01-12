const { Animal, User } = require('../models');

// CREATE (Admin)
exports.createAnimal = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        console.log("REQ USER:", req.user);

        const { name, species, age, owner_id } = req.body;

        if (!name || !species || !age) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        let assignedOwner = req.user.id;
        if (req.user.role === 'admin' && owner_id) {
            assignedOwner = owner_id;
        }

        const animal = await Animal.create({
            name,
            species,
            age,
            owner_id: assignedOwner
        });

        res.status(201).json({
            message: "Data hewan berhasil ditambahkan",
            animal
        });

    } catch (err) {
        console.error("CREATE ANIMAL ERROR:", err);
        res.status(500).json({
            message: "Gagal menambahkan data hewan",
            error: err.message
        });
    }
};

// READ ALL (Admin & User)
// READ ALL (Admin & User)
exports.getAnimals = async (req, res) => {
    try {
        const whereClause = {};
        if (req.user.role !== 'admin') {
            whereClause.owner_id = req.user.id;
        }

        const animals = await Animal.findAll({
            where: whereClause,
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });
        console.log("Animals Found:", animals.length);
        res.json(animals);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data hewan' });
    }
};

// READ BY ID (Admin & User)
exports.getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Data hewan tidak ditemukan' });
        }

        res.json(animal);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data hewan' });
    }
};

// UPDATE (Admin)
exports.updateAnimal = async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Data hewan tidak ditemukan' });
        }

        await animal.update(req.body);

        res.json({
            message: 'Data hewan berhasil diperbarui',
            animal
        });
    } catch (err) {
        res.status(500).json({ message: 'Gagal memperbarui data hewan' });
    }
};

// DELETE (Admin)
exports.deleteAnimal = async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id);

        if (!animal) {
            return res.status(404).json({ message: 'Data hewan tidak ditemukan' });
        }

        await animal.destroy();

        res.json({ message: 'Data hewan berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus data hewan' });
    }
};
