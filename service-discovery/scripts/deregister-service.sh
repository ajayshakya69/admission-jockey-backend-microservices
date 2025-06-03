#!/bin/bash

SERVICE_ID=$1

curl --request PUT http://localhost:8500/v1/agent/service/deregister/$SERVICE_ID
