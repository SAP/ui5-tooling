#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."
echo "Changed directory to $(pwd)"

# Store docker image name
DOCKER_IMAGE=ui5-cli/mkdocs-material

# Build image if not existing
./scripts/buildImage.sh

npm run generate-cli-doc

docker run --rm -it -p 8000:8000 -v $(pwd):/docs $DOCKER_IMAGE
