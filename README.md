# Book Cafe

A modern, full-stack web application for book lovers to browse, review, and manage books with a beautiful user profile experience.

---

## 🚀 Tech Stack & Tools

### Frontend
- **React** (with Hooks)
- **Material-UI (MUI)** for UI components and icons
- **React Router** for navigation
- **Fetch API** for HTTP requests

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Joi** for request validation
- **CORS** for cross-origin requests
- **dotenv** for environment variables

### Other Tools
- **Nodemon** for backend development

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install Dependencies
#### Backend
```bash
cd server
npm install
```
#### Frontend
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables
- In `server/.env`, set:
  - `MONGO_URI=<your-mongodb-connection-string>`

### 4. Start the Development Servers
#### Backend
```bash
cd server
npm run dev
```
#### Frontend
```bash
cd ../client
npm start
```

### 5. Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## ✨ Features
- User authentication and profile management
- Editable profile (name, email, bio)
- Book browsing and search
- Review submission and review history
- Profile statistics and badges
- Responsive, modern UI

---

## 📦 Folder Structure
```
client/    # React frontend
server/    # Express backend
```

---
## Vercel link - https://bookcafe-workelate.vercel.app/
## 📝 Notes
- Ensure MongoDB is running and accessible.
- For production, set proper environment variables and use secure API keys.

---

## 📄 License
This project is for educational/demo purposes. Adapt and extend as you wish!
