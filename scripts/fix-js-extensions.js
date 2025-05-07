// Fix JS Extensions Script
// This script scans JavaScript files in the src directory and adds .js or .jsx extensions to import statements

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

// Extensions to process
const extensions = ['.js', '.jsx'];
// Extensions to add to imports
const validExtensions = ['.js', '.jsx', '.json'];

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check if a file exists with any of the valid extensions
function findFileWithExtension(basePath) {
  for (const ext of validExtensions) {
    const fullPath = `${basePath}${ext}`;
    if (fs.existsSync(fullPath)) {
      return ext;
    }
  }
  return null;
}

// Function to fix imports in a file
function fixImportsInFile(filePath) {
  console.log(`Processing ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Regular expression to match import statements without file extensions
  const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:[^{}\s,]+))?\s*(?:,\s*(?:\{[^}]*\}))?\s*from\s+['"]([^'"]*)['"]/g;
  
  // Find all import statements
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip if it's a package import (doesn't start with . or /)
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      continue;
    }
    
    // Skip if it already has an extension
    if (validExtensions.some(ext => importPath.endsWith(ext))) {
      continue;
    }
    
    // Resolve the absolute path of the imported file
    const importDir = path.dirname(filePath);
    const resolvedPath = path.resolve(importDir, importPath);
    
    // Find the correct extension
    const extension = findFileWithExtension(resolvedPath);
    
    if (extension) {
      // Replace the import statement with one that includes the extension
      const newImportPath = `${importPath}${extension}`;
      const originalImport = match[0];
      const newImport = originalImport.replace(`'${importPath}'`, `'${newImportPath}'`).replace(`"${importPath}"`, `"${newImportPath}"`);
      
      content = content.replace(originalImport, newImport);
      modified = true;
      
      console.log(`  Fixed import: ${importPath} -> ${newImportPath}`);
    } else {
      console.log(`  Warning: Could not find file for import ${importPath}`);
    }
  }
  
  // Save the file if it was modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
  }
}

// Main function
function main() {
  console.log('Starting to fix JS extensions...');
  
  // Get all JS and JSX files
  const files = getAllFiles(srcDir);
  console.log(`Found ${files.length} files to process`);
  
  // Process each file
  files.forEach(file => {
    fixImportsInFile(file);
  });
  
  console.log('Finished fixing JS extensions');
}

main();