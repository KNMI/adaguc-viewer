#!/bin/bash

# merge and dist
./mergejs tdd_list           ../dist/tdd.js
cp ../src/graphics/style.css ../dist/tdd.css
cp -r ../src/doc             ../dist  
