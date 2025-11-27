// Load environment variables from .env file
require('dotenv').config();

// Import Kafka client library for Node.js
const { Kafka } = require('kafkajs');

// Import our database connection and data models
const connectDatabase = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/User');

// Configuration: Kafka broker addresses (where Kafka servers are running)
// Support both single broker (KAFKA_BROKER) and multiple brokers (KAFKA_BROKERS)
const KAFKA_BROKERS = process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER || 'kafka-1:9092,kafka-2:9092';
const BROKER_LIST = KAFKA_BROKERS.split(',');

// CONSUMER GROUP: Multiple workers can belong to the same group.
// Kafka ensures each message is processed by only ONE worker in the group.
// This allows horizontal scaling - add more workers, they'll share the workload.
const CONSUMER_GROUP = process.env.CONSUMER_GROUP || 'analytics-group';

// Create Kafka client instance
const kafka = new Kafka({
  clientId: 'analytics-worker',  // Unique identifier for this worker
  brokers: BROKER_LIST           // List of Kafka broker addresses
});

// Create a CONSUMER that belongs to our consumer group
// CONSUMER GROUP BENEFITS:
// - Load balancing: Kafka distributes partitions among group members
// - Fault tolerance: If one worker dies, others take over its partitions
// - Exactly-once processing: Each message processed by only one worker in group
const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

async function connectKafka() {
  try {
    // Establish connection to Kafka cluster
    await consumer.connect();
    console.log('Worker connected to Kafka');
    
    // TOPICS: Named streams of messages in Kafka
    // Each topic can have multiple PARTITIONS for parallel processing
    // Topics are like "channels" - producers publish to topics, consumers subscribe
    const topics = ['events_page_view', 'events_signup', 'events_login', 'events_purchase', 'events_click', 'events_generic'];
    
    // SUBSCRIPTION: Tell Kafka which topics this worker wants to consume from
    // Kafka will automatically assign PARTITIONS from these topics to this worker
    await consumer.subscribe({ topics });
    console.log('Subscribed to topics:', topics);
    
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    throw error;
  }
}

// Function to process each individual message
async function processMessage(message, topic, partition, offset) {
  try {
    // MESSAGE STRUCTURE:
    // - message.value: The actual data (JSON string in our case)
    // - topic: Which topic this message came from (e.g., "events_page_view")
    // - partition: Which partition within the topic (for parallel processing)
    // - offset: Position of this message in the partition (like a sequence number)
    
    // Parse the JSON message sent by the API
    const eventData = JSON.parse(message.value.toString());
    
    // Create new Event document for MongoDB
    const event = new Event({
      event_type: eventData.event,
      user_id: eventData.user_id,
      session_id: eventData.session_id,
      props: eventData.props || {},
      timestamp: new Date(eventData.timestamp),
      ip_address: eventData.ip_address,
      user_agent: eventData.user_agent,
      
      // KAFKA METADATA: Store Kafka information for debugging/tracking
      // This helps us know exactly where this event came from in Kafka
      kafka_metadata: {
        topic,                      // Which topic (e.g., "events_page_view")
        partition,                  // Which partition number (e.g., 0, 1, 2...)
        offset: offset.toString()   // Message position in partition (e.g., "1234")
      }
    });
    
    // Save the event to MongoDB
    await event.save();
    
    // Update user activity tracking
    await updateUserActivity(eventData.user_id);
    
    console.log(`Processed ${eventData.event} event for user ${eventData.user_id} - ID: ${event._id}`);
    
  } catch (error) {
    console.error('Error processing message:', error);
    console.error('Message content:', message.value.toString());
    throw error;  // Re-throw so Kafka knows processing failed
  }
}

// Update user activity statistics
async function updateUserActivity(user_id) {
  try {
    // Find existing user or create new one
    let user = await User.findOne({ user_id });
    
    if (!user) {
      // First time seeing this user
      user = new User({ 
        user_id,
        first_seen: new Date()
      });
    }
    
    // Update activity tracking
    user.last_seen = new Date();      // When we last saw activity
    user.total_events += 1;           // Increment event counter
    
    if (user.total_events === 1) {
      user.status = 'active';          // Mark as active user
    }
    
    await user.save();
    
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
}

async function startWorker() {
  try {
    // Connect to MongoDB first
    await connectDatabase();
    
    // Then connect to Kafka
    await connectKafka();
    
    // START CONSUMING MESSAGES
    await consumer.run({
      // This function is called for EVERY message Kafka sends us
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        try {
          // OFFSET: This is the position of the message in the partition
          // Think of it like page numbers in a book - offset 0 is first message,
          // offset 1 is second message, etc. Offsets are per-partition.
          console.log(`Received message from ${topic}[${partition}] offset: ${message.offset}`);
          
          // Process the actual message
          await processMessage(message, topic, partition, message.offset);
          
          // HEARTBEAT: Tell Kafka "I'm still alive and processing"
          // This prevents Kafka from thinking this worker is dead and reassigning
          // our partitions to other workers. Must be called regularly.
          await heartbeat();
          
        } catch (error) {
          console.error('Error in message processing:', error);
          // Note: If we don't re-throw here, Kafka will consider the message
          // successfully processed. Re-throwing would cause retry/failure handling.
        }
      },
    });
    
    console.log('Worker started and listening for messages...');
    
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown: Clean up connections when worker stops
async function gracefulShutdown() {
  console.log('Shutting down worker gracefully...');
  
  try {
    // Disconnect from Kafka cleanly
    // This tells Kafka to reassign our partitions to other workers in the group
    await consumer.disconnect();
    console.log('Worker shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals (Ctrl+C, Docker stop, etc.)
process.on('SIGINT', gracefulShutdown);   // Ctrl+C
process.on('SIGTERM', gracefulShutdown);  // Docker stop

// Start the worker
startWorker().catch(console.error);

/*
KAFKA CONCEPTS EXPLAINED:

🏪 TOPICS: Like different "stores" or "channels"
- Each topic handles one type of event (page_view, signup, etc.)
- Topics are divided into PARTITIONS for parallel processing

📦 PARTITIONS: Like "checkout lanes" in a store
- Each topic can have multiple partitions (lanes)
- Messages with same KEY go to same partition (maintains order)
- More partitions = more parallel processing possible

👥 CONSUMER GROUPS: Like "teams of workers"
- Multiple workers can belong to same group
- Kafka ensures each partition is assigned to only ONE worker in the group
- If worker dies, its partitions are reassigned to other group members

📍 OFFSETS: Like "bookmarks" in each partition
- Every message gets a sequential number (offset) in its partition
- Worker tracks which offset it last processed
- If worker restarts, it continues from last processed offset

💓 HEARTBEAT: Like saying "I'm still working!"
- Worker must regularly tell Kafka it's alive
- If no heartbeat for too long, Kafka assumes worker died
- Dead worker's partitions get reassigned to other group members

EXAMPLE FLOW:
1. API publishes event to topic "events_page_view"
2. Kafka routes message to a partition (e.g., partition 0)
3. This worker (part of "analytics-group") gets assigned the partition
4. Worker receives message with offset 1234
5. Worker processes message, saves to MongoDB
6. Worker sends heartbeat to Kafka saying "still alive"
7. Worker moves to next message (offset 1235)

SCALING:
- Add more workers to same group = better performance
- Kafka automatically distributes partitions among all group members
- Each message still processed exactly once
*/