const { Media, Animal, User } = require('../models');
const fs = require('fs');
const path = require('path');

exports.deleteMedia = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const media = await Media.findByPk(mediaId);

        if (!media) {
            return res.status(404).json({ message: 'Media tidak ditemukan' });
        }

        // Check ownership or admin
        // Note: For simplicity, assuming Admin mainly uses this, or Owner.
        // If strict owner check needed:
        // const animal = await Animal.findByPk(media.animal_id);
        // if (req.user.role !== 'admin' && animal.owner_id !== req.user.id) return 403...

        // Delete from filesystem
        const filePath = path.join(__dirname, '..', media.file_path);

        // Check if file exists before trying to delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await media.destroy();

        res.json({ message: 'Media berhasil dihapus' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal menghapus media' });
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        console.log("REQ.FILE =", req.file);
        console.log("REQ.BODY =", req.body);
        console.log(req.file);

        const { animal_id } = req.body;

        const animal = await Animal.findByPk(animal_id);
        if (!animal) {
            return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        }

        // user hanya boleh upload ke hewannya
        if (req.user.role !== 'admin' && animal.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'File tidak ditemukan' });
        }

        const media = await Media.create({
            animal_id,
            file_name: file.originalname,
            file_path: `uploads/images/${file.filename}`,
            file_type: file.mimetype
        });


        res.status(201).json({
            message: 'File berhasil diupload',
            media
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal upload file' });
    }
};

exports.getMediaByAnimal = async (req, res) => {
    try {
        const animalId = req.params.animal_id;

        const animal = await Animal.findByPk(animalId);
        if (!animal) {
            return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        }

        if (req.user.role !== 'admin' && animal.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const media = await Media.findAll({
            where: { animal_id: animalId },
            include: [{
                model: Animal,
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }]
        });

        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil media' });
    }
};
