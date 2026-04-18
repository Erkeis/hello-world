# Phase 3 Implementation Review Buffer (Intelligence & Autonomy)

This buffer stores pending decisions for the "Context-Aware Autonomy" phase.

## 🏗️ Architecture Review

### [ISSUE 1] 컨텍스트 포화 및 전달 효율성
- **결정:** **1B (Context Sniping / Smart Routing)**.
- **상세:** Hub가 작업 키워드(Role/Task)에 기반하여 `decision-log.md`에서 필요한 맥락만 추출하여 에이전트에게 주입. PO의 Context Capacity 관리 부하를 최소화함.

### [ISSUE 2] 'Proposal' 상태 및 승인 루프 (Human-in-the-loop)
- **결정:** **2A/2B Hybrid**.
- **상세:** 에이전트는 작업 전 `PROPOSING` 상태로 진입하여 제안서를 제출하고, 사용자가 대시보드에서 승인할 때까지 실행을 보류함.

### [ISSUE 3] Agile Context Reset (Session Hard-Reset)
- **결정:** **3B (Session Hard-Reset via Command)**.
- **상세:** 단순 파일 삭제가 아닌, 에이전트 CLI(Gemini, Claude 등)에 `/quit` 등의 종료 명령을 전송하여 세션을 종료한 후, 새로운 컨텍스트를 주입하여 재실행. 도구별 맞춤형 리셋 스크립트 적용.

## 💻 Code Quality Review

### [ISSUE 4] 컨텍스트 스나이핑(Extraction) 구현 패턴
- **결정:** **4A (Regex-based Metadata Tagging)**.
- **상세:** 의사결정 기록 시 `#tag` 사용. 오케스트레이터는 정규식으로 이를 추출.
- **룰 거버넌스:** 태그 관련 규칙을 `.agent` 하위 최상위 룰 및 글로벌 룰(`GEMINI.md`)에 중복 명시하여 에이전트의 준수율(Repetition & Proximity Effect)을 극대화함.

### [ISSUE 5] 승인 루프의 데이터 흐름
- **결정:** **5B (State Lock & Release)**.
- **상세:** `intent.json` 내 `status: "PENDING_APPROVAL"` 필드 사용. 사용자가 대시보드에서 승인 시 `"APPROVED"`로 업데이트하여 하네스 잠금 해제.

## 🧪 Test Review

### [ISSUE 6] 컨텍스트 추출 정확도 검증
- **결정:** **MANDATORY**. 
- **상세:** 다양한 마크다운 포맷이 섞인 로그에서 정규식 파싱이 완벽하게 작동하는지 확인하는 단위 테스트 및 엣지 케이스(태그 누락, 중복) 테스트 수행.

### [ISSUE 7] 승인 루프 상태 전이 테스트
- **결정:** **MANDATORY**. 
- **상세:** `PENDING_APPROVAL` 시 하네스의 '쓰기 잠금(Write Lock)' 기능과 승인 시 '즉시 해제' 로직을 시뮬레이션 테스트로 검증.

## ⚡ Performance Review

### [ISSUE 8] 로그 대량 파싱 및 메모리 부하 (P2, Confidence 9/10)
- **내용:** `decision-log.md`가 수천 줄로 커질 경우, 매번 전체 파일을 읽어 정규식을 돌리는 것은 비효율적임.
- **추천:** **8A (In-memory Context Cache)**. 오케스트레이터가 로그 파일의 변경 사항만 감시(Chokidar)하여 메모리 상의 '태그 맵'을 최신화하고, 에이전트 요청 시 메모리에서 즉시 반환.
