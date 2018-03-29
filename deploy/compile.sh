#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

node_modules/.bin/jsdoc -c ./jsdoc.json ./lib/

mkdir -p ./jsdocs/resources
