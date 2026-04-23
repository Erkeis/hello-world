#!/bin/bash
# [Intent] Test for Phase 5 Task 2 logic: Physical Sandboxing

# Create a local test environment
TEST_ROOT="./sandbox-test"
REPO_DIR="$TEST_ROOT/repo"
rm -rf "$TEST_ROOT"
mkdir -p "$REPO_DIR/.git"
echo "secret data" > "$REPO_DIR/sensitive-file.txt"

IDENTITY="test-agent"
LOG_FILE="$REPO_DIR/work-${IDENTITY}.log"

echo "--- Step 1: Default State (Writable) ---"
chmod -R u+w "$REPO_DIR"
[ -w "$REPO_DIR/sensitive-file.txt" ] && echo "✅ Initial file is writable"

echo "--- Step 2: Apply READ_ONLY Sandbox ---"
MODE="READ_ONLY"

if [ "$MODE" == "READ_ONLY" ]; then
    echo "🔒 Read-Only Mode Active. Sandboxing $REPO_DIR..."
    chmod -R a-w "$REPO_DIR"
    if [ -d "$REPO_DIR/.git" ]; then
        chmod -R u+w "$REPO_DIR/.git"
    fi
    touch "$LOG_FILE"
    chmod u+w "$LOG_FILE"
fi

echo "--- Step 3: Verify Restrictions ---"

if [ -w "$REPO_DIR/sensitive-file.txt" ]; then
    echo "❌ FAILED: sensitive-file.txt is writable!"
    FAIL=1
else
    echo "✅ SUCCESS: sensitive-file.txt is read-only."
fi

# Try to write to it anyway to be sure
echo "tamper" >> "$REPO_DIR/sensitive-file.txt" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "❌ FAILED: Successfully wrote to read-only file!"
    FAIL=1
else
    echo "✅ SUCCESS: Write attempt blocked as expected."
fi

if [ -w "$LOG_FILE" ]; then
    echo "✅ SUCCESS: Log file is writable."
    echo "Log entry" >> "$LOG_FILE"
else
    echo "❌ FAILED: Log file is read-only!"
    FAIL=1
fi

if [ -w "$REPO_DIR/.git" ]; then
    echo "✅ SUCCESS: .git directory is writable."
    touch "$REPO_DIR/.git/index.lock"
    rm "$REPO_DIR/.git/index.lock"
else
    echo "❌ FAILED: .git directory is read-only!"
    FAIL=1
fi

echo "--- Step 4: Restore Permissions ---"
if [ "$MODE" == "READ_ONLY" ]; then
    echo "🔓 Task finished. Restoring permissions..."
    chmod -R u+w "$REPO_DIR"
fi

if [ -w "$REPO_DIR/sensitive-file.txt" ]; then
    echo "✅ SUCCESS: Permissions restored."
else
    echo "❌ FAILED: Permissions not restored!"
    FAIL=1
fi

# Cleanup
rm -rf "$TEST_ROOT"

if [ "$FAIL" == "1" ]; then
    echo "Final Result: FAILED"
    exit 1
else
    echo "Final Result: PASSED"
    exit 0
fi
