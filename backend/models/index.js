const User = require('./User');
const Animal = require('./Animal');
const MedicalRecord = require('./MedicalRecord');
const Media = require('./Media');

User.hasMany(Animal, { foreignKey: 'owner_id' });
Animal.belongsTo(User, { foreignKey: 'owner_id' });

Animal.hasMany(MedicalRecord, { foreignKey: 'animal_id' });
MedicalRecord.belongsTo(Animal, { foreignKey: 'animal_id' });

Animal.hasMany(Media, { foreignKey: 'animal_id' });
Media.belongsTo(Animal, { foreignKey: 'animal_id' });

module.exports = {
    User,
    Animal,
    MedicalRecord,
    Media
};
