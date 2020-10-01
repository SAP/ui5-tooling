#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

npm run generate-cli-doc

docker run --rm -it -v $(pwd):/docs squidfunk/mkdocs-material:6.0.1 build

npm run jsdoc-generate
