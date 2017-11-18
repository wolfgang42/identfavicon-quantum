#!/bin/bash
set -e

mkdir -p output
cp -r manifest.json background.js icon/ output/
cat blockies/blockies.js inject-core.js > output/inject.js

web-ext lint -w -s output
