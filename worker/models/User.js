const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    sparse: true
  },
  first_seen: {
    type: Date,
    default: Date.now
  },
  last_seen: {
    type: Date,
    default: Date.now
  },
  total_events: {
    type: Number,
    default: 0
  },
  properties: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  segments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'churned'],
    default: 'active'
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ last_seen: -1 });
userSchema.index({ total_events: -1 });

userSchema.methods.updateActivity = function() {
  this.last_seen = new Date();
  this.total_events += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);