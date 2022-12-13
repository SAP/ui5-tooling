#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."
echo "Changed directory to $(pwd)"

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material

# Build image if not existent
if [[ "$(docker images -q $DOCKER_IMAGE 2> /dev/null)" == "" ]]; then
  ./scripts/buildImage.sh
fi

if [[ -z "${GIT_COMMITTER_NAME}" ]]; then
	GIT_COMMITTER_NAME="OpenUI5 Bot"
	GIT_COMMITTER_EMAIL="openui5@sap.com"
fi

# If not provided, set default values for building the docs
if [[ -z "${MIKE_VERSION}" ]]; then
	MIKE_VERSION=v3
	MIKE_ALIAS=latest
fi

echo "Setting up build of documentation and tagging it with version" $MIKE_VERSION;

if [[ $MIKE_ALIAS ]]; then
	echo "Alias set to" $MIKE_ALIAS;
fi

npm run generate-cli-doc

# Build with MkDocs/Mike
docker run --rm -v $(pwd):/docs --entrypoint mike \
	--env GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME}" --env GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL}"  \
	$DOCKER_IMAGE deploy $MIKE_VERSION $MIKE_ALIAS --rebase --update-aliases

npm run jsdoc-generate

echo "Documentation build & tagged"
