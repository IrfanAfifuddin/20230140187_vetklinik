const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Media = sequelize.define('Media', {
    animal_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'media',
    timestamps: false
});

module.exports = Media;
