#!/bin/bash
set -e

cd "$(dirname -- "$0")"
echo "Changed directory to $(pwd)"

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material

if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
	echo "Building image..."
	docker build -t $DOCKER_IMAGE -f Dockerfile .
	echo "Done building image."
else
	echo "Docker image '${DOCKER_IMAGE}' already exists."
fi

exit 0
