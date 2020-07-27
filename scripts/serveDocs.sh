#!/bin/bash
set -e

cd "$(dirname -- "$0")/.."

echo "Changed directory to $(pwd)"

npm run generate-cli-doc
docker run --rm -it -p 8000:8000 -v $(pwd):/docs squidfunk/mkdocs-material:4.6.0
