#!/bin/bash

# Build all services for production
set -e

echo "Building all services..."

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
  echo "Building $service..."
  cd "$service"
  
  # Install dependencies
  npm ci --only=production
  
  # Build TypeScript
  npm run build
  
  # Go back to root
  cd ..
  
  echo "$service built successfully"
done

echo "All services built successfully!"
