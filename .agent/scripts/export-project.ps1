# [#] /exprj: Archiving workspace while preserving core infrastructure and knowledge assets (2026-04-15)

param (
    [string]$TargetDir = (Get-Location).Path,
    [string]$ExcludePatterns = ".agent,.gemini,.git,docs\knowledge-assets"
)

$currentDir = Get-Item $TargetDir
$parentDir = $currentDir.Parent.FullName
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$exportName = "${timestamp}_temp"
$destination = Join-Path $parentDir $exportName

# Convert relative exclude paths to absolute paths
$excludePaths = $ExcludePatterns.Split(",") | ForEach-Object { 
    $p = $_.Trim(); 
    if ([System.IO.Path]::IsPathRooted($p)) { $p } else { Join-Path $TargetDir $p } 
}

Write-Host "Creating export directory: $destination"
if (-not (Test-Path $destination)) {
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
}

function Move-WithExclusion($Source, $Dest, $Excludes) {
    Get-ChildItem -Path $Source | ForEach-Object {
        $item = $_
        $skip = $false
        foreach ($ex in $Excludes) {
            if ($item.FullName -eq $ex) { $skip = $true; break }
            if ($ex.StartsWith($item.FullName + "\")) {
                # Sub-item is excluded. Create folder in dest and move other children.
                $newDest = Join-Path $Dest $item.Name
                if (-not (Test-Path $newDest)) { New-Item -ItemType Directory -Path $newDest -Force | Out-Null }
                Move-WithExclusion $item.FullName $newDest $Excludes
                $skip = $true; break
            }
        }
        if (-not $skip) {
            $relPath = $item.FullName.Replace($TargetDir, "")
            Write-Host " -> Moving: $relPath"
            Move-Item -Path $item.FullName -Destination $Dest -Force
        }
    }
}

Move-WithExclusion $TargetDir $destination $excludePaths

Write-Host "Export completed successfully."
