const Transaction = require('../models/transactions.model.js');

// Create and Save a new Transaction
exports.create = (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Transaction content can not be empty"
        });
    }

    // Create a Transaction
    const note = new Transaction({
        tansactionID: req.body.title || "Untitled Transaction",
        walletID: req.body.content
    });

    // Save Transaction in the database
    note.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Transaction."
            });
        });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Transaction.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Transaction.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Transaction content can not be empty"
        });
    }

    // Find note and update it with the request body
    Transaction.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Transaction",
        content: req.body.content
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Transaction.findByIdAndRemove(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            res.send({ message: "Transaction deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
};