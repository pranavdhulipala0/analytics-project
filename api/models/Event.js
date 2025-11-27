const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_type: {
    type: String,
    required: true,
    index: true,
    enum: ['page_view', 'signup', 'login', 'purchase', 'click', 'generic']
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  session_id: {
    type: String,
    index: true
  },
  props: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  processed: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  collection: 'analytics_events'
});

eventSchema.index({ event_type: 1, timestamp: -1 });
eventSchema.index({ user_id: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1 });

eventSchema.methods.toKafkaMessage = function() {
  return {
    event: this.event_type,
    user_id: this.user_id,
    session_id: this.session_id,
    props: this.props,
    timestamp: this.timestamp.toISOString(),
    ip_address: this.ip_address,
    user_agent: this.user_agent
  };
};

module.exports = mongoose.model('Event', eventSchema);