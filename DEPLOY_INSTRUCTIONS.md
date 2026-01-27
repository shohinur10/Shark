# Docker Deployment Instructions

## Issue: Docker I/O Error / Disk Space

If you're getting I/O errors during Docker build, Docker is running out of disk space.

## Solution Steps:

### Step 1: Aggressive Docker Cleanup

Run the aggressive cleanup script:
```bash
cd /Users/shohinur/Desktop/Shark
chmod +x clean-docker-aggressive.sh
./clean-docker-aggressive.sh
```

Or manually run:
```bash
# Stop all containers
docker stop $(docker ps -aq) 2>/dev/null

# Remove everything
docker system prune -af --volumes
docker builder prune -af

# Remove all images
docker rmi -f $(docker images -aq) 2>/dev/null
```

### Step 2: Restart Docker Desktop

1. Quit Docker Desktop completely
2. Wait 10 seconds
3. Restart Docker Desktop
4. Wait for it to fully start

### Step 3: Increase Docker Disk Space (if needed)

1. Open Docker Desktop
2. Go to Settings (gear icon)
3. Go to Resources > Advanced
4. Increase the Disk image size (e.g., from 60GB to 100GB)
5. Click "Apply & Restart"

### Step 4: Deploy Again

```bash
cd /Users/shohinur/Desktop/Shark
./deploy-docker.sh
```

Or if you want to push to Docker Hub:
```bash
export DOCKER_USERNAME=your-dockerhub-username
./deploy-docker.sh
```

## Alternative: Build Without Cache

If issues persist, try building without cache:
```bash
docker build --no-cache --progress=plain -t shark-next:latest -f Dockerfile .
```

## Check Docker Disk Usage

```bash
docker system df
```

This will show you how much space Docker is using.
