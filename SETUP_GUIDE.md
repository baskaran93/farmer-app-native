# 🚀 Farmer App - Complete Setup Guide

## Database Configuration

Your app now supports both **Local Storage** (fallback) and **SQL Server Database** (primary).

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure SQL Server

Edit `backend/.env`:

```env
DB_SERVER=localhost              # SQL Server instance
DB_NAME=FarmerApp               # Database name
DB_USER=sa                      # Username (default: sa)
DB_PASSWORD=YourPassword123     # Your SQL Server password
PORT=5000
```

### Step 3: Start Backend Server

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
✅ Connected to SQL Server
✅ Database tables created/verified
🚀 Farmer App Backend Server Ready
   Running on port 5000
```

### Step 4: Update App API URL

Edit `src/services/api.ts` line 1:

```typescript
// For Web (localhost):
const BASE = 'http://localhost:5000/api'

// For Android Emulator:
const BASE = 'http://10.0.2.2:5000/api'

// For Physical Device (use your machine's IP):
const BASE = 'http://192.168.X.X:5000/api'
```

Find your PC IP:
```bash
ipconfig  # Windows
# Look for "IPv4 Address" like 192.168.1.100
```

### Step 5: Start React App

**Terminal 2 - Frontend:**
```bash
npm start
```

Then press `w` for web.

## ✅ Verification

### Check Backend is Running

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Farmer App Backend is running"
}
```

### Check Database Connection

Look for this in backend terminal:
```
✅ Connected to SQL Server
✅ Database tables created/verified
```

## 🔄 Data Flow

1. **Add Sale** → React App → Backend API → SQL Server Database
2. **Get Sales** → React App → Backend API → SQL Server Database ← Local Storage (fallback)
3. **Delete Sale** → React App → Backend API → SQL Server Database

### Offline Support
If the backend is unavailable, the app saves to local storage automatically and syncs when connection is restored.

## 📊 Database Tables

### Sales Table
```sql
CREATE TABLE Sales (
  id VARCHAR(50) PRIMARY KEY,
  date VARCHAR(10),
  rate DECIMAL(10,2),
  firstKg DECIMAL(10,2),
  secondKg DECIMAL(10,2),
  firstAmount DECIMAL(10,2),
  secondRate DECIMAL(10,2),
  secondAmount DECIMAL(10,2),
  totalAmount DECIMAL(10,2),
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Advances Table
```sql
CREATE TABLE Advances (
  id VARCHAR(50) PRIMARY KEY,
  date VARCHAR(10),
  amount DECIMAL(10,2),
  description VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
)
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot connect to SQL Server` | Verify SQL Server is running, check credentials in `.env` |
| `Port 5000 already in use` | Change `PORT=5001` in `.env` |
| `CORS errors` | Ensure API URL matches your network setup |
| `Data not saving` | Check browser console for API errors, backend logs |
| `Offline mode` | App falls back to local storage automatically |

## 🎯 Production Deployment

### Backend Deployment (e.g., Azure)

1. Set environment variables on hosting platform
2. Update API URL to production domain
3. Deploy backend code
4. Test API endpoints

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API URL to production backend
2. Deploy React app
3. Test full flow

## 📞 Support

- Check backend logs: Look at terminal output
- Check frontend logs: Open browser DevTools (F12)
- Verify database: Use SQL Server Management Studio
- Check network: Use browser Network tab or `curl` commands

---

**Backend**: http://localhost:5000  
**Frontend**: http://localhost:19006 (Web) or Expo Go (Mobile)
