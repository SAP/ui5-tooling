#!/bin/bash
set -e

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material

# Build image if not existent
if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
  ./scripts/buildImage.sh
fi

cd "$(dirname -- "$0")/.."
echo "Changed directory to $(pwd)"

npm run generate-cli-doc

docker run --rm -it -p 8000:8000 -v $(pwd):/docs $DOCKER_IMAGE
