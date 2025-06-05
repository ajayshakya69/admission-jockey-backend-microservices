#!/bin/bash

# Exit on any error
set -e

# Install dependencies for all services
echo "Installing dependencies for all services..."

for service in \
  api-gateway \
  auth-service \
  user-service \
  college-service \
  chatbot-gateway \
  application-service \
  alumni-service \
  calendar-service \
  payment-service \
  notification-service
do
  echo "Installing dependencies in $service..."
  (cd "$service" && npm install)
done

# Start services with Docker Compose
echo "Starting all services with Docker Compose..."
docker-compose up -d

echo "Admission Jockey backend initialized successfully!"
echo "API Gateway is running at http://localhost:3000"
echo "Service Discovery UI available at http://localhost:8500"
echo "Grafana dashboard available at http://localhost:3100"
echo "MailHog UI available at http://localhost:8025"
