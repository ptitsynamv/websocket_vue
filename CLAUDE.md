# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Two independent apps in one repo:

- **Frontend** (repo root): Vue 2 + Vuex + vue-router + Vuetify 1.x, built with the legacy `vue-cli` webpack 3 template (`build/`, `config/`). Plain JavaScript, no TypeScript.
- **Backend** (`server/`): Express + Mongoose + Socket.IO 2 + passport-jwt. Has its own `package.json` and `node_modules`.

Target runtime per README: **Node v8.17.0 / npm 6.13.4** (use nvm). The old webpack/babel 6 toolchain is unlikely to work on modern Node.

## Commands

Frontend (repo root):
```bash
npm install
npm run dev          # webpack-dev-server on http://localhost:8080, hot reload
npm run build        # production build to dist/
npm run build --report   # build + bundle analyzer
npm run lint         # eslint (standard config) over src/*.js,*.vue
```
ESLint also runs inside the dev build (`config/index.js` → `useEslint: true`), so lint errors break `npm run dev`.

Backend:
```bash
cd server && npm install
npm start            # node index — port 4000 (or $PORT)
npm run server       # nodemon
```
Requires a local MongoDB at `mongodb://localhost:27017/websocket` (`server/config/keys.dev.js`). Production config reads `MONDO_URI` (sic) and `JWT` env vars. `server/controllers/*` require `jsonwebtoken`, which is **not** listed in `server/package.json` — install it if missing.

There are no tests in either project.

## Architecture

The frontend talks to **two separate backends** with **two separate user/auth systems**:

1. **Firebase** (config hard-coded in `src/main.js`) — powers the "objects / orders" part of the app. Auth via Firebase Auth (`store/user.js`, getter `user`), data in Firebase Realtime DB (`objects`, `users/{uid}/orders`) and images in Firebase Storage (`store/object.js`, `store/orders.js`).
2. **Local Node server** — powers the chat. `POST /api/auth/login` (proxied from the dev server via `config/index.js` `proxyTable`) both logs in *and auto-registers* unknown emails, returning a JWT plus user flags (`isAdmin`, `isBan`, `isMute`, `color`). This is stored as `userChat` in `store/userChat.js` and persisted to `localStorage`.

`src/router/auth.guard.js` branches on route name: the `chat` route checks `userChat` (and `isBan`); every other guarded route checks the Firebase `user`.

### Chat / WebSocket flow

- `vue-socket.io` is registered in `src/main.js` against `ws://localhost:4000` with the Vuex store. Socket handlers are attached dynamically in `Chat.vue` via `this.$options.sockets.<event> = ...`, and dispatch into the `socket` store module (`store/socket.js`).
- Client → server events: `login`, `logout`, `message`, `getPreviousMessage` (pagination), `mute`, `ban`. Every authenticated event carries the JWT (`login`/`logout` send the token directly; others send it as `sender`), and the server re-verifies it and re-reads the user from Mongo on each event.
- Server → client events: `message` (`{isNewMessage, message: [...]}`), `allUsers` (map of users with `isOnline`), `serverError` (`{code, message}`).
- All socket logic lives in `server/controllers/chat.js`. Online state is held **in memory** in two `Map`s (`peers`: userId → socket, `allUsers`), so it is lost on restart and is single-process only. Business rules enforced there: muted users can't post, banned users are disconnected, only admins can mute/ban, admins can't be muted/banned, and a user can't post more than once per 15 seconds.
- Socket errors are logged via log4js to `server/debug/socket.log` (`server/soft/helpFunctions.js`).

### Other notes

- CORS in `server/app.js` is hard-coded to `http://localhost:8080`.
- Vuex modules are non-namespaced, so all mutation/action/getter names share a global namespace (`setLoading`/`setError`/`clearError` from `store/shared.js` are used everywhere).
- `Vue.http` (vue-resource) is used in `store/userChat.js` and relies on `window.Vue` being set in `main.js`.
- `src/.gitrepo` marks `src/` as a git-subrepo of the Vuetify webpack template; don't edit that file.
