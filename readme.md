# Book Search and Bookmarking Backend

This is a simple book search and bookmarking application where users can search for books using the Google Books API, register with email and password, login to their accounts, add books to their bookmark list, list their bookmarks, and remove books from their bookmarks.

## User Stories

- **Search Books**: Users can search for books by title, author, or keywords using the Google Books API.
- **User Registration**: Users can register with their email and password.
- **User Login**: Users can login to their accounts using their registered email and password.
- **Add Bookmarks**: Logged-in users can add books to their bookmark list.
- **List Bookmarks**: Logged-in users can list their bookmarks.
- **Remove Bookmarks**: Logged-in users can remove books from their bookmarks.
- **Prevent Duplicate Bookmarks**: Users cannot bookmark the same book twice.

## Technologies Used

- Node.js
- Express.js
- MySQL
- Google Books API
- bcrypt for password hashing
- jsonwebtoken for authentication
- body-parser for parsing JSON requests

## Setup Instructions

### 1. Clone the repository:
    ```
    git clone <repository_url>
    ```
### 2. Install dependencies:
    ```
    npm install
    ```
### 3. Set up your MySQL database:

- Create a database named `book_search_bookmark`.
- Import the database schema from the `database_schema.sql` file.

### 4. Configure environment variables:

- Create a `.env` file in the root directory.
- Define the following environment variables:

    ```
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=book_search_bookmark
    JWT_SECRET=your_jwt_secret
    ```

### 5. Start the application:
    ```
    npm start
    ```
    
## API Endpoints

1. **User Registration**
   - `POST /register`: Register a new user with email and password.

2. **User Login**
   - `POST /login`: Login with registered email and password. Returns a JWT token.

3. **Book Search**
   - `GET /search?query=search_query`: Search for books by title, author, or keywords.

4. **Add Bookmark**
   - `POST /bookmarks/add`: Add a book to the user's bookmark list.

5. **List Bookmarks**
   - `GET /bookmarks`: List all bookmarks of the logged-in user.

6. **Remove Bookmark**
   - `DELETE /bookmarks/remove/:id`: Remove a book from the user's bookmark list by book ID.

## Contributors

- Ihor Kompanets

Feel free to contribute by submitting pull requests or opening issues.

