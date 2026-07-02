-- ============================================================
-- People E-Sheba — MySQL Database Schema
-- Version : 1.0
-- Created : 2026-04-24
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS people_e_sheba
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE people_e_sheba;

-- ============================================================
-- Disable FK checks during setup
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TABLE: users
-- ============================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)        NOT NULL,
  email         VARCHAR(180)        NOT NULL UNIQUE,
  password_hash VARCHAR(255)        NOT NULL,
  phone         VARCHAR(20)         DEFAULT NULL,
  address       TEXT                DEFAULT NULL,
  division      VARCHAR(60)         DEFAULT NULL,  -- e.g. Dhaka, Chittagong
  district      VARCHAR(60)         DEFAULT NULL,
  avatar_url    VARCHAR(500)        DEFAULT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  blood_group   ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  is_active     TINYINT(1)          NOT NULL DEFAULT 1,
  created_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email    (email),
  INDEX idx_users_role     (role),
  INDEX idx_users_division (division),
  INDEX idx_users_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: sos_contacts
-- ============================================================
DROP TABLE IF EXISTS sos_contacts;
CREATE TABLE sos_contacts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120)  NOT NULL,                -- e.g. "National Emergency"
  number       VARCHAR(30)   NOT NULL,
  description  VARCHAR(255)  DEFAULT NULL,
  icon         VARCHAR(60)   DEFAULT NULL,            -- icon key for frontend
  sort_order   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_sos_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: emergency_services
-- ============================================================
DROP TABLE IF EXISTS emergency_services;
CREATE TABLE emergency_services (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(180)  NOT NULL,
  category     ENUM('hospital','ambulance','police','fire','other') NOT NULL,
  address      TEXT          DEFAULT NULL,
  division     VARCHAR(60)   DEFAULT NULL,
  district     VARCHAR(60)   DEFAULT NULL,
  phone        VARCHAR(60)   DEFAULT NULL,  -- comma-separated numbers
  email        VARCHAR(180)  DEFAULT NULL,
  latitude     DECIMAL(10,7) DEFAULT NULL,
  longitude    DECIMAL(10,7) DEFAULT NULL,
  description  TEXT          DEFAULT NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_by   INT UNSIGNED  DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_es_category (category),
  INDEX idx_es_division (division),
  INDEX idx_es_district (district),
  INDEX idx_es_active   (is_active),
  CONSTRAINT fk_es_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: blood_donors
-- ============================================================
DROP TABLE IF EXISTS blood_donors;
CREATE TABLE blood_donors (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED  NOT NULL,
  blood_group     ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  division        VARCHAR(60)   NOT NULL,
  district        VARCHAR(60)   NOT NULL,
  phone           VARCHAR(20)   NOT NULL,
  last_donated_at DATE          DEFAULT NULL,
  is_available    TINYINT(1)    NOT NULL DEFAULT 1,  -- 0 = not available right now
  note            TEXT          DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_donor_user (user_id),  -- one donor record per user
  INDEX idx_bd_blood_group   (blood_group),
  INDEX idx_bd_division      (division),
  INDEX idx_bd_district      (district),
  INDEX idx_bd_available     (is_available),
  CONSTRAINT fk_bd_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: donation_posts
-- ============================================================
DROP TABLE IF EXISTS donation_posts;
CREATE TABLE donation_posts (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED  NOT NULL,
  title           VARCHAR(255)  NOT NULL,
  description     TEXT          NOT NULL,
  amount_needed   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  amount_received DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  category        ENUM('medical','education','food','disaster','other') NOT NULL DEFAULT 'other',
  division        VARCHAR(60)   DEFAULT NULL,
  district        VARCHAR(60)   DEFAULT NULL,
  image_url       VARCHAR(500)  DEFAULT NULL,
  status          ENUM('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
  admin_note      TEXT          DEFAULT NULL,
  reviewed_by     INT UNSIGNED  DEFAULT NULL,
  reviewed_at     DATETIME      DEFAULT NULL,
  expires_at      DATE          DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_dp_user_id   (user_id),
  INDEX idx_dp_status    (status),
  INDEX idx_dp_category  (category),
  INDEX idx_dp_division  (division),
  CONSTRAINT fk_dp_user        FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_dp_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: donations
-- ============================================================
DROP TABLE IF EXISTS donations;
CREATE TABLE donations (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id        INT UNSIGNED   NOT NULL,
  donor_id       INT UNSIGNED   NOT NULL,  -- user making the donation
  amount         DECIMAL(12,2)  NOT NULL,
  payment_method ENUM('bkash','nagad','rocket','bank','cash','other') NOT NULL DEFAULT 'other',
  transaction_id VARCHAR(120)   DEFAULT NULL,
  message        TEXT           DEFAULT NULL,
  status         ENUM('pending','confirmed','failed') NOT NULL DEFAULT 'pending',
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_don_post_id  (post_id),
  INDEX idx_don_donor_id (donor_id),
  INDEX idx_don_status   (status),
  CONSTRAINT fk_don_post  FOREIGN KEY (post_id)  REFERENCES donation_posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_don_donor FOREIGN KEY (donor_id) REFERENCES users(id)          ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: jobs
-- ============================================================
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  posted_by    INT UNSIGNED  NOT NULL,
  title        VARCHAR(255)  NOT NULL,
  company      VARCHAR(180)  DEFAULT NULL,
  category     ENUM('tuition','worker','office','ngo','driver','domestic','other') NOT NULL DEFAULT 'other',
  job_type     ENUM('full_time','part_time','contract','volunteer') NOT NULL DEFAULT 'full_time',
  description  TEXT          NOT NULL,
  requirements TEXT          DEFAULT NULL,
  salary       VARCHAR(100)  DEFAULT NULL,  -- e.g. "8,000–12,000 BDT/month"
  division     VARCHAR(60)   DEFAULT NULL,
  district     VARCHAR(60)   DEFAULT NULL,
  address      TEXT          DEFAULT NULL,
  contact_phone VARCHAR(30)  DEFAULT NULL,
  contact_email VARCHAR(180) DEFAULT NULL,
  deadline     DATE          DEFAULT NULL,
  status       ENUM('open','closed','expired') NOT NULL DEFAULT 'open',
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_jobs_posted_by (posted_by),
  INDEX idx_jobs_category  (category),
  INDEX idx_jobs_status    (status),
  INDEX idx_jobs_division  (division),
  CONSTRAINT fk_jobs_posted_by FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: job_applications
-- ============================================================
DROP TABLE IF EXISTS job_applications;
CREATE TABLE job_applications (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id       INT UNSIGNED  NOT NULL,
  applicant_id INT UNSIGNED  NOT NULL,
  cover_letter TEXT          DEFAULT NULL,
  resume_url   VARCHAR(500)  DEFAULT NULL,
  status       ENUM('submitted','reviewed','shortlisted','rejected') NOT NULL DEFAULT 'submitted',
  applied_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_job_applicant (job_id, applicant_id),  -- one application per job
  INDEX idx_ja_job_id       (job_id),
  INDEX idx_ja_applicant_id (applicant_id),
  INDEX idx_ja_status       (status),
  CONSTRAINT fk_ja_job       FOREIGN KEY (job_id)       REFERENCES jobs(id)  ON DELETE CASCADE,
  CONSTRAINT fk_ja_applicant FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: volunteers
-- ============================================================
DROP TABLE IF EXISTS volunteers;
CREATE TABLE volunteers (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED  NOT NULL,
  role         ENUM('blood_donor','helper','rescue','medical','teacher','other') NOT NULL DEFAULT 'helper',
  division     VARCHAR(60)   NOT NULL,
  district     VARCHAR(60)   NOT NULL,
  phone        VARCHAR(20)   NOT NULL,
  skills       TEXT          DEFAULT NULL,
  availability VARCHAR(120)  DEFAULT NULL,  -- e.g. "Weekends", "Anytime"
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  note         TEXT          DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_volunteer_user (user_id),  -- one volunteer record per user
  INDEX idx_vol_role     (role),
  INDEX idx_vol_division (division),
  INDEX idx_vol_district (district),
  INDEX idx_vol_active   (is_active),
  CONSTRAINT fk_vol_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- Re-enable FK checks
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- ██████████  SEED DATA  ██████████
-- ============================================================

-- ----------------------------------------
-- SEED: users
-- Passwords are bcrypt hash of "Password@123"
-- ----------------------------------------
INSERT INTO users (name, email, password_hash, phone, address, division, district, role, blood_group) VALUES
('Admin User',        'admin@esheba.bd',   '$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01700000001', 'Motijheel, Dhaka',     'Dhaka',     'Dhaka',      'admin', 'O+'),
('Rahim Uddin',       'rahim@example.com', '$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01711111111', 'Mirpur 10, Dhaka',     'Dhaka',     'Dhaka',      'user',  'A+'),
('Fatema Begum',      'fatema@example.com','$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01822222222', 'Agrabad, Chittagong',  'Chittagong','Chittagong', 'user',  'B+'),
('Karim Hossain',     'karim@example.com', '$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01933333333', 'Sylhet Sadar',         'Sylhet',    'Sylhet',     'user',  'O-'),
('Nasrin Akter',      'nasrin@example.com','$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01744444444', 'Rajshahi City',        'Rajshahi',  'Rajshahi',   'user',  'AB+'),
('Shahidul Islam',    'shahid@example.com','$2b$12$LqiMEoFpxeO8JjWvVCVn2OkRH1UcjQdFZbbh.fGxaUBpnLWmGfYEG', '01855555555', 'Khulna Sadar',         'Khulna',    'Khulna',     'user',  'B-');


-- ----------------------------------------
-- SEED: sos_contacts
-- ----------------------------------------
INSERT INTO sos_contacts (name, number, description, icon, sort_order) VALUES
('National Emergency',   '999',       'Police, Fire, Ambulance — one number',           'emergency',   1),
('Ambulance Service',    '199',       'Government ambulance (free)',                     'ambulance',   2),
('Fire Service',         '16163',     'Fire Service & Civil Defence',                   'fire',        3),
('Police Control Room',  '100',       'Bangladesh Police emergency line',               'police',      4),
('Disaster Helpline',    '1090',      'Ministry of Disaster Management',                'disaster',    5),
('Women & Children Help','109',       'Violence / trafficking / child abuse hotline',   'woman',       6),
('Suicide Prevention',   '16789',     'Kaan Pete Roi — mental health helpline',         'mental',      7),
('Coast Guard',          '01769400900','Bangladesh Coast Guard emergency',              'coast',       8);


-- ----------------------------------------
-- SEED: emergency_services
-- ----------------------------------------
INSERT INTO emergency_services (name, category, address, division, district, phone, latitude, longitude, created_by) VALUES
('Dhaka Medical College Hospital',   'hospital',  'Secretariat Rd, Dhaka 1000',        'Dhaka',     'Dhaka',       '02-55165088',      23.7259280, 90.3991390, 1),
('Sir Salimullah Medical College',   'hospital',  'Mitford Rd, Dhaka 1100',             'Dhaka',     'Dhaka',       '02-57315901',      23.7131760, 90.4058380, 1),
('Chittagong Medical College Hosp.', 'hospital',  'K B Fazlul Kader Rd, Chittagong',   'Chittagong','Chittagong',  '031-636695',       22.3568790, 91.8337310, 1),
('Sylhet MAG Osmani Medical',        'hospital',  'Osmani Hospital Rd, Sylhet',         'Sylhet',    'Sylhet',      '0821-716476',      24.8948260, 91.8687940, 1),
('Rajshahi Medical College Hospital','hospital',  'Rajshahi 6000',                      'Rajshahi',  'Rajshahi',    '0721-772150',      24.3745220, 88.5987730, 1),
('Dhaka Fire Service HQ',            'fire',      'Fulbaria, Dhaka',                    'Dhaka',     'Dhaka',       '02-9556006',       23.7272490, 90.4124700, 1),
('Chittagong Fire Service',          'fire',      'Jubilee Rd, Chittagong',             'Chittagong','Chittagong',  '031-713553',       22.3328610, 91.8362150, 1),
('DMP Headquarters',                 'police',    'Ramna, Dhaka 1000',                  'Dhaka',     'Dhaka',       '02-8391009',       23.7338640, 90.4043040, 1),
('Chittagong Metro Police',          'police',    'Dampara Police Lines, Chittagong',   'Chittagong','Chittagong',  '031-636866',       22.3362780, 91.8317220, 1),
('DGDA Ambulance Dhaka',             'ambulance', 'Mohakhali, Dhaka',                   'Dhaka',     'Dhaka',       '199',              23.7806130, 90.4063430, 1);


-- ----------------------------------------
-- SEED: blood_donors
-- ----------------------------------------
INSERT INTO blood_donors (user_id, blood_group, division, district, phone, last_donated_at, is_available) VALUES
(2, 'A+', 'Dhaka',     'Dhaka',       '01711111111', '2025-12-01', 1),
(3, 'B+', 'Chittagong','Chittagong',  '01822222222', '2026-01-15', 1),
(4, 'O-', 'Sylhet',    'Sylhet',      '01933333333', NULL,         1),
(5, 'AB+','Rajshahi',  'Rajshahi',    '01744444444', '2025-11-20', 0),
(6, 'B-', 'Khulna',    'Khulna',      '01855555555', '2026-02-10', 1);


-- ----------------------------------------
-- SEED: donation_posts
-- ----------------------------------------
INSERT INTO donation_posts (user_id, title, description, amount_needed, amount_received, category, division, district, status, reviewed_by, reviewed_at) VALUES
(2, 'Help for Cancer Treatment',
   'My mother has been diagnosed with blood cancer. We need financial support for her chemotherapy sessions at DMCH.',
   150000.00, 35000.00, 'medical', 'Dhaka', 'Dhaka', 'approved', 1, NOW()),

(3, 'Flood Relief for Sunamganj Victims',
   'Families in Sunamganj are severely affected by the 2026 floods. We are collecting donations for food and shelter.',
   500000.00, 210000.00, 'disaster', 'Sylhet', 'Sunamganj', 'approved', 1, NOW()),

(4, 'School Fees for Poor Children',
   'Supporting 20 underprivileged children in Sylhet Sadar with school admission and monthly tuition fees.',
   80000.00, 0.00, 'education', 'Sylhet', 'Sylhet', 'pending', NULL, NULL),

(5, 'Winter Clothes for Street People',
   'Collecting warm clothes and blankets for homeless people in Rajshahi during winter.',
   30000.00, 12000.00, 'other', 'Rajshahi', 'Rajshahi', 'approved', 1, NOW()),

(6, 'Food for Orphan Children',
   'Monthly food support for 50 orphan children living in a shelter in Khulna.',
   60000.00, 0.00, 'food', 'Khulna', 'Khulna', 'pending', NULL, NULL);


-- ----------------------------------------
-- SEED: donations
-- ----------------------------------------
INSERT INTO donations (post_id, donor_id, amount, payment_method, transaction_id, message, status) VALUES
(1, 1, 15000.00, 'bkash',  'BKS20260101A', 'Praying for your mother''s recovery.',  'confirmed'),
(1, 5, 10000.00, 'nagad',  'NGD20260102B', 'Stay strong.',                          'confirmed'),
(1, 6, 10000.00, 'rocket', 'RKT20260103C', NULL,                                    'confirmed'),
(2, 1, 100000.00,'bank',   'BBL20260104D', 'For flood relief.',                     'confirmed'),
(2, 2, 50000.00, 'bkash',  'BKS20260105E', NULL,                                    'confirmed'),
(2, 3, 60000.00, 'nagad',  'NGD20260106F', 'Helping flood victims.',                'confirmed'),
(4, 1, 12000.00, 'bkash',  'BKS20260107G', 'For winter relief.',                    'confirmed');


-- ----------------------------------------
-- SEED: jobs
-- ----------------------------------------
INSERT INTO jobs (posted_by, title, company, category, job_type, description, requirements, salary, division, district, contact_phone, deadline, status) VALUES
(1, 'Home Tutor (HSC Math & Physics)',
   'Private Family',
   'tuition', 'part_time',
   'Looking for an experienced home tutor for 2 HSC students (Science group) in Mirpur, Dhaka.',
   'BSc/MSc in Math or Physics. Minimum 2 years tutoring experience.',
   '8,000–12,000 BDT/month',
   'Dhaka', 'Dhaka', '01700000001', '2026-06-30', 'open'),

(1, 'Office Assistant',
   'Sunshine Trading Co.',
   'office', 'full_time',
   'We need a hardworking office assistant for our trading company in Motijheel.',
   'SSC passed. Computer knowledge preferred. Age 20–35.',
   '12,000–15,000 BDT/month',
   'Dhaka', 'Dhaka', '01700000001', '2026-05-31', 'open'),

(2, 'Garments Worker (Sewing Operator)',
   'Dhaka Apparels Ltd.',
   'worker', 'full_time',
   'Urgently needed experienced sewing machine operators for our RMG factory.',
   'Minimum 1 year experience in sewing. No education requirement.',
   '10,000–14,000 BDT/month',
   'Dhaka', 'Dhaka', '01711111111', '2026-05-15', 'open'),

(3, 'NGO Field Officer — Chittagong',
   'BDesh Aid Foundation',
   'ngo', 'full_time',
   'Field officer needed to manage community programs in rural Chittagong.',
   'Graduation required. Must have own bike. NGO experience preferred.',
   '18,000–22,000 BDT/month + travel allowance',
   'Chittagong', 'Chittagong', '01822222222', '2026-06-15', 'open'),

(4, 'Rickshaw/CNG Driver',
   'Individual Owner',
   'driver', 'full_time',
   'Honest and experienced driver needed for CNG auto-rickshaw in Sylhet city.',
   'Valid driving license required.',
   '15,000 BDT/month or 50/50 revenue share',
   'Sylhet', 'Sylhet', '01933333333', '2026-05-01', 'open');


-- ----------------------------------------
-- SEED: job_applications
-- ----------------------------------------
INSERT INTO job_applications (job_id, applicant_id, cover_letter, status) VALUES
(1, 3, 'I have 3 years of tutoring experience in Dhaka.', 'submitted'),
(1, 4, 'Currently pursuing BSc in Math at Sylhet University.', 'reviewed'),
(2, 5, 'I have worked as a receptionist for 2 years.', 'submitted'),
(3, 6, 'I have 2 years of factory experience.',            'shortlisted'),
(4, 2, 'Interested in community development work.',        'submitted');


-- ----------------------------------------
-- SEED: volunteers
-- ----------------------------------------
INSERT INTO volunteers (user_id, role, division, district, phone, skills, availability, is_active) VALUES
(2, 'blood_donor', 'Dhaka',     'Dhaka',      '01711111111', 'First aid, CPR',          'Anytime',  1),
(3, 'helper',      'Chittagong','Chittagong',  '01822222222', 'Cooking, Logistics',      'Weekends', 1),
(4, 'rescue',      'Sylhet',    'Sylhet',      '01933333333', 'Swimming, First aid',     'Anytime',  1),
(5, 'teacher',     'Rajshahi',  'Rajshahi',    '01744444444', 'Math, English tutoring',  'Evenings', 1),
(6, 'medical',     'Khulna',    'Khulna',      '01855555555', 'Nursing, Patient care',   'Weekends', 1);


-- ============================================================
-- END OF SCHEMA
-- ============================================================
