import { getDynamicCSS } from './tailwind';
export const html = (strings: TemplateStringsArray, ...values: any[]): string => 
    strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");

export async function renderPage(pageResult: string | { head?: string; body: string }): Promise<string> {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${css}</style>${head}</head><body>${body}</body></html>`;
}