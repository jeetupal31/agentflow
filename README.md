# 🚀 AI Workflow Automation Platform (n8n Clone)

A full-stack workflow automation platform inspired by n8n, featuring a visual workflow builder, AI-powered agents, tool execution, HTTP integrations, workflow persistence, authentication, and MongoDB storage.

## ✨ Features

### Workflow Builder
- Visual workflow canvas using React Flow
- Multiple node types
- Connect nodes visually
- Node configuration panel
- Workflow execution engine

### AI Agent System
- Multi-step AI agent execution
- Tool calling support
- Dynamic reasoning loop
- LLM integration

### Node Types

#### Agent Node
- AI agent execution
- Tool selection
- Multi-step reasoning

#### LLM Node
- Direct LLM interaction
- Prompt processing
- AI responses

#### HTTP Node
- REST API calls
- External service integration
- API data retrieval

### Workflow Management
- Create workflows
- Save workflows
- Load workflows
- Delete workflows
- User-specific workflows

### Authentication
- User registration
- User login
- JWT authentication
- Protected routes

### Database
- MongoDB integration
- Workflow persistence
- User management

---

# 🛠 Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- React Flow
- Tailwind CSS

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- MongoDB
- Mongoose

## Authentication
- JWT
- bcryptjs

## AI
- Gemini API
- Agent Executor
- Tool Calling System

---

# 📂 Project Structure

```bash
n8n-clone/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   ├── config/
│   │   ├── engine/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── nodes/
│   │   ├── registry/
│   │   ├── routes/
│   │   ├── tools/
│   │   └── server.ts
│
└── README.md
```

---

# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/n8n-clone.git

cd n8n-clone
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🔐 Authentication API

## Signup

```http
POST /auth/signup
```

Request

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## Login

```http
POST /auth/login
```

Request

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "jwt_token"
}
```

---

# 📊 Workflow APIs

## Save Workflow

```http
POST /workflows
```

## Get Workflows

```http
GET /workflows
```

## Delete Workflow

```http
DELETE /workflows/:id
```

---

# 🤖 Workflow Execution

## Execute Workflow

```http
POST /run-workflow
```

Example

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "agent",
      "parameters": {
        "query": "What is 45 * 20?"
      }
    }
  ],
  "edges": []
}
```

Response

```json
{
  "1": "900"
}
```

---

# 🚀 Future Improvements

- Drag-and-drop node sidebar
- Workflow execution animation
- Dark mode
- User profile management
- Workflow scheduling
- Webhook support
- Docker deployment
- Real-time collaboration

---

# 💼 Resume Description

Built a full-stack workflow automation platform inspired by n8n with AI-powered agents, visual workflow builder, MongoDB persistence, JWT authentication, and tool execution capabilities using Next.js, React, Node.js, Express, TypeScript, and MongoDB.

---

# 👨‍💻 Author

**Jeetu Pal**

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

# 📄 License

MIT License

---

⭐ If you found this project useful, consider giving it a star on GitHub.
