const app = require ('./app')

const { sequelize, User, JournalEntries } = require("./db");

app.listen(3000, ()=>{
    console.log('listening on', 4000)
})