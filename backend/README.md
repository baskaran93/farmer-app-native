# Farmer App Backend - SQL Server Setup

## 📋 Prerequisites

- SQL Server 2019+ installed and running
- Node.js 14+ installed
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database Connection

Edit `.env` file with your SQL Server credentials:

```env
DB_SERVER=localhost                    # Your SQL Server address
DB_NAME=FarmerApp                      # Database name
DB_USER=sa                             # SQL Server username
DB_PASSWORD=YourPassword123            # SQL Server password
PORT=5000
```

### 3. Create Database (First time only)

The backend automatically creates the database and tables on first run.

If you need to manually create the database:

```sql
-- Run in SQL Server Management Studio
CREATE DATABASE FarmerApp;
GO

USE FarmerApp;
GO

CREATE TABLE Sales (
  id VARCHAR(50) PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  firstKg DECIMAL(10, 2) NOT NULL,
  secondKg DECIMAL(10, 2) NOT NULL,
  firstAmount DECIMAL(10, 2) NOT NULL,
  secondRate DECIMAL(10, 2) NOT NULL,
  secondAmount DECIMAL(10, 2) NOT NULL,
  totalAmount DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Advances (
  id VARCHAR(50) PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE()
);
```

### 4. Start Backend Server

```bash
npm start
```

Server will start on http://localhost:5000

## 📡 API Endpoints

### Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Advances

- `GET /api/advances` - Get all advances
- `GET /api/advances/:id` - Get single advance
- `POST /api/advances` - Create advance
- `PUT /api/advances/:id` - Update advance
- `DELETE /api/advances/:id` - Delete advance

### Health Check

- `GET /api/health` - Server status

## 🔗 Connect React App to Backend

Update `src/services/api.ts` with your backend URL:

```typescript
const BASE = 'http://YOUR_SERVER_IP:5000/api'

// For local testing:
// Web: 'http://localhost:5000/api'
// Android Emulator: 'http://10.0.2.2:5000/api'
// Physical device: 'http://192.168.X.X:5000/api' (your local IP)
```

## 🚀 Development Mode

Run with auto-reload on file changes:

```bash
npm run dev
```

## 📝 Example API Calls

### Add Sale

```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1234567890",
    "date": "2026-09-10",
    "rate": 30,
    "firstKg": 640,
    "secondKg": 80,
    "firstAmount": 19200,
    "secondRate": 15,
    "secondAmount": 1200,
    "totalAmount": 20400
  }'
```

### Get All Sales

```bash
curl http://localhost:5000/api/sales
```

## ⚠️ Troubleshooting

### Cannot connect to SQL Server

1. Verify SQL Server is running
2. Check connection credentials in `.env`
3. Ensure SQL Server TCP/IP protocol is enabled
4. Check firewall settings

### Port 5000 already in use

Change PORT in `.env` to a different value (e.g., 5001)

### CORS errors

The backend includes CORS middleware - ensure your app URL is whitelisted

## 📚 Backend Structure

```
backend/
├── server.js          # Express server & routes setup
├── database.js        # SQL Server connection & setup
├── routes/
│   ├── sales.js       # Sales CRUD endpoints
│   └── advances.js    # Advances CRUD endpoints
├── package.json       # Dependencies
├── .env              # Configuration
└── README.md         # This file
```
