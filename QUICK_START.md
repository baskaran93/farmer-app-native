# 🚀 Quick Start - Database Setup

## Connection Details
```
Server: BINARY4
User: sa
Password: binary124@
Database: FarmerApp
```

## Option 1: Quick SQL Script (Fastest)

**In SQL Server Management Studio:**

1. **File** → **Open** → Select `backend/create-database.sql`
2. Click **Execute** button or press **F5**
3. Done! ✅

## Option 2: Copy-Paste SQL

**In SQL Server Management Studio:**

1. Click **New Query**
2. Paste this code:

```sql
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

CREATE INDEX IX_Sales_Date ON Sales(date);
CREATE INDEX IX_Advances_Date ON Advances(date);
```

3. Press **F5** to execute
4. Done! ✅

## Verify It Worked

Run this query:

```sql
USE FarmerApp;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
```

Should show:
- Advances
- Sales

## Then Restart Backend

```bash
cd backend
npm start
```

Look for this message:
```
✅ Connected to SQL Server
✅ Database tables created/verified
🚀 Running on port 3500
```

---

## 📱 Your App is Ready!

- **Frontend**: http://localhost:19006
- **Backend**: http://localhost:3500/api
- **Database**: FarmerApp on BINARY4

Start adding sales & advances! 🎉
