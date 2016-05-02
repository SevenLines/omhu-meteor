#!/usr/bin/env bash
source /home/${USER}/.nvm/nvm.sh
nvm use 0.10
export MONGO_URL='mongodb://localhost:27017/${APP_NAME}'
export PORT=3000
export ROOT_URL=http://0.0.0.0
cd /home/${USER}/projects/omhu/bundle && node /home/${USER}/projects/omhu/bundle/main.js
