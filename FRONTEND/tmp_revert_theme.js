const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Usuario\\Documents\\PROYECTOS\\DFRATELLI\\FRONTEND\\src';

const replaceInFile = (filePath, replacements) => {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [from, to] of replacements) {
        content = content.split(from).join(to);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
};

// 1. App.jsx: Remove global dark background
replaceInFile(path.join(srcDir, 'App.jsx'), [
    ['<div className="min-h-screen bg-[#1a0a00] flex flex-col font-sans">', '<div className="min-h-screen flex flex-col font-sans bg-amber-50">']
]);

// 2. Footer.jsx: Make it brown ("marronsito")
replaceInFile(path.join(srcDir, 'components', 'layout', 'Footer.jsx'), [
    ['bg-amber-50', 'bg-[#1a0a00]'],
    ['border-amber-200', 'border-amber-900/50'],
    ['text-gray-900', 'text-white'],
    ['text-gray-600', 'text-slate-400'],
    ['text-gray-500', 'text-slate-500'],
    ['bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent', 'text-amber-500']
]);

// 3. Products.jsx: Revert to light theme
replaceInFile(path.join(srcDir, 'pages', 'Products.jsx'), [
    ['bg-transparent min-h-screen', 'bg-transparent min-h-screen'], // already handled by App.jsx bg-amber-50
    ['text-white', 'text-gray-900'],
    ['text-slate-400', 'text-gray-600'],
    ['bg-[#2c1200]/50 border border-amber-900/50', 'bg-white border border-amber-300'],
    ['bg-slate-900 border border-slate-700', 'bg-amber-50 border border-amber-200/70'],
    ['text-amber-300', 'text-gray-700'], // wait, SlidersHorizontal button
    ['bg-amber-900/20 border border-amber-900/50', 'bg-amber-50 border border-amber-200'],
    ['bg-[#1a0a00]', ''] // just in case
]);

// 4. ProductCard.jsx: Revert to light theme
replaceInFile(path.join(srcDir, 'components', 'products', 'ProductCard.jsx'), [
    ['bg-[#2c1200]/80 border border-amber-900/50 hover:border-amber-400 hover:shadow-[0_4px_25px_rgba(255,140,0,0.3)]', 'bg-white border border-amber-200 hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(255,140,0,0.1)]'],
    ['bg-slate-900', 'bg-amber-50'],
    ['text-white', 'text-gray-900']
]);

// 5. Promotions.jsx: Revert to light theme
replaceInFile(path.join(srcDir, 'pages', 'Promotions.jsx'), [
    ['text-white', 'text-gray-900'],
    ['bg-[#2c1200]/50 border border-amber-900/30', 'bg-white border border-amber-200'],
    ['text-amber-500/50', 'text-amber-500'],
    ['bg-[#2c1200]/80 border border-amber-900/50 hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)]', 'bg-white border border-amber-200 hover:border-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.05)]']
]);

// 6. Services.jsx: Revert to light theme
replaceInFile(path.join(srcDir, 'pages', 'Services.jsx'), [
    ['text-white', 'text-gray-900'],
    ['bg-glass border border-slate-700/50', 'bg-white border border-amber-200'],
    ['bg-slate-800/50', 'bg-amber-50'],
    ['border-slate-700', 'border-amber-200'],
    ['group-hover:bg-slate-800', 'group-hover:bg-amber-100'],
    ['bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700', 'bg-gradient-to-r from-white to-amber-50 border border-amber-200']
]);

// 7. Contact.jsx: Revert to light theme
replaceInFile(path.join(srcDir, 'pages', 'Contact.jsx'), [
    ['text-white', 'text-gray-900'],
    ['text-amber-50', 'text-gray-900'],
    ['bg-glass border border-slate-700', 'bg-white border border-amber-200'],
    ['bg-slate-800/50', 'bg-amber-50'],
    ['bg-slate-800', 'bg-amber-100'],
    ['bg-slate-900 border border-slate-700', 'bg-white border border-amber-200']
]);

console.log("All pages reverted to light theme successfully.");
