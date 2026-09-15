#!/bin/bash
set -e

cd ~/1337wing/frontend

echo "Pulling latest frontend code..."
git pull

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Fixing permissions so Nginx can serve it..."
chmod -R 755 dist/

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "--- Verifying ---"
curl -I http://localhost/

echo ""
echo "Frontend deployed."
