const request = require("supertest");
const app = require('./app');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const { generateAccessToken, verifyToken } = require("./auth");
const express = require("express");
const { User, JournalEntries, sequelize } = require("./db");
const { response } = require("./app");



const seedData = {
    username: 'James',
    password: 'James123'
}

const passwordHash = bcrypt.hashSync(seedData.password, 10)

describe('journal test suite', () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await User.create({
            username: seedData.username,
            passwordHash: passwordHash
        })
        await JournalEntries.create({ title: 'Test title One', text: 'lorem ipsum dolor doset', userId: 1 })

    });




    test('can create a user', async () => {
        const username = "John"
        const password = "john123"
        const response = await request(app)
            .post('/users')
            .send({ username, password });
        expect(response.status).toBe(201)
        const userDoesExist = await User.findOne({
            where: { username },
        });
        expect(userDoesExist).toBeTruthy();
        const passwordIsCorrect = await bcrypt.compare(password, userDoesExist.passwordHash);
        expect(passwordIsCorrect).toBe(true);

    })


    test('cannot create a duplicate user', async () => {
        const username = "James"
        const password = "James123"
        const response = await request(app)
            .post('/users')
            .send({ username, password });
        expect(response.status).toBe(400)
        const userDoesExist = await User.findOne({
            where: { username },
        });
        expect(userDoesExist).toBeTruthy();
    })

    test('can login to user account', async () => {
        const { username, password } = seedData
        const response = await request(app)
            .post('/login')
            .send({ username, password });
        expect(response.status).toBe(200)
        const userDoesExist = await User.findOne({
            where: { username },
        });
        expect(userDoesExist).toBeTruthy();
    })

    test('can make a journal entry', verifyToken, async () => {
        const { username, password } = seedData
        const response = await request(app)
            .post('/users/1/entries')
        expect(response.status).toBe(201)
        const createdEntry = await JournalEntries.create({ title: 'Test title One', text: 'lorem ipsum dolor doset', userId: 1 })
        expect(createdEntry).toBeTruthy()
    }) //Needs authorisation

    test('can delete a user', async () => {
        const { username, password } = seedData
        const response = await request(app)
            .delete('/users/1')
        expect(response.status).toBe(200)
        const userDoesExist = await User.findOne({
            where: { username }
        })
        expect(userDoesExist).toBe(null)
    })

    test('can delete an induvidual entry', async () => {
        const { username, password } = seedData
        const response = await request(app)
            .delete('/users/1/entries/1')
        expect(response.status).toBe(200)
        const entryDoesExist = await JournalEntries.findOne({
            where: { userId: 1 }
        })
        expect(entryDoesExist).toBe(null)
    })

    test('can return a user entry', async () => {
        const response = await request(app)
            .get('/users/1/entries')
        expect(response.status).toBe(200)
        const entryDoesExist = await JournalEntries.findOne({
            where: { title: 'Test title One' }
        })
        expect(entryDoesExist).toBeTruthy()
    })
})

