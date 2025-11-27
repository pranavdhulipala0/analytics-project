const { Kafka } = require('kafkajs');

// Support both single broker (KAFKA_BROKER) and multiple brokers (KAFKA_BROKERS)
const KAFKA_BROKERS = process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER || 'kafka-1:9092,kafka-2:9092';
const BROKER_LIST = KAFKA_BROKERS.split(',');

const kafka = new Kafka({
  clientId: 'analytics-api',
  brokers: BROKER_LIST  // Now supports multiple brokers
});

const producer = kafka.producer();

let isConnected = false;

const connectKafka = async () => {
  try {
    await producer.connect();
    isConnected = true;
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    throw error;
  }
};

const publishToKafka = async (topic, key, message) => {
  try {
    if (!isConnected) {
      throw new Error('Kafka producer not connected');
    }

    const result = await producer.send({
      topic,
      messages: [
        {
          key: key.toString(),
          value: JSON.stringify(message)
        }
      ]
    });

    // Log which broker handled the message
    const partition = result[0].partition;
    const offset = result[0].baseOffset;
    
    console.log(`Published to ${topic}[${partition}] offset: ${offset} with key ${key}`);
    
  } catch (error) {
    console.error('Error publishing to Kafka:', error);
    throw error;
  }
};

const disconnectKafka = async () => {
  try {
    await producer.disconnect();
    isConnected = false;
    console.log('Disconnected from Kafka');
  } catch (error) {
    console.error('Error disconnecting from Kafka:', error);
  }
};

module.exports = {
  connectKafka,
  publishToKafka,
  disconnectKafka
};