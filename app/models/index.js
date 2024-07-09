const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
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

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.user_detail = require("../models/user_detail.model.js")(sequelize, Sequelize);
db.division = require("../models/division.model")(sequelize, Sequelize);
db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.document = require("./document.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles"
});
db.user.belongsToMany(db.role, {
    through: "user_roles"
});

// One-to-One relationship user_detail to user
db.user.hasOne(db.user_detail, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.user_detail.belongsTo(db.user, {
    foreignKey: 'userId'
});
// end One-to-One relationship user_detail to user

db.division.hasOne(db.user_detail, {
    foreignKey: 'divisionID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.user_detail.belongsTo(db.division, {
    foreignKey: 'divisionID'
});

db.document.hasOne(db.user, {
    foreignKey: 'uploaderID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.user.belongsTo(db.document, {
    foreignKey: 'uploaderID'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
