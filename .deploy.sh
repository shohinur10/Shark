#!/bin/bash
set -e  # Exit on any error

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Docker registry configuration
# Change these values to match your Docker Hub or registry settings
DOCKER_USERNAME="${DOCKER_USERNAME:-your-dockerhub-username}"
IMAGE_NAME="${IMAGE_NAME:-shark-next}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-docker.io}"  # Use 'docker.io' for Docker Hub, or 'ghcr.io' for GitHub Container Registry

# Full image name
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building and pushing Docker image: ${FULL_IMAGE_NAME}"

# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)
REMOTE_BRANCH="origin/${CURRENT_BRANCH}"

# Check if remote branch exists, otherwise use main
if ! git ls-remote --heads origin ${CURRENT_BRANCH} | grep -q ${CURRENT_BRANCH}; then
    REMOTE_BRANCH="origin/main"
    echo "Current branch not found on remote, using main branch"
fi

#production
git fetch origin
git clean -fd
git reset --hard ${REMOTE_BRANCH}

# Stop existing containers (optional, comment out if not needed)
# docker compose down

# Build the Docker image with the tag
echo "Building Docker image..."
docker build -t ${FULL_IMAGE_NAME} --no-cache -f Dockerfile .

echo "✅ Successfully built ${FULL_IMAGE_NAME}"

# Check if we should push to registry
if [ "${DOCKER_USERNAME}" != "your-dockerhub-username" ]; then
    echo "Pushing Docker image to registry..."
    
    # Check if logged in, if not, try to login
    if ! docker info | grep -q "Username"; then
        echo "Please login to Docker Hub..."
        docker login ${REGISTRY}
    fi
    
    docker push ${FULL_IMAGE_NAME}
    echo "✅ Successfully pushed ${FULL_IMAGE_NAME}"
else
    echo "⚠️  Skipping push - Docker Hub username not configured"
    echo "To push the image, set DOCKER_USERNAME environment variable:"
    echo "  export DOCKER_USERNAME=your-username"
    echo "  ./.deploy.sh"
fi

# Optionally, if you want to run it locally after pushing:
# docker compose build --no-cache
# docker compose up -d
