#!/bin/bash
# Agent Farm 초기 환경 구축 스크립트 (Ubuntu 24.04 LTS용)

echo "🚀 Agent Farm 환경 구축을 시작합니다..."

# 1. 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 2. 필수 도구 설치 (Docker, Git, Node.js)
sudo apt install -y docker.io docker-compose git nodejs npm

# 3. Docker 권한 설정 (현재 사용자가 sudo 없이 실행 가능하도록)
sudo usermod -aG docker $USER

# 4. Agent Farm 디렉토리 구조 생성
mkdir -p ~/agent-farm/shared-context  # 에이전트들이 공유할 intent.json 위치
mkdir -p ~/agent-farm/agents          # 개별 에이전트 작업 공간

# 5. 첫 번째 '3-container' 테스트용 docker-compose.yml 생성
cat << 'DOCKER' > ~/agent-farm/docker-compose.yml
version: '3.8'
services:
  agent-1:
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
    command: tail -f /dev/null
  agent-2:
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
    command: tail -f /dev/null
  agent-3:
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
    command: tail -f /dev/null
DOCKER

echo "✅ 설정 완료! 설정 적용을 위해 'exit' 후 다시 SSH로 접속해 주세요."
echo "📍 공유 컨텍스트 위치: ~/agent-farm/shared-context"
echo "📍 실행 방법: cd ~/agent-farm && docker-compose up -d"
