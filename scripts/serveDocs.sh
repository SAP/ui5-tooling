#!/bin/bash
set -e

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material

npm run generate-cli-doc

# Build image if not existent
if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
  ./scripts/buildImage.sh
fi

docker run --rm -it -p 8000:8000 -v $(pwd):/docs $DOCKER_IMAGE
