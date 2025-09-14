#!/bin/bash

if [ -z "$REDIS_READ_ONLY" ]; then
    IFS='
    '

    inotifywait --event moved_to --format '%f' -m $REDIS_DATA_DIR |\
    (
        while read
        do
            FILE=$(echo $REPLY | cut -f 1 -d' ')
            echo $EVENT
            if [ "$FILE" == 'dump.rdb' ]; then
                aws --endpoint-url=$AWS_ENDPOINT s3 cp "$REDIS_DATA_DIR/$FILE" "s3://$AWS_DEFAULT_BUCKET/$AWS_DEFAULT_KEY"
                echo Dump is saved at $(date)
                if [[ $((`date +%M`)) -ge 50 ]]; then 
                    TODAY=`date --iso`
                    aws --endpoint-url=$AWS_ENDPOINT s3 cp "$REDIS_DATA_DIR/$FILE" "s3://$AWS_DEFAULT_BUCKET/backup/$TODAY.rdb"
                    echo Daily backup
                fi
            else
                echo Ignored file $FILE.
            fi
        done
    )
fi

