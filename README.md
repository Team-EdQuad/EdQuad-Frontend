# 📁 EdQuad – Frontend (ReactJS)

This is the **frontend interface** of the EdQuad Education Management & Decision Support System. It provides role-based dashboards for **Admins**, **Teachers**, and **Students**, integrating with backend microservices via the API Gateway.

> 🚀 Built with ReactJS, Material UI, and JWT authentication.

---

## 📦 Features

* 🎯 Role-based dashboards (Admin, Teacher, Student)
* 📊 ML-based performance & risk predictions
* 🤖 Explainable AI insights (SHAP)
* 📅 Event calendar integration
* 🔔 Notification system with responsive UI

---

## 🔧 Setup Instructions (Development)

```bash
# Clone the repo
https://github.com/Team-EdQuad/EdQuad-Frontend.git
cd EdQuad-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

> Ensure the backend API Gateway is running on `http://localhost:8000`

---

## 🐳 Docker Setup (Frontend)

```bash
cd EdQuad-Frontend

docker ps
docker container prune -f
docker image prune -a -f
git pull origin main
docker compose build --no-cache
docker compose up -d
```

---

## 👥 Sample Users for Testing

| Role    | Email                                                                   | Password    |
| ------- | ----------------------------------------------------------------------- | ----------- |
| Admin   | [admin@example.com](mailto:admin@example.com)                           | admin123    |
| Teacher | [amal@gmail.com](mailto:amal@gmail.com)                                 | amal123     |
| Student | [danielle.johnson82@example.com](mailto:danielle.johnson82@example.com) | danielle214 |

> 📝 No signup. Users must be registered by Admin.

---

## 🔗 Backend Repository

This frontend depends on the backend microservices:
👉 [`microservices-app`](https://github.com/Team-EdQuad/microservices-app)

---
