#!/bin/bash

/entrypoint.sh 1>/dev/null 2>/dev/null &

/root/.nvm/versions/node/v22.19.0/bin/node /srv/random-history
