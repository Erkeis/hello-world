$SESSION_ID = Get-Date -Format "yyyyMMdd-HHmmss"
$SESSION_DIR = "R:\Users\kg908\Documents\temp\.superpowers\brainstorm\$SESSION_ID"
New-Item -ItemType Directory -Path "$SESSION_DIR\content" -Force | Out-Null
New-Item -ItemType Directory -Path "$SESSION_DIR\state" -Force | Out-Null
$env:BRAINSTORM_DIR = $SESSION_DIR
$env:BRAINSTORM_HOST = "127.0.0.1"
$env:BRAINSTORM_URL_HOST = "localhost"
$env:BRAINSTORM_OWNER_PID = $pid
Set-Location "C:\Users\kg908\.gemini\extensions\superpowers\skills\brainstorming\scripts"
node server.cjs
