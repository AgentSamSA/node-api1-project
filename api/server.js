const express = require("express");

const User = require("./user-model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.json({ message: "the server is working" });
});

server.get("/api/users", (req, res) => {
    User.findAll()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." });
        });
});

server.get("api/users/:id", (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: `user with id ${id} not found` });
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." });
        });
});

server.post("/api/users", async (req, res) => {
    const user = req.body;

    if (!user.name || !user.bio) {
        res.status(400).json({ errorMessage: "Please provide a name and bio for the user." });
    } else {
        try {
            const newlyCreatedUser = await User.create(user);
            res.status(201).json(newlyCreatedUser);
        } catch (err) {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database." });
        }
    }
});

server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const userChanges = req.body;

    if (!userChanges.name || !userChanges.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user" });
    } else {
        try {
            const updatedUser = await User.update(id.userChanges);
            if (!updatedUser) {
                res.status(404).json({ message: "The user with that specified ID does not exist." });
            } else {
                res.status(200).json(updatedUser);
            }
        } catch (err) {
            res.status(500).json({ errorMessage: "The user information could not be modified." });
        }
    }
});

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;

    User.delete(id)
        .then(deletedUser => {
            if (!deletedUser) {
                res.status(404).json({ message: "The user with that specified ID does not exist." });
            } else {
                res.status(200).json(deletedUser);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed." })
        });
});

module.exports = server;