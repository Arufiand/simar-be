const { authJwt } = require("../middleware");
const controller = require("../controller/tutorial.controller.js");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", controller.create);

    // Retrieve all Tutorials
    router.get("/", controller.findAll);

    // Retrieve all published Tutorials
    router.get("/published", controller.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", controller.findOne);

    // Update a Tutorial with id
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);

    // Delete a Tutorial with id
    router.delete("/:id",[authJwt.verifyToken, authJwt.isModerator], controller.delete);

    // Delete all Tutorials
    router.delete("/",[authJwt.verifyToken, authJwt.isModerator], controller.deleteAll);

    app.use('/api/tutorials', router);
};
