#!/bin/bash

# Utility functions for deployment

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check required tools
check_requirements() {
  local requirements=("docker" "docker-compose")
  
  for cmd in "${requirements[@]}"; do
    if ! command_exists "$cmd"; then
      echo "Error: $cmd is required but not installed."
      exit 1
    fi
  done
}

# Load environment variables
load_env() {
  if [[ -f .env.production ]]; then
    echo "Loading environment variables..."
    source .env.production
  else
    echo "Error: .env.production file not found"
    exit 1
  fi
}

# Create required directories
create_directories() {
  local directories=("nginx/conf.d" "ssl" "certbot/conf" "certbot/www")
  
  for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    echo "Created directory: $dir"
  done
}

# Check if port is available
check_port() {
  local port=$1
  if lsof -Pi ":$port" -sTCP:LISTEN -t >/dev/null ; then
    echo "Error: Port $port is already in use"
    exit 1
  fi
}

# Validate SSL configuration
validate_ssl() {
  if [[ ! -f "ssl/nginx.crt" ]] || [[ ! -f "ssl/nginx.key" ]]; then
    echo "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout ssl/nginx.key \
      -out ssl/nginx.crt \
      -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN:-localhost}"
  fi
}