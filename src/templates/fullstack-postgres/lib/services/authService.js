import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB, pool } from '../../config/db.js';
import { User } from '../models/User.js';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'nexa-framework-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Hash password
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// Compare passwords
export async function comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

// Generate tokens
export function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
}

// Verify token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Register user
export async function registerUser(email, password, name, role = 'user') {
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role
    });

    return user;
}

// Login user
export async function loginUser(email, password) {
    await connectDB();
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return user;
}

// Get user by ID
export async function getUserById(id) {
    await connectDB();
    return User.findById(id);
}

// Get all users (admin only)
export async function getAllUsers() {
    await connectDB();
    return User.find({}, '-password');
}

// Update user role (admin only)
export async function updateUserRole(userId, role) {
    await connectDB();
    return User.findByIdAndUpdate(userId, { role });
}

// Delete user (admin only)
export async function deleteUser(userId) {
    await connectDB();
    return User.findByIdAndDelete(userId);
}

// Refresh token
export async function refreshAccessToken(refreshToken) {
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
        throw new Error('Invalid refresh token');
    }

    const user = await getUserById(decoded.id);
    if (!user) {
        throw new Error('User not found');
    }

    return generateAccessToken(user);
}
