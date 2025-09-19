#!/bin/bash

LAST_BACKUP=`ls -1 /mnt/backup | egrep -o 'dump-.*\.rdb' | sort -r | head -n 1`

if [ -f "$LAST_BACKUP" ]; then
    cp "$LAST_BACKUP" /data
fi

/entrypoint.sh 1>/dev/null 2>/dev/null &

/root/.nvm/versions/node/v22.19.0/bin/node /srv/random-history
