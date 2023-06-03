#!/bin/bash

counter=1
for file in VisualFlow/*; do
    extension="${file##*.}"
    new_name="image${counter}.${extension}"
    mv "$file" "VisualFlow/${new_name}"
    counter=$((counter + 1))
done