-- Simple Migration: Add reset_token and reset_token_expiry columns to users table
-- Run this manually if TypeORM synchronize doesn't work
-- Or restart your server - TypeORM with synchronize: true will add these automatically

USE swift_filling;

-- Add columns (will fail if they already exist, which is fine)
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL,
ADD COLUMN role VARCHAR(50) DEFAULT 'customer',
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Add index
CREATE INDEX idx_reset_token ON users(reset_token);




