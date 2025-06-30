# DevOps Blog
*Created as a part of a university course - CI/CD.*

DevOps Blog is a full-stack blogging platform built with React, Vite, Node.js (Express), and MongoDB.  
It allows users to create posts, add tags, and comment, all organized in a clean, simple, modern UI.  

---

## Features

- Create, view, and list blog posts with tags  
- Add and manage tags dynamically  
- Comment on posts with live updates  
- Responsive UI built with React + Tailwind CSS  
- Backend API built with Express and MongoDB  
- Dockerized for easy local development and deployment  
- Orchestrated with Docker Compose for full-stack setup  
- Ready for CI/CD pipelines and Kubernetes deployment  

---

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS  
- Backend: Node.js, Express, MongoDB, Mongoose  
- Containerization: Docker, Docker Compose  
- Deployment: Kubernetes (manifests provided)  

---

## Getting Started

### Prerequisites

- Node.js 20+  
- Docker & Docker Compose  
- MongoDB (local or Atlas cloud)  
- Git  

### Local Development

1. Clone the repo:  
   ```bash
   git clone https://github.com/SaraAps/devblog.git
   cd devblog```
2. Run backend and frontend separately:
   ```cd backend
      npm install
      node server.js```

   ```cd backend
      npm install
      npm run dev```
3. Make sure your MongoDB is running and configured in backend .env
