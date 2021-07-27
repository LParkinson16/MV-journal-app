const express = require("express");
const bcrypt = require("bcrypt");
const { User, JournalEntries } = require("./db");
const { generateAccessToken } = require("./auth");

const app = express();
app.use(express.json());

//establish connection with server
app.get('/', (req,res)=>{
    return res.send('working')
});
app.get('/users/:id', (req,res)=>{
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

//delete accounts
app.delete('/users/:id', async (req,res)=>{
   const userId = req.params.id;
   console.log(userId)
   const userToDelete = await User.findByPk(userId);
   try{
       await userToDelete.destroy();
       res.sendStatus(200)
   }catch{
       res.sendStatus(500)
   }
})

// ENTRIES
//create journal entry
app.post('/users/:userId/entries', async (req, res) => {
    const { text } = res.body;
    await JournalEntries.create({ text })
    res.sendStatus(201)
})

//show journal entries
app.get('users/:userId/entries/entriesId', async(req, res)=>{
    const entries = req.params.entriesId;
    const findEntries = await entries.findByPk(entries);
    res.send(findEntries)
})

//delete entries
app.delete('/users/:userId/entries/:entriesId', async (req,res)=>{
    const entryId = req.params.entriesId
    const entryToDelete = await JournalEntries.findByPk(entryId);
    try{
        await entryToDelete.destroy();
        res.sendStatus(200)
    }catch{
        res.sendStatus(500)
    }
})


module.exports = app