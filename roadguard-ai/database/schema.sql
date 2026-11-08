-- RoadGuard AI — Database DDL Schema (MySQL 8.0+ / SQLite compatible)
-- Creates all tables, indices, and default department configurations.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'citizen' NOT NULL,
    account_status VARCHAR(30) DEFAULT 'active' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    jurisdiction_reference VARCHAR(120) NOT NULL,
    contact_configuration VARCHAR(255),
    integration_status VARCHAR(50) DEFAULT 'Demo Simulation Mode' NOT NULL,
    sla_hours INT DEFAULT 72 NOT NULL,
    escalation_rules TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cameras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stream_configuration_reference VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    road_segment_id VARCHAR(100),
    connection_status VARCHAR(40) DEFAULT 'online' NOT NULL,
    last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    feed_type VARCHAR(30) DEFAULT 'stream' NOT NULL
);

CREATE TABLE IF NOT EXISTS detections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    defect_type VARCHAR(60) NOT NULL,
    confidence DOUBLE NOT NULL,
    estimated_severity VARCHAR(30) DEFAULT 'Medium' NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    location_source VARCHAR(60) DEFAULT 'GPS Exif / Confirmed Pin' NOT NULL,
    location_accuracy DOUBLE DEFAULT 5.0,
    evidence_path VARCHAR(255) NOT NULL,
    annotated_path VARCHAR(255),
    bounding_box TEXT,
    camera_id INT,
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    review_status VARCHAR(40) DEFAULT 'pending' NOT NULL,
    FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    public_tracking_id VARCHAR(40) UNIQUE NOT NULL,
    source_type VARCHAR(50) DEFAULT 'citizen_report' NOT NULL,
    detection_id INT,
    defect_type VARCHAR(60) NOT NULL,
    description TEXT,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    road_name VARCHAR(180) NOT NULL,
    severity VARCHAR(30) DEFAULT 'Medium' NOT NULL,
    priority VARCHAR(30) DEFAULT 'P3-Normal' NOT NULL,
    responsible_department_id INT,
    current_status VARCHAR(50) DEFAULT 'Submitted' NOT NULL,
    reporter_name VARCHAR(120),
    reporter_contact VARCHAR(120),
    evidence_path VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    target_resolution_at DATETIME,
    external_reference_id VARCHAR(80),
    duplicate_of_id INT,
    FOREIGN KEY (detection_id) REFERENCES detections(id) ON DELETE SET NULL,
    FOREIGN KEY (responsible_department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (duplicate_of_id) REFERENCES complaints(id) ON DELETE SET NULL
);

CREATE INDEX idx_complaint_location ON complaints (latitude, longitude);
CREATE INDEX idx_complaint_status ON complaints (current_status);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(120) DEFAULT 'System' NOT NULL,
    notes TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    inspector_id INT,
    inspector_name VARCHAR(120),
    scheduled_at DATETIME,
    inspected_at DATETIME,
    findings TEXT,
    result VARCHAR(60),
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (inspector_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    assigned_team VARCHAR(120) NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at DATETIME,
    repair_notes TEXT,
    repair_evidence_path VARCHAR(255),
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    reviewer_id INT,
    reviewer_name VARCHAR(120),
    result VARCHAR(50) DEFAULT 'Approved' NOT NULL,
    before_evidence_reference VARCHAR(255),
    after_evidence_reference VARCHAR(255),
    verification_notes TEXT,
    similarity_score DOUBLE,
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    complaint_id INT,
    channel VARCHAR(30) DEFAULT 'in_app' NOT NULL,
    message TEXT NOT NULL,
    delivery_status VARCHAR(40) DEFAULT 'delivered' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(80) DEFAULT 'system' NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
