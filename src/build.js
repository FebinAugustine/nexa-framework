// This logic runs during 'nexa build'
import { writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function build() {
    try {
        console.log("🔥 Starting Nexa build process...");
        
        const pagesDir = join(process.cwd(), "pages");
        const pages = await readdir(pagesDir);
        
        let globalCSS = "";
        
        for (const pageFile of pages) {
            if (pageFile.endsWith('.js')) {
                const pagePath = join(pagesDir, pageFile);
                const module = await import(pagePath);
                const content = typeof module.default === 'function' ? await module.default() : module.default;
                const html = typeof content === 'object' && content.body ? content.body : content;
                
                // Get dynamic CSS for each page
                const { getDynamicCSS } = await import(join(process.cwd(), 'core', 'tailwind.js'));
                const css = await getDynamicCSS(html);
                globalCSS += css;
            }
        }
        
        const publicDir = join(process.cwd(), "public");
        await writeFile(join(publicDir, "dist.css"), globalCSS);
        console.log(`✅ CSS compilation complete. Generated dist.css (${globalCSS.length} bytes)`);
        
        console.log("✨ Build successful!");
    } catch (error) {
        console.error("❌ Build failed:", error);
        process.exit(1);
    }
}