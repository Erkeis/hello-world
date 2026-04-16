#!/bin/bash
# agent-harness/simulate-agent.sh
ROLE=$1
NAME=$2
echo "Starting Agent Harness for $NAME as $ROLE..."
while true; do
  if [ -f "/app/shared/intent-$ROLE.json" ]; then
    echo "New Intent Detected!"
    # Simulate work
    sleep 2
    git config --global user.email "agent@farm.local"
    git config --global user.name "Agent Farm"
    echo "Result of $ROLE task" >> "/app/repo/work-$NAME.txt"
    git add "/app/repo/work-$NAME.txt"
    git commit -m "agent/$NAME[$ROLE]: completed task from intent"
    rm "/app/shared/intent-$ROLE.json"
    echo "Task complete and committed."
  fi
  sleep 5
done
