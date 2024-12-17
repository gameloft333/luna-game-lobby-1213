#!/bin/bash

# Main deployment script
set -e

# Load utility scripts
source scripts/utils.sh
source scripts/docker.sh

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check and stop existing containers
stop_existing_containers() {
  echo "Checking for existing containers..."
  if docker ps -q --filter "name=luna-game-lobby" | grep -q .; then
    echo "Stopping existing containers..."
    docker-compose down
  fi
}

# Function to check and kill processes using specific ports
kill_port_process() {
  local port=$1
  if lsof -i :$port -t >/dev/null 2>&1; then
    echo "Port $port is in use. Attempting to free it..."
    lsof -i :$port -t | xargs kill -9 || true
  fi
}

# Enhanced port checking function
check_ports() {
  local ports=(9080 9443)
  for port in "${ports[@]}"; do
    if ! kill_port_process $port; then
      echo "Failed to free port $port"
      return 1
    fi
  done
}

# Function to handle cleanup
cleanup() {
  echo "Cleaning up old deployment..."
  docker system prune -f
  rm -rf tmp/* || true
}

main() {
  echo "Starting deployment process..."
  
  # Check if script is run with sudo/admin privileges
  if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
  }
  
  # Check requirements
  if ! check_requirements; then
    echo "Requirements check failed"
    exit 1
  }
  
  # Load environment variables
  if ! load_env; then
    echo "Failed to load environment variables"
    exit 1
  }
  
  echo "Creating required directories..."
  mkdir -p nginx/conf.d ssl certbot/conf certbot/www
  
  # Stop existing containers
  stop_existing_containers
  
  # Check and free ports
  if ! check_ports; then
    echo "Failed to free required ports"
    exit 1
  }
  
  # Clean up old deployment
  cleanup
  
  echo "Building and starting containers..."
  if ! docker-compose up --build -d; then
    echo "Failed to start containers"
    exit 1
  }
  
  # Initialize SSL certificates
  if ! init_ssl; then
    echo "SSL initialization failed"
    docker-compose down
    exit 1
  }
  
  # Check container health
  if ! check_health; then
    echo "Health check failed"
    docker-compose down
    exit 1
  }
  
  echo "Deployment completed successfully!"
}

# Trap ctrl-c and call cleanup
trap 'echo "Deployment interrupted"; docker-compose down; exit 1' INT

# Run main function
main "$@"