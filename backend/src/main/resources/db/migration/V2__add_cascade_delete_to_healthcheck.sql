-- =============================================
-- V2: Add CASCADE DELETE to HealthCheck Table
-- Date: 2026-06-08
-- =============================================

-- Drop the existing constraint (without cascade)
ALTER TABLE heathcheck 
DROP CONSTRAINT IF EXISTS fk4i6sc94sornwihg9j15ankmdl;

-- Re-create the foreign key with CASCADE DELETE
ALTER TABLE heathcheck 
ADD CONSTRAINT fk_healthcheck_service 
FOREIGN KEY (service_id) 
REFERENCES monitoring(id) 
ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_healthcheck_service_id 
ON heathcheck(service_id);

-- Documentation
COMMENT ON CONSTRAINT fk_healthcheck_service ON heathcheck 
IS 'When a service is deleted, automatically delete all its health check logs';