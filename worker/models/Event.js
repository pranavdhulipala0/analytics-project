const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_type: {
    type: String,
    required: true,
    index: true
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
  },
  kafka_metadata: {
    topic: String,
    partition: Number,
    offset: String
  }
}, {
  timestamps: true,
  collection: 'analytics_events'
});

eventSchema.index({ event_type: 1, timestamp: -1 });
eventSchema.index({ user_id: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1 });
eventSchema.index({ processed: 1, timestamp: -1 });

module.exports = mongoose.model('Event', eventSchema);