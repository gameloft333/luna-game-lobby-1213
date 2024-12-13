#!/bin/bash

# Make script exit on first error
set -e

# Load environment variables
source .env.production

# Create required directories
mkdir -p certbot/conf
mkdir -p certbot/www

# Pull latest changes
git pull origin main

# Build and start containers
docker-compose up -d --build

# Wait for nginx to start
sleep 10

# Initialize SSL certificates
docker-compose run --rm certbot

# Reload nginx to apply SSL configuration
docker-compose exec web nginx -s reload

echo "Deployment completed successfully!"