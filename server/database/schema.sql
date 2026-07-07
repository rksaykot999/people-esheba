-- ============================================================
-- People E-Sheba — Complete Database Schema (Full & Final)
-- ============================================================
-- Run this file on a fresh database to set up everything.
-- All tables use IF NOT EXISTS so it's safe to re-run.
-- ============================================================

DROP DATABASE IF EXISTS people_e_sheba;
CREATE DATABASE people_e_sheba
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE people_e_sheba;


-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar        VARCHAR(255),
  division      VARCHAR(60),
  district      VARCHAR(60),
  upazila       VARCHAR(60),
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  is_verified   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email  (email),
  INDEX idx_role   (role),
  INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ── SOS / Emergency Contacts ──────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_contacts (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  number     VARCHAR(30)  NOT NULL,
  type       VARCHAR(40)  NOT NULL DEFAULT 'general',
  icon       VARCHAR(10)  DEFAULT '📞',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Emergency Services ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_services (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(150) NOT NULL,
  name_bn     VARCHAR(150),
  type        ENUM('hospital','police','fire','ambulance','mental','other') NOT NULL DEFAULT 'other',
  address     VARCHAR(255),
  address_bn  VARCHAR(255),
  division    VARCHAR(60),
  district    VARCHAR(60),
  upazila     VARCHAR(60),
  phone       VARCHAR(50),
  latitude    DECIMAL(10,7),
  longitude   DECIMAL(10,7),
  is_24h      TINYINT(1)   NOT NULL DEFAULT 0,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type     (type),
  INDEX idx_district (district)
) ENGINE=InnoDB;

-- ── Blood Donors ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blood_donors (
  id               INT          PRIMARY KEY AUTO_INCREMENT,
  user_id          INT          NOT NULL,
  blood_group      ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  last_donation    DATE,
  is_available     TINYINT(1)   NOT NULL DEFAULT 1,
  division         VARCHAR(60),
  district         VARCHAR(60),
  upazila          VARCHAR(60),
  address          VARCHAR(255),
  emergency_contact VARCHAR(20),
  total_donations  INT          NOT NULL DEFAULT 0,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_blood_group (blood_group),
  INDEX idx_available   (is_available),
  INDEX idx_district    (district)
) ENGINE=InnoDB;

-- ── Donations / Help Requests ─────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  user_id       INT          NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT         NOT NULL,
  category      ENUM('medical','education','disaster','food','agriculture','other') NOT NULL DEFAULT 'other',
  amount_needed DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount_raised DECIMAL(12,2) NOT NULL DEFAULT 0,
  image         VARCHAR(255),
  division      VARCHAR(60),
  district      VARCHAR(60),
  status        ENUM('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
  is_urgent     TINYINT(1)   NOT NULL DEFAULT 0,
  deadline      DATE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status   (status),
  INDEX idx_category (category),
  INDEX idx_district (district)
) ENGINE=InnoDB;

-- ── Donation Transactions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS donation_transactions (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  donation_id  INT          NOT NULL,
  donor_id     INT,
  amount       DECIMAL(12,2) NOT NULL,
  message      VARCHAR(255),
  is_anonymous TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
  FOREIGN KEY (donor_id)    REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Jobs ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id              INT          PRIMARY KEY AUTO_INCREMENT,
  user_id         INT          NOT NULL,
  title           VARCHAR(200) NOT NULL,
  title_bn        VARCHAR(200),
  company         VARCHAR(150) NOT NULL,
  company_bn      VARCHAR(150),
  description     TEXT         NOT NULL,
  description_bn  TEXT,
  requirements    TEXT,
  category        VARCHAR(60)  NOT NULL DEFAULT 'general',
  type            ENUM('full-time','part-time','freelance','internship','govt') NOT NULL DEFAULT 'full-time',
  salary_min      DECIMAL(10,2),
  salary_max      DECIMAL(10,2),
  salary_currency VARCHAR(10)  NOT NULL DEFAULT 'BDT',
  division        VARCHAR(60),
  district        VARCHAR(60),
  is_remote       TINYINT(1)   NOT NULL DEFAULT 0,
  deadline        DATE,
  status          ENUM('active','closed','draft') NOT NULL DEFAULT 'active',
  views           INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status   (status),
  INDEX idx_type     (type),
  INDEX idx_district (district),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- ── Job Applications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_applications (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  job_id       INT          NOT NULL,
  user_id      INT          NOT NULL,
  cover_letter TEXT,
  resume       VARCHAR(255),
  status       ENUM('pending','shortlisted','rejected','hired') NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_job_user (job_id, user_id),
  FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Volunteers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id           INT          PRIMARY KEY AUTO_INCREMENT,
  user_id      INT          NOT NULL,
  skills       TEXT,
  availability VARCHAR(100),
  category     VARCHAR(80)  NOT NULL DEFAULT 'general',
  division     VARCHAR(60),
  district     VARCHAR(60),
  bio          TEXT,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_active   (is_active),
  INDEX idx_district (district),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- ── Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       TEXT         NOT NULL,
  type       VARCHAR(40)  NOT NULL DEFAULT 'info',
  link       VARCHAR(255),
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- ── Bookmarks ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id          INT         PRIMARY KEY AUTO_INCREMENT,
  user_id     INT         NOT NULL,
  entity_type ENUM('job','donation','volunteer','emergency') NOT NULL,
  entity_id   INT         NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bookmark (user_id, entity_type, entity_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Reports ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  reporter_id INT          NOT NULL,
  entity_type VARCHAR(40)  NOT NULL,
  entity_id   INT          NOT NULL,
  reason      TEXT         NOT NULL,
  status      ENUM('pending','reviewed','resolved') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Ratings ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
  id          INT       PRIMARY KEY AUTO_INCREMENT,
  user_id     INT       NOT NULL,
  entity_type VARCHAR(40) NOT NULL,
  entity_id   INT       NOT NULL,
  score       TINYINT   NOT NULL CHECK (score BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_rating (user_id, entity_type, entity_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Announcements (Admin broadcast) ──────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  admin_id   INT          NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       TEXT         NOT NULL,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Site Settings (CMS / Config) ──────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key   VARCHAR(100) PRIMARY KEY,
  setting_value TEXT,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ── Doctors ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200) NOT NULL,
  name_bn     VARCHAR(200),
  specialty   VARCHAR(100) NOT NULL,
  specialty_bn VARCHAR(100),
  area        VARCHAR(100),
  area_bn     VARCHAR(100),
  district    VARCHAR(60),
  division    VARCHAR(60),
  phone       VARCHAR(30),
  hours       VARCHAR(100),
  rating      DECIMAL(2,1) NOT NULL DEFAULT 0,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_specialty (specialty),
  INDEX idx_district  (district)
) ENGINE=InnoDB;

-- ── Pharmacies ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pharmacies (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200) NOT NULL,
  name_bn     VARCHAR(200),
  area        VARCHAR(100),
  area_bn     VARCHAR(100),
  type        ENUM('retail','hospital-pharmacy','24-7') NOT NULL DEFAULT 'retail',
  district    VARCHAR(60),
  division    VARCHAR(60),
  phone       VARCHAR(30),
  hours       VARCHAR(100),
  is_24h      TINYINT(1)   NOT NULL DEFAULT 0,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_district (district)
) ENGINE=InnoDB;

-- ── Directory Listings (Hospitals / Services / Government / Finance) ──
-- Generic reusable listing table so new public categories don't need
-- a bespoke table + controller each time. `category` picks the page,
-- `subtype` picks the filter chip shown on that page.
CREATE TABLE IF NOT EXISTS directory_listings (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  category    ENUM('hospital','service','government','finance') NOT NULL,
  subtype     VARCHAR(60)  NOT NULL DEFAULT 'other',
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  area        VARCHAR(100),
  district    VARCHAR(60),
  division    VARCHAR(60),
  address     VARCHAR(255),
  phone       VARCHAR(50),
  website     VARCHAR(300),
  rating      DECIMAL(2,1) NOT NULL DEFAULT 0,
  badge_key   VARCHAR(60),
  price_info  VARCHAR(120),
  features    VARCHAR(400),
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_subtype  (subtype),
  INDEX idx_district (district)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notices (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(300) NOT NULL,
  title_bn    VARCHAR(300),
  category    ENUM('academic','career','scholarship','government','donate','general') NOT NULL DEFAULT 'general',
  source      VARCHAR(200),
  link        VARCHAR(500),
  description TEXT,
  description_bn TEXT,
  is_urgent   TINYINT(1)   NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_active   (is_active)
) ENGINE=InnoDB;

-- ── Education Institutions (schools / colleges / universities) ─
CREATE TABLE IF NOT EXISTS education_institutions (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200) NOT NULL,
  name_bn     VARCHAR(200),
  type        ENUM('school','college','university') NOT NULL DEFAULT 'school',
  subtype     VARCHAR(60)  NOT NULL DEFAULT 'other',
  district    VARCHAR(60),
  division    VARCHAR(60),
  address     VARCHAR(255),
  address_bn  VARCHAR(255),
  phone       VARCHAR(30),
  website     VARCHAR(300),
  description TEXT,
  description_bn TEXT,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type     (type),
  INDEX idx_district (district)
) ENGINE=InnoDB;

-- ── Scholarships ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scholarships (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(300) NOT NULL,
  title_bn    VARCHAR(300),
  provider    VARCHAR(200),
  provider_bn VARCHAR(200),
  deadline    DATE,
  amount      VARCHAR(100),
  link        VARCHAR(500),
  description TEXT,
  description_bn TEXT,
  category    VARCHAR(60)  NOT NULL DEFAULT 'general',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_active   (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

-- ── Default SOS contacts ──────────────────────────────────────
INSERT IGNORE INTO sos_contacts (name, number, type, icon) VALUES
  ('National Emergency', '999',         'emergency', '🆘'),
  ('Fire Service',       '199',         'fire',      '🚒'),
  ('Ambulance',          '199',         'ambulance', '🚑'),
  ('Police',             '999',         'police',    '👮'),
  ('Anti-Terrorism',     '01769-691613','security',  '🛡️'),
  ('Child Helpline',     '1098',        'child',     '👶'),
  ('Women Helpline',     '10921',       'women',     '👩'),
  ('Suicide Prevention', '16789',       'mental',    '🧠');

-- ── Default Admin User (password: Admin@1234) ─────────────────
INSERT IGNORE INTO users (name, email, phone, password_hash, role, is_verified) VALUES
  ('Super Admin', 'admin@esheba.bd', '01700000000',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2pHKPAlMy2',
   'admin', 1);

-- ── Default Site Settings ──────────────────────────────────────
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('site_name', 'People E-Sheba'),
  ('contact_email', 'admin@peopleesheba.com'),
  ('site_description', 'A community platform for service and donation.'),
  ('hero_title', 'Empowering Citizens, Connecting Communities'),
  ('hero_subtitle', 'Join the largest digital service platform in Bangladesh.'),
  ('about_text', 'People E-Sheba is a comprehensive platform designed to bridge the gap between citizens and essential services.');

