module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define("documents", {
        document_name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
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

    return Document;
};
