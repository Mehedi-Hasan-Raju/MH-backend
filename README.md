# Portfolio Backend API

A RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** that powers a personal portfolio website and its admin dashboard. It handles authentication, project/skill/timeline management, contact messages, and image uploads via Cloudinary.

## ✨ Features

- JWT-based authentication with HTTP-only cookies
- Admin profile management (avatar, resume, social links, password reset via email)
- CRUD for **Projects** (with multiple image uploads), **Skills**, **Timeline/Experience**, and **Software Applications**
- Contact form message handling
- Image & file storage via **Cloudinary**
- Email delivery via **Nodemailer** (password reset)
- CORS configured for a separate portfolio (public) frontend and dashboard (admin) frontend

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt |
| File Uploads | express-fileupload, Cloudinary |
| Email | Nodemailer |

## 📁 Project Structure

```
Backend/
├── config/
│   └── config.env          # environment variables (not committed)
├── controller/              # route handler logic
├── database/
│   └── dbConnection.js      # MongoDB connection
├── middleware/               # auth guard, error handling
├── models/                   # Mongoose schemas
├── router/                   # Express route definitions
├── utils/                    # JWT token & email helpers
├── app.js                    # Express app setup (middleware, routes)
├── server.js                 # entry point
└── vercel.json                # Vercel serverless config (optional)
```

## ⚙️ Environment Variables

Create a `config/config.env` file (this file is git-ignored and must be created manually, or set the same variables directly in your hosting provider's dashboard):


## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Cloudinary account
- A Gmail (or other SMTP) account with an app password for sending emails

### Installation

```bash
git clone <your-repo-url>
cd Backend
npm install
```

Create `config/config.env` as shown above, then run:

```bash
npm run dev     # development, with nodemon auto-restart
# or
npm start       # production
```

The server will start on `http://localhost:4000` (or your configured `PORT`).

## 📡 API Endpoints

Base URL: `/api/v1`

### Auth & User — `/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register the admin user |
| POST | `/login` | No | Log in, sets auth cookie |
| GET | `/logout` | Yes | Log out, clears auth cookie |
| GET | `/me` | Yes | Get logged-in user's profile |
| GET | `/me/portfolio` | No | Get public profile data (used by the portfolio site) |
| PUT | `/update/me` | Yes | Update profile (name, bio, avatar, resume, social links) |
| PUT | `/update/password` | Yes | Change password |
| POST | `/password/forgot` | No | Request a password reset email |
| PUT | `/password/reset/:token` | No | Reset password using the emailed token |

### Projects — `/project`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add a new project (supports multiple images) |
| PUT | `/update/:id` | Yes | Update a project |
| DELETE | `/delete/:id` | Yes | Delete a project |
| GET | `/getall` | No | Get all projects |
| GET | `/get/:id` | No | Get a single project |

### Skills — `/skill`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add a new skill |
| PUT | `/update/:id` | Yes | Update a skill (e.g. proficiency) |
| DELETE | `/delete/:id` | Yes | Delete a skill |
| GET | `/getall` | No | Get all skills |

### Timeline / Experience — `/timeline`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add a new timeline entry |
| DELETE | `/delete/:id` | Yes | Delete a timeline entry |
| GET | `/getall` | No | Get all timeline entries |

### Software Applications — `/softwareapplication`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add a new application/tool entry |
| DELETE | `/delete/:id` | Yes | Delete an entry |
| GET | `/getall` | No | Get all entries |

### Messages — `/message`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/send` | No | Send a message from the portfolio contact form |
| GET | `/getall` | Yes | Get all received messages |
| DELETE | `/delete/:id` | Yes | Delete a message |

> Routes marked **Auth: Yes** require a valid `token` cookie (set on login) and are intended for the admin dashboard only.

## ☁️ Deployment

This API can be deployed to any Node.js hosting provider (Render, Railway, Vercel, etc.).

**On Render / Railway (always-on server):**
- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Add all environment variables listed above in the dashboard's Environment settings

**On Vercel (serverless):**
- A `vercel.json` is included; the app is exported from `server.js` and does not call `app.listen()` when `process.env.VERCEL` is set
- Add the same environment variables in the Vercel project settings

After deployment, update the `VITE_BACKEND_URL` environment variable in both frontend projects (portfolio and dashboard) to point to this API's deployed URL, and update `PORTFOLIO_URL` / `DASHBOARD_URL` here to match the deployed frontend URLs (required for CORS and cookie-based auth to work).

## 🔒 Security Notes

- Auth cookies are set with `httpOnly`, `secure`, and `sameSite: "None"` to support cross-domain requests between the deployed frontend and backend
- Passwords are hashed with bcrypt before being stored
- File uploads are streamed to a temp directory before being pushed to Cloudinary, then the temp file is discarded

## 📄 License

ISC
