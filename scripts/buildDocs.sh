#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."
echo "Changed directory to $(pwd)"

# Store docker image name
DOCKER_IMAGE=ui5-tooling/mkdocs-material

# Build image if not existing
./scripts/buildImage.sh

npm run generate-cli-doc


if [[ $MIKE_VERSION ]]; then # Build with Mike (versioning)
	echo "Starting building & versioning Docs with Mike version: ${MIKE_VERSION}; alias: ${MIKE_ALIAS}..."
	docker run --rm -v $(pwd):/docs --entrypoint mike \
		--env GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME}" --env GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL}"  \
		$DOCKER_IMAGE deploy $MIKE_VERSION $MIKE_ALIAS --rebase --update-aliases

else # Build with MkDocs
	echo "Starting building Docs with MkDocs..."
	docker run --rm -v $(pwd):/docs $DOCKER_IMAGE build

fi

npm run jsdoc-generate

echo "Documentation has been built"
