#!/bin/bash

DUMP=dump.rdb

curl https://bba648a99ldqe5v3f10h.containers.yandexcloud.net/api/2028e1e6-916b-11f0-b23d-7be7537085b4/backup

LAST_BACKUP=`/usr/local/bin/aws --endpoint-url='https://storage.yandexcloud.net' s3 ls 's3://random-history/backup/' | egrep -o 'dump-.*\.rdb' | sort -r | head -n 1`

if [ -n "`docker container ls | grep redis-starter`" ]; then
    docker container stop redis-starter
fi

/usr/local/bin/aws --endpoint-url='https://storage.yandexcloud.net' s3 cp "s3://random-history/backup/$LAST_BACKUP" .data
rm -rf .data/$DUMP
cp "`pwd`/.data/$LAST_BACKUP" "`pwd`/.data/$DUMP"

docker run -v /media/portable/.3f-lab/_humanitarian/random-history/.data/:/data --rm -d -p 6377:6379 --env-file .env --name redis-starter redis-starter:random-history
