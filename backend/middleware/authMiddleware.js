const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token tidak ada' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'name', 'email', 'role']
        });

        if (!user) {
            return res.status(401).json({ message: 'User tidak valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid' });
    }
};
