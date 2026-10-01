-- ============================================
-- Farmer App - Database Reset Script
-- SQL Server
-- ============================================

-- Step 1: Drop existing database if it exists
DROP DATABASE IF EXISTS FarmerApp;
GO

-- Step 2: Create Database
CREATE DATABASE FarmerApp;
GO

-- Step 3: Use the new database
USE FarmerApp;
GO

-- Step 4: Create Users Table
CREATE TABLE Users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    fullName VARCHAR(100),
    isActive BIT DEFAULT 1,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Step 5: Create Sales Table
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

-- Step 6: Create Advances Table
CREATE TABLE Advances (
    id VARCHAR(50) PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);

-- Step 7: Create Indexes for better performance
CREATE INDEX IX_Sales_Date ON Sales(date);
CREATE INDEX IX_Advances_Date ON Advances(date);
CREATE INDEX IX_Users_Username ON Users(username);

-- Step 8: Insert default admin user (username: admin, password: admin123)
INSERT INTO Users (id, username, password, email, fullName, isActive)
VALUES ('admin-001', 'admin', '6fa16e3bfd3f1ecc910e0b50e18b1390', 'admin@farmerapp.com', 'Administrator', 1);

-- Step 9: Verify tables were created
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo';

-- ============================================
-- Database reset complete!
-- Default login credentials:
-- Username: admin
-- Password: admin123
-- ============================================
