const { User, Event } = require('../models');

const getUsers = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0,
      status,
      sort_by = 'last_seen',
      order = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sort_by] = order === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: total > (parseInt(offset) + parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch users'
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const user = await User.findOne({ user_id }).lean();
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found'
      });
    }

    const recentEvents = await Event.find({ user_id })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const eventStats = await Event.aggregate([
      { $match: { user_id } },
      {
        $group: {
          _id: '$event_type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          event_type: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      user,
      recent_events: recentEvents,
      event_stats: eventStats
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch user profile'
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    
    const topUsers = await User.find()
      .sort({ total_events: -1 })
      .limit(10)
      .select('user_id total_events last_seen')
      .lean();

    res.json({
      total_users: totalUsers,
      active_users: activeUsers,
      inactive_users: inactiveUsers,
      top_users: topUsers
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch user statistics'
    });
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  getUserStats
};