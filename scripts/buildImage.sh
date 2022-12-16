#!/bin/bash
set -e

cd "$(dirname -- "$0")"
echo "Changed directory to $(pwd)"

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material
# If Dockerfile has been modified, we need to rebuild the image
DOCKER_TAG=$(node ./hash.js ./Dockerfile)

if [[ "$(docker images -q $DOCKER_IMAGE:$DOCKER_TAG 2> /dev/null)" != "" ]]; then
	echo "Image ${DOCKER_IMAGE}:${DOCKER_TAG} already exists"
	exit 0
fi

echo "Building image '${DOCKER_IMAGE}:${DOCKER_TAG}'..."
docker build -t $DOCKER_IMAGE -f Dockerfile .
docker tag $DOCKER_IMAGE $DOCKER_IMAGE:$DOCKER_TAG # Tag the image with Dockerfile's hash
echo "Done building image."

exit 0
