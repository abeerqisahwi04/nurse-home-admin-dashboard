#!/usr/bin/env python3
"""
TypeScript to JavaScript Converter for UI Components
Converts all .tsx files to .jsx with proper JavaScript syntax
"""

import os
import re
import sys
from pathlib import Path

def remove_type_annotations(content):
    """Remove TypeScript type annotations"""
    # Remove React.ComponentProps<...> patterns
    content = re.sub(r'React\.ComponentProps<[^>]+>', '', content)
    
    # Remove type parameters like <T>, <T | null>, <Type[]>, etc.
    content = re.sub(r'<[A-Za-z_][A-Za-z0-9_|{}\[\],\s]*>', '', content)
    
    # Remove 'as' type assertions
    content = re.sub(r'\s+as\s+[A-Za-z_][A-Za-z0-9_|<>\[\]]*', '', content)
    
    # Remove function parameter type annotations
    content = re.sub(r':\s*(?:string|number|boolean|any|void|never|[A-Za-z_][A-Za-z0-9_]*(?:\[\])?(?:\s*\|\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*([,\)])', r'\1', content)
    
    # Remove generic type parameters in variable declarations
    content = re.sub(r'<[A-Za-z_][^>]*>', '', content)
    
    # Remove type keyword definitions
    content = re.sub(r'^type\s+[^\n]+\n', '', content, flags=re.MULTILINE)
    
    # Remove interface keyword definitions
    content = re.sub(r'^interface\s+[^\n{]*\{[^}]*\}\n', '', content, flags=re.MULTILINE)
    
    # Remove property type annotations in inline objects
    content = re.sub(r':\s*(?:keyof\s+)?[A-Za-z_][A-Za-z0-9_<>|\[\]\s]*(?=[,;}\)])', '', content)
    
    # Remove type from destructuring patterns
    content = re.sub(r':\s*(?:typeof|type)\s+[A-Za-z_][A-Za-z0-9_]*(?=[,}])', '', content)
    
    return content

def convert_tsx_to_jsx(file_path):
    """Convert a single TSX file to JSX"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove type annotations
        content = remove_type_annotations(content)
        
        # Change file extension in output
        jsx_path = file_path.replace('.tsx', '.jsx')
        
        # Write the converted file
        with open(jsx_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True, jsx_path
    except Exception as e:
        return False, str(e)

def main():
    """Main converter function"""
    ui_dir = Path('src/app/components/ui')
    
    if not ui_dir.exists():
        print("Error: UI components directory not found!")
        sys.exit(1)
    
    tsx_files = list(ui_dir.glob('*.tsx'))
    
    if not tsx_files:
        print("No .tsx files found to convert.")
        sys.exit(0)
    
    print(f"Found {len(tsx_files)} TypeScript files to convert...")
    print("=" * 60)
    
    converted = 0
    skipped = 0
    failed = 0
    
    for tsx_file in sorted(tsx_files):
        jsx_file = tsx_file.with_suffix('.jsx')
        
        if jsx_file.exists():
            print(f"⊘ Skipping {tsx_file.name} (already converted)")
            skipped += 1
            continue
        
        success, result = convert_tsx_to_jsx(str(tsx_file))
        
        if success:
            print(f"✓ Converted {tsx_file.name} → {jsx_file.name}")
            converted += 1
        else:
            print(f"✗ Failed to convert {tsx_file.name}: {result}")
            failed += 1
    
    print("=" * 60)
    print(f"\nConversion Summary:")
    print(f"  ✓ Converted: {converted}")
    print(f"  ⊘ Skipped:   {skipped}")
    print(f"  ✗ Failed:    {failed}")
    print(f"  Total:       {len(tsx_files)}")
    
    if converted > 0:
        print("\n✓ TypeScript to JavaScript conversion completed!")
    
    sys.exit(0 if failed == 0 else 1)

if __name__ == '__main__':
    main()
