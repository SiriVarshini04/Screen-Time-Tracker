CREATE DATABASE IF NOT EXISTS screen_time_db;
USE screen_time_db;

-- Drop tables if they exist to allow easy re-running
DROP TABLE IF EXISTS Rewards;
DROP TABLE IF EXISTS Usage_Data;
DROP TABLE IF EXISTS Limits;
DROP TABLE IF EXISTS Websites;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE Websites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  daily_limit INT NOT NULL, -- inside minutes
  weekly_limit INT NOT NULL, -- inside minutes
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Renamed Usage to Usage_Data since USAGE is a reserved keyword in some SQL contexts
CREATE TABLE Usage_Data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  website_id INT,
  duration INT NOT NULL, -- inside minutes
  date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES Websites(id) ON DELETE CASCADE
);

CREATE TABLE Rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  badge_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Insert a default admin account
-- The password is 'admin123' hashed using bcrypt with salt rounds = 10
-- Password hash: $2b$10$w6pU21hXYcM4X/u5l.hApe.NqYl5R5PZ6MQQ9kF36lB2e0yW1x4rK
INSERT INTO Users (name, email, password, role) VALUES ('Admin User', 'admin@screentime.com', '$2b$10$w6pU21hXYcM4X/u5l.hApe.NqYl5R5PZ6MQQ9kF36lB2e0yW1x4rK', 'admin');
