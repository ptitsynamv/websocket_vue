# websocket_vue

![Vue.js](https://img.shields.io/badge/Vue.js-2.x-4FC08D?logo=vuedotjs&logoColor=white)
![Vuex](https://img.shields.io/badge/Vuex-3.x-4FC08D?logo=vuedotjs&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-1.5-1867C0?logo=vuetify&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-5.x-FFCA28?logo=firebase&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-2.x-010101?logo=socketdotio&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%205-47A248?logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-8.17.0-339933?logo=nodedotjs&logoColor=white)
![Build](https://img.shields.io/badge/build-no%20CI%20configured-lightgrey)
![License](https://img.shields.io/badge/license-not%20specified-lightgrey)

A Vue 2 single-page app with two parts:

- **Objects and orders.** Users list items ("objects") with images, browse them and place orders. This part runs on Firebase.
- **Real-time chat.** A WebSocket chat with admin moderation (mute and ban). It runs on a Node.js/Express server with Socket.IO and MongoDB.

## Key features

**Objects and orders (Firebase)**
- Register and log in with Firebase Authentication.
- Create objects with a title, description, image and a "promo" flag. Images go to Firebase Storage.
- Promo objects are featured on the home page.
- Edit your own objects on the "My objects" page.
- Buy an object through a modal form (name and phone). The order goes to the object's owner.
- The owner's orders page lets them mark orders as done.

**Real-time chat (Socket.IO + MongoDB)**
- Log in with email and password. An unknown email is registered automatically, and the server returns a JWT.
- Messages are pushed live to everyone connected, with a colour assigned to each user.
- Older messages load page by page.
- An online/offline user list.
- Admins can mute or ban any non-admin user. A muted user can't post, and a banned user is disconnected immediately.
- Each user can send at most one message every 15 seconds.
- Socket errors are sent to the client and written to a log file on the server.

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | Vue 2, Vuex, vue-router (history mode), Vuetify 1.5, vue-resource, vue-socket.io |
| Build    | webpack 3, Babel 6, ESLint (Standard), from the `vue-cli` webpack template |
| BaaS     | Firebase Auth, Realtime Database, Storage |
| Backend  | Node.js, Express 4, Socket.IO 2, Passport (JWT strategy), bcryptjs, log4js |
| Database | MongoDB via Mongoose 5 |

## Prerequisites

- **Node.js 8.17.0 and npm 6.13.4.** The project uses webpack 3 and Babel 6, which don't build reliably on current Node. Use [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows)) to switch versions:
  ```bash
  nvm install 8.17.0
  nvm use 8.17.0
  node -v   # v8.17.0
  ```
- **MongoDB** running locally on `mongodb://localhost:27017`. The chat server uses a database named `websocket`.
- **Git.**

The Firebase project settings are already in `src/main.js`. To use your own Firebase project, replace that config and enable Email/Password auth, Realtime Database and Storage in it.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/ptitsynamv/websocket_vue.git
cd websocket_vue
```

### 2. Start the chat server

```bash
cd server
npm install
npm install jsonwebtoken   # required by the server but missing from server/package.json
npm start                  # http://localhost:4000
```

To restart automatically when files change, run `npm run server` (nodemon) instead.

| Variable   | Used when                 | Purpose |
|------------|---------------------------|---------|
| `PORT`     | always                    | Server port (default `4000`) |
| `NODE_ENV` | always                    | `production` loads `config/keys.prod.js`; anything else loads `config/keys.dev.js` |
| `MONDO_URI` | `NODE_ENV=production`   | MongoDB connection string. The name is spelled `MONDO_URI` in the code. |
| `JWT`      | `NODE_ENV=production`     | Secret used to sign JWTs |

In development the server uses `mongodb://localhost:27017/websocket` and a fixed development JWT secret.

### 3. Start the frontend

Open a second terminal in the repository root:

```bash
npm install
npm run dev     # http://localhost:8080
```

The dev server forwards `/api/*` to `http://localhost:4000`. The Socket.IO client connects directly to `ws://localhost:4000`.

> The server only accepts cross-origin requests from `http://localhost:8080`, and the socket URL is hard-coded in `src/main.js`. If you change either port, update `server/app.js` and `src/main.js` to match.

### 4. Make a chat admin (optional)

New chat users are never admins. To make one, set the flag in MongoDB:

```js
// mongo shell
use websocket
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

Then log out of the chat and log back in.

## Available scripts

**Frontend** (repository root)

| Command | Description |
|---------|-------------|
| `npm run dev` / `npm start` | Dev server with hot reload on port 8080. ESLint runs during the build, so lint errors stop it. |
| `npm run build` | Production build into `dist/` |
| `npm run build --report` | Production build plus the webpack bundle analyzer |
| `npm run lint` | ESLint on `src/**/*.js` and `src/**/*.vue` |

**Backend** (`server/`)

| Command | Description |
|---------|-------------|
| `npm start` | Runs the API and Socket.IO server |
| `npm run server` | Same, with nodemon auto-reload |

Neither project has automated tests.

## Project structure

```
websocket_vue/
├── build/                  # webpack 3 build scripts and configs (vue-cli template)
├── config/                 # Dev/prod settings: ports, /api proxy, source maps
├── index.html              # Page template for the SPA
├── static/                 # Static assets copied as-is
├── src/                    # Vue frontend
│   ├── main.js             # App setup: Vuetify theme, Firebase, Socket.IO, global components
│   ├── App.vue             # Layout: toolbar, navigation drawer, error snackbar
│   ├── router/
│   │   ├── index.js        # Routes (history mode)
│   │   └── auth.guard.js   # Chat routes check the chat login; other routes check the Firebase login
│   ├── store/              # Vuex modules (not namespaced)
│   │   ├── object.js       # Objects (Firebase Realtime DB and Storage)
│   │   ├── orders.js       # Orders for each object owner
│   │   ├── user.js         # Firebase Auth user
│   │   ├── userChat.js     # Chat user and JWT, saved in localStorage
│   │   ├── socket.js       # Chat messages and user list from socket events
│   │   └── shared.js       # Shared loading and error state
│   └── components/
│       ├── Auth/           # Firebase login and registration
│       ├── Object/         # Object list, detail, create and edit
│       ├── User/           # Orders page
│       ├── Chat/           # Chat room and chat login
│       └── Shared/         # Buy modal and loading spinner
└── server/                 # Node.js backend
    ├── index.js            # HTTP server and Socket.IO setup
    ├── app.js              # Express app: MongoDB, Passport, CORS, routes
    ├── config/             # keys.dev.js / keys.prod.js (Mongo URL, JWT secret)
    ├── routes/             # /api/auth, /api/about
    ├── controllers/
    │   ├── auth.js         # Login, or register an unknown email, and return a JWT
    │   ├── chat.js         # All Socket.IO events: messages, users online, mute, ban
    │   └── about.js        # Example JWT-protected endpoint
    ├── models/             # Mongoose models: User, Message
    └── soft/               # Passport strategy, error handling, helpers and logging
```

## Socket.IO events

| Direction | Event | Payload |
|-----------|-------|---------|
| client → server | `login` | JWT |
| client → server | `logout` | JWT |
| client → server | `message` | `{ sender: JWT, comment }` |
| client → server | `getPreviousMessage` | `{ paginationLimit, paginationSkip }` |
| client → server | `mute` | `{ sender: JWT, userForMuteId }` (admin only) |
| client → server | `ban` | `{ sender: JWT, userForBanId }` (admin only) |
| server → client | `message` | `{ isNewMessage, message: [...] }` |
| server → client | `allUsers` | Map of userId to `{ email, isAdmin, isBan, isMute, isOnline }` |
| server → client | `serverError` | `{ code, message }` |

The server keeps the list of who is online in memory. It is lost when the server restarts and only works with a single server process.

## Contributing

Use a feature branch and open a pull request against `master`. Run `npm run lint` before you push.

## License

This repository has no license file, so all rights are reserved by the author by default. Add a `LICENSE` file before reusing or redistributing the code.
