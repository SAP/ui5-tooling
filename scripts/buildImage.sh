#!/bin/bash
set -e

echo "Building image..."
docker build -t ui5-tooling/mkdocs-material -f scripts/Dockerfile .
echo "Done building image."

exit 0
