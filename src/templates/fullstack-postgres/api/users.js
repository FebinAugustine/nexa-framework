import { 
    getAllUsers, 
    updateUserRole, 
    deleteUser 
} from '../lib/services/authService.js';
import { verifyToken } from '../lib/services/authService.js';

export async function GET(req) {
    try {
        // Get access token from cookie or header
        const authHeader = req.headers.get('Authorization');
        const cookieHeader = req.headers.get('Cookie');
        
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        } else if (cookieHeader) {
            const cookies = cookieHeader.split(';');
            const accessTokenCookie = cookies.find(c => c.trim().startsWith('nexa_access='));
            if (accessTokenCookie) {
                token = accessTokenCookie.split('=')[1];
            }
        }
        
        if (!token) {
            return new Response(
                JSON.stringify({ success: false, error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return new Response(
                JSON.stringify({ success: false, error: 'Forbidden - Admin only' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const users = await getAllUsers();
        const usersWithoutPassword = users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt
        }));
        
        return new Response(
            JSON.stringify({ success: true, data: usersWithoutPassword }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Users API error:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('Authorization');
        const cookieHeader = req.headers.get('Cookie');
        
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        } else if (cookieHeader) {
            const cookies = cookieHeader.split(';');
            const accessTokenCookie = cookies.find(c => c.trim().startsWith('nexa_access='));
            if (accessTokenCookie) {
                token = accessTokenCookie.split('=')[1];
            }
        }
        
        if (!token) {
            return new Response(
                JSON.stringify({ success: false, error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return new Response(
                JSON.stringify({ success: false, error: 'Forbidden - Admin only' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const updatedUser = await updateUserRole(body.userId, body.role);
        return new Response(
            JSON.stringify({ 
                success: true, 
                data: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    role: updatedUser.role
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Update user role error:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get('Authorization');
        const cookieHeader = req.headers.get('Cookie');
        
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        } else if (cookieHeader) {
            const cookies = cookieHeader.split(';');
            const accessTokenCookie = cookies.find(c => c.trim().startsWith('nexa_access='));
            if (accessTokenCookie) {
                token = accessTokenCookie.split('=')[1];
            }
        }
        
        if (!token) {
            return new Response(
                JSON.stringify({ success: false, error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return new Response(
                JSON.stringify({ success: false, error: 'Forbidden - Admin only' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        await deleteUser(body.userId);
        return new Response(
            JSON.stringify({ success: true, message: 'User deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Delete user error:', error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}