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
    owner_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'animals',
    timestamps: true,
    underscored: true
});

module.exports = Animal;
