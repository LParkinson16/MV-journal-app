const express = require("express");
const bcrypt = require("bcrypt");
const { User, JournalEntries } = require("./db");
const { generateAccessToken, verifyToken } = require("./auth");
const jwt = require("jsonwebtoken");
require('dotenv').config()
console.log(process.env.JWT_SECRET)

const app = express();
app.use(express.json());

//establish connection with server
app.get('/', (req, res) => {
    return res.send('working')
});
app.get('/users/:id', (req, res) => {
    return res.send('working')
});

//USER ACCOUNTS 

//creating an account
app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    const userAlreadyExists = await User.findOne({ where: { username } });
    if (userAlreadyExists) {
        return res.sendStatus(400)
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ username, passwordHash })
    res.sendStatus(201)
})

//logging into created account + gives me an access token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.sendStatus(404)
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)
    if (passwordIsCorrect) {
        try {
            const token = await generateAccessToken(user.id);
            res.json(token)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    } else {
        res.sendStatus(403)
    }
})

//delete user accounts with all journal entries included
  app.delete("/users/:userId", async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    await JournalEntries.destroy({
      where: {
        UserId: req.params.userId,
      },
    });
    await user.destroy();
    res.sendStatus(200);
  });

// ENTRIES
//create journal entry + is linked to a user
app.post('/users/:userId/entries', verifyToken, async (req, res) => {
    const userId = req.userId;
    if (userId != req.params.userId) {
        console.log('no match')
        return res.sendStatus(403);
    }
    const UserId = req.params.userId;
    await JournalEntries.create({ title: req.body.title, text: req.body.text, UserId, });
    res.sendStatus(201);
})

//show  all user journal entries
app.get("/users/:userId/entries", async (req, res) => {
    const UserId = req.params.userId;
    const entries = await JournalEntries.findAll({
        where: {
            UserId,
        },
    });
    return res.send(entries)
});

//delete entries
app.delete('/users/:userId/entries/:entriesId', async (req, res) => {
    const entryId = req.params.entriesId
    const entryToDelete = await JournalEntries.findByPk(entryId);
    try {
        await entryToDelete.destroy();
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

module.exports = app