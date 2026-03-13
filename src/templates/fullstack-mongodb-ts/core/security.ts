// Security and CORS configuration
export const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

export function applyCORSHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

export function isSafePath(path: string): boolean {
  // Prevent directory traversal
  return !path.includes('..') && !path.startsWith('/../') && !path.endsWith('/..');
}
