import { getDynamicCSS } from './tailwind.js';
export const html = (strings, ...values) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
export async function renderPage(pageResult) {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${css}</style>${head}</head><body>${body}</body></html>`;
}