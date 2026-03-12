import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshTokens: [{
        token: String,
        createdAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Method to add refresh token
userSchema.methods.addRefreshToken = function(token) {
    this.refreshTokens.push({
        token,
        createdAt: new Date()
    });
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
    this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

// Static method to find user by refresh token
userSchema.statics.findByRefreshToken = function(token) {
    return this.findOne({ 'refreshTokens.token': token });
};

export const User = mongoose.model('User', userSchema);