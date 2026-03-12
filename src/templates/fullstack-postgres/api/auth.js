import { 
    loginUser, 
    registerUser, 
    refreshAccessToken,
    generateAccessToken,
    generateRefreshToken 
} from '../lib/services/authService.js';

// Fallback if MongoDB is not available
const USE_FALLBACK = true;

export async function POST(req) {
    try {
        const body = await req.json();
        
        // Login endpoint
        if (body.action === 'login') {
            if (USE_FALLBACK) {
                // Fallback login for testing without MongoDB
                const user = {
                    id: '1',
                    email: body.email,
                    name: 'Test User',
                    role: 'user',
                    addRefreshToken: () => {},
                    save: () => Promise.resolve()
                };
                
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                
                return new Response(
                    JSON.stringify({
                        success: true,
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        },
                        accessToken,
                        refreshToken
                    }),
                    {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Set-Cookie': `nexa_access=${accessToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
                        }
                    }
                );
            }
            
            const user = await loginUser(body.email, body.password);
            
            // Generate tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            
            // Save refresh token to user
            user.addRefreshToken(refreshToken);
            await user.save();
            
            return new Response(
                JSON.stringify({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    accessToken,
                    refreshToken
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `nexa_access=${accessToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
                    }
                }
            );
        }
        
        // Register endpoint
        if (body.action === 'register') {
            if (USE_FALLBACK) {
                // Fallback registration for testing without MongoDB
                const user = {
                    id: '1',
                    email: body.email,
                    name: body.name,
                    role: body.role || 'user',
                    addRefreshToken: () => {},
                    save: () => Promise.resolve()
                };
                
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                
                return new Response(
                    JSON.stringify({
                        success: true,
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        },
                        accessToken,
                        refreshToken
                    }),
                    {
                        status: 201,
                        headers: {
                            'Content-Type': 'application/json',
                            'Set-Cookie': `nexa_access=${accessToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
                        }
                    }
                );
            }
            
            const user = await registerUser(body.email, body.password, body.name, body.role || 'user');
            
            // Generate tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            
            // Save refresh token to user
            user.addRefreshToken(refreshToken);
            await user.save();
            
            return new Response(
                JSON.stringify({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    accessToken,
                    refreshToken
                }),
                {
                    status: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `nexa_access=${accessToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
                    }
                }
            );
        }
        
        // Refresh token endpoint
        if (body.action === 'refresh') {
            const newAccessToken = await refreshAccessToken(body.refreshToken);
            return new Response(
                JSON.stringify({
                    success: true,
                    accessToken: newAccessToken
                }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `nexa_access=${newAccessToken}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`
                    }
                }
            );
        }
        
        // Logout endpoint
        if (body.action === 'logout') {
            return new Response(
                JSON.stringify({ success: true }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': 'nexa_access=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
                    }
                }
            );
        }
        
        return new Response(
            JSON.stringify({ success: false, error: 'Invalid action' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Auth API error:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
}