#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Initializing Admission Jockey Backend (TypeScript)${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your actual values before proceeding.${NC}"
    read -p "Press enter to continue after editing .env file..."
fi

# Create necessary directories
echo -e "${GREEN}📁 Creating necessary directories...${NC}"
mkdir -p logs
mkdir -p monitoring-service/config/prometheus
mkdir -p monitoring-service/config/grafana

# Install dependencies for all services
services=("api-gateway" "auth-service" "user-service" "college-service" "application-service" "alumni-service" "calendar-service" "payment-service" "notification-service")

for service in "${services[@]}"; do
    if [ -d "$service" ]; then
        echo -e "${GREEN}📦 Installing dependencies for $service...${NC}"
        cd "$service" && npm install && cd ..
    else
        echo -e "${YELLOW}⚠️  Directory $service not found, skipping...${NC}"
    fi
done

# Build and start services with Docker Compose
echo -e "${GREEN}🐳 Building and starting all services with Docker Compose...${NC}"
docker-compose up --build -d

# Wait for services to be ready
echo -e "${GREEN}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check service health
echo -e "${GREEN}🔍 Checking service health...${NC}"
services_health=(
    "http://localhost:3000/health:API Gateway"
    "http://localhost:8500:Consul UI"
    "http://localhost:3100:Grafana"
    "http://localhost:8025:MailHog"
    "http://localhost:15672:RabbitMQ Management"
)

for service_health in "${services_health[@]}"; do
    IFS=':' read -r url name <<< "$service_health"
    if curl -s "$url" > /dev/null; then
        echo -e "${GREEN}✅ $name is running${NC}"
    else
        echo -e "${RED}❌ $name is not responding${NC}"
    fi
done

echo -e "${GREEN}🎉 Admission Jockey backend initialized successfully!${NC}"
echo -e "${GREEN}📋 Service URLs:${NC}"
echo -e "  🌐 API Gateway: http://localhost:3000"
echo -e "  🔍 Service Discovery (Consul): http://localhost:8500"
echo -e "  📊 Grafana Dashboard: http://localhost:3100 (admin/admin)"
echo -e "  📧 MailHog UI: http://localhost:8025"
echo -e "  🐰 RabbitMQ Management: http://localhost:15672"
echo -e "  📈 Prometheus: http://localhost:9090"

echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "  • Check logs: docker-compose logs -f [service-name]"
echo -e "  • Stop services: docker-compose down"
echo -e "  • Rebuild: docker-compose up --build"
echo -e "  • View all services: docker-compose ps"
