const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔒 ADMIN ONLY
function adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
}

/* =========================
   CREATE USER (ADMIN)
========================= */
router.post("/", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User berhasil dibuat" });

    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({ message: "Gagal membuat user" });
    }
});

/* =========================
   GET ALL USERS (ADMIN)
========================= */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
    try {
        const [users] = await sequelize.query(
            "SELECT id, name, email, role, created_at FROM users"
        );
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
});

/* =========================
   UPDATE USER (ADMIN)
========================= */
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({
                message: "Data tidak lengkap"
            });
        }

        if (name.length < 3) {
            return res.status(400).json({ message: "Nama harus minimal 3 karakter" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Format email tidak valid" });
        }

        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({
                message: "Role tidak valid"
            });
        }

        // ❌ Admin tidak boleh edit dirinya sendiri
        if (Number(req.user.id) === Number(id)) {
            return res.status(400).json({
                message: "Tidak bisa mengubah akun sendiri"
            });
        }

        const [, metadata] = await sequelize.query(
            `
            UPDATE users
            SET name = ?, email = ?, role = ?
            WHERE id = ?
            `,
            {
                replacements: [name, email, role, id]
            }
        );

        if (metadata.affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        res.json({ message: "User berhasil diupdate" });

    } catch (error) {
        console.error("EDIT USER ERROR:", error);
        res.status(500).json({
            message: "Gagal mengupdate user"
        });
    }
});

/* =========================
   DELETE USER (ADMIN)
========================= */
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
    try {
        const id = req.params.id;

        // ❌ Admin tidak boleh hapus dirinya sendiri
        if (Number(req.user.id) === Number(id)) {
            return res.status(400).json({
                message: "Tidak bisa menghapus akun sendiri"
            });
        }

        // 1. Ambil list animal_id milik user
        const [animals] = await sequelize.query(
            "SELECT id FROM animals WHERE owner_id = ?",
            { replacements: [id] }
        );
        const animalIds = animals.map(a => a.id);

        if (animalIds.length > 0) {
            // 2. Hapus Media linked to animals
            await sequelize.query(
                "DELETE FROM media WHERE animal_id IN (?)",
                { replacements: [animalIds] }
            );

            // 3. Hapus Medical Records linked to animals
            await sequelize.query(
                "DELETE FROM medical_records WHERE animal_id IN (?)",
                { replacements: [animalIds] }
            );

            // 4. Hapus Animals
            await sequelize.query(
                "DELETE FROM animals WHERE id IN (?)",
                { replacements: [animalIds] }
            );
        }

        // 5. Hapus API Keys linked to user
        await sequelize.query(
            "DELETE FROM api_keys WHERE user_id = ?",
            { replacements: [id] }
        );

        // 6. Akhirnya Hapus User
        const [, metadata] = await sequelize.query(
            "DELETE FROM users WHERE id = ? AND role != 'admin'",
            {
                replacements: [id]
            }
        );

        if (metadata.affectedRows === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan atau tidak bisa dihapus"
            });
        }

        res.json({ message: "User berhasil dihapus" });

    } catch (error) {
        console.error("DELETE USER ERROR:", error);
        res.status(500).json({ message: "Gagal menghapus user" });
    }
});

module.exports = router;
