import { loginUser, registerUser } from '../lib/services/authService';
import { generateAccessToken, generateRefreshToken } from '../lib/services/authService';
import { connectDB } from '../config/db';

export async function POST(req: Request) {
  await connectDB();

  try {
    const data = await req.json();

    if (data.action === 'login') {
      const { email, password } = data;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const user = await loginUser(email, password);
            
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in user document
      user.addRefreshToken(refreshToken);
      await user.save();

      const response = new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          tokens: {
            access: accessToken,
            refresh: refreshToken
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

      // Set cookies
      response.headers.set('Set-Cookie', `nexa_access=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/`);
      response.headers.set('Set-Cookie', `nexa_refresh=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`);

      return response;
    } else if (data.action === 'register') {
      const { email, password, name, role = 'user' } = data;

      if (!email || !password || !name) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email, password, and name are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (password.length < 6) {
        return new Response(
          JSON.stringify({ success: false, error: 'Password must be at least 6 characters long' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const user = await registerUser(email, password, name, role);
            
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token in user document
      user.addRefreshToken(refreshToken);
      await user.save();

      const response = new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          tokens: {
            access: accessToken,
            refresh: refreshToken
          }
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );

      // Set cookies
      response.headers.set('Set-Cookie', `nexa_access=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/`);
      response.headers.set('Set-Cookie', `nexa_refresh=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`);

      return response;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
        
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
