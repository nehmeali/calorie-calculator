#!/bin/bash
echo "Installing Python dependencies..."
pip install flask flask-cors

echo "Starting Python backend on port 8000..."
python main.py &

echo "Starting Node frontend on port 3000..."
node server.js
