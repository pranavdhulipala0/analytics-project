# Analytics Project Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- curl or Postman (for testing)

## Project Structure

```
analytics-project/
├── docker-compose.yml
├── api/
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
├── worker/
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
└── steps.md
```

## Step 1: Start the Services

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

This will start:
- Zookeeper on port 2181
- Kafka on port 9092
- MongoDB on port 27017
- API server on port 8000
- Worker service (no exposed port)

## Step 2: Wait for Services to Initialize

Services need time to start up. Wait for these logs:
- `Connected to Kafka` (from API)
- `Connected to MongoDB` (from worker)
- `Worker started and listening for messages...`

## Step 3: Create Kafka Topics

The worker automatically subscribes to these topics:
- `events_page_view`
- `events_signup`
- `events_generic`

Topics are created automatically when first message is sent.

## Step 4: Test the API

### Send a page view event:
```bash
curl -X POST http://localhost:8000/api/v1/events/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "page_view",
    "user_id": "user123",
    "session_id": "sess_abc123",
    "props": {
      "url": "/home",
      "referrer": "google"
    }
  }'
```

### Send a signup event:
```bash
curl -X POST http://localhost:8000/api/v1/events/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "signup",
    "user_id": "user124",
    "session_id": "sess_def456",
    "props": {
      "email": "test@example.com",
      "source": "landing_page"
    }
  }'
```

Expected response: 
```json
{
  "status": "ok",
  "event_id": "648a1b2c3d4e5f6789abcdef",
  "timestamp": "2025-11-26T12:00:00.000Z"
}
```

### Query events:
```bash
# Get all events
curl "http://localhost:8000/api/v1/events"

# Get events for specific user
curl "http://localhost:8000/api/v1/events?user_id=user123"

# Get event statistics
curl "http://localhost:8000/api/v1/events/stats"
```

### Query users:
```bash
# Get all users
curl "http://localhost:8000/api/v1/users"

# Get user profile
curl "http://localhost:8000/api/v1/users/user123"

# Get user statistics
curl "http://localhost:8000/api/v1/users/stats"
```

## Step 5: Verify Data in MongoDB

### Connect to MongoDB container:
```bash
docker exec -it mongo mongosh
```

### Query the data:
```javascript
use analytics
db.analytics_events.find().pretty()

// Count events by type
db.analytics_events.aggregate([
  { $group: { _id: "$event_type", count: { $sum: 1 } } }
])

// Find recent events
db.analytics_events.find().sort({ timestamp: -1 }).limit(10)
```

## Step 6: Monitor Logs

### View all logs:
```bash
docker-compose logs -f
```

### View specific service logs:
```bash
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f kafka
```

## Configuration

### Environment Variables

**API Service:**
- `KAFKA_BROKER`: Kafka broker address (default: kafka:9092)
- `PORT`: API port (default: 8000)

**Worker Service:**
- `KAFKA_BROKER`: Kafka broker address (default: kafka:9092)  
- `MONGODB_URI`: MongoDB connection string (default: mongodb://mongodb:27017/analytics)

### Kafka Topics

The system uses topic naming convention: `events_{event_type}`

Examples:
- `page_view` → `events_page_view`
- `signup` → `events_signup`
- `purchase` → `events_purchase`

## Troubleshooting

### Services won't start:
1. Check Docker is running
2. Ensure ports 2181, 9092, 27017, 8000 are available
3. Run `docker-compose down` then `docker-compose up --build`

### Kafka connection issues:
1. Wait longer for Kafka to fully initialize
2. Check `docker-compose logs kafka`
3. Verify Zookeeper is running

### MongoDB connection issues:
1. Check `docker-compose logs mongodb`
2. Verify MongoDB container is healthy: `docker ps`

### No events in MongoDB:
1. Check worker logs: `docker-compose logs worker`
2. Verify API is publishing to Kafka: `docker-compose logs api`
3. Ensure topics exist and worker is subscribed

## Stopping the Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes MongoDB data)
docker-compose down -v
```

## Local Development

To run services locally (outside Docker):

1. Start only infrastructure:
```bash
docker-compose up zookeeper kafka mongodb
```

2. Install dependencies:
```bash
cd api && npm install
cd ../worker && npm install
```

3. Set environment variables:
```bash
export KAFKA_BROKER=localhost:9092
export MONGODB_URI=mongodb://localhost:27017/analytics
```

4. Run services:
```bash
# Terminal 1
cd api && npm run dev

# Terminal 2  
cd worker && npm run dev
```