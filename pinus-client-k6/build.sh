#!/bin/bash

echo "Cleaning..."
rm -rf dist
rm -rf js

echo "Building..."
npx tsc

echo "Copying js files..."
npx rollup js/Pinus.js --file dist/pinus/index.js --format cjs

echo "Copying d.ts files..."
npx gulp d.ts
