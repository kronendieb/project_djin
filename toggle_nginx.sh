#!/bin/bash
NGINX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/nginx" && pwd)"
NGINX_CONF="$NGINX_DIR/nginx.conf"
NGINX_PID="$NGINX_DIR/nginx.pid"

if [ -f "$NGINX_PID" ]; then
    kill -QUIT "$(cat "$NGINX_PID")" && echo "Nginx stopped"
else
    echo $NGINX_DIR
    echo $NGINX_CONF
    echo $NGINX_PID
    nginx -c "$NGINX_CONF" -p "$NGINX_DIR" -g "pid $NGINX_PID;" && echo "Starting Nginx"
fi
