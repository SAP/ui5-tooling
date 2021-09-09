#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

npm run generate-cli-doc

docker run --rm -it -v $(pwd):/docs squidfunk/mkdocs-material:7.2.6 build

npm run jsdoc-generate
