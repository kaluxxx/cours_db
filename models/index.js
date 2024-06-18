const Sequelize = require("sequelize");
const dbConfig = require("../db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.soundFiles = require("./soundFile.js")(sequelize, Sequelize);
db.tags = require("./tag.js")(sequelize, Sequelize);
db.soundFileTag = require("./soundFileTag.js")(sequelize, Sequelize);

db.soundFiles.belongsToMany(db.tags, { through: db.soundFileTag, foreignKey: 'SoundFileID' });
db.tags.belongsToMany(db.soundFiles, { through: db.soundFileTag, foreignKey: 'TagID' });

module.exports = db;
