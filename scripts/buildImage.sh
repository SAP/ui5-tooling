#!/bin/bash
set -e

cd "$(dirname -- "$0")"
echo "Changed directory to $(pwd)"

echo "Building image..."
docker build -t ui5-tooling/mkdocs-material -f Dockerfile .
echo "Done building image."

exit 0
