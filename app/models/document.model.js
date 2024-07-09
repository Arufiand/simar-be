module.exports = (sequelize, Sequelize) => {
    const document = sequelize.define("documents", {
        document_name: {
            type: Sequelize.DataTypes.STRING,
            index : true,
            unique : true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        filepath: {
            type: Sequelize.DataTypes.BLOB('long'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        remark: {
            type: Sequelize.DataTypes.STRING,
        },
        uploaderID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
    });

    return document;
};
