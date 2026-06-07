-- =============================================
-- Initial Schema Migration - V1
-- Created: 2026-06-02
-- =============================================

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Monitoring Table
CREATE TABLE monitoring (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255),
    url VARCHAR(255),
    status VARCHAR(255),
    auto_check_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    check_interval INT NOT NULL DEFAULT 1,
    last_checked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_monitoring_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. HealthCheck Table 
CREATE TABLE heathcheck (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT,
    status_code NUMERIC,
    response_time NUMERIC,
    sucess BOOLEAN,
    message VARCHAR(255),
    status VARCHAR(255),
    checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_healthcheck_service 
        FOREIGN KEY (service_id) REFERENCES monitoring(id) ON DELETE CASCADE
);

-- 4. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id BIGINT,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================

CREATE INDEX idx_monitoring_user_id ON monitoring(user_id);
CREATE INDEX idx_monitoring_status ON monitoring(status);
CREATE INDEX idx_healthcheck_service_id ON healthcheck(service_id);
CREATE INDEX idx_healthcheck_checked_at ON healthcheck(checked_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE users IS 'User accounts';
COMMENT ON TABLE monitoring IS 'Monitored services/endpoints';
COMMENT ON TABLE healthcheck IS 'Health check history logs';
COMMENT ON TABLE audit_logs IS 'Audit trail for user actions';