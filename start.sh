#!/bin/sh
export DISPLAY=:1.0
Xvfb :1 -screen 0 800x600x24&
npm run start
