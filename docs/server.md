# Server Application Documentation
## Overview
This backend application uses Express with various routes and middleware for handling user authentication, payments, signup, and more. It integrates Prisma as an ORM, supports session management with passport, and serves views using the EJS templating engine.


#### Setup

1. **Install Dependencies:**

```
npm install 

```

2. **Environmental Variables**

Create a `.env` file with the following:


```
PORT=3000
SESSION_KEY=your_session_secret_key
DATABASE_URL=your_database_url # Prisma
```

3. **Run the Server**

```
npm run dev

```

The server will run on `http://localhost:3000`

### Middleware Used

- `express-session`: Handles sessions for user authentication.
- `passport`: Used for login with local strategy.
- `cors`: Configures cross-origin requests.
- `morgan`: HTTP request logging.
- `express.json()` / `express.urlencoded()`: Parses incoming requests with JSON and URL-encoded payloads..

## Routes

### 1. Root Route (`GET /`)

- **Description**: Renders the homepage.
- **Response**: EJS view with the variable `{ name: "User" }`.

### 2. Signup and Payment Routes

- `POST /signup-submit` – Handles user signup.
- `POST /payment` – Processes payments.
- `POST /verification` – Verifies user details.

### 3. Create Login

`GET /create-login`

- **Protected**: Only accessible to users with Admin role.
- - **Description**: Renders the login creation page.

`POST /create-login`
- **Description**: Creates a new login entry for employees.



