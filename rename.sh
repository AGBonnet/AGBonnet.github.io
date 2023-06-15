#!/bin/bash
counter=1
for file in VisualFlow/*; do
    extension="${file##*.}"
    new_name="image${counter}.${extension}"
    mv "$file" "VisualFlow/${new_name}"
    counter=$((counter + 1))
done

# Go to the VisualFlow directory
cd VisualFlow

# Rename files with uppercase extensions to lowercase
for file in *.[JjPpEeGgNnPpWw][PpNnEeGg]*; do
    newname=$(echo "$file" | tr '[:upper:]' '[:lower:]')
    mv "$file" "$newname"
done

cd ..

find VisualFlow/ -type f -exec basename {} \; | jq -R '.' | jq -s '{"images": .}' > images.json