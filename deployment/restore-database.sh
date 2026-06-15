#!/bin/bash

# =============================================================================
# Database Restore Script
# Transportation Management System
# =============================================================================
# Purpose: Restore PostgreSQL database from backup
# Usage: ./restore-database.sh <backup-file>
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Backup file not specified${NC}"
    echo ""
    echo "Usage: ./restore-database.sh <backup-file>"
    echo ""
    echo "Example:"
    echo "  ./restore-database.sh backups/tms_backup_20260615_123456.sql.gz"
    echo ""
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

# Load environment variables if .env file exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL or individual DB vars are set
if [ -z "$DATABASE_URL" ] && [ -z "$PGHOST" ]; then
    echo -e "${RED}❌ Error: Database credentials not found${NC}"
    echo "Set DATABASE_URL or PGHOST, PGDATABASE, PGUSER, PGPASSWORD in environment"
    exit 1
fi

# Construct connection string if using individual vars
if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT:-5432}/${PGDATABASE}?sslmode=require"
fi

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}🔄 Database Restore Script${NC}"
echo -e "${BLUE}Transportation Management System${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

echo -e "${YELLOW}⚠️  WARNING: This will OVERWRITE the current database!${NC}"
echo -e "${YELLOW}⚠️  All existing data will be LOST!${NC}"
echo ""
echo -e "Backup file: ${GREEN}${BACKUP_FILE}${NC}"
echo -e "Target database: ${GREEN}${PGHOST:-extracted from DATABASE_URL}${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to proceed): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}❌ Restore cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}⏳ Starting database restore...${NC}"

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo -e "${YELLOW}⏳ Decompressing backup...${NC}"
    gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
else
    echo -e "${YELLOW}⏳ Restoring from uncompressed backup...${NC}"
    psql "$DATABASE_URL" -f "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${BLUE}==============================================================================${NC}"
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo "  1. Verify database integrity"
    echo "  2. Test application functionality"
    echo "  3. Check logs for any errors"
    echo ""
    echo -e "${YELLOW}📋 Verification queries:${NC}"
    echo '  psql "$DATABASE_URL" -c "SELECT count(*) FROM users;"'
    echo '  psql "$DATABASE_URL" -c "SELECT count(*) FROM trips;"'
    echo '  psql "$DATABASE_URL" -c "SELECT count(*) FROM bookings;"'
    echo ""
else
    echo ""
    echo -e "${RED}❌ Restore failed${NC}"
    echo "Check the error messages above for details"
    exit 1
fi

exit 0
