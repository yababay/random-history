#!/bin/bash

while true ; 
do
    echo =======================
    npx ts-node --project tsconfig-pump.json scripts/pump.ts
    sleep 250
done
