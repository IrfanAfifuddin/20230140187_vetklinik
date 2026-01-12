const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    species: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'animals',
    timestamps: false   // 🔥 FIX UTAMA
});

module.exports = Animal;
