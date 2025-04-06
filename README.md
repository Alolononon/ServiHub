# ServiHub Report Handling System

A full-stack Next.js app that allows users to submit reports and admins to manage them.

## 🔧 Setup Instructions

1. Make sure you have **Node.js (v18 or later)** installed.
Download it here: https://nodejs.org

2. Create a empty folder, and right-click, open terminal


2. Clone the repo:

```bash
git clone https://github.com/Alolononon/ServiHub.git
cd ServiHub
```

3. Install Dependencies:
```bash
npm install
```

3. Create .env file with the inputs. copy the following:
```bash
New-Item .env -ItemType File
```

copy the content
```bash
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD=adminsecret123
```




4. Set up the database:
```bash
npx cross-env DATABASE_URL="file:./dev.db" npx prisma db push
npx prisma db push

```

5. Run the app:
```bash
npm run dev
```


Admin Login
Admin Password: adminsecret123