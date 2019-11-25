#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

docker run --rm -it -v $(pwd):/docs squidfunk/mkdocs-material:4.6.0 build
npm run jsdoc-generate
