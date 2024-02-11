const express = require('express');
const UserModel = require('../../model/users');
const bcrypt = require('bcrypt');

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

module.exports = router;
