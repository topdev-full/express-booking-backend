const express = require('express');
const fetch = require('node-fetch');
const { promisify } = require('util');
const redis = require('redis');

// Import the model
const BookmarkModel = require('../../model/bookmark');
const verifyToken = require('../auth/auth');

const router = express.Router();

const client = redis.createClient({
    port: 6379,
    host: 'localhost',
});

client.on('error', (err) => {
    console.log('Redis client error:', err);
});
client.on('connect', () => {
    console.log('Redis client connected');        
});


// // Promisify the exists, get, and set methods
// const existsAsync = promisify(client.exists).bind(client);
// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Bookmark API is running!'
    });
});

router.get('/search', async (req, res) => {
    const query = req.query.query;
    // Redis database configration
    client.exists(query, async (err, reply) => {
        if (err) {
            console.error('Error checking key existence:', err);
          } else {
            if (reply === 1) {
                console.log(`Query '${query}' exists`);
                client.get(query, (err, value) => {
                    if(err) {
                        console.error('Error getting in redis', err);
                        return res.status(401).send({
                            message: 'Getting redis Error'
                        });
                    }
                    res.status(200).json(JSON.parse(value));
                });
            } else {
                console.log(`Query '${query}' does not exist`);
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
                const data = await response.json();
                client.set(query, JSON.stringify(data), 'EX', 1800, (err, reply) => {
                if (err) {
                    console.error('Error setting value:', err);
                    return res.status(401).send({
                      message: 'Error setting redis'
                    });
                } else {
                    console.log(`Value '${data}' set for key '${query}'`);
                    return res.status(200).json(data);
                }
              });
            }
        }
    });
});

router.get('/list', verifyToken, async (req, res) => {
    const userId = req.user.email;

    try {
        const bookmarks = await BookmarkModel.findAll({ where: {user_id: userId} });
        if(bookmarks) {
            res.json(bookmarks);
        }
    } catch (error) {
        console.log('Error listing Bookmark', error);
        res.status(500).send({
            message: 'Error listing Bookmarks'
        });
    }
});

router.post('/add', verifyToken, async (req, res) => {
    const user_id = req.user.email;
    const {book_id, title, author, link} = req.body;

    try {
        // Check the multiple bookmark exist
        const existBookmark = await BookmarkModel.findOne( {where: {id: book_id}} );
        if(existBookmark) {
            return res.status(400).send({
                message: 'Bookmark already exists'
            });
        }

        // If multiple bookmark is not existed, create a bookmark
        await BookmarkModel.create({
            user_id,
            id: book_id,
            title,
            author,
            link
        });

        // If bookmark is added, send the success message
        console.log('Bookmark is added');
        res.status(200).send({
            message: 'Bookmark is added'
        });
    } catch (error) {
        // If error was occurred, send the error message
        console.log('Bookmark adding error', error);
        res.status(500).send({
            message: 'Bookmark adding error'
        });
    }
});

router.delete('/remove/:id', verifyToken, async (req, res) => {
    const bookmarkId = req.params.id;
    const userId = req.user.email;

    try {
        await BookmarkModel.destroy({ where: { id: bookmarkId, user_id: userId } });
        console.log('Bookmark removed');
        res.status(200).send('Bookmark is removed');
    } catch (error) {
        console.error('Bookmark removal failed:', error);
        res.status(400).send('Bookmark removal failed');
    }
});

module.exports = router;
