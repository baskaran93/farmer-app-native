# 🎯 SQL Server Configuration Guide

Your backend is ready! Now you need to configure SQL Server. Follow these steps:

## Step 1: Verify SQL Server Installation

Open **SQL Server Management Studio (SSMS)** and check your server settings.

## Step 2: Update Backend Configuration

Edit `backend/.env` with your actual SQL Server credentials:

```env
# For local development with default SQL Server
DB_SERVER=localhost
DB_NAME=FarmerApp
DB_USER=sa                          # Change this to your SQL Server login
DB_PASSWORD=YourActualPassword      # Change this to your SQL Server password
PORT=5000
```

### Finding Your SQL Server Credentials

**In SQL Server Management Studio:**
1. Right-click Server → Properties
2. Security tab → Check Login mode (Windows or Mixed)
3. If using **Windows Authentication**, update `.env`:
   ```env
   DB_SERVER=(local)
   DB_USER=YourWindowsUsername
   DB_PASSWORD=
   ```

4. If using **SQL Server Authentication (sa)**, update password:
   ```env
   DB_USER=sa
   DB_PASSWORD=YourSAPassword
   ```

## Step 3: Alternative - Use LocalDB (Simpler)

LocalDB is a simplified SQL Server version included with Visual Studio.

Update `backend/.env`:
```env
DB_SERVER=(localdb)\mssqllocaldb
DB_NAME=FarmerApp
DB_USER=.
DB_PASSWORD=
```

## Step 4: Restart Backend

1. Stop current backend (Ctrl+C)
2. Update `.env` with correct credentials
3. Restart:
   ```bash
   cd backend
   node server.js
   ```

## Expected Output

When correctly configured, you should see:

```
✅ Connected to SQL Server
✅ Database tables created/verified

╔════════════════════════════════════╗
║  Farmer App Backend Server Ready   ║
║  🚀 Running on port 5000          ║
║  📊 Database: SQL Server           ║
║  🔗 API: http://localhost:5000   ║
╚════════════════════════════════════╝
```

## Step 5: Test Connection

```bash
# Test if backend API is working
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"Farmer App Backend is running"}
```

## Need Help?

### Check SQL Server is Running

Open Services (Windows):
- Press `Win+R` → `services.msc`
- Look for "SQL Server" service
- Make sure it's **Running**

### Enable SQL Server TCP/IP

1. Open **SQL Server Configuration Manager**
2. SQL Server Network Configuration → MSSQLSERVER
3. Enable **TCP/IP**
4. Restart SQL Server service

### Test SQL Server Connection

```bash
# In Command Prompt or PowerShell
sqlcmd -S localhost -U sa -P YourPassword

# If connected, you'll see: 1>
# Exit with: exit
```

---

✅ Once configured correctly, all data will be stored in SQL Server!  
📱 App will sync automatically when backend is available  
💾 Local storage acts as fallback if offline
