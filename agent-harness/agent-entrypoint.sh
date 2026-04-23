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

# [Intent] CLI Wrapper to enable Peer-to-Peer intent dispatching via the Orchestrator. (2026-04-23)
dispatch_sub_intent() {
    local target_role=$1
    local task=$2
    local mode=${3:-""}
    local schema=${4:-"STANDARD_REPORT"}

    # [Intent] Task-Type Logic: Auto-select mode based on task keywords if not explicitly provided.
    if [ -z "$mode" ]; then
        if [[ "$task" =~ "fix" ]] || [[ "$task" =~ "implement" ]] || [[ "$task" =~ "add" ]] || [[ "$task" =~ "modify" ]]; then
            mode="READ_WRITE"
        else
            mode="READ_ONLY"
        fi
    fi

    # [Intent] Use host.docker.internal to reach the host-bound orchestrator from inside the container.
    # Note: host.docker.internal works on Docker Desktop (Windows/Mac) and can be configured on Linux.
    curl -s -X POST http://host.docker.internal:3000/broadcast \
         -H "Content-Type: application/json" \
         -d "{\"role\": \"$target_role\", \"task\": \"$task\", \"mode\": \"$mode\", \"response_schema\": \"$schema\"}"
}

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
            MODE=$(jq -r '.mode // "READ_WRITE"' "$INTENT_FILE")
            TASK=$(jq -r '.task' "$INTENT_FILE")
            # Write bundled context to a temporary file for the CLI tool to consume
            CONTEXT_FILE="/tmp/context.json"
            jq -r '.context' "$INTENT_FILE" > "$CONTEXT_FILE"

            # [Intent] Physical Sandboxing: Strip write permissions if mode is READ_ONLY.
            # We must preserve write access to the log file and .git for the harness to function.
            if [ "$MODE" == "READ_ONLY" ]; then
                echo "🔒 Read-Only Mode Active. Sandboxing /app/repo..."
                # [Intent] Ensure log file exists before we lock the directory.
                touch "/app/repo/work-${IDENTITY}.log"
                # [Intent] Setup trap to ensure permissions are restored even on crash or exit.
                trap 'chmod -R u+w /app/repo 2>/dev/null' EXIT
                
                chmod -R a-w /app/repo
                # Restore write permission for .git so the harness can commit logs
                if [ -d "/app/repo/.git" ]; then
                    chmod -R u+w /app/repo/.git
                fi
                # Ensure log file is writable
                chmod u+w "/app/repo/work-${IDENTITY}.log"
            fi
            
            run_task "$TASK" "$CONTEXT_FILE"

            # [Intent] Restore permissions after task completion.
            if [ "$MODE" == "READ_ONLY" ]; then
                echo "🔓 Task finished. Restoring permissions..."
                chmod -R u+w /app/repo
                trap - EXIT
            fi
            
            # [Intent] Clear intent to prevent re-execution, but keep the file for inotify.
            truncate -s 0 "$INTENT_FILE"
        fi
    fi
done
