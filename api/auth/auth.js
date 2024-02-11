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

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne( {where: {email: email} })
        .then(existUser => {
            if(existUser) {
                return res.status(400).send('Email already exists');
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if(err) {
                        console.log('Password hashing failed:', err);
                        res.status(500).send({
                            message: 'Password hashing is failed'
                        });
                    } else {
                        // Create User
                        UserModel.create({
                          email: email,
                          password: hash
                        }).then(user => {
                          console.log('User registered', user);
                          res.status(201).send('User registered');
                        }).catch(err => {
                          console.error('Registration failed:', err);
                          res.status(400).send('Registration failed');
                        });
                    }
                });
            }
        }).catch(err => {
            console.error('Error checking email:', err);
            res.status(500).send('Error checking email');
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    UserModel.findOne({ where: { email: email } })
        .then(user => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Compare passwords
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Password comparison failed:', err);
                return res.status(500).send('Password comparison failed');
            }
            if (match) {
                // Generate JWT token
                const token = jwt.sign({ email: user.email }, 'joseph');
                res.json({ token: 'Bearer ' + token });
            } else {
                res.status(401).send('Incorrect password');
            }
        });
        }).catch(err => {
            console.error('Login failed:', err);
            res.status(500).send('Login failed: ' + err);
        });
})

module.exports = router;
