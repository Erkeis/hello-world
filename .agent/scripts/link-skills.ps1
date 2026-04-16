<#
.SYNOPSIS
    Gemini CLI 스킬을 Antigravity 환경으로 연결(Link)하는 스크립트입니다.

.PARAMETER SkillName
    연결할 스킬의 이름입니다. (예: notebooklm)

.PARAMETER Scope
    연결 범위입니다. 'Global', 'Local', 'Both' 중 하나를 선택합니다.

.PARAMETER ProjectPath
    로컬 프로젝트의 경로입니다. 기본값은 현재 디렉터리입니다.

.EXAMPLE
    .\link-skills.ps1 -SkillName notebooklm -Scope Local
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$SkillName,

    [Parameter(Mandatory=$false)]
    [ValidateSet("Global", "Local", "Both")]
    [string]$Scope = "Local",

    [Parameter(Mandatory=$false)]
    [string]$ProjectPath = "."
)

$ErrorActionPreference = "Stop"

# 1. 원본 스킬 경로 (gemini install로 설치된 곳)
$homeDir = [System.Environment]::GetFolderPath("UserProfile")
$sourceSkillPath = Join-Path $homeDir ".gemini\skills\$SkillName"

# 2. Antigravity Global Skills 경로 (시스템 전역)
$globalAntigravityRoot = Join-Path $homeDir ".gemini\antigravity\framework"
$globalSkillsPath = Join-Path $globalAntigravityRoot "skills\$SkillName"

# 3. 로컬 프로젝트 경로
$localSkillsPath = Join-Path $ProjectPath ".agent\skills\$SkillName"

function New-Junction {
    param($Path, $Target)
    if (Test-Path $Path) {
        Write-Host "이미 경로가 존재합니다: $Path" -ForegroundColor Yellow
        return
    }
    
    $parent = Split-Path $Path
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    Write-Host "Junction 생성 중: $Path -> $Target" -ForegroundColor Cyan
    New-Item -ItemType Junction -Path $Path -Value $Target | Out-Null
}

if (-not (Test-Path $sourceSkillPath)) {
    Write-Error "원본 스킬을 찾을 수 없습니다: $sourceSkillPath. 우선 'gemini skills install'을 진행해 주세요."
    exit 1
}

# 요청된 범위에 따라 실행
switch ($Scope) {
    "Global" {
        New-Junction -Path $globalSkillsPath -Target $sourceSkillPath
    }
    "Local" {
        New-Junction -Path $localSkillsPath -Target $sourceSkillPath
    }
    "Both" {
        New-Junction -Path $globalSkillsPath -Target $sourceSkillPath
        New-Junction -Path $localSkillsPath -Target $sourceSkillPath
    }
}

Write-Host "스킬($SkillName) 연결 작업이 완료되었습니다." -ForegroundColor Green
