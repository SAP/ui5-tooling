#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

# Build image if not existent
if [[ "$(docker images -q squidfunk/mkdocs-material:8.5.9 2> /dev/null)" == "" ]]; then
  bash ./scripts/buildImage.sh
fi

# Mike configuration
git config --local user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "github-actions[bot]"

echo "Setting up build of documentation and tagging it with version" $MIKE_VERSION;

if [[ $MIKE_ALIAS ]]; then
	echo "Alias set to" $MIKE_ALIAS;
fi

# Build with MkDocs/Mike
docker run --rm -v $(pwd):/docs squidfunk/mkdocs-material:8.5.9 mike deploy $MIKE_VERSION $MIKE_ALIAS --rebase --update-aliases

# Build the rest of the documentation
npm run generate-cli-doc
npm run jsdoc-generate

# Set default versioning and publish
docker run --rm -v $(pwd):/docs squidfunk/mkdocs-material:8.5.9 mike set-default $MIKE_VERSION --push
echo "Documentation build & tagged"