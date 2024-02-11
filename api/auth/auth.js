const express = require('express');
const UserModel = require('../../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Auth API is working!'
    });
});

/** *
 * This is a register function in googlebook backend
* @route /api/auth/register
* @param email, password
* @return send the message to frontend
*/
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check the multiple user by email
        const existUser = await UserModel.findOne( {where: {email: email} });
        if(existUser) {
            return res.status(400).send({
                message: 'Email already exists'
            });
        }
        
        // If user is not multiple, create user account
        const hash = await bcrypt.hash(password, 10); // encrypt the password with hash
        // Create User
        await UserModel.create({
            email: email,
            password: hash
        })        
        console.log(`${email} registered`);
        res.status(201).send({
            message: 'User registered'
        });
    } catch {
        // If error was occurred, send the error message
        console.error('Register Error:', err);
        res.status(500).send({
            message: 'Error in Register'
        });
    }
});

/** *
 * This is a login function in googlebook backend
* @route /api/auth/register
* @param email, password
* @return send the message to frontend
*/
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email address
        const user = await UserModel.findOne({ where: { email: email } });
        if(!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        // If valid email, check the password
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(401).send({
                message: 'Incorrect password'
            });
        }

        // If valid email and password, send JWT token
        const token = jwt.sign({ email: user.email }, 'joseph');
        res.json({
            token: 'Bearer ' + token
        });
    } catch(error) {
        // If error was occurred, send the error message
        console.error('Login failed', error);
        res.status(500).send('Login failed!');
    }
})

module.exports = router;
