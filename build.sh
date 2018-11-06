#!/bin/bash
set -e

mkdir -p output
cp -r src/manifest.json src/background.js icon/ output/
cat src/blockies/blockies.js src/inject-core.js > output/inject.js

web-ext lint -w -s output
