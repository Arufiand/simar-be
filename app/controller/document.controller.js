const db = require("../models");
const Document = db.document;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.document_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tutorial
    const Document = {
        document_name: req.body.document_name,
        filepath: req.body.filepath,
        remark: req.body.remark,
        uploaderID: req.body.uploaderID
    };

    // Save Tutorial in the database
    Document.create(Document)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Document from the database.
exports.findAll = (req, res) => {
    const document_name = req.query.document_name;
    let condition = document_name ? { document_name: { [Op.like]: `%${document_name}%` } } : null;

    Document.findAll({ where: condition })
        .then(data => {
            res.send({res : data});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Documents."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Document.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Document with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Document with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Document.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Document.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Document from the database.
exports.deleteAll = (req, res) => {
    Document.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Document were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Documents."
            });
        });
};

