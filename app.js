const express = require("express");
const bcrypt = require("bcrypt");
const { User, JournalEntries } = require("./db");
const { generateAccessToken } = require("./auth");
const jwt = require("jsonwebtoken");

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
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ username, passwordHash })
    res.sendStatus(201)
})

//logging into created account
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)
    if (passwordIsCorrect) {
        const token = await generateAccessToken(user.id);
        res.json(token)
    } else {
        res.sendStatus(403)
    }
})

//delete user accounts
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.sendStatus(200);
})

// ENTRIES
//create journal entry
app.post('/users/:userId/entries', async (req, res) => {
    const { text } = req.body;
    await JournalEntries.create({ text })
    res.sendStatus(201)
})

//show  all user journal entries
app.get("users/:userId/entries", async (req, res) => {
    const UserId = req.params.userId;
    await JournalEntry.findAll({
        where: {
            UserId: UserId,
        },
    });
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