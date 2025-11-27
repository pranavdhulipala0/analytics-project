const { Kafka } = require('kafkajs');

async function waitForKafka() {
  const KAFKA_BROKERS = process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER || 'kafka-1:9092,kafka-2:9092';
  const BROKER_LIST = KAFKA_BROKERS.split(',');
  
  const kafka = new Kafka({
    clientId: 'health-check',
    brokers: BROKER_LIST
  });

  const admin = kafka.admin();
  
  let connected = false;
  let retries = 0;
  const maxRetries = 30;

  while (!connected && retries < maxRetries) {
    try {
      console.log(`Attempting to connect to Kafka (attempt ${retries + 1}/${maxRetries})...`);
      await admin.connect();
      await admin.listTopics();
      connected = true;
      console.log('✅ Kafka is ready!');
      await admin.disconnect();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.error('❌ Failed to connect to Kafka after', maxRetries, 'attempts');
        process.exit(1);
      }
      console.log('⏳ Kafka not ready, waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

if (require.main === module) {
  waitForKafka().then(() => {
    require('./index.js');
  }).catch(console.error);
}

module.exports = waitForKafka;