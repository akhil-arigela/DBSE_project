-- ============================================================
--  Real Estate Listing & Virtual Tour Portal — MySQL Schema
--  Normalized to 3NF | Course: 25CS1302E | Trimester 4 Y25
-- ============================================================

CREATE DATABASE IF NOT EXISTS realestate_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE realestate_db;

-- ─────────────────────────────────────────────
-- Drop tables in reverse FK order (safe re-run)
-- ─────────────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS property_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ─────────────────────────────────────────────
-- 1. USERS  (buyers, sellers, agents all share this table)
-- ─────────────────────────────────────────────
CREATE TABLE users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('buyer','seller','agent') NOT NULL DEFAULT 'buyer',
    phone         VARCHAR(20),
    profile_image VARCHAR(500),
    is_active     BOOLEAN       DEFAULT TRUE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email  (email),
    INDEX idx_users_role   (role)
);

-- ─────────────────────────────────────────────
-- 2. AGENTS  (extended profile for agent-role users)
-- ─────────────────────────────────────────────
CREATE TABLE agents (
    agent_id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT          NOT NULL UNIQUE,
    license_number   VARCHAR(50),
    bio              TEXT,
    agency_name      VARCHAR(150),
    experience_years INT          DEFAULT 0,
    avg_rating       DECIMAL(3,2) DEFAULT 0.00,
    total_reviews    INT          DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_agents_user (user_id)
);

-- ─────────────────────────────────────────────
-- 3. PROPERTIES  (core listing data)
-- ─────────────────────────────────────────────
CREATE TABLE properties (
    property_id      INT AUTO_INCREMENT PRIMARY KEY,
    seller_id        INT          NOT NULL,
    agent_id         INT,
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    property_type    ENUM('house','apartment','condo','villa','plot','commercial') NOT NULL,
    listing_type     ENUM('sale','rent') NOT NULL,
    price            DECIMAL(14,2) NOT NULL,
    address          VARCHAR(255) NOT NULL,
    city             VARCHAR(100) NOT NULL,
    state            VARCHAR(100),
    country          VARCHAR(100) DEFAULT 'India',
    pincode          VARCHAR(20),
    latitude         DECIMAL(10,8),
    longitude        DECIMAL(11,8),
    bedrooms         INT,
    bathrooms        INT,
    area_sqft        DECIMAL(10,2),
    has_virtual_tour BOOLEAN      DEFAULT FALSE,
    status           ENUM('available','sold','rented','inactive') DEFAULT 'available',
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (agent_id)  REFERENCES agents(agent_id) ON DELETE SET NULL,
    -- Indexed columns for filtered search
    INDEX idx_prop_city       (city),
    INDEX idx_prop_type       (property_type),
    INDEX idx_prop_listing    (listing_type),
    INDEX idx_prop_price      (price),
    INDEX idx_prop_status     (status),
    INDEX idx_prop_seller     (seller_id)
);

-- ─────────────────────────────────────────────
-- 4. AMENITIES  (reference table — avoids multi-valued columns)
-- ─────────────────────────────────────────────
CREATE TABLE amenities (
    amenity_id   INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE
);

-- Seed common amenities
INSERT INTO amenities (name) VALUES
  ('Swimming Pool'),('Gym'),('Parking'),('Elevator'),('Security'),
  ('Garden'),('Balcony'),('Air Conditioning'),('Power Backup'),('Internet'),
  ('Clubhouse'),('Children Play Area'),('Jogging Track'),('CCTV'),('Modular Kitchen');

-- ─────────────────────────────────────────────
-- 5. PROPERTY_AMENITIES  (junction table — 3NF bridge)
-- ─────────────────────────────────────────────
CREATE TABLE property_amenities (
    property_id  INT NOT NULL,
    amenity_id   INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id)  REFERENCES amenities(amenity_id)  ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 6. MEDIA  (photos & 360° tour assets)
--    Metadata in DB; file in local storage / Cloudinary
-- ─────────────────────────────────────────────
CREATE TABLE media (
    media_id      INT AUTO_INCREMENT PRIMARY KEY,
    property_id   INT          NOT NULL,
    media_type    ENUM('photo','virtual_tour_360','video') NOT NULL DEFAULT 'photo',
    url           VARCHAR(500) NOT NULL,
    filename      VARCHAR(255),
    is_primary    BOOLEAN      DEFAULT FALSE,
    display_order INT          DEFAULT 0,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    INDEX idx_media_property (property_id),
    INDEX idx_media_type     (media_type)
);

-- ─────────────────────────────────────────────
-- 7. BOOKINGS  (site-visit scheduling)
--    Conflict-free via application-level transaction locks
-- ─────────────────────────────────────────────
CREATE TABLE bookings (
    booking_id   INT AUTO_INCREMENT PRIMARY KEY,
    property_id  INT  NOT NULL,
    buyer_id     INT  NOT NULL,
    agent_id     INT,
    visit_date   DATE NOT NULL,
    visit_time   TIME NOT NULL,
    status       ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (buyer_id)    REFERENCES users(user_id),
    FOREIGN KEY (agent_id)    REFERENCES agents(agent_id) ON DELETE SET NULL,
    -- Unique slot: one booking per property per date+time slot
    UNIQUE KEY uq_slot (property_id, visit_date, visit_time),
    INDEX idx_booking_buyer    (buyer_id),
    INDEX idx_booking_property (property_id),
    INDEX idx_booking_status   (status)
);

-- ─────────────────────────────────────────────
-- 8. REVIEWS  (ratings for properties and/or agents)
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
    review_id    INT AUTO_INCREMENT PRIMARY KEY,
    property_id  INT,
    agent_id     INT,
    reviewer_id  INT NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id)    REFERENCES agents(agent_id)        ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id),
    -- One review per reviewer per entity
    UNIQUE KEY uq_review_property (reviewer_id, property_id),
    INDEX idx_review_property (property_id),
    INDEX idx_review_agent    (agent_id)
);

-- ─────────────────────────────────────────────
-- 9. TRANSACTIONS  (payment & deal records)
-- ─────────────────────────────────────────────
CREATE TABLE transactions (
    transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
    property_id      INT          NOT NULL,
    buyer_id         INT          NOT NULL,
    seller_id        INT          NOT NULL,
    agent_id         INT,
    amount           DECIMAL(14,2) NOT NULL,
    transaction_type ENUM('sale','rent') NOT NULL,
    status           ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    payment_method   VARCHAR(50),
    reference_number VARCHAR(100),
    notes            TEXT,
    transaction_date TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (buyer_id)    REFERENCES users(user_id),
    FOREIGN KEY (seller_id)   REFERENCES users(user_id),
    FOREIGN KEY (agent_id)    REFERENCES agents(agent_id) ON DELETE SET NULL,
    INDEX idx_txn_buyer    (buyer_id),
    INDEX idx_txn_property (property_id),
    INDEX idx_txn_status   (status)
);

-- ─────────────────────────────────────────────
-- Sample seed data (optional — for testing)
-- ─────────────────────────────────────────────
-- Default admin / test users (password: Test@1234 bcrypt hashed)
INSERT INTO users (name, email, password_hash, role, phone) VALUES
  ('Admin User',   'admin@realestate.com',  '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'seller', '9000000001'),
  ('Agent Ravi',   'ravi@realestate.com',   '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'agent',  '9000000002'),
  ('Buyer Priya',  'priya@example.com',     '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'buyer',  '9000000003');

INSERT INTO agents (user_id, license_number, bio, agency_name, experience_years) VALUES
  (2, 'LIC-2024-001', 'Senior real estate agent with 10 years of experience.', 'Prime Realty', 10);
