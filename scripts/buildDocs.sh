#!/bin/bash
set -e

# Store docker image name
DOCKER_IMAGE=squidfunk/mkdocs-material-modified:8.5.9

# If not provided, set default values for building the docs
if [[ -z "${MIKE_VERSION}" ]]; then
	MIKE_VERSION=v3
	MIKE_ALIAS=latest
fi

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

# Build image if not existent
if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
  bash ./scripts/buildImage.sh
fi

echo "Setting up build of documentation and tagging it with version" $MIKE_VERSION;

if [[ $MIKE_ALIAS ]]; then
	echo "Alias set to" $MIKE_ALIAS;
fi

npm run generate-cli-doc

# Build with MkDocs/Mike
docker run --rm -v $(pwd):/docs $DOCKER_IMAGE mike deploy $MIKE_VERSION $MIKE_ALIAS --rebase --update-aliases

npm run jsdoc-generate

echo "Documentation build & tagged"
