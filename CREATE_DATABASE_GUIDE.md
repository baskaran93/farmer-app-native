# 🗄️ Create FarmerApp Database - Step by Step Guide

## Prerequisites
- SQL Server installed and running
- SQL Server Management Studio (SSMS) installed
- Admin access to SQL Server

## Step 1: Open SQL Server Management Studio

1. Open **SQL Server Management Studio**
2. Connect to your server:
   - **Server name**: BINARY4
   - **Authentication**: SQL Server Authentication
   - **Login**: sa
   - **Password**: binary124@
3. Click **Connect**

## Step 2: Create the Database

### Method 1: Using SQL Script (Recommended)

1. In SSMS, click **File** → **Open** → **File**
2. Navigate to: `backend/create-database.sql`
3. Click **Open**
4. Click **Execute** (or press F5)
5. Wait for the script to complete

### Method 2: Manual SQL Execution

1. Click **New Query** button
2. Copy and paste the following SQL:

```sql
-- Create Database
CREATE DATABASE FarmerApp;
GO

USE FarmerApp;
GO

-- Create Sales Table
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

-- Create Advances Table
CREATE TABLE Advances (
    id VARCHAR(50) PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Create Indexes
CREATE INDEX IX_Sales_Date ON Sales(date);
CREATE INDEX IX_Advances_Date ON Advances(date);
```

3. Click **Execute** (F5)

## Step 3: Verify Database Created

Run this query to verify:

```sql
-- Check if database exists
SELECT * FROM sys.databases WHERE name = 'FarmerApp';

-- Check tables
USE FarmerApp;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo';

-- Expected output:
-- Advances
-- Sales
```

## Step 4: Test Connection

In PowerShell, run:

```bash
sqlcmd -S BINARY4 -U sa -P binary124@ -d FarmerApp -Q "SELECT * FROM Sales"
```

## Step 5: Restart Backend

Once database is created:

```bash
cd backend
npm start
```

You should see:
```
✅ Connected to SQL Server
✅ Database tables created/verified
```

## ✅ Success!

Your database is now ready. The backend will automatically:
- Connect to FarmerApp database
- Verify tables exist
- Start syncing data from your React app

---

## 📝 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Login failed for user 'sa'" | Verify password is correct: binary124@ |
| "Cannot find database" | Run create-database.sql script first |
| "Cannot connect to BINARY4" | Verify SQL Server is running and TCP/IP is enabled |
| "Access denied" | Use sa account with admin privileges |

---

## 🔧 Alternative: Enable Encryption (Optional)

If you want to enable encryption, add this to `.env`:

```env
DB_SERVER=BINARY4
DB_NAME=FarmerApp
DB_USER=sa
DB_PASSWORD=binary124@
PORT=3500
DB_ENCRYPT=true
```

Then restart backend.
