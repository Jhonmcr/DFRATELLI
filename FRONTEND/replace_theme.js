import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-\[#1a0f05\](\/[0-9]+)?/g, 'bg-amber-50');
    content = content.replace(/bg-\[#2a1b0a\](\/[0-9]+)?/g, 'bg-white');

    // Borders
    content = content.replace(/border-\[#5C3D11\]\/30/g, 'border-amber-200');
    content = content.replace(/border-\[#5C3D11\]\/40/g, 'border-amber-200');
    content = content.replace(/border-\[#5C3D11\]\/50/g, 'border-amber-300');
    content = content.replace(/border-\[#5C3D11\]\/80/g, 'border-amber-400');
    content = content.replace(/border-\[#5C3D11\]/g, 'border-amber-200');
    
    // Text colors (Dark texts for contrast since background is now light)
    content = content.replace(/text-white/g, 'text-gray-900');
    content = content.replace(/text-gray-400/g, 'text-gray-600');
    content = content.replace(/text-gray-300/g, 'text-gray-700');
    content = content.replace(/hover:text-white/g, 'hover:text-amber-500');
    content = content.replace(/text-\[#1a0f05\]/g, 'text-amber-50');
    
    // Orange/Amber mapping (mustard palette)
    content = content.replace(/orange-500/g, 'amber-500');
    content = content.replace(/orange-400/g, 'amber-600');
    content = content.replace(/orange-600/g, 'amber-600');

    fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (filePath.endsWith('.jsx')) {
            replaceInFile(filePath);
            console.log('Processed', filePath);
        }
    }
}

processDirectory(directoryPath);
