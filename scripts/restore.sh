#!/bin/bash

LAST_BACKUP=`/usr/local/bin/aws --endpoint-url='https://storage.yandexcloud.net' s3 ls 's3://random-history/backup/' | egrep -o 'dump.*\.rdb' | sort -r | head -n 1`

/usr/local/bin/aws --endpoint-url='https://storage.yandexcloud.net' s3 cp "s3://random-history/backup/$LAST_BACKUP" .data
