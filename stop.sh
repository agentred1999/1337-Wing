#!/bin/bash
if [ -f ~/1337wing/backend.pid ]; then
  kill $(cat ~/1337wing/backend.pid) 2>/dev/null
  rm ~/1337wing/backend.pid
  echo "> backend stopped"
fi

if [ -f ~/1337wing/frontend.pid ]; then
  kill $(cat ~/1337wing/frontend.pid) 2>/dev/null
  rm ~/1337wing/frontend.pid
  echo "> frontend stopped"
fi

rm -f ~/1337wing/.start.lock
echo "> lockfile cleared"
