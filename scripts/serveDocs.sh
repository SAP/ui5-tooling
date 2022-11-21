#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

npm run generate-cli-doc

# Build image if not existent
if [[ "$(docker images -q squidfunk/mkdocs-material:8.5.9 2> /dev/null)" == "" ]]; then
  bash ./scripts/buildImage.sh
fi

docker run --rm -it -p 8000:8000 -v $(pwd):/docs squidfunk/mkdocs-material:8.5.9
