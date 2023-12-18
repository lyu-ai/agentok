#!/bin/sh

DATA_DIR="/data"
BACKUP_DIR="/backups"

if [ ! "$(ls -A $DATA_DIR)" ] && [ "$(ls -A $BACKUP_DIR)" ]; then
    unzip $BACKUP_DIR/pb_backup.zip -d $DATA_DIR
    # any additional commands to restore the backup
fi

# Now start PocketBase
exec /usr/local/bin/pocketbase serve --dir="$DATA_DIR" --http=0.0.0.0:7676