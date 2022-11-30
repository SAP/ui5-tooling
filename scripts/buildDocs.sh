#!/bin/bash
set -e

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material:8.5.9

# If not provided, set default values for building the docs
if [[ -z "${MIKE_VERSION}" ]]; then
	MIKE_VERSION=v3
	MIKE_ALIAS=latest
fi

# If not provided, set default values for building the docs
if [[ -z "${GIT_COMMITTER_EMAIL}" ]]; then
	GIT_COMMITTER_NAME="OpenUI5 Bot"
	GIT_COMMITTER_EMAIL="openui5@sap.com"
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

# Setup Git config for mike & stash local settings to prevent overwrites
LOCAL_GH_NAME=$(git config --default "" --local --get user.name)
LOCAL_GH_EMAIL=$(git config --default "" --local --get user.email)
RESET_GH_NAMES="${LOCAL_GH_NAME}${LOCAL_GH_EMAIL}"

if [[ -z "${RESET_GH_NAMES}" ]]; then
	echo "Setting temporary git local user.name and user.email ${GIT_COMMITTER_NAME}<${GIT_COMMITTER_EMAIL}>"
	git config --local user.name $GIT_COMMITTER_NAME
	git config --local user.email $GIT_COMMITTER_EMAIL
fi

# Build with MkDocs/Mike
docker run --rm -v $(pwd):/docs $DOCKER_IMAGE mike deploy $MIKE_VERSION $MIKE_ALIAS --rebase --update-aliases

if [[ -z "${RESET_GH_NAMES}" ]]; then
	echo "Cleanup git --local records"
	git config --local --unset user.name
	git config --local --unset user.email
fi

npm run jsdoc-generate

echo "Documentation build & tagged"
