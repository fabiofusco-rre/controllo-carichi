#!/usr/bin/with-contenv bashio
echo "[INFO] START GESTIONE CARICHI"
cd /load-manager-addon || exit
echo "[INFO] INSTALLAZIONE IN CORSO..."
npm i
#echo "[INFO] RUN BUILD IN CORSO..."
#npm run build:prod
echo "[INFO] AVVIO BACK-END IN CORSO..."
node /load-manager-addon/app/backend/index.js
echo "[INFO] RUN.SH - END"
