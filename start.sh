#!/bin/bash
LOCKFILE=~/1337wing/.start.lock

if [ -f "$LOCKFILE" ]; then
  echo "> start.sh already running (lockfile exists). Run stop.sh first, or delete $LOCKFILE if stale."
  exit 1
fi
touch "$LOCKFILE"
trap "rm -f $LOCKFILE" EXIT

cd ~/1337wing

pkill -9 -f "vite preview" 2>/dev/null
pkill -9 -f "node server.js" 2>/dev/null
sleep 1

echo "> starting 1337 wing backend..."
cd backend
npm start > ~/1337wing/backend.log 2>&1 &
echo $! > ~/1337wing/backend.pid
cd ..

echo "> building and starting frontend..."
cd frontend
npm run build >> ~/1337wing/frontend.log 2>&1
npm run preview -- --host > ~/1337wing/frontend.log 2>&1 &
echo $! > ~/1337wing/frontend.pid
cd ..

echo "> backend PID: $(cat ~/1337wing/backend.pid)"
echo "> frontend PID: $(cat ~/1337wing/frontend.pid)"
echo "> logs: ~/1337wing/backend.log and ~/1337wing/frontend.log"
echo "> run ~/1337wing/stop.sh to stop both"
