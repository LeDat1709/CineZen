#!/bin/bash

# CineZen Deployment Health Check Script
# Usage: ./scripts/deploy-check.sh https://api.yourdomain.com https://yourdomain.com https://admin.yourdomain.com

echo "🚀 CineZen Deployment Health Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
API_URL=${1:-"http://localhost:5000"}
FRONTEND_URL=${2:-"http://localhost:3000"}
ADMIN_URL=${3:-"http://localhost:3001"}

echo "Testing URLs:"
echo "  API: $API_URL"
echo "  Frontend: $FRONTEND_URL"
echo "  Admin: $ADMIN_URL"
echo ""

# Function to check endpoint
check_endpoint() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Check Backend
echo "📡 Backend API Tests:"
echo "--------------------"
check_endpoint "$API_URL/api/health" "Health endpoint"
check_endpoint "$API_URL/api/contents" "Contents endpoint"
check_endpoint "$API_URL/api/genres" "Genres endpoint"
check_endpoint "$API_URL/api-docs" "API Documentation"
echo ""

# Check Frontend
echo "🎨 Frontend Tests:"
echo "------------------"
check_endpoint "$FRONTEND_URL" "Homepage"
check_endpoint "$FRONTEND_URL/movies" "Movies page"
check_endpoint "$FRONTEND_URL/series" "Series page"
check_endpoint "$FRONTEND_URL/sitemap.xml" "Sitemap"
check_endpoint "$FRONTEND_URL/robots.txt" "Robots.txt"
echo ""

# Check Admin
echo "👨‍💼 Admin Panel Tests:"
echo "---------------------"
check_endpoint "$ADMIN_URL" "Admin homepage"
echo ""

# Performance Check
echo "⚡ Performance Tests:"
echo "--------------------"
echo -n "Frontend response time... "
time=$(curl -o /dev/null -s -w '%{time_total}\n' "$FRONTEND_URL")
if (( $(echo "$time < 3" | bc -l) )); then
    echo -e "${GREEN}✓ GOOD${NC} (${time}s)"
else
    echo -e "${YELLOW}⚠ SLOW${NC} (${time}s)"
fi

echo -n "API response time... "
time=$(curl -o /dev/null -s -w '%{time_total}\n' "$API_URL/api/health")
if (( $(echo "$time < 1" | bc -l) )); then
    echo -e "${GREEN}✓ GOOD${NC} (${time}s)"
else
    echo -e "${YELLOW}⚠ SLOW${NC} (${time}s)"
fi
echo ""

# SSL Check
echo "🔒 Security Tests:"
echo "------------------"
if [[ $FRONTEND_URL == https* ]]; then
    echo -e "${GREEN}✓${NC} HTTPS enabled on frontend"
else
    echo -e "${RED}✗${NC} HTTPS not enabled on frontend"
fi

if [[ $API_URL == https* ]]; then
    echo -e "${GREEN}✓${NC} HTTPS enabled on API"
else
    echo -e "${RED}✗${NC} HTTPS not enabled on API"
fi
echo ""

echo "===================================="
echo "✅ Health check complete!"
echo ""
echo "Next steps:"
echo "1. Check Google Search Console"
echo "2. Test adding content via admin"
echo "3. Monitor logs for errors"
echo "4. Run PageSpeed Insights"
