#!/bin/bash
set -e

cd "$(dirname -- "$0")/../"
echo "Changed directory to $(pwd)"

echo "Building image..."
docker build -t squidfunk/mkdocs-material:8.5.9 -f scripts/Dockerfile .
echo "Done building image."

exit 0