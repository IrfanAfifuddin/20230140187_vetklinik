const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    animal_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    treatment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    visit_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    vet_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'medical_records',
    timestamps: false
});

module.exports = MedicalRecord;
