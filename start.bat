#!/bin/bash
# start.bat

# Start Flask server in the background
python app.py &

# Optional: Start frontend (e.g., open HTML file or run npm dev server)
open index.html  # or your frontend command