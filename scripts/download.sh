#!/bin/bash

if [ -n "${AWS_ENDPOINT}" ]; then
    aws --endpoint-url=${AWS_ENDPOINT} s3 cp "s3://${AWS_DEFAULT_BUCKET}/${AWS_DEFAULT_KEY}" "${REDIS_DATA_DIR}"
fi

