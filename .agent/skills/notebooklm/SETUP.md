# Setup & Diagnostic: NotebookLM (`nlm`)

This document covers the one-time installation, authentication, and troubleshooting of the NotebookLM CLI and MCP tools. Use this only when the tools are missing or failing due to environment issues.

## 🛠️ Installation
Install the core CLI tools using `uv`:
```powershell
uv tool install notebooklm-mcp-cli
```

## 🔑 Authentication
Authentication is required to interact with the NotebookLM web platform.
```powershell
# Requires browser interaction
nlm login
```

## ⚙️ Path & Environment
- **Binary Location**: `C:\Users\kg908\.local\bin`
- **Global Config**: `C:\Users\kg908\.notebooklm-mcp-cli\profiles\default`
- **Recommended Variable**: `$env:PYTHONIOENCODING = "utf-8"` (prevents encoding crashes during success messages)

## 🩺 Troubleshooting
If `nlm` fails with "Authentication expired":
1. Check if the base Python path has changed (Update `pyvenv.cfg` in the uv tool's venv).
2. Run `nlm login` again.
