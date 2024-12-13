#!/bin/bash

# Main deployment script
set -e

# Load utility scripts
source scripts/utils.sh
source scripts/docker.sh

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

main() {
  echo "Starting deployment process..."
  
  # Check requirements
  check_requirements
  
  # Load environment variables
  load_env
  
  # Create required directories
  create_directories
  
  # Check ports
  check_port 9080
  check_port 9443
  
  # Validate SSL configuration
  validate_ssl
  
  # Clean up old deployment
  cleanup
  
  # Start containers
  start_containers
  
  # Initialize SSL certificates
  init_ssl
  
  # Check container health
  check_health
  
  echo "Deployment completed successfully!"
}

# Run main function
main "$@"