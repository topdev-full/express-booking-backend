const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const authAPI = require('./api/auth/auth');

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

// // Register route
// app.post('/register', (req, res) => {
//   const { email, password } = req.body;

//   // Hash password
//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) throw err;
//     // Store email and hashed password in database
//     db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, result) => {
//       if (err) throw err;
//       console.log('User registered');
//       res.status(201).send('User registered');
//     });
//   });
// });

// // Login route
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Find user by email
//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err) throw err;
//     if (results.length > 0) {
//       const user = results[0];
//       // Compare hashed password
//       bcrypt.compare(password, user.password, (err, match) => {
//         if (err) throw err;
//         if (match) {
//           // Generate JWT token
//           const token = jwt.sign({ email: user.email }, 'your_secret_key');
//           res.json({ token });
//         } else {
//           res.status(401).send('Incorrect password');
//         }
//       });
//     } else {
//       res.status(404).send('User not found');
//     }
//   });
// });

// // Protected route
// app.get('/protected', (req, res) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return res.status(401).send('Access denied. No token provided');
//   }

//   try {
//     const decoded = jwt.verify(token, 'your_secret_key');
//     req.user = decoded;
//     res.send('You are authorized');
//   } catch (error) {
//     res.status(400).send('Invalid token');
//   }
// });

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Google Book Backend is working!'
    });
});

app.use('/api/auth', authAPI);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
