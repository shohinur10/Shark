#!/bin/bash

echo "🧹 Aggressive Docker cleanup to free disk space..."

# Stop all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

# Remove all containers
echo "Removing all containers..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Remove all images
echo "Removing all images..."
docker rmi -f $(docker images -aq) 2>/dev/null || true

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || true

# Remove all networks (except default)
echo "Removing unused networks..."
docker network prune -f

# Remove all build cache
echo "Removing all build cache..."
docker builder prune -af

# System prune everything
echo "System-wide cleanup..."
docker system prune -af --volumes

# Show disk usage
echo ""
echo "📊 Docker disk usage after cleanup:"
docker system df

echo ""
echo "✅ Aggressive Docker cleanup complete!"
echo ""
echo "💡 If errors persist, you may need to:"
echo "   1. Restart Docker Desktop"
echo "   2. Increase Docker's disk space limit in Docker Desktop settings"
echo "   3. Or manually delete Docker's data:"
echo "      - Docker Desktop > Settings > Resources > Advanced > Clean / Purge data"
