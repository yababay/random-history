#!/bin/bash

cd dist

find . -type f | while read l
do
    fn=`echo "$l" | sed 's/\.\///'`
    aws --endpoint-url=https://storage.yandexcloud.net/ \
    s3 cp "$l" "s3://random-history/$fn"
done

cd ..
