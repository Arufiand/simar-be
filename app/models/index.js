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

// Many-to-Many relationship between User and Role
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

// One-to-One relationship between User and User_detail
db.user.hasOne(db.user_detail, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.user_detail.belongsTo(db.user, {
    foreignKey: 'userId'
});

// One-to-One relationship between Division and User_detail
db.division.hasOne(db.user_detail, {
    foreignKey: 'divisionID',
    onUpdate: 'CASCADE'
});
db.user_detail.belongsTo(db.division, {
    foreignKey: 'divisionID'
});

// One-to-One relationship between Document and User
db.user.hasOne(db.document, {
    foreignKey: 'uploaderID',
    onDelete: 'CASCADE',  // Cascade delete
    onUpdate: 'CASCADE'   // Cascade update
});

db.document.belongsTo(db.user, {
    foreignKey: 'uploaderID',
    onDelete: 'CASCADE',  // Cascade delete
    onUpdate: 'CASCADE'   // Cascade update
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
