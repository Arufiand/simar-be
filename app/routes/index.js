module.exports = app => {
    require("./tutorial.routes")(app);
    require("./user.routes")(app);
    require("./auth.routes")(app);
};
