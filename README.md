# 🎯 SmartHire — AI-Powered Job Application Tracker

![Java](https://img.shields.io/badge/Java-21-orange?logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-teal?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

A **full-stack job application tracker** with an **AI-powered resume-to-job-description match scorer**. Built with Spring Boot 3, React 18, TypeScript, and Tailwind CSS — featuring JWT authentication, a Kanban board, and an intelligent keyword-matching engine.

---

## ✨ Features

- 🔐 **JWT Authentication & Security** — BCrypt password hashing, stateless token-based authentication via Spring Security
- 📊 **Interactive Dashboard** — Real-time metrics on applications, interviews, offers, and average match scores
- 📋 **Kanban Board** — Drag-and-drop pipeline: `Applied` ➔ `Screening` ➔ `Interview` ➔ `Offer` ➔ `Rejected`
- 🤖 **AI Match Scoring Engine** — Extracts key technical skills from job descriptions and resumes, computes overlap percentage (0-100%), and identifies missing skills with recommendations
- 🔍 **Search & Filters** — Filter by status, search by company or role
- 🐳 **One-Command Docker Compose** — Orchestrates PostgreSQL, Spring Boot backend, and React Nginx frontend
- 📖 **Swagger / OpenAPI 3 Docs** — Interactive API exploration

---

## 🏗️ Architecture

```
┌────────────────────────┐      REST / JSON       ┌──────────────────────────────┐
│  React 18 + Vite SPA   │ ─────────────────────▶ │   Spring Boot Backend :8080  │
│  (Tailwind, TanStack)  │                        │   (Java 21, Spring Security) │
└────────────────────────┘                        └──────────────┬───────────────┘
           │                                                     │
           ▼                                                     ▼
     Nginx :3000                                          PostgreSQL :5434
                                                      (users & job_applications)
```

---

## 🚀 Quick Start

**Prerequisites:** Docker & Docker Compose

```bash
git clone https://github.com/shubhamraghawant/smarthire.git
cd smarthire
git checkout develop
docker compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 📡 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/v1/applications` | List user's job applications (paginated) | Yes |
| `POST` | `/api/v1/applications` | Create job application | Yes |
| `GET` | `/api/v1/applications/{id}` | Get application details | Yes |
| `PUT` | `/api/v1/applications/{id}` | Update application | Yes |
| `DELETE` | `/api/v1/applications/{id}` | Delete application | Yes |
| `PATCH` | `/api/v1/applications/{id}/status`| Update status (Kanban drag-and-drop) | Yes |
| `POST` | `/api/v1/applications/{id}/analyze`| Compute AI match score & missing skills | Yes |
| `GET` | `/api/v1/dashboard/stats` | Retrieve metrics summary | Yes |

---

## 🤖 AI Match Scorer

The built-in match scoring engine tokenizes job descriptions and candidate resumes, normalizes technical terms (e.g., `Java`, `Spring Boot`, `Kafka`, `Kubernetes`), computes frequency-weighted skill overlap, and generates instant feedback on:
1. **Match Percentage** (e.g., 85% Match)
2. **Matched Skills** (e.g., `Kafka`, `PostgreSQL`, `Docker`)
3. **Missing Critical Skills** (e.g., `AWS`, `Redis`)
4. **Actionable Recommendations** for application optimization

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
