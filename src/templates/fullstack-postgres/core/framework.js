import { getDynamicCSS } from './tailwind.js';
export const html = (strings, ...values) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
export async function renderPage(pageResult) {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    const nexaProxyScript = `
    <script>
    // Nexa Zero-API Layer - Client-Side Proxy
    window.Nexa = {
        services: new Proxy({}, {
            get(target, serviceName) {
                return new Proxy({}, {
                    get(target, methodName) {
                        return async (...args) => {
                            const response = await fetch('/__nexa_proxy', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ service: serviceName, method: methodName, args })
                            });
                            
                            const result = await response.json();
                            if (!response.ok) throw new Error(result.error || "Nexa Service Error");
                            return result.data;
                        };
                    }
                });
            }
        })
    };
    </script>`;
    
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${css}</style>${head}${nexaProxyScript}</head><body>${body}</body></html>`;
}