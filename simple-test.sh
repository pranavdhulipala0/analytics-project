#!/bin/bash

# Simple, clean API test script
echo "🚀 Starting Simple API Test"
echo "Press Ctrl+C to stop"
echo "========================="

counter=1

# Function to handle Ctrl+C
cleanup() {
    echo -e "\n🛑 Stopping test... Total requests: $counter"
    exit 0
}
trap cleanup INT

# Simple event templates with correct format
events=(
    '{"event": "page_view", "user_id": "U1", "props": {"page": "/home", "url": "/"}}'
    '{"event": "signup", "user_id": "U2", "props": {"email": "user@test.com", "url": "/signup"}}'
    '{"event": "login", "user_id": "U3", "props": {"device": "desktop", "url": "/login"}}'
    '{"event": "purchase", "user_id": "U4", "props": {"amount": 99.99, "url": "/checkout"}}'
    '{"event": "click", "user_id": "U5", "props": {"element": "button", "url": "/"}}'
    '{"event": "generic", "user_id": "U6", "props": {"action": "test", "url": "/"}}'
)

while true; do
    # Pick random event
    event_index=$((RANDOM % ${#events[@]}))
    event_json="${events[$event_index]}"
    
    echo "[$counter] Sending request..."
    
    # Make request with explicit content-length
    response=$(curl -s \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Content-Length: ${#event_json}" \
        --data-raw "$event_json" \
        -w "%{http_code}" \
        http://localhost:8000/api/v1/events/track)
    
    status_code="${response: -3}"
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ] || [ "$status_code" = "202" ]; then
        echo "  ✅ Success ($status_code)"
    else
        echo "  ❌ Failed ($status_code)"
        echo "  Response: $response"
    fi
    
    counter=$((counter + 1))
done