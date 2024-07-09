module.exports = (sequelize, Sequelize) => {
    const division = sequelize.define("divisions", {
        name: {
            type: Sequelize.DataTypes.STRING,
            index : true,
            unique : true,
        },
        description: {
            type: Sequelize.DataTypes.STRING,
        },
    });

    return division;
};
