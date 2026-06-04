# ⚡ n8n-clone: Visual Workflow Automation & AI Agent Platform

A lightweight, developer-friendly, full-stack workflow automation platform inspired by n8n. Build, connect, and execute automated flows featuring standard API calls, LLM tasks, and self-reasoning AI Agents equipped with tools.

---

## ✨ Features

### 🌐 Visual Workflow Canvas
- Dynamic node-based builder using **React Flow (v11)**.
- Connect, reposition, and customize execution flows interactively.
- Detailed Sidebar configuration panel to customize node variables and configurations.

### 🤖 Autonomous ReAct AI Agent Node
- Multi-step reasoning loop (ReAct model) executing up to 5 reasoning actions.
- Automatically selects, parses, and executes built-in tools based on context.
- Returns clean JSON actions and answers.

### 🔌 Diverse Node Library
- **Agent Node**: Triggers the autonomous agentic execution loops.
- **LLM Node**: Interacts directly with text completion endpoints.
- **HTTP Node**: Performs GET requests to fetch data from external APIs.

### 💾 Workflow Management
- Persist, save, load, and delete workflows.
- User-specific database mapping allows separate configurations per user.

### 🔒 Security & Authentication
- Secure signup and login endpoints.
- Password hashing (bcryptjs) and protected server routes using JWT (JSON Web Tokens).

---

## 🛠 Tech Stack

- **Frontend**: Next.js (v16 with App Router), React Flow (v11), Tailwind CSS (v4)
- **Backend**: Node.js, Express.js (v5), TypeScript
- **Database**: MongoDB & Mongoose
- **AI Integrations**: OpenRouter API (GPT-3.5-Turbo for agent reasoning and LLM prompts)

---

## 📂 Project Structure

```bash
n8n/
├── backend/                  # TypeScript Express Server
│   ├── src/
│   │   ├── agents/           # LLM client & ReAct Agent Executor
│   │   ├── config/           # Database setup
│   │   ├── engine/           # Execution engines
│   │   ├── middleware/       # Auth verification middlewares
│   │   ├── models/           # MongoDB user & workflow schemas
│   │   ├── nodes/            # Node actions (HTTP, LLM, Agent)
│   │   ├── registry/         # Registry matching node types to executors
│   │   ├── routes/           # Auth and workflow routes
│   │   ├── tools/            # Agent tools (calculator, weather wttr.in API)
│   │   └── server.ts         # Server bootstrapper
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router (Home, login, signup pages)
│   │   ├── components/       # Custom React Flow nodes & sidebar
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **OpenRouter API Key** (or custom LLM API provider key)

---

### 1. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the UI.

---

## 🔒 Authentication API

### Signup
`POST /auth/signup`
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Login
`POST /auth/login`
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
*Returns a `{ token: "jwt_token" }` payload for local authorization.*

---

## 📊 Workflow APIs

- **Save Workflow**: `POST /workflows` (Protected)
- **Get Workflows**: `GET /workflows` (Protected)
- **Delete Workflow**: `DELETE /workflows/:id` (Protected)

---

## 🤖 Workflow Execution API

`POST /run-workflow`
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
Response:
```json
{
  "1": "900"
}
```

---

## 💼 Portfolio Description

**Full-Stack AI Workflow Automation Platform (n8n Clone)**
Built a full-stack workflow automation platform inspired by n8n. Designed and implemented a visual workflow builder using Next.js and React Flow, backed by a Node.js/Express execution engine. Configured MongoDB persistence for user workflows, set up JWT-based authentication, and designed a custom ReAct-based AI Agent with self-reasoning capabilities and tool-execution support.

---

## 👨‍💻 Author

**Jeetu Pal**
- **GitHub**: [jeetupal31](https://github.com/jeetupal31)
- **Email**: jeetupal.pal31@gmail.com

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star on GitHub!
