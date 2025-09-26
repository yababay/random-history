#!/bin/bash
rm -rf ./build
rm -rf ./dist
mkdir build
source .env
 
echo "npx tsc --build tsconfig.json"
npx tsc --build tsconfig.json
cp package-pure.json ./dist/package.json

# сделать архив
cd ./dist
# rm -rf scripts
rm ../build/func.zip
zip -r ../build/func.zip .
cd ..

echo "yc function version create $FUNCTION_NAME"

yc serverless function version create \
  --function-name="$FUNCTION_NAME" \
  --runtime nodejs16 \
  --entrypoint index.handler \
  --memory 256m \
  --execution-timeout 5s \
  --source-path ./build/func.zip \
  --service-account-id="$SERVICE_ACCOUNT_ID" \
  --folder-id $FOLDER_ID \
  --environment "ENDPOINT=$ENDPOINT,DATABASE=$DATABASE,YDB_ACCESS_TOKEN_CREDENTIALS=$YDB_ACCESS_TOKEN_CREDENTIALS,TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN,TELEGRAM_CHANNEL=$TELEGRAM_CHANNEL,YANDEX_OAUTH_TOKEN=$YANDEX_OAUTH_TOKEN"
