#!/bin/sh

set -e

echo "⏳ Waiting for Kafka to be ready at $KAFKA_BROKER..."

while ! nc -z $(echo "$KAFKA_BROKER" | cut -d: -f1) $(echo "$KAFKA_BROKER" | cut -d: -f2); do
  echo "Kafka is not ready yet..."
  sleep 2
done

echo "✅ Kafka is up and running at $KAFKA_BROKER!"
exec "$@"
