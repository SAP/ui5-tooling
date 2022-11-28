#!/bin/bash
set -e

# Store docker image name
DOCKER_IMAGE=squidfunk/mkdocs-material:8.5.9

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

# Set default versioning and publish
docker run --rm -v $(pwd):/docs $DOCKER_IMAGE mike set-default $MIKE_VERSION
echo "Documentation build & tagged"
