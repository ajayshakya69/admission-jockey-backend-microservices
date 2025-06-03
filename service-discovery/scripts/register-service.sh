#!/bin/bash

SERVICE_NAME=$1
SERVICE_ID=$2
SERVICE_ADDRESS=$3
SERVICE_PORT=$4

curl --request PUT --data @- http://localhost:8500/v1/agent/service/register <<EOF
{
  "Name": "$SERVICE_NAME",
  "ID": "$SERVICE_ID",
  "Address": "$SERVICE_ADDRESS",
  "Port": $SERVICE_PORT,
  "Check": {
    "HTTP": "http://$SERVICE_ADDRESS:$SERVICE_PORT/health",
    "Interval": "10s"
  }
}
EOF
