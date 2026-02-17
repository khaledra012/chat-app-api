# chat-app-api

# 🚀 Secured Real-Time Chat Engine (Backend)

A high-performance, scalable, and secure backend architecture for real-time messaging. This system goes beyond basic chat apps by implementing a **Zero-Trust Socket Handshake**, **Multi-Device Session Tracking**, and a **Class-Based Service Architecture**.

---

## 🌟 Key Technical Highlights

### 🛡️ JWT-Secured Socket Handshake

Standard Socket.io implementations often rely on unverified User IDs. This project implements a secure registration flow:

- Clients must emit a `register_user` event with a valid **JWT**.
- The server verifies the token via `jsonwebtoken`, extracts the trusted `userId`, and binds it directly to the socket instance (`socket.userId`).
- This prevents "ID Spoofing" where a user could potentially join another user's private room.

---

### 📱 Intelligent Multi-Device Support

The engine manages a `Map` of online users to support multiple concurrent connections (e.g., Mobile, Web, Desktop):

- **Connection Logic:** Increments a device counter on each new socket registration.
- **Disconnection Logic:** Decrements the counter on disconnect. A user is only removed from the `onlineUsers` Map when their last device goes offline.
- **Cleanup Strategy:** Uses the attached `socket.userId` during the `disconnect` event to ensure accurate state management even if the client closes abruptly.

---

### 🏢 Architecture & Design Patterns

- **Service Layer Pattern:** Business logic is encapsulated in a singleton `SocketService` class for better maintainability.
- **Middleware-First Security:** Routes are protected by an `authMiddleware` that populates `req.user`, ensuring data integrity across the platform.
- **Dependency Injection:** Controllers and Middlewares are structured as classes/instances to promote clean code and testability.

---

### ⚠️ Advanced Error Handling

The system distinguishes between:

- **Operational Errors** (e.g., Invalid Token)
- **Programming Errors** (e.g., Reference Errors)

Behavior by environment:

- In **Production**, users receive clean, non-technical messages.
- In **Development**, full stack traces are provided for debugging.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Real-Time Engine:** Socket.io  
- **Security:** JSON Web Tokens (JWT), Bcrypt.js (Password Hashing)  
- **Logging & Utilities:** Morgan, Dotenv, SweetAlert2 (Frontend alerts)

---

## 📂 Project Directory Structure

```text
Backend/
├── src/
│   ├── modules/
│   │   ├── user/             # User Schema, Controller & Auth Routes
│   │   └── message/          # Messaging Logic & Data Persistence
│   ├── shared/
│   │   ├── middlewares/      # Authentication Guard & Global Error Handler
│   │   └── socket/           # Socket.io Service (The Real-Time Engine)
│   ├── app.js                # Express Middleware & Route Mounting
│   └── server.js             # Entry Point & DB Connection
└── .env                      # Environment Secrets (Not for Version Control)
```

---

## 📡 API Endpoints (REST)

### 🔑 Authentication

| Method | Endpoint              | Description                              | Auth  |
|--------|----------------------|------------------------------------------|-------|
| POST   | /api/v1/users/login  | Authenticate user & return JWT           | 🔓 None |
| GET    | /api/v1/users        | Fetch all users (Contacts)               | 🔐 JWT |

---

### 💬 Messaging

| Method | Endpoint               | Description                               | Auth |
|--------|------------------------|-------------------------------------------|------|
| POST   | /api/v1/messages       | Save message & Trigger Socket             | 🔐 JWT |

---

## 🔌 Socket.io Events Mapping

### Client to Server

- `register_user`  
  Payload: `{ token: string }`  
  Authenticates the session and joins the user's private room.

- `disconnect`  
  Automatic cleanup of the `onlineUsers` map using the bound `socket.userId`.

---

### Server to Client

- `registration_success`  
  Confirms the socket is now secured and ready.

- `new_message`  
  Real-time delivery of messages to the specific recipient's room.

- `auth_error`  
  Triggered if the handshake fails due to an invalid token.

---

## ⚙️ Installation & Deployment

### 📌 Local Setup

```bash
git clone <your-repo-url>
cd Backend
npm install
```

---

### 🔐 Environment Configuration (.env)

```env
PORT=5000
DATABASE_URL=your_mongodb_atlas_url
JWT_SECRET=your_super_complex_secret_key
NODE_ENV=development
```

---

### 🚀 Production Deployment

- **CORS:** Ensure `app.js` has the correct origin for your production frontend.
- **Environment Variables:** Set keys in your hosting provider's dashboard (Render / Heroku / Vercel).
- **Process Management:** Use `npm start` which runs:

```bash
node server.js
```

---

## ✅ Summary

This backend architecture provides:

- Secure Zero-Trust socket authentication  
- Reliable multi-device session tracking  
- Clean and scalable service-based architecture  
- Production-grade error handling  
- REST + Real-Time hybrid communication model  

Designed for scalability, maintainability, and security from day one.
