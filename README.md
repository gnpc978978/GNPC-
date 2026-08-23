# Greater Noida Press Club

Official website and admin panel for the Greater Noida Press Club.

The project is divided into two parts:

* **Frontend** – Next.js application for the public website and admin interface.
* **Backend** – Node.js API for authentication, content management and database operations.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Multer
* Cloudinary

---

# Features

## Public Website

* Home
* About
* Press Releases
* Announcements
* Press Conferences
* Events
* Members
* Gallery
* Contact
* Download Membership Form
* Admin Login

---

## Admin Panel

### Super Admin

* Dashboard
* Admin Management
* Press Releases
* Announcements
* Press Conferences
* Events
* Gallery
* Members
* Contact Messages
* Website Settings
* Profile Management

### Admin

* Dashboard
* Press Releases
* Announcements
* Press Conferences
* Events
* Gallery
* Members
* Contact Messages
* Profile Management

---

# Project Structure

```text
greater-noida-press-club
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── next.config.ts
│
├── backend
│   ├── src
│   ├── uploads
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

# Frontend Structure

```text
src
│
├── app
│   ├── about
│   ├── announcements
│   ├── contact
│   ├── events
│   ├── members
│   ├── gallery
│   ├── login
│   ├── press-conferences
│   ├── press-releases
│   └── admin
│
├── components
│   ├── about
│   ├── admin
│   ├── announcements
│   ├── common
│   ├── contact
│   ├── events
│   ├── members
│   ├── gallery
│   ├── home
│   ├── layout
│   ├── press-conferences
│   ├── press-releases
│   ├── shared
│   └── ui
│
├── constants
├── data
├── hooks
├── lib
├── services
├── types
└── utils
```

---

# Backend Structure

```text
src
│
├── config
├── controllers
│   ├── auth
│   ├── admin
│   ├── announcement
│   ├── pressRelease
│   ├── pressConference
│   ├── event
│   ├── gallery
│   ├── members
│   ├── contact
│   └── settings
│
├── middleware
├── models
├── routes
├── services
├── validations
├── utils
├── types
├── app.ts
└── server.ts
```

---

# Database Collections

* users
* press_releases
* announcements
* press_conferences
* events
* galleries
* members
* contacts
* settings

---

# Press Conference Module

Each press conference can include:

* Title
* Slug
* Featured Image
* Conference Date
* Venue
* Short Description
* Detailed Content
* Gallery Images (Optional)
* PDF Attachment (Optional)
* Publish Status

---

# Membership

Online membership is **not** available.

Visitors can download the membership form from the website and submit it offline at the Press Club office.

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

---

# Production Build

### Frontend

```bash
npm run build
npm start
```

### Backend

```bash
npm run build
npm start
```

---

# Current Development Status

### Frontend

* Public Website
* Responsive Design
* Admin Panel UI
* Reusable Components

### Backend

* Authentication
* Role-Based Access Control
* Content Management APIs
* File Upload
* MongoDB Integration
* REST API

---

# License

This project is developed for the Greater Noida Press Club. All rights reserved.
