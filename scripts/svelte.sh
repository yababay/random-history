#!/bin/bash

BACKUP_DIR="/mnt/backup"
BACKUP_FILE=`[ -d "$BACKUP_DIR" ] && ls -1 "$BACKUP_DIR" | egrep -o 'dump-.*\.rdb' | sort -r | head -n 1`
LATEST_BACKUP="$BACKUP_DIR/$BACKUP_FILE"

if [ -f "$LATEST_BACKUP" ]; then
    cp "$LATEST_BACKUP" /data/dump.rdb
fi

/entrypoint.sh 1>/dev/null 2>/dev/null &

/root/.nvm/versions/node/v22.19.0/bin/node /srv/random-history
