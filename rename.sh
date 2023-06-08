#!/bin/bash
# find VisualFlow/ -type f -exec basename {} \; | jq -R '.' | jq -s '{"images": .}' > images.json
counter=1
for file in VisualFlow/*; do
    extension="${file##*.}"
    new_name="image${counter}.${extension}"
    mv "$file" "VisualFlow/${new_name}"
    counter=$((counter + 1))
done