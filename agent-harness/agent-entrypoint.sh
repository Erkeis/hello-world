#!/bin/bash
# [Intent] Reactive agent harness that waits for approved intents via inotify and executes specialized CLI tools. (2026-04-18)

IDENTITY=${IDENTITY:-"unknown-agent"}
ROLE=${ROLE:-"generalist"}
INTENT_FILE="/app/shared/intent-${IDENTITY}.json"

echo "🛡️ Identity: $IDENTITY | 🎭 Current Role: $ROLE"

# 1. Specialized Tool Auto-Discovery
if command -v gemini >/dev/null 2>&1; then
    AGENT_TOOL="gemini"
elif command -v claude >/dev/null 2>&1; then
    AGENT_TOOL="claude"
elif command -v codex >/dev/null 2>&1; then
    AGENT_TOOL="codex"
else
    AGENT_TOOL="simulation"
fi

echo "🛠️ Capability Detected: $AGENT_TOOL"

run_task() {
    local task=$1
    local context_file=$2
    
    echo "🚀 Executing Task: $task"
    
    case $AGENT_TOOL in
        "gemini")
            gemini --task "$task" --context "$context_file"
            ;;
        "claude")
            claude-code --intent "$task" --context "$context_file"
            ;;
        "codex")
            codex exec --objective "$task" --context "$context_file"
            ;;
        *)
            echo "🧪 [Simulation] Working on: $task"
            sleep 3
            ;;
    esac

    # [Intent] Report success via Git prefix convention as per Phase 2 decisions.
    git config --global user.email "agent@farm.local"
    git config --global user.name "Agent Farm"
    echo "Completed: $task" >> "/app/repo/work-${IDENTITY}.log"
    git add "/app/repo/work-${IDENTITY}.log"
    git commit -m "agent/${IDENTITY}[${ROLE}]: completed task"
}

# 2. Reactive Event Loop
echo "📡 Waiting for intents..."

# Ensure file exists for inotify to watch
touch "$INTENT_FILE"

while true; do
    # [Intent] Use inotifywait for zero-latency reaction to atomic file renames/writes.
    inotifywait -e close_write,moved_to "$INTENT_FILE" > /dev/null 2>&1

    if [ -s "$INTENT_FILE" ]; then
        STATUS=$(jq -r '.status // "APPROVED"' "$INTENT_FILE" 2>/dev/null)
        
        if [ "$STATUS" == "PENDING_APPROVAL" ]; then
            echo "⏳ Task received. Waiting for Shareholder Approval..."
            # Wait for the next update that makes it APPROVED
            continue
        fi

        if [ "$STATUS" == "APPROVED" ]; then
            TASK=$(jq -r '.task' "$INTENT_FILE")
            # Write bundled context to a temporary file for the CLI tool to consume
            CONTEXT_FILE="/tmp/context.json"
            jq -r '.context' "$INTENT_FILE" > "$CONTEXT_FILE"
            
            run_task "$TASK" "$CONTEXT_FILE"
            
            # [Intent] Clear intent to prevent re-execution, but keep the file for inotify.
            truncate -s 0 "$INTENT_FILE"
        fi
    fi
done
