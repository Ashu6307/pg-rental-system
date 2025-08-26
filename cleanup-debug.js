#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all JS/JSX files
function findJSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== 'build' && file !== 'dist') {
            findJSFiles(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to remove debug console.log statements (keep console.error)
function cleanDebugLogs(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove standalone console.log statements (not console.error or console.warn)
    const lines = content.split('\n');
    const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        
        // Keep essential console statements
        if (trimmed.includes('console.error') || 
            trimmed.includes('console.warn') || 
            trimmed.includes('console.info')) {
            return true;
        }
        
        // Remove debug console.log statements
        if (trimmed.startsWith('console.log(') || 
            trimmed.includes('console.log(') && !trimmed.includes('//')) {
            modified = true;
            return false;
        }
        
        return true;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, cleanedLines.join('\n'));
        console.log(`Cleaned: ${filePath}`);
    }
}

// Main execution
const projectRoot = process.cwd();
const jsFiles = findJSFiles(path.join(projectRoot, 'src'));

console.log(`Found ${jsFiles.length} JS/JSX files to check...`);

jsFiles.forEach(cleanDebugLogs);

console.log('Debug log cleanup completed!');
