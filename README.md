# Fullstack Chat App

A full-stack MERN real-time chat application with authentication, one-to-one messaging, image sharing, online user presence, customizable themes, and an AI assistant chat powered through OpenRouter/OpenAI-compatible APIs.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [API Endpoints](#api-endpoints)
- [Socket.IO Events](#socketio-events)
- [Available Scripts](#available-scripts)
- [Notes and Known Issues](#notes-and-known-issues)

## Features

- User signup, login, logout, and session checking
- JWT authentication stored in an HTTP-only cookie
- Protected API routes using authentication middleware
- Password hashing with bcrypt
- Real-time messaging with Socket.IO
- Online/offline user status
- One-to-one chat history stored in MongoDB
- Image messages uploaded to Cloudinary
- Profile image upload and update
- AI assistant conversation using OpenRouter via the OpenAI SDK
- Responsive React UI built with Vite
- Zustand state management for auth, chat, and theme state
- Theme selection using Tailwind CSS and DaisyUI
- Toast notifications with react-hot-toast

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS
- DaisyUI
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Socket.IO
- JSON Web Token
- bcrypt
- cookie-parser
- CORS
- Cloudinary
- OpenAI SDK using OpenRouter base URL
- dotenv

## Project Structure

```text
fullstackk-chat-app/
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/
│       │   └── dotenv.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── messageController.js
│       ├── db/
│       │   └── db.js
│       ├── lib/
│       │   ├── cloudinary.js
│       │   ├── generateToken.js
│       │   └── socket.js
│       ├── middlewares/
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── messageModel.js
│       │   └── userModel.js
│       └── routes/
│           ├── authRoutes.js
│           └── messageRoutes.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       ├── constants/
│       ├── lib/
│       ├── pages/
│       └── store/
├── package.json
└── README.md
```

## How It Works

### Authentication Flow

1. A user signs up or logs in from the React frontend.
2. The frontend sends credentials to the backend using Axios with `withCredentials: true`.
3. The backend validates the request, hashes or compares passwords with bcrypt, and creates a JWT.
4. The JWT is saved in a cookie named `jwt`.
5. Protected routes use `protectRoute` middleware to verify the cookie and attach the authenticated user to `req.user`.
6. The frontend calls `/api/auth/check` to restore the authenticated session on page refresh.

### Messaging Flow

1. Authenticated users are fetched from `/api/messages/users`, excluding the current user.
2. Selecting a user loads message history from `/api/messages/:id`.
3. Sending a message posts to `/api/messages/send/:id`.
4. Normal chat messages are saved to MongoDB.
5. If the receiver is online, Socket.IO emits `receiveMessage` to update the UI in real time.
6. Image messages are uploaded to Cloudinary and the Cloudinary URL is stored in MongoDB.

### AI Assistant Flow

1. The sidebar includes a virtual user with ID `ai-chat`.
2. Messages sent to `ai-chat` are saved as user messages.
3. The backend sends the message text to OpenRouter using the OpenAI SDK.
4. The AI response is stored as an AI message in MongoDB.
5. AI chat history is retrieved using the same message history endpoint.

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB database connection string
- Cloudinary account
- OpenRouter API key

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Variable Descriptions

| Variable | Description |
| --- | --- |
| `PORT` | Backend server port. Defaults to `5001` if not set. |
| `NODE_ENV` | Use `development` locally and `production` for deployment. |
| `CLIENT_URL` | Frontend URL allowed by CORS. Defaults to `http://localhost:5173`. |
| `DB_URI` | MongoDB connection string used by Mongoose. |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `OPENROUTER_API_KEY` | API key for AI assistant responses through OpenRouter. |

## Installation

Install dependencies from the root if you want to use the root scripts:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running Locally

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5001
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Production Build

From the project root:

```bash
npm run build
npm start
```

The root `build` script installs frontend dependencies, builds the frontend, and installs backend dependencies. The root `start` script starts the backend.

In production mode, the backend serves the built frontend from `frontend/dist`.

## API Endpoints

Base URL:

```text
/api
```

### Auth Routes

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Create a new user account. |
| `POST` | `/auth/login` | No | Log in an existing user. |
| `POST` | `/auth/logout` | No | Clear the JWT cookie and log out. |
| `PUT` | `/auth/updateprofile` | Yes | Upload and update the user profile picture. |
| `GET` | `/auth/check` | Yes | Return the currently authenticated user. |

### Message Routes

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| `GET` | `/messages/users` | Yes | Get all users except the authenticated user. |
| `GET` | `/messages/:id` | Yes | Get message history with a user or the AI assistant. |
| `POST` | `/messages/send/:id` | Yes | Send a message to a user or the AI assistant. |

## Socket.IO Events

| Event | Direction | Description |
| --- | --- | --- |
| `connection` | Client to server | Connects a user socket and stores their user ID. |
| `getOnlineUsers` | Server to client | Sends the current list of online user IDs. |
| `receiveMessage` | Server to client | Sends a new message in real time. |
| `disconnect` | Client to server | Removes the user from the online user map. |

## Available Scripts

### Root

| Script | Description |
| --- | --- |
| `npm run build` | Installs frontend dependencies, builds frontend, then installs backend dependencies. |
| `npm start` | Starts the backend server. |

### Backend

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the backend with nodemon. |
| `npm start` | Starts the backend with Node.js. |

### Frontend

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the frontend for production. |
| `npm run lint` | Runs ESLint. |
| `npm run preview` | Previews the production build locally. |

## Notes and Known Issues

- The backend auth responses for signup and login return a nested `user` object with `id`, while parts of the frontend expect `authUser._id`. The `/auth/check` endpoint returns the full user shape from MongoDB, so session restore may behave differently from immediate login/signup state.
- `frontend/src/lib/socket.js` exports a standalone Socket.IO client using `VITE_BACKEND_URL`, but the main app currently creates sockets inside `useAuthStore.js`.
- `frontend/src/pages/SettingsPage.jsx` should be checked for JSX formatting/syntax before running a production build.
- AI assistant messages are stored in the database, but the current send endpoint returns the user's message after creating the AI response. If you want instant UI updates for AI replies, the frontend may need to refetch messages or the backend can emit/return the AI message too.

## Security Notes

- Do not commit `.env` files or real API keys.
- Keep `JWT_SECRET`, Cloudinary credentials, MongoDB URI, and OpenRouter API key private.
- In production, cookies are configured with `secure: true` and `sameSite: "none"`, so HTTPS is required.

## License

This project currently uses the `ISC` license in the backend package metadata.
