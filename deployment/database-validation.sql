-- =============================================================================
-- DATABASE VALIDATION QUERIES
-- Transportation Management System - Production Readiness Check
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABLE COUNT & ROW COUNTS
-- ---------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    (
        SELECT COUNT(*) 
        FROM pg_class c 
        WHERE c.relname = tablename
    ) as table_exists,
    (
        SELECT n_tup_ins - n_tup_del 
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public' AND relname = tablename
    ) as approx_row_count
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;

-- ---------------------------------------------------------------------------
-- 2. VERIFY CRITICAL TABLES
-- ---------------------------------------------------------------------------
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') 
        THEN '✓ users table exists'
        ELSE '✗ users table MISSING'
    END as users_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trips') 
        THEN '✓ trips table exists'
        ELSE '✗ trips table MISSING'
    END as trips_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') 
        THEN '✓ bookings table exists'
        ELSE '✗ bookings table MISSING'
    END as bookings_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'otp_codes') 
        THEN '✓ otp_codes table exists'
        ELSE '✗ otp_codes table MISSING'
    END as otp_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') 
        THEN '✓ payments table exists'
        ELSE '✗ payments table MISSING'
    END as payments_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') 
        THEN '✓ audit_logs table exists'
        ELSE '✗ audit_logs table MISSING'
    END as audit_logs_check;

-- ---------------------------------------------------------------------------
-- 3. VERIFY ALL FOREIGN KEYS ARE VALID
-- ---------------------------------------------------------------------------
SELECT 
    COUNT(*) as total_foreign_keys,
    COUNT(CASE WHEN is_valid THEN 1 END) as valid_foreign_keys,
    COUNT(CASE WHEN NOT is_valid THEN 1 END) as invalid_foreign_keys
FROM (
    SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition,
        convalidated as is_valid
    FROM 
        pg_constraint
    WHERE 
        contype = 'f' 
        AND connamespace = 'public'::regnamespace
) fk_check;

-- ---------------------------------------------------------------------------
-- 4. VERIFY INDEXES
-- ---------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    COUNT(*) as index_count
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
GROUP BY 
    schemaname, tablename
ORDER BY 
    tablename;

-- ---------------------------------------------------------------------------
-- 5. CHECK FOR MISSING SEQUENCES
-- ---------------------------------------------------------------------------
SELECT 
    tablename,
    column_name,
    column_default,
    CASE 
        WHEN column_default LIKE 'nextval%' 
        THEN 
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM pg_sequences 
                    WHERE schemaname = 'public' 
                    AND sequencename = REPLACE(REPLACE(column_default, 'nextval(''', ''), '''::regclass)', '')
                )
                THEN '✓ Sequence exists'
                ELSE '✗ Sequence MISSING'
            END
        ELSE 'No sequence'
    END as sequence_status
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND column_default LIKE 'nextval%';

-- ---------------------------------------------------------------------------
-- 6. VERIFY TRIGGERS
-- ---------------------------------------------------------------------------
SELECT 
    trigger_schema,
    event_object_table as table_name,
    trigger_name,
    event_manipulation as trigger_event,
    action_timing as trigger_timing,
    action_statement as trigger_function
FROM 
    information_schema.triggers
WHERE 
    trigger_schema = 'public'
ORDER BY 
    event_object_table, trigger_name;

-- ---------------------------------------------------------------------------
-- 7. VERIFY VIEWS
-- ---------------------------------------------------------------------------
SELECT 
    table_name as view_name,
    CASE 
        WHEN view_definition IS NOT NULL THEN '✓ Valid'
        ELSE '✗ Invalid'
    END as view_status
FROM 
    information_schema.views
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;

-- ---------------------------------------------------------------------------
-- 8. CHECK ENUM TYPES
-- ---------------------------------------------------------------------------
SELECT 
    t.typname as enum_type,
    COUNT(e.enumlabel) as value_count,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM 
    pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE 
    n.nspname = 'public'
GROUP BY 
    t.typname
ORDER BY 
    t.typname;

-- ---------------------------------------------------------------------------
-- 9. VERIFY EXTENSIONS
-- ---------------------------------------------------------------------------
SELECT 
    extname as extension_name,
    extversion as version,
    CASE 
        WHEN extname = 'pgcrypto' THEN '✓ Required for gen_random_uuid()'
        WHEN extname = 'pg_trgm' THEN '✓ Required for fuzzy search'
        WHEN extname = 'btree_gist' THEN '✓ Required for EXCLUDE constraints'
        ELSE 'Additional extension'
    END as purpose
FROM 
    pg_extension
ORDER BY 
    extname;

-- ---------------------------------------------------------------------------
-- 10. CHECK FOR ORPHANED RECORDS (DATA INTEGRITY)
-- ---------------------------------------------------------------------------

-- Check for bookings without valid trips
SELECT 
    'Orphaned Bookings' as check_type,
    COUNT(*) as orphaned_count
FROM 
    bookings b
WHERE 
    NOT EXISTS (SELECT 1 FROM trips t WHERE t.id = b.trip_id);

-- Check for bookings without valid users
SELECT 
    'Bookings without Users' as check_type,
    COUNT(*) as orphaned_count
FROM 
    bookings b
WHERE 
    NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.user_id);

-- Check for audit logs without valid users
SELECT 
    'Audit Logs without Users' as check_type,
    COUNT(*) as orphaned_count
FROM 
    audit_logs a
WHERE 
    actor_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = a.actor_id);

-- ---------------------------------------------------------------------------
-- 11. VERIFY PERMISSIONS
-- ---------------------------------------------------------------------------
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM 
    information_schema.table_privileges
WHERE 
    table_schema = 'public'
    AND grantee = CURRENT_USER
ORDER BY 
    table_name, privilege_type;

-- ---------------------------------------------------------------------------
-- 12. DATABASE SIZE & STATISTICS
-- ---------------------------------------------------------------------------
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as database_size,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as table_count,
    (SELECT COUNT(*) FROM pg_sequences WHERE schemaname = 'public') as sequence_count,
    (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public') as view_count,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as trigger_count,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as index_count;

-- ---------------------------------------------------------------------------
-- 13. VERIFY CRITICAL COLUMNS EXIST
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    -- Check users table critical columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email'
    ) THEN
        missing_columns := missing_columns || 'users.email, ';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN
        missing_columns := missing_columns || 'users.password_hash, ';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trips' AND column_name = 'departure_time'
    ) THEN
        missing_columns := missing_columns || 'trips.departure_time, ';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'status'
    ) THEN
        missing_columns := missing_columns || 'bookings.status, ';
    END IF;
    
    IF LENGTH(missing_columns) > 0 THEN
        RAISE WARNING 'Missing critical columns: %', TRIM(TRAILING ', ' FROM missing_columns);
    ELSE
        RAISE NOTICE '✓ All critical columns exist';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 14. PRODUCTION READINESS SUMMARY
-- ---------------------------------------------------------------------------
SELECT 
    '✓ Database validation complete' as status,
    current_database() as database_name,
    current_user as connected_as,
    version() as postgresql_version,
    NOW() as validation_timestamp;
