import { compile } from 'tailwindcss';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function getDynamicCSS(htmlContent) {
    try {
        // Use the full default Tailwind CSS from the package
        const cssPath = join(process.cwd(), 'node_modules', 'tailwindcss', 'index.css');
        const content = await readFile(cssPath, 'utf-8');
        const compiler = await compile(content);
        
        const candidates = Array.from(htmlContent.matchAll(/class=["']([^"']+)["']/g), m => m[1].split(/\s+/)).flat().filter(Boolean);
        
        // Build CSS with the identified candidates
        const cssResult = compiler.build(candidates);
        
        if (typeof cssResult === 'string') {
            return cssResult;
        } else if (typeof cssResult === 'object' && cssResult !== null && 'css' in cssResult) {
            return cssResult.css;
        } else {
            console.warn("Unexpected CSS result format:", cssResult);
            return "";
        }
    } catch (e) { 
        console.error("Tailwind CSS Error:", e);
        console.error("Stack trace:", e.stack);
        return ""; 
    }
}
