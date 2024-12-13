#!/bin/bash

# Main deployment script
set -e

echo "Starting deployment process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Create required directories
mkdir -p config/nginx

# Stop and remove existing containers
docker-compose down

# Build and start containers
docker-compose up -d --build

echo "Deployment completed successfully!"
