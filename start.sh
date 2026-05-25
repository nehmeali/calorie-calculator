#!/bin/bash
pip install flask flask-cors --break-system-packages
python main.py &
node server.js
