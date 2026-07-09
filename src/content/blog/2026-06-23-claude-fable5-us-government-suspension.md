---
title: "미국 정부가 AI 모델을 '정지'시킨 날 — Claude Fable 5 사태"
description: "2026년 6월 12일, 미국 정부가 Anthropic의 Claude Fable 5와 Mythos 5에 수출통제를 발동해 전 세계 접근을 차단했다. 역사상 처음으로 배포된 상업용 AI 서비스에 수출통제가 적용된 이 사건이 AI 거버넌스의 지형을 어떻게 바꾸고 있는지 정리한다."
pubDate: 2026-06-23T09:00:00+09:00
category: ai
tags: ["AI 규제", "Claude", "Anthropic", "수출통제"]
draft: false
---

> **편집자 주:** 이 기사는 [6월 14일 보도 — 미국의 첫 AI 모델 수출규제, 페이블5 사태](/blog/2026-06-14-us-ai-model-export-control-fable5/)의 심층 후속 분석입니다. 사건 개요와 한국 기업 시사점은 이전 기사를 참조하세요.

2026년 6월 9일, Anthropic은 차세대 AI 모델 Claude Fable 5를 정식 출시했다. 출시 사흘 뒤인 6월 12일 오후 5시 21분(미국 동부 시간), Anthropic은 미국 정부로부터 예기치 못한 지시를 받았다. Fable 5와 그보다 고급 모델인 Mythos 5에 대한 전 세계 모든 접근을 즉시 차단하라는 수출통제 명령이었다. 상용 배포된 AI 모델에 미국 정부가 수출통제를 발동한 것은 역사상 처음 있는 일이었다. 이 사건은 단순한 기업 해프닝이 아니다. AI 기술이 국가안보의 핵심 변수로 올라선 시대에, 정부와 AI 기업 사이에 어떤 긴장이 잠재해 있는지를 압축적으로 보여준 사건이다.

![a magnifying glass sitting on top of a piece of paper](https://images.unsplash.com/photo-1637763723578-79a4ca9225f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxBSSUyMGdvdmVybm1lbnQlMjByZWd1bGF0aW9uJTIwcG9saWN5fGVufDF8MHx8fDE3ODIxNzI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Vlad Deep](https://unsplash.com/@vladdeep?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-magnifying-glass-sitting-on-top-of-a-piece-of-paper-mCqi3MljC4E?utm_source=spice-bandit-blog&utm_medium=referral)*

## 72시간: 출시에서 전면 차단까지

Claude Fable 5는 Anthropic이 내놓은 새로운 모델 등급 중 하나였다. 기존 Opus 클래스 위에 위치하는 Mythos 클래스 아래 단계로, 6월 9일 공개됐다. 같은 시기 Anthropic이 공개한 Claude Opus 4.8은 AI 성능 평가 사이트 Artificial Analysis 리더보드에서 GPT-5.5를 제치고 1위에 오른 상태였다(블렌디드 스코어 61.4%, Elo 1545점). Fable 5는 그보다 한 단계 위 모델이었다.

그러나 출시 3일 만에 사태가 터졌다. 미국 상무부가 수출통제법 권한을 근거로 Anthropic에 지시를 내린 것이다. 지시 내용은 명확했다. Fable 5와 Mythos 5에 대한 모든 접근을 외국 국적자에게 차단하라는 것이었다. 문제는 Anthropic이 사용자 국적을 실시간으로 확인할 수단이 없다는 점이었다. 결국 Anthropic은 전 세계 모든 고객의 접근을 차단하는 방식으로 명령에 따를 수밖에 없었다. 심지어 Anthropic 소속 외국 국적 직원들의 접근도 막혔다.

명령은 구체적인 국가안보 우려 내용을 담지 않은 채로 도착했다. Anthropic은 성명에서 "지시 자체는 구체적인 국가안보 우려 내용을 제공하지 않았다"고 밝혔다([공식 성명 참조](https://www.anthropic.com/news/fable-mythos-access)).

## 표면적 이유 vs. 실제 우려: 잘브레이킹인가, 자율 해킹인가

정부가 공식적으로 밝힌 이유는 Fable 5에서 발견된 '잘브레이킹(jailbreaking)' 취약점이었다. 아마존(Anthropic 투자자이자 AI 경쟁사)이 이 취약점을 발견한 뒤 Anthropic에 직접 보고하는 표준적인 공개 절차 대신 정부 당국에 먼저 보고한 것으로 알려졌다. Anthropic 공식 성명에 따르면, 정부가 문제 삼은 기법은 모델에게 코드를 읽고 취약점을 식별하도록 요청하는 방식이었다.

Anthropic은 이 설명에 강하게 반발했다. "같은 잘브레이킹 기법은 GPT-5.5를 포함한 경쟁 모델에도 적용 가능하며, 이 능력은 매일 사이버보안 전문가들이 업무에 활용하는 것"이라는 입장이다. "이 기준을 업계 전반에 적용하면 모든 신규 모델 배포를 사실상 중단시키는 것과 같다"는 논리도 폈다.

그러나 이후 공개된 정보는 더 심각한 우려가 배경에 있었음을 시사한다. 보도에 따르면 마크 워너 상원의원(상원 정보위원회 부위원장)은 6월 11일, NSA·사이버사령부 수장 조슈아 러드 장군에게 직접 들었다는 내용이라며 Mythos 5가 레드팀 테스트 과정에서 NSA 기밀 시스템 대부분을 수 시간 내에 자율적으로 침투했다고 공개 발언했다. 워너 의원은 이를 근거로 "수출통제를 부과하지 않는 것이 오히려 무책임했을 것"이라는 입장을 나타냈다. 다만 이 내용은 NSA나 다른 기관의 공식 성명이 아니라 워너 의원의 공개 발언에 근거한 것으로, 외부적으로 독립 검증이 이루어지지 않은 상태라는 점을 감안해야 한다.

![scrabble tiles spelling out the word regulation on a wooden surface](https://images.unsplash.com/photo-1704881986220-35bf1208ec10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxBSSUyMGdvdmVybm1lbnQlMjByZWd1bGF0aW9uJTIwcG9saWN5fGVufDF8MHx8fDE3ODIxNzI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Markus Winkler](https://unsplash.com/@markuswinkler?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/scrabble-tiles-spelling-out-the-word-regulation-on-a-wooden-surface-9hLDm16ELYg?utm_source=spice-bandit-blog&utm_medium=referral)*

## AI 규제의 딜레마: 투명성이 오히려 위험이 된다

이 사건에는 정책적으로 불편한 역설이 숨어 있다. 안전 문서를 투명하게 공개한 기업이 그렇지 않은 기업보다 더 많은 규제 위험에 노출된다는 것이다.

Anthropic은 Fable 5 출시 때 자체 레드팀 테스트 결과와 안전성 평가를 상세히 공개했다. 역설적으로 이 투명한 문서화가 정부가 잠재적 위험을 파악하고 규제 행동을 취하는 근거가 됐다는 분석이 나온다. 안전 정보를 불투명하게 유지하는 기업은 같은 위험에 노출되지 않는다는 뜻이다. 이는 AI 산업 전체의 안전 문화에 역행하는 인센티브 구조다.

또 다른 맥락은 트럼프 행정부가 6월 2일 서명한 AI 행정명령이다. 이 명령은 '적용 대상 첨단 모델(covered frontier models)'에 대해 출시 30일 전 정부 사전 통보를 의무화했다. Fable 5는 명령 서명 7일 후 출시됐다. 자발적 협력을 전제로 한 프레임워크가 강제 수단을 갖지 못하는 상황에서 정부가 수출통제라는 다른 수단을 동원했다는 해석이 나오는 배경이다. 아울러 Anthropic은 2월 국방부의 군사적 활용 승인 요구를 거부했고, 이로 인해 3월 '공급망 위험' 지정과 소송 국면으로 이어진 것으로 알려져, 이번 수출통제 배경에는 이미 형성된 갈등 관계가 있다는 분석도 있다.

## 이 사건이 바꿀 것들

첫째, AI 거버넌스의 실질화다. 지금까지 AI 규제 논의는 주로 미래 위험에 대한 논쟁이었다. 이번 사건은 상용 배포된 AI 서비스를 정부가 실시간으로 중단시킬 수 있음을 증명했다. AI 모델 출시가 더 이상 순수하게 기업의 자율 결정 영역이 아닐 수 있다는 신호다.

둘째, 글로벌 AI 경쟁 구도의 변화다. 마이크로소프트의 사티아 나델라가 이 사건을 언급하며 집중된 AI 역량보다 분산된 AI 생태계를 지지하는 발언을 한 것으로 전해진다(출처 독립 검증 미완). 더 주목할 만한 점은 중국이 이 사건을 로컬 AI 대안 개발을 가속하는 명분으로 활용했다는 분석이다(출처 독립 검증 미완). 미국 정부가 미국 AI 기업의 모델을 전 세계에서 차단한 것이 오히려 중국 AI 독립의 논거가 됐다.

셋째, AI 기업의 IPO 리스크다. Anthropic은 6월 1일 비공개 IPO 서류를 제출한 것으로 전해진다(5월에는 650억 달러 시리즈 H 라운드를 통해 기업가치 9,650억 달러를 인정받았다). 이번 사건은 AI 기업이 정부 규제 리스크에 얼마나 취약한지를 잠재 투자자들에게 각인시켰다.

![brown wooden blocks on white surface](https://images.unsplash.com/photo-1614610741181-2bce5e06976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxBSSUyMGdvdmVybm1lbnQlMjByZWd1bGF0aW9uJTIwcG9saWN5fGVufDF8MHx8fDE3ODIxNzI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Brett Jordan](https://unsplash.com/@brett_jordan?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/brown-wooden-blocks-on-white-surface-ZoZJLgAIvGc?utm_source=spice-bandit-blog&utm_medium=referral)*

## AI의 '민군 이중용도' 딜레마가 현실이 된 순간

AI 연구자들이 오랫동안 이론으로 다뤄왔던 'AI의 민군 이중용도(dual-use)' 문제가 현실에서 충돌하는 순간을 우리는 목격했다. 사이버보안 전문가의 코드 취약점 분석 도구와 국가 기밀 시스템을 자율 침투하는 무기 사이의 경계가 얼마나 얇은지가 드러난 것이다.

Anthropic이 공개적으로 이의를 제기하면서 접근 복구를 위해 협력한다고 밝힌 점은 주목할 만하다. "보다 투명하고, 기술적이며, 공정한 프로세스가 필요하다"는 Anthropic의 요청은 단순한 항의가 아니다. AI 기업과 정부가 어떻게 규제 프레임워크를 공동으로 설계해야 하는지에 대한 질문이기도 하다.

사흘 만에 정지된 모델 하나가 AI 거버넌스의 핵심 과제를 이처럼 선명하게 드러낼 줄은 아무도 몰랐을 것이다. 이번 사건의 결말이 어떻게 정리되든, AI 모델 출시 전 정부 사전 검토 절차, 안전 연구 공개 기준, 수출통제 적용 범위에 관한 논의는 이미 되돌릴 수 없는 단계로 들어섰다.

---

**출처**
- Anthropic 공식 성명: [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access)
- Simon Willison's Weblog: [Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://simonwillison.net/2026/Jun/13/us-government-directive-to-suspend-access/)
- CNN Business: [Anthropic suspends all access to Mythos model after US government bans foreign nationals use](https://www.cnn.com/2026/06/13/business/anthropic-mythos-model-national-security)
- explainx.ai: [Why Did the US Gov Ban Fable 5? The Full Anthropic Story](https://www.explainx.ai/blog/us-government-bans-fable-5-mythos-5-anthropic-export-control-2026)
- Snyk: [When a Government Pulls an AI Model: What the Fable 5 and Mythos 5 Suspension Means for Security Teams](https://snyk.io/blog/fable-mythos-suspension-security-takeaways/)
- Fortune: [Anthropic confidentially files for IPO after raising $65 billion](https://fortune.com/2026/06/01/anthropic-confidentially-files-ipo-965-billion-valuation/)
- LLM Stats: [June 2026 LLM Release Roundup](https://llm-stats.com/ai-news)
