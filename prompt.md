# Analytics Tracking Pipeline (Kafka + MongoDB + Node.js)

## Overview

This project is a small analytics event tracking system for learning purposes. It uses:

* **Frontend**: sends events to an API
* **API (Node.js)**: receives events and publishes to Kafka topics
* **Kafka + Zookeeper**: message broker for event streaming
* **Worker (Node.js)**: consumes Kafka events and stores in MongoDB
* **MongoDB**: stores event data

This setup demonstrates:

* Kafka producer and consumer concepts
* Multiple topics
* Consumer groups and partitions
* MongoDB inserts for analytics

---

## Architecture

```
Frontend → API → Kafka → Worker → MongoDB
                         ↑
                      Zookeeper
```

* **API server**: receives events from frontend and publishes to Kafka.
* **Kafka**: message broker with topics per event type.
* **Worker**: subscribes to Kafka topics and inserts events into MongoDB.
* **MongoDB**: stores events for future queries/analytics.
* **Zookeeper**: coordinates Kafka brokers (required for older Kafka versions).

---

## Kafka Topics

* `events_page_view`
* `events_signup`
* `events_generic`

Messages are JSON objects:

```json
{
  "event": "page_view",
  "user_id": "123",
  "props": {
    "url": "/home",
    "ref": "google"
  },
  "timestamp": "2025-11-26T12:00:00Z"
}
```

---

## MongoDB Schema

Collection: `analytics_events`

```json
{
  "_id": ObjectId,
  "event_type": "page_view",
  "user_id": "123",
  "props": {
    "url": "/home",
    "referrer": "google"
  },
  "timestamp": ISODate("2025-11-26T12:00:00Z")
}
```

Indexes:

```js
db.analytics_events.createIndex({ event_type: 1 })
db.analytics_events.createIndex({ user_id: 1 })
db.analytics_events.createIndex({ timestamp: -1 })
```

---

## Docker Compose Setup

```yaml
version: '3.8'
services:

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  mongodb:
    image: mongo:6.0
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  api:
    build: ./api
    depends_on:
      - kafka
    ports:
      - "8000:8000"

  worker:
    build: ./worker
    depends_on:
      - kafka
      - mongodb

volumes:
  mongo-data:
```

---

## API Server

* Endpoint: `POST /track`
* Accepts JSON event:

```json
{
  "event": "page_view",
  "user_id": "123",
  "props": {"url":"/home"}
}
```

* Publishes to Kafka topic: `events_<event_type>`
* Returns `{ status: 'ok' }`

---

## Worker Server

* Subscribes to all event topics
* Uses a **consumer group** for scaling
* Reads messages and inserts into MongoDB collection `analytics_events`
* Kafka ensures:

  * Each partition is processed by only **one consumer** in the group
  * Multiple consumer groups can process the same messages independently

---

## Running the Project

```bash
docker-compose up --build
```

### Test the API

```bash
curl -X POST http://localhost:8000/track \
  -H "Content-Type: application/json" \
  -d '{"event":"page_view","user_id":"U1","props":{"url":"/"}}'
```

### Check MongoDB

```bash
mongo
use analytics
db.analytics_events.find().pretty()
```

---

## Notes

* Zookeeper coordinates Kafka brokers: leader election, broker coordination, metadata
* Single Kafka broker is enough for learning projects
* Use multiple brokers and partitions for high throughput and fault tolerance
* MongoDB handles flexible JSON event storage and indexing for queries

---

## Optional Improvements

* Add more topics for different event types
* Add batch insert in worker for high throughput
* Add real-time dashboards querying MongoDB
* Scale workers in the same consumer group to parallelize partition processing
