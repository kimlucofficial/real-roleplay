CREATE DATABASE IF NOT EXISTS real_roleplay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE real_roleplay;

CREATE TABLE IF NOT EXISTS whitelist_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(64) NOT NULL,
  discord_username VARCHAR(120) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  rp_experience VARCHAR(120) NOT NULL,
  online_time VARCHAR(120) NOT NULL,
  source VARCHAR(120) NOT NULL,
  short_description TEXT NOT NULL,
  backstory LONGTEXT NOT NULL,
  why_join TEXT NOT NULL,
  status ENUM('pending','review','approved','rejected') NOT NULL DEFAULT 'pending',
  staff_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_discord_id (discord_id),
  INDEX idx_status (status)
);
