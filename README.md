# 🚀 ServiHub Report Handling System

A full-stack **Next.js** app that allows users to submit reports and admins to manage and resolve them.

---

## 🛠️ Setup Instructions

Follow the steps below to run ServiHub locally.

### 1. Prerequisites

Make sure you have **Node.js (v18 or later)** installed.  
📦 Download it here: https://nodejs.org

---

### 2. Set Up the Project

1. Create a new empty folder anywhere.
2. Open a terminal in that folder (right-click > "Open Terminal").

Run the following in the **same terminal**:

```bash
git clone https://github.com/Alolononon/ServiHub.git
cd ServiHub
npm install
```

### 3. Set Up the Database
For Windows (PowerShell):
```bash
$env:DATABASE_URL = "file:./dev.db"
npx prisma db push
```
For macOS/Linux (bash/zsh):
```bash
DATABASE_URL="file:./dev.db" npx prisma db push
```

### 4. Start the Development Server
```bash
npm run dev
```

Then open your browser and go to:
http://localhost:3000

Note: 
The default admin password is: adminsecret123