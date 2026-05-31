-- Real Roleplay database schema
-- Dùng MySQL trên Railway.
-- Trong Railway Query tab hoặc DBeaver/MySQL Workbench: connect vào database railway rồi chạy file này.

CREATE TABLE IF NOT EXISTS whitelist_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  discord_id VARCHAR(64) NOT NULL,
  discord_username VARCHAR(120) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  rp_experience VARCHAR(120) NOT NULL,
  online_time VARCHAR(120) NOT NULL,
  source VARCHAR(120) NOT NULL,
  short_description VARCHAR(80) NOT NULL,
  backstory LONGTEXT NOT NULL,
  why_join TEXT NOT NULL,
  status ENUM('pending','review','approved','rejected') NOT NULL DEFAULT 'pending',
  staff_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_discord_id (discord_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
