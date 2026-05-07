# Street Race X API REST
> API REST for app web and mobile about street races, created with node, typescript and express with framework and principal language

## 📋 Table of Contents
- [Description](#-description)
- [Technologies Used](#-technologies-used)
- [Prerequisites](#-prerequisites)
- [Installation and Configuration](#-installation-and-configuration)
- [environment variables](#-variables-de-entorno)
- [Use](#-use)
- [Main Endpoints](#-main-endpoints)

## 📖 Description
This API is a work for the elective class 2 (backend of Development) with this job aims to apply everything learned in class such as hexagonal 
architecture, real-time connection, user authentication, code testing and other topics learned.

## 🛠️ Technologies Used
* [Node.js](https://nodejs.org)
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com)
* [Redis](https://redis.io/)
* [Firebase](https://firebase.google.com/)
* [FirebaseORM](https://fireorm.js.org/#/)
* [Cloudinary](https://cloudinary.com/)
* [JsonWebToken](https://www.jwt.io/)
* [Zod](https://zod.dev/)
* [Bcrypt](https://bcrypt-generator.com/)
* [Cookie-Parse](https://expressjs.com/en/resources/middleware/cookie-parser.html)
* [Cors](https://expressjs.com/en/resources/middleware/cors.html)
* [Multer](https://expressjs.com/en/resources/middleware/multer.html)
* [Morgan](https://expressjs.com/en/resources/middleware/morgan.html)
* [Dotenv](https://www.dotenv.org/docs/)
* [UUID](https://github.com/uuidjs/uuid#readme)
* [Supertest](https://supertest.co/)
* [Vitest](https://vitest.dev/)

## 📋 Prerequisites
List of requirements to be able to execute the project:
* Node.js v20.15.0+
* Database Firebase cloud
* TypeScript installed

## 🚀 Installation and Configuration
Step-by-step instructions for cloning and running the backend locally:
```bash
# 1. clone repositorie
git clone https://github.com/AndresBerdu/StreetRaceX-backend.git

# 2. Install dependencies
cd project
npm install

# 3. Configurate environment variables
cp .env.example .env
```

## ⚙️ Environment variables
Explain what you need in your file `.env`:
* `PORT`: App port.
* `SECRET_KEY`: Secret password of tokens.
* `TOKEN_EXPIRE`: Time in milisecods for token expire.
* `REFRASH_TOKEN_EXPIRE`: Time in milisecods for refresh token expire.
* `REDIS_USERNAME`: Redis username.
* `REDIS_PASSWORD`: Redis password.
* `REDIS_SOCKET_HOST`: Redis socket host.
* `REDIS_SOCKET_PORT`: Redis port.
* `FIREBASE_PROJECT_ID`: Firebase project id.
* `FIREBASE_CLIENT_EMAIL`: Firebase client email.
* `FIREBASE_PRIVATE_KEY`: Firebase private key.
* `CLOUDINARY_NAME_KEY`: cloudinary name key.
* `CLOUDINARY_API_KEY`: cloudinary apy key.
* `CLOUDINARY_SECRET_KEY`: cloudinary secret key.

## 💡 Use
Explains how to start the server in development mode:
```bash
npm run dev
```

## 🔗 Main Endpoints (API Reference)
Overview of the most important endpoints:

### Auth
* `POST /api/auth/sign-in-session`: sign in (require body).
* `POST /api/auth/sign-up-session`: sign up (require body).
* `POST /api/auth/logue-out-sessio`: logue out (require token).
* `POST /api/auth/refresh-session`: refresh session (require token).

### User
* `GET /api/users/?sise={number}&page={number}`: list user by slug (require token) (size: amout of users) (page: page of visualization).
* `GET /api/users/:slug`: list user by slug (require token).
* `POST /api/users/`: create user (require token).
* `PATCH /api/users/:slug`: patch user by slug (requiere token) (require body).
* `DELETE /api/users/:slug`: delete user by slug (requiere token).

### Vehicle
* `GET /api/users/:slug/vehicles`: list vehicles of user (require token).
* `POST /api/users/:slug/vehicles`: create one vehicle for one user (requiere token) (require body).
* `PATCH /api/users/:slug/vehicles/plate/:plate`: update one vehicle for one user by slug of user and plate of vehicle (requiere token) (require body).
* `DELETE /api/users/:slug/vehicles/plate/:plate`: delete one vehicle for one user by slug of user and plate of vehicle (requiere token).
* `PATCH /api/users/:slug/vehicles/slug/:vehicles_slug`: update one vehicle for one user by slug of user and slug vehicle of vehicle (requiere token) (require body).
* `DELETE /api/users/:slug/vehicles/slug/:vehicles_slug`: delete one vehicle for one user by slug of user and slug vehicle of vehicle (requiere token).
