#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

docker run --rm -it -v $(pwd):/docs squidfunk/mkdocs-material build
npm run jsdoc-generate
