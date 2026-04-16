---
name: "ps-multiline-err"
description: "Parser errors when using multiline strings in run_shell_command."
---
# [Quick Action]
Use `write_file` to workspace then `Move-Item` to target:
```powershell
# Write to temp workspace first
# Move-Item -Path $temp -Destination $target -Force
```
*Avoid direct multiline strings in shell commands to prevent terminator errors.*
