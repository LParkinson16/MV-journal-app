const { Sequelize, DataTypes, Model } = require("sequelize");
const path = require('path')

const dbPath = process.env.NODE_ENV === 'test'
    ? ':memory:' 
    : path.join(__dirname, "db.sqlite")


const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
});

//instantiate users in database
class User extends Model { }

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
);

//instantiate journals in database
class JournalEntries extends Model { }

JournalEntries.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: "JournalEntries",
    }
);


User.hasMany(JournalEntries, { as: "entries", foreignKey: "UserId", onDelete: "cascade",});
JournalEntries.belongsTo(User, { foreignKey: "UserId" })

sequelize.sync();

module.exports = { sequelize, User, JournalEntries };