#!/bin/bash
# Script to reset the database using seed_db.sql

DB_USER="root"
DB_PASS="tbAR52@#"
DB_NAME="qa_training"

echo "Resetting database '$DB_NAME'..."

mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < seed_db.sql

if [ $? -eq 0 ]; then
    echo "Database reset successfully."
else
    echo "Error resetting database."
    exit 1
fi
