-- =============================================================================
-- Migration: Make bus_id and driver_id nullable in trips table
-- Run this on the Neon production database once.
-- =============================================================================

-- Allow trips to be created without a bus assigned
ALTER TABLE trips ALTER COLUMN bus_id DROP NOT NULL;

-- Allow trips to be created without a driver assigned (can assign later)
ALTER TABLE trips ALTER COLUMN driver_id DROP NOT NULL;

-- Allow trips to be created without a route_description (auto-generated)
ALTER TABLE trips ALTER COLUMN route_description DROP NOT NULL;

-- Verify
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'trips'
  AND column_name IN ('bus_id', 'driver_id', 'route_description')
ORDER BY column_name;
