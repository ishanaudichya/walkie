const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  identityNo: {
    type: String,
    unique: true,
    required: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendingRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  sentRequests: [{
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Helper method to get friend requests
userSchema.methods.getPendingRequests = function() {
  return this.pendingRequests.filter(request => request.status === 'pending');
};

// Helper method to check if users are friends
userSchema.methods.isFriendWith = function(userId) {
  return this.friends.includes(userId);
};

// Helper method to check if a request is pending
userSchema.methods.hasPendingRequestFrom = function(userId) {
  return this.pendingRequests.some(
    request => request.from.toString() === userId.toString() && request.status === 'pending'
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User; 