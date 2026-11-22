#!/bin/bash
# Kavvusia – uruchamia prototyp na http://localhost:8080 (koszyk działa między stronami)
cd "$(dirname "$0")"
( sleep 1; open "http://localhost:8080/index.html" ) &
echo "Prototyp działa na http://localhost:8080  –  zamknij to okno, żeby zatrzymać."
python3 -m http.server 8080 --bind 127.0.0.1
