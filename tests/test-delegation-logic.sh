#!/bin/bash

# Mock curl to capture the payload
curl() {
    for arg in "$@"; do
        if [[ "$arg" == "{"* ]]; then
            echo "PAYLOAD: $arg"
        fi
    done
}

# Source the function (we need to bypass the loop at the end of agent-entrypoint.sh)
# Instead of sourcing the whole file, I'll just redefine the function here for testing
dispatch_sub_intent() {
    local target_role=$1
    local task=$2
    local mode=${3:-""}
    local schema=${4:-"STANDARD_REPORT"}

    if [ -z "$mode" ]; then
        if [[ "$task" =~ "fix" ]] || [[ "$task" =~ "implement" ]] || [[ "$task" =~ "add" ]] || [[ "$task" =~ "modify" ]]; then
            mode="READ_WRITE"
        else
            mode="READ_ONLY"
        fi
    fi

    curl -s -X POST http://host.docker.internal:3000/broadcast \
         -H "Content-Type: application/json" \
         -d "{\"role\": \"$target_role\", \"task\": \"$task\", \"mode\": \"$mode\", \"response_schema\": \"$schema\"}"
}

echo "Testing 'explore' task (Default READ_ONLY):"
dispatch_sub_intent "sec-forge" "Explore the codebase for leaks"

echo -e "\nTesting 'fix' task (Auto READ_WRITE):"
dispatch_sub_intent "tester" "Fix the bug in logic"

echo -e "\nTesting explicit mode:"
dispatch_sub_intent "qascout" "Do something" "READ_WRITE"

echo -e "\nTesting explicit schema:"
dispatch_sub_intent "qascout" "Do something" "READ_ONLY" "SECURITY_AUDIT"
