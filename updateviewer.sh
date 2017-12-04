#!/bin/bash

# Call with: bash updateviewer.sh

echo "Creating backup of configuration"
mv config.js config.js_backup
mv config.php config.php_backup

echo "Pulling updates from repository"
hg pull http://dev.knmi.nl/hg/adagucviewer
hg update
echo "Restoring configuration"

cp config.js_backup config.js
cp config.php_backup config.php

echo "Update completed."
