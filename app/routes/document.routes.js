const { authJwt } = require("../middleware");
const controller = require("../controller/document.controller");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    var router = require("express").Router();

    // Create a new Document
    router.post("/", [authJwt.verifyToken, authJwt.isModerator], controller.create);

    // Retrieve all Documents
    router.get("/", [authJwt.verifyToken], controller.findAll);

    // Retrieve a single Document with id
    router.get("/:id",[authJwt.verifyToken, authJwt.isModerator],  controller.findOne);

    // Update a Document with id
    router.put("/:id", [authJwt.verifyToken, authJwt.isModerator], controller.update);

    // Delete a Document with id
    router.delete("/:id",[authJwt.verifyToken, authJwt.isAdmin], controller.delete);

    // Delete all Documents
    router.delete("/",[authJwt.verifyToken, authJwt.isAdmin], controller.deleteAll);

    app.use('/api/documents', router);
};
