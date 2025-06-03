#!/bin/bash

# Run tests for all services
set -e

echo "Running tests for all services..."

services=(
  "api-gateway"
  "auth-service"
  "user-service"
  "college-service"
  "application-service"
  "alumni-service"
  "calendar-service"
  "payment-service"
  "notification-service"
)

for service in "${services[@]}"; do
  echo "Testing $service..."
  cd "$service"
  
  # Run tests
  npm test
  
  # Go back to root
  cd ..
  
  echo "$service tests passed"
done

echo "All tests passed successfully!"
