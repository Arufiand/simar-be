module.exports = (sequelize, Sequelize) => {
    const User_detail = sequelize.define("user_detail", {
        userId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        fullName: {
            type: Sequelize.DataTypes.STRING,
            index : true,
            unique : true,
        },
        birthDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        gender: {
            type: Sequelize.DataTypes.ENUM,
            values: ['man', 'woman'],
            allowNull: false
        },
        divisionID: {
            type : Sequelize.DataTypes.INTEGER,
            references: {
                model: 'divisions',
                key: 'id'
            }
        }
    });

    return User_detail;
};
