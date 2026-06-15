#!/bin/bash

# =============================================================================
# Database Backup Script
# Transportation Management System
# =============================================================================
# Purpose: Automated backup of Neon PostgreSQL database
# Usage: ./backup-database.sh
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="tms_backup_${TIMESTAMP}.sql"
BACKUP_COMPRESSED="tms_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

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
echo -e "${BLUE}📦 Database Backup Script${NC}"
echo -e "${BLUE}Transportation Management System${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✓${NC} Backup directory: ${BACKUP_DIR}"

# Perform backup
echo -e "${YELLOW}⏳ Starting database backup...${NC}"
pg_dump "$DATABASE_URL" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --verbose \
    > "${BACKUP_DIR}/${BACKUP_FILE}" 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backup completed: ${BACKUP_FILE}"
    
    # Compress backup
    echo -e "${YELLOW}⏳ Compressing backup...${NC}"
    gzip "${BACKUP_DIR}/${BACKUP_FILE}"
    
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_COMPRESSED}" | cut -f1)
        echo -e "${GREEN}✓${NC} Backup compressed: ${BACKUP_COMPRESSED} (${BACKUP_SIZE})"
    else
        echo -e "${RED}❌ Compression failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Clean up old backups
echo -e "${YELLOW}⏳ Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"
find "$BACKUP_DIR" -name "tms_backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
REMAINING=$(find "$BACKUP_DIR" -name "tms_backup_*.sql.gz" -type f | wc -l)
echo -e "${GREEN}✓${NC} Cleanup complete. ${REMAINING} backups remaining."

echo ""
echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "Backup file: ${GREEN}${BACKUP_DIR}/${BACKUP_COMPRESSED}${NC}"
echo -e "Backup size: ${GREEN}${BACKUP_SIZE}${NC}"
echo -e "Timestamp:   ${GREEN}${TIMESTAMP}${NC}"
echo ""
echo -e "${YELLOW}📋 To restore this backup:${NC}"
echo -e "   gunzip ${BACKUP_DIR}/${BACKUP_COMPRESSED}"
echo -e "   psql \"\$DATABASE_URL\" -f ${BACKUP_DIR}/${BACKUP_FILE}"
echo ""
echo -e "${BLUE}==============================================================================${NC}"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo -e "${YELLOW}⏳ Uploading to cloud storage...${NC}"
# 
# # AWS S3
# # aws s3 cp "${BACKUP_DIR}/${BACKUP_COMPRESSED}" "s3://your-bucket/backups/"
# 
# # Google Cloud Storage
# # gsutil cp "${BACKUP_DIR}/${BACKUP_COMPRESSED}" "gs://your-bucket/backups/"
# 
# # Azure Blob Storage
# # az storage blob upload --account-name youraccount --container-name backups --file "${BACKUP_DIR}/${BACKUP_COMPRESSED}" --name "${BACKUP_COMPRESSED}"
# 
# echo -e "${GREEN}✓${NC} Backup uploaded to cloud storage"

exit 0
