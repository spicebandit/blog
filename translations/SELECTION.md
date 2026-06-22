# BAS-12 영어 파일럿 — 선별 글 목록 및 번역 현황

> 작성일: 2026-06-22 | 담당: EditorInChief (BAS-12)
> CTO 핸드오프용: BAS-8 i18n 구축 이슈에 이 폴더 내 번역본을 연동해주세요.

---

## 번역 파일 위치

```
~/projects/blog/translations/en/
```

모든 파일은 `draft: true`로 마킹되어 있습니다 — 사람 감수 후 발행 전환 필요.

---

## 선별 기준

- **AI·에너지 카테고리 우선**, 일부 경제(에이전틱 AI) 포함
- **상시성(evergreen)**: 특정 날짜·이슈에 종속되지 않고 반년~1년 이상 유효한 글
- **글로벌 관심도**: 국내 한정(한국 규제·정책·시세) 내용 위주인 글 제외
- **draft 제외**: `draft: true` 상태 원문은 선택에서 제외

---

## 선별 목록 (7편)

| # | 원문 슬러그 | 카테고리 | 영어 번역 파일 | 선정 사유 |
|---|------------|----------|----------------|-----------|
| 1 | `agentic-ai-delegation-era` | economy | `agentic-ai-era-of-delegation.md` | 에이전틱 AI를 '위임'이라는 프레임으로 설명하는 3부작 시리즈 #1. 개념 정립형, 글로벌 독자에게 차별화된 앵글 |
| 2 | `agentic-ai-market-delegation` | economy | `how-agentic-ai-reshapes-markets.md` | 시리즈 #2. 에이전트가 시장 경쟁 규칙을 어떻게 바꾸는지 구체 사례(Qwen)와 함께 설명. 글로벌 비즈니스 독자 대상 |
| 3 | `agentic-ai-organization-delegation` | economy | `agentic-ai-organizational-transformation.md` | 시리즈 #3. 조직·리더십 변화. 운영위임률 개념 포함, 경영 실무 독자 대상 |
| 4 | `ai-agent-harness-engineering` | ai | `ai-agent-harness-engineering.md` | "88% of AI agent projects fail before production" — 하네스 엔지니어링 개념 설명. 개발자·기술 실무자 대상 evergreen |
| 5 | `2026-06-13-how-ai-agents-work` | ai | `how-ai-agents-work-human-steering.md` | AI 에이전트 작동 원리를 비전문가에게 쉽게 설명. 검색 수요 높은 키워드(how AI agents work) 직접 공략 |
| 6 | `2026-06-18-nuclear-power-role-and-debate` | energy | `nuclear-power-2026-renaissance-debate.md` | 원전 르네상스·SMR·안전·폐기물 논쟁을 균형 있게 정리. AI 데이터센터 전력 수요 연결, 글로벌 독자 관심도 매우 높음 |
| 7 | `2026-06-14-us-ai-model-export-control-fable5` | economy | `us-ai-export-control-frontier-models.md` | 미국 AI 모델 수출규제 첫 사례. 글로벌 AI 공급망 리스크 주제로 영어권 독자에게 임팩트 높음. 국내 한정 내용(한국 섹션)을 글로벌 관점으로 재구성 |

---

## 제외된 글 (선정 이유)

| 원문 슬러그 | 제외 이유 |
|------------|-----------|
| `oil-gas-price-outlook-iran-war-end` | 미-이란 전쟁 종료라는 특정 시점 이슈에 종속 (evergreen X) |
| `2026-06-22-energy-storage-ess-basics` | 후반부가 국내 ESS 입찰(전남 8곳 563MW) 특화 → 글로벌 독자 관심 낮음 |
| `korea-lmp-regional-electricity-pricing-2026` | 국내 LMP 제도 특화 |
| `2026-06-21-korea-power-generation-merger` | 한국전력 발전 자회사 통합 이슈, 국내 한정 |
| `boj-rate-hike-2026-outlook` | 일본은행 금리 인상 시의성 이슈 |
| `2026-06-15-korea-us-interest-rate-gap-outlook` | 한·미 금리차 국내 관점 특화 |
| `2026-06-22-won-dollar-exchange-rate-1500-impact` | 원/달러 환율 국내 한정 |
| `2026-06-21-byd-self-driving-accident-compensation` | 글로벌 관심도는 있으나 후반부가 현대차·한국 시장 특화 → 추가 번역 후보 |
| `2026-06-22-agentic-ai-enterprise-productivity-2026` | `draft: true` 원문 제외 |
| `2026-06-21-working-with-ai-assistant` | `draft: true` 원문 제외 |
| `claude-code-stock-agent-*` (시리즈) | KIS API 등 한국 증권사 API 특화 |

---

## 번역 품질 노트

- 기계번역이 아닌 자연스러운 영어로 직접 작성 (직역 금지 원칙 준수)
- 제목·description은 영어 SEO 키워드 기준으로 재작성 (원문 직역 아님)
- 한국 특화 섹션(예: Fable5 글의 "한국에는 무엇을 의미하나")은 글로벌 시각으로 재구성
- 모든 이미지 URL·출처 표기는 원문 그대로 유지
- **사람 감수 필수**: 번역 초안 수준. 발행 전 반드시 네이티브 수준 감수 또는 검토 필요

---

## CTO를 위한 기술 메모 (BAS-8 i18n)

현재 번역 파일들은 `translations/en/` 스테이징 폴더에 있습니다.

i18n 구조 확정 후 적용 시 고려 사항:
1. **slug 설계**: 영어 슬러그가 `/blog/en/<slug>/`인지 `/en/blog/<slug>/` 구조인지 결정 필요
2. **frontmatter 필드**: 번역본에 `lang: en`, `sourceSlug: <원문슬러그>` 필드를 추가해두었습니다 — i18n 라우팅에서 원문 ↔ 번역 연결에 활용 가능
3. **카테고리**: 원문과 동일 (`energy`/`economy`/`ai`) — 영어 블로그에서도 같은 카테고리 사용 가능
4. **3부작 내부 링크**: 번역본 내 `[Part 2](/blog/en/how-agentic-ai-reshapes-markets/)` 형태로 연결되어 있습니다 — URL 구조 확정 후 경로 업데이트 필요

---

*EditorInChief / BAS-12 / 2026-06-22*
