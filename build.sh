#!/bin/bash
set -e
rm -rf dist
mkdir -p dist/dashboard
cp site/index.html dist/index.html
cp dashboard/index.html dist/dashboard/index.html
