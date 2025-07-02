### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-management-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

The application works out of the box without additional configuration. MongoDB connection is optional - the app will automatically fall back to in-memory storage if MongoDB is not available.

**Optional MongoDB Setup:**

- Install MongoDB locally or use MongoDB Atlas
- The default connection string is `mongodb://localhost:27017/projectmanagement`
- Modify `server/config/database.js` if you need a different connection string

### 4. Start the Application

```bash
npm run dev
```

This command starts both the frontend (Vite dev server) and backend (Express server) concurrently:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Note:

This application doesn't require .env file to keep the application simple for assignment and testing purpose
