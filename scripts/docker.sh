#!/bin/bash

# Docker related functions

# Clean up old containers and images
cleanup() {
  echo "Cleaning up old containers and images..."
  docker-compose down --remove-orphans
  docker system prune -f
}

# Build and start containers
start_containers() {
  echo "Building and starting containers..."
  docker-compose up -d --build
  
  # Wait for containers to be healthy
  echo "Waiting for containers to be ready..."
  sleep 10
}

# Check container health
check_health() {
  local container="game-lobby-web"
  
  if [[ "$(docker inspect -f {{.State.Running}} $container 2>/dev/null)" != "true" ]]; then
    echo "Error: Container $container is not running"
    docker-compose logs web
    exit 1
  fi
  
  echo "Container $container is running"
}

# Initialize SSL certificates with certbot
init_ssl() {
  if [[ -n "$DOMAIN" ]] && [[ -n "$SSL_EMAIL" ]]; then
    echo "Initializing SSL certificates for $DOMAIN..."
    docker-compose run --rm certbot
  else
    echo "Skipping SSL initialization: DOMAIN or SSL_EMAIL not set"
  fi
}