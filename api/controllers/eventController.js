const { Event, User } = require('../models');
const { publishToKafka } = require('../config/kafka');

const trackEvent = async (req, res) => {
  try {
    const { event, user_id, session_id, props } = req.validatedBody;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');

    const kafkaMessage = {
      event,
      user_id,
      session_id,
      props: props || {},
      ip_address,
      user_agent,
      timestamp: new Date().toISOString()
    };

    const topic = `events_${event}`;
    
    await publishToKafka(topic, user_id, kafkaMessage);

    console.log(`Event ${event} published to Kafka for user ${user_id}`);
    
    res.status(202).json({ 
      status: 'accepted',
      message: 'Event published for processing'
    });
    
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to track event'
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const { 
      user_id, 
      event_type, 
      limit = 50, 
      offset = 0,
      start_date,
      end_date
    } = req.query;

    const query = {};
    
    if (user_id) query.user_id = user_id;
    if (event_type) query.event_type = event_type;
    
    if (start_date || end_date) {
      query.timestamp = {};
      if (start_date) query.timestamp.$gte = new Date(start_date);
      if (end_date) query.timestamp.$lte = new Date(end_date);
    }

    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: total > (parseInt(offset) + parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch events'
    });
  }
};

const getEventStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const matchStage = {};
    if (start_date || end_date) {
      matchStage.timestamp = {};
      if (start_date) matchStage.timestamp.$gte = new Date(start_date);
      if (end_date) matchStage.timestamp.$lte = new Date(end_date);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$event_type',
          count: { $sum: 1 },
          unique_users: { $addToSet: '$user_id' }
        }
      },
      {
        $project: {
          event_type: '$_id',
          count: 1,
          unique_users: { $size: '$unique_users' },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ];

    const stats = await Event.aggregate(pipeline);
    
    res.json({ stats });
    
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch event statistics'
    });
  }
};


module.exports = {
  trackEvent,
  getEvents,
  getEventStats
};