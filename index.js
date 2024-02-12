const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// import the defined APIs
const authAPI = require('./api/auth/auth');
const bookmarkAPI = require('./api/bookmark/bookmark');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'googlebook_backend'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Check the server is running
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Google Book Backend is working!'
    });
});

// Set the apis by url
app.use('/api/auth', authAPI);
app.use('/api/bookmark', bookmarkAPI);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
