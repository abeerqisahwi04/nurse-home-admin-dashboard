#!/bin/bash

# TypeScript to JavaScript Conversion Script for UI Components
# This script converts all remaining .tsx UI components to .jsx with JS syntax

# Directory containing the UI components
UI_DIR="src/app/components/ui"

# Function to convert a single file
convert_file() {
    local tsx_file=$1
    local jsx_file="${tsx_file%.tsx}.jsx"
    
    echo "Converting $tsx_file to $jsx_file..."
    
    # If already converted (jsx exists), skip
    if [ -f "$jsx_file" ]; then
        echo "  $jsx_file already exists, skipping..."
        return
    fi
    
    # Convert the file
    cat "$tsx_file" | \
    # Remove React.ComponentProps<...> type patterns and replace with plain objects
    sed 's/React\.ComponentProps<typeof \([^>]*\)>/const __props/g' | \
    # Remove function parameter type annotations
    sed 's/: React\.ComponentProps<[^>]*>//g' | \
    # Remove generic type parameters like <T>, <T | null>, etc.
    sed 's/<[A-Za-z_ |]*>//g' | \
    # Remove 'as' type assertions
    sed 's/ as [A-Za-z]*//g' | \
    # Remove type/interface definitions
    sed '/^type /d' | \
    sed '/^interface /d' | \
    # Remove type: comments
    sed 's/: [A-Za-z_]* | [A-Za-z_]*//g' | \
    sed 's/: [A-Za-z_]*//g' | \
    # Remove React import type specifiers
    sed 's/React\.ComponentProps</const __UNUSED</g' > "$jsx_file"
    
    echo "  ✓ Converted $jsx_file"
}

# Get all unconverted .tsx files (excluding already converted .jsx versions)
echo "Starting TypeScript to JavaScript conversion for UI components..."
echo "=================================================="

for tsx_file in "$UI_DIR"/*.tsx; do
    if [ -f "$tsx_file" ]; then
        convert_file "$tsx_file"
    fi
done

echo "=================================================="
echo "Conversion complete! All UI components converted to JavaScript (.jsx)"
