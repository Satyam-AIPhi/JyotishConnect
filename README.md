## Overview

JyotishConnect offers a modern, responsive experience:
- **Authentication:** Separate flows for regular users and astrologers.
- **Real-Time Communication:** Chat and call functionalities via Socket.IO and WebRTC.
- **Astrological Services:** Personalized horoscopes, free kundli, compatibility reports, and more.
- **Review System:** Submit, sort, and view reviews for astrologers.
- **Additional Services:** Blog, live sessions, spiritual product purchases, and educational content.

---

## Features

- **Secure Authentication & Role Management:** JWT-based sign-up/login with user‑ and astrologer‑specific flows.
- **Real‑Time Chat & Call:** Integrated text chat with typing indicators, browser notifications, and audio/video calls using WebRTC.
- **Dynamic Astrologer Listings:** Advanced filtering and pagination based on rating, experience, languages, and specializations.
- **Horoscope Generation:** User input forms that proxy requests to a Dockerized external API (VedAstro).
- **Reviews & Ratings:** Users can submit, update, and view astrologer reviews.
- **Responsive & Interactive UI:** Built with Next.js, React, Redux, Tailwind CSS, and Framer Motion.

---

## Technologies Used

- **Backend:** Node.js, Express.js, Socket.IO, MongoDB, JWT-based authentication.
- **Frontend:** Next.js, React, Redux Toolkit, Tailwind CSS, Framer Motion, Socket.IO, WebRTC (simple-peer).
- **External Integrations:** VedAstro API for horoscope calculations, AI APIs for chat summaries.

---

## Backend

### Base URL and Endpoints

All backend endpoints are prefixed with **`/api/v1`**.  
Example:  
```
http://localhost:7000/api/v1/
```

### Authentication Endpoints

| Method | Endpoint              | Access   | Description                                      |
|--------|-----------------------|----------|--------------------------------------------------|
| POST   | `/signup`             | Public   | Register a new regular user                      |
| POST   | `/signup/astrologer`  | Public   | Register a new astrologer                        |
| POST   | `/login`              | Public   | Log in a user and obtain a JWT token             |
| POST   | `/google`             | Public   | Google-based authentication                      |
| GET    | `/signout`            | Public   | Sign out (clears JWT cookie)                     |

### Other Backend Endpoints

#### User Endpoints *(JWT Protected)*
- **GET** `/users/profile` – Retrieve own user details.
- **PUT** `/users/update` – Update user details.
- **DELETE** `/users/delete` – Delete user account.
- **Admin Endpoints:** Search, list, or delete user profiles.

#### Astrologer Endpoints
- **GET** `/astrologers/filter-options` – Dynamic filtering options.
- **GET** `/astrologers` or `/astrologers/list` – List astrologers (with pagination).
- **GET** `/astrologers/:id` – Detailed astrologer profile.
- **PUT** `/astrologers/update/:astrologerId` – Update astrologer profile.
- **POST/DELETE** endpoints for managing specializations.

#### Review Endpoints
- **GET** `/reviews/astrologer/:astrologerId` – Retrieve astrologer reviews.
- **POST** `/reviews/create` – Create a new review.
- **PATCH** endpoints to edit reviews/replies and mark as helpful.

#### Chat Endpoints *(JWT Protected)*
- **GET** `/chat/list` – Retrieve chats for the user.
- **GET** `/chat/:chatId` – Fetch messages from a specific chat.
- **DELETE** `/chat/:chatId` – Delete a chat.
- **POST** `/chat/init` – Initialize a new chat session.
- **PUT** `/chat/:chatId/read` – Mark chat as read.

#### Horoscope Endpoint
- **POST** `/horoscope` – Proxy to the VedAstro API for horoscope predictions.

### Getting Started – Backend

1. **Clone the Repository & Navigate:**

   ```bash
   cd JyotishConnect/server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**  
   Create a `.env` file in the root with:

   ```env
   PORT=7000
   MONGODB_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   VEDASTRO_API_BASE_URL="http://localhost:3001"
   AI_API_KEY="your_ai_api_key"
   ```

4. **Run the Server:**

   ```bash
   npm start
   ```

The server will run at:  
`http://localhost:7000/api/v1/`

---

## Frontend

### Getting Started – Frontend

1. **Clone the Repository & Navigate:**

   ```bash
   cd JyotishConnect/client
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**  
   Create a `.env.local` file in the project root with:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:7000/api/v1
   NEXT_PUBLIC_SOCKET_URL=https://jyotishconnect.onrender.com
   ```

4. **Run the Frontend Application:**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---
