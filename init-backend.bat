@echo off
REM Install dependencies for all services
echo Installing dependencies for all services...
cd api-gateway && npm install && cd ..
cd auth-service && npm install && cd ..
cd user-service && npm install && cd ..
cd college-service && npm install && cd ..
cd chatbot-gateway && npm install && cd ..
cd application-service && npm install && cd ..
cd alumni-service && npm install && cd ..
cd calendar-service && npm install && cd ..
cd payment-service && npm install && cd ..
cd notification-service && npm install && cd ..

REM Start services with Docker Compose
echo Starting all services with Docker Compose...
docker-compose up -d

echo Admission Jockey backend initialized successfully!
echo API Gateway is running at http://localhost:3000
echo Service Discovery UI available at http://localhost:8500
echo Grafana dashboard available at http://localhost:3100
echo MailHog UI available at http://localhost:8025
