# ⬡ TaskFlow — Full-Stack Task Management App

A team collaboration and task management application built with **Angular**, **Java Spring Boot**, and **MySQL**.

---

## 📁 Project Structure

```
taskflow/
├── backend/          # Java Spring Boot REST API
├── frontend/         # Angular 17 SPA
├── database/         # SQL schema & seed data
└── README.md
```

---

## 🛠 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Angular 17, TypeScript  |
| Backend   | Java 17, Spring Boot 3  |
| Database  | MySQL 8                 |
| Auth      | JWT (JSON Web Tokens)   |
| Build     | Maven, Node/npm         |

---

## ⚙️ Prerequisites

- Java 17+
- Node.js 18+ & npm
- MySQL 8+
- Maven 3.9+

---

## 🗄️ Database Setup

```sql
-- 1. Create the database
CREATE DATABASE taskflow;

-- 2. Run the schema
mysql -u root -p taskflow < database/schema.sql

-- 3. (Optional) Load seed data
mysql -u root -p taskflow < database/seed.sql
```

---

## 🚀 Backend Setup

```bash
cd backend

# Configure DB credentials in src/main/resources/application.properties
# spring.datasource.username=YOUR_USER
# spring.datasource.password=YOUR_PASSWORD

mvn clean install
mvn spring-boot:run
# API runs on http://localhost:8080
```

---

## 🖥️ Frontend Setup

```bash
cd frontend
npm install
ng serve
# App runs on http://localhost:4200
```

---

## 🔐 Demo Credentials

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@demo.com     | admin123   |
| Member | member@demo.com    | member123  |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | /api/auth/login        | Login & get JWT    |
| POST   | /api/auth/register     | Register new user  |

### Users
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/users             | List all users     |
| GET    | /api/users/{id}        | Get user by ID     |
| PUT    | /api/users/{id}/role   | Update user role   |
| DELETE | /api/users/{id}        | Remove user        |

### Projects
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/projects          | List projects      |
| POST   | /api/projects          | Create project     |
| GET    | /api/projects/{id}     | Get project        |
| PUT    | /api/projects/{id}     | Update project     |
| DELETE | /api/projects/{id}     | Delete project     |

### Tasks
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/tasks             | List tasks         |
| POST   | /api/tasks             | Create task        |
| GET    | /api/tasks/{id}        | Get task           |
| PUT    | /api/tasks/{id}        | Update task        |
| DELETE | /api/tasks/{id}        | Delete task        |

---

## 🌿 Git Setup

```bash
git init
git add .
git commit -m "Initial commit: TaskFlow full-stack app"
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

---

## 📄 License

MIT
