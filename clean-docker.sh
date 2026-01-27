#!/bin/bash

echo "🧹 Cleaning up Docker to free disk space..."

# Remove all stopped containers
echo "Removing stopped containers..."
docker container prune -f

# Remove all unused images
echo "Removing unused images..."
docker image prune -af

# Remove all unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# Remove all build cache
echo "Removing build cache..."
docker builder prune -af

# Show disk usage
echo ""
echo "📊 Docker disk usage after cleanup:"
docker system df

echo ""
echo "✅ Docker cleanup complete!"
