#!/bin/bash
set -e

cd ~/1337wing/backend

echo "Starting 1337 Wing backend..."

if pm2 describe 1337wing-backend > /dev/null 2>&1; then
  echo "Process exists, restarting with fresh env..."
  pm2 restart 1337wing-backend --update-env
else
  echo "Starting fresh..."
  pm2 start server.js --name 1337wing-backend
fi

pm2 save

sleep 2
echo ""
echo "--- Status ---"
pm2 status

echo ""
echo "--- Health check ---"
curl -s http://localhost:5000/api/health
echo ""
