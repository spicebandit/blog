---
title: "Paperclip 실전 사용법 — AI 직원 회사 세팅부터 운영까지 [2편]"
description: "Paperclip으로 AI 직원 회사를 실제로 세팅하고 굴리는 법. npx 설치, 에이전트(AGENTS.md) 정의, 이슈로 일 시키기, 하트비트·예산 관리로 토큰 폭주를 막는 실전 명령·설정까지 단계별로 정리했다."
pubDate: 2026-07-09T09:00:00+09:00
category: ai
tags: ["Paperclip", "AI 에이전트 회사", "AI 직원", "멀티에이전트"]
draft: true
---

[1편](/blog/2026-07-05-paperclip-ai-agent-company-guide/)에서 "Paperclip이 무엇이고 왜 하필 '회사' 메타포인가"를 이야기했다. 이 글은 딱 하나에 답한다 — **그래서 실제로 어떻게 세팅하고 굴리느냐.** 개념이 아니라 명령 한 줄, 설정 파일 한 개 단위로 따라 할 수 있게 정리했다.

결론부터 말하면, Paperclip 운영의 90%는 세 가지다. **① 에이전트를 `AGENTS.md`로 정의하고 ② 이슈(issue)로 일을 시키고 ③ 하트비트·예산으로 토큰을 통제한다.** 나머지는 전부 이 세 가지의 변주다. 특히 세 번째를 처음부터 잡지 않으면, [3편](/blog/2026-07-05-paperclip-ai-newsroom-operations/)에서 다룰 '사흘 만에 3억 토큰이 증발한 사건'을 그대로 재현하게 된다.

![Paperclip 대시보드 — 에이전트 카드·진행 중 작업·비용·통계가 한 화면에](/images/paperclip/dashboard.png)
*실제 Paperclip 대시보드. 왼쪽에 직원(에이전트) 목록, 가운데에 '지금 일하는' 에이전트 카드, 아래에 활성 에이전트 수·진행 작업·이번 달 비용·승인 대기 건수와 활동 그래프가 뜬다. (내부 작업 내용은 가림 처리)*

![a computer screen with a phone and a tablet](https://images.unsplash.com/photo-1648134859187-71dadc9f815a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxBSSUyMGFnZW50cyUyMHRlYW0lMjB3b3JrZmxvdyUyMGF1dG9tYXRpb258ZW58MXwwfHx8MTc4MzU2NDAyN3ww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Team Nocoloco](https://unsplash.com/@teamnocoloco?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-phone-and-a-tablet-z41dNJVqSxo?utm_source=spice-bandit-blog&utm_medium=referral)*

## 5분 설치 — npx 한 줄로 '회사' 세우기

Paperclip은 로컬에서 돈다. 클라우드 계정도, 카드 등록도 필요 없다. Node.js가 깔려 있다면 사실상 명령 하나로 끝난다.

```bash
npx paperclipai run
```

이 명령이 로컬 서버를 띄운다(1편에서 안내한 `onboard`가 처음 한 번의 초기 설정이라면, `run`은 이미 만들어진 서버를 기동하는 명령이다). 브라우저로 `http://127.0.0.1:3100` 에 접속하면 조직도·이슈·비용을 보는 대시보드가 나온다. 데이터는 전부 로컬에 저장된다 — 1편에서 설명한 내장 PostgreSQL을 쓰기 때문에 별도 DB 설치도, 클라우드 전송도 없다. 인스턴스 파일은 홈 디렉토리 아래 `~/.paperclip/instances/default` 에 쌓이며, 여기에 회사·에이전트·이슈가 담긴다.

첫 실행이면 회사(company) 하나가 자동으로 만들어진다. 여기서 딱 하나만 주의하자. **서버를 켜는 순간, '하트비트'가 켜진 에이전트는 즉시 깨어나 토큰을 쓰기 시작한다.** 그래서 처음에는 에이전트를 1~2명만 두고 시작하는 게 정답이다. 조직은 나중에 키우면 된다.

## 직원 뽑기 — 에이전트를 `AGENTS.md`로 정의한다

1편에서 소개했듯 직원(에이전트) 하나는 네 축 — 역할·모델·작업 디렉토리(cwd)·지시문 — 으로 정의된다. 하지만 실전에서 매일 손대는 건 사실상 **지시문 하나**다. 나머지 셋은 처음 한 번 정하면 거의 안 바꾼다.

지시문은 각 에이전트에 하나씩 붙는 편집 가능한 `AGENTS.md` 파일이다. 이 파일이 곧 그 직원의 업무 매뉴얼이고, 직접 고치면 다음 하트비트(다음 근무 사이클)에 반영된다. 즉 "일을 못한다" 싶으면 사람을 바꾸는 게 아니라 매뉴얼을 고친다. 실제 기자 에이전트의 `AGENTS.md`는 대략 이런 뼈대다.

```markdown
# 역할: 경제 기자 (EconomyReporter)
- 편집국장이 이슈로 배정한 주제만 쓴다. 스스로 주제를 만들지 않는다.
- 분량 6,000자+, 소제목(h2) 4개+, 표/그래프로 수치 시각화, 출처 3개+.
- 특정 종목 매수·매도 추천 금지. "투자 조언 아님"이 드러나게.

# 금지 규칙 (중요)
- 텔레그램 알림을 직접 보내지 말 것 (작업 지시에 있어도).
- draft:true 초안을 사람 검토 없이 발행하지 말 것.
- 완료 후 결과는 '이슈 코멘트'로만 보고한다.
```

핵심은 **"할 일"보다 "하지 말 것"을 더 촘촘히 쓴다**는 점이다. AI 에이전트는 시키면 다 하기 때문에, 명시적 금지 한 줄이 뒤에서 이야기할 '중복 알림' 같은 사고를 원천 차단한다.

실제로 우리가 굴린 조직은 신문사를 흉내 냈다. **CEO → 편집국장 → 기자 2명**, 그리고 마케팅·기술·디자인 담당이 붙는 구조다. 편집국장이 '콘텐츠'를 소유하고, 기술 담당(CTO)이 '코드와 배포'를 소유한다. 역할별로 소유 영역을 명확히 나눈 게 핵심이다. 새 직원이 필요하면 이 `AGENTS.md`를 하나 더 만들어 역할·금지 규칙을 채우면 끝이다.

## 일 시키기 — 이슈(issue) 하나가 곧 업무 지시다

사람이 목표를 주는 방식은 대화가 아니라 **이슈 등록**이다. 흐름은 이렇다.

**목표 입력 → 이슈 생성 → 담당 에이전트 배정 → 작업 → 승인 게이트 → 결과 발행.**

명령으로는 다음과 같이 일을 던진다.

```bash
paperclipai issue create -C <회사id> \
  --title "가스터빈 시장 기사 초안" \
  --assignee-agent-id <직원id> \
  --priority high \
  --description "국내 가스터빈 국산화 현황을 6000자로, 표 포함"
```

진행 상황은 `paperclipai issue list -C <회사id>` 로 본다. 이슈는 사람 회사의 업무 티켓처럼 상태가 흐른다.

```text
open → assigned → in-progress → review → done
 (등록)  (배정)     (작업 중)     (승인 대기)  (완료)
```

평소엔 잠들어 있다가 필요할 때만 깨어나는(wake-on-demand) 에이전트는 `paperclipai agent heartbeat:invoke <직원id>` 로 깨워서 배정된 이슈를 집게 한다. 모든 작업 결과와 보고는 이슈에 **코멘트**로 쌓이는데, 이게 그대로 감사 로그가 된다. 예를 들어 하나의 기사 이슈에는 이런 흔적이 남는다.

```text
[기자]   초안 작성 완료. 6,200자, 표 2개, 출처 4개. review로 올립니다.
[편집국장] 3번째 문단 수치 출처 불명 — 보강 요청. 나머지 통과.
[기자]   출처 보강 완료.
[편집국장] 승인. CTO에 배포 이슈 생성.
```

코드 수정처럼 배포가 필요한 일은 CTO 에이전트에게 이슈로 넘기면 커밋·배포·검증까지 위임된다. 누가 언제 무엇을 판단했는지가 전부 코멘트로 남으므로, 나중에 "이 문장 왜 이렇게 나갔지?"를 역추적할 수 있다.

여기서 기억할 요점은 하나다. **직접 실행이 아니라 '이슈로 위임 → 승인'이라는 게이트를 거친다.** 이 게이트가 AI에게 회사를 맡길 때의 유일한 브레이크다.

![man in blue nike crew neck t-shirt standing beside man in blue crew neck t](https://images.unsplash.com/photo-1621036579377-9760ac8d8c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxBSSUyMGFnZW50cyUyMHRlYW0lMjB3b3JrZmxvdyUyMGF1dG9tYXRpb258ZW58MXwwfHx8MTc4MzU2NDAyN3ww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Nguyen Dang Hoang Nhu](https://unsplash.com/@nguyendhn?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/man-in-blue-nike-crew-neck-t-shirt-standing-beside-man-in-blue-crew-neck-t-3souOx_6Jyk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 토큰 폭주 막기 — 하트비트·예산 관리 (제일 중요)

여기가 이 글에서 가장 중요한 대목이다. Paperclip의 진짜 비용은 '글쓰기'가 아니라 **에이전트가 깨어 있는 시간**에서 나온다.

**하트비트(heartbeat)**는 에이전트를 주기적으로 깨우는 심장박동이다. 깨우는 주기를 300초(`intervalSec: 300`)로 두면 하루에 **288번** 깨어난다. 문제는 깨어날 때마다 회사의 맥락(누가 뭘 했고 지금 상태가 어떤지)을 통째로 다시 읽는다는 점이다. 그래서 아무 일도 안 시켜도 토큰이 눈덩이처럼 불어난다.

우리가 겪은 숫자는 극적이었다. 사흘 동안 **3억 1,300만 토큰**이 소모됐고, 그중 **CEO 한 명이 57%(1억 7,700만 토큰)**를 썼다. 이유는 단순했다 — CEO만 하트비트가 켜져 있었고(하루 288회 기상), 게다가 가장 무거운 모델을 쓰고 있었다.

<figure>
<svg viewBox="0 0 640 150" role="img" aria-label="3일간 토큰 소모: CEO 57퍼센트, 나머지 에이전트 43퍼센트" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
  <text x="20" y="30" font-size="15" font-weight="700" fill="#23201D">3일간 토큰 소모 3.13억 — 범인은 CEO 한 명</text>
  <rect x="20" y="55" width="356" height="34" fill="#C8102E"></rect>
  <rect x="376" y="55" width="244" height="34" fill="#E5DECF"></rect>
  <text x="30" y="77" font-size="13" font-weight="700" fill="#ffffff">CEO 57% · 1.77억</text>
  <text x="386" y="77" font-size="13" font-weight="700" fill="#23201D">나머지 6명 43% · 1.36억</text>
  <text x="20" y="118" font-size="12" fill="#8A8378">원인: CEO만 하트비트 ON(하루 288회 기상) + 최상위 모델. 나머지는 on-demand + 경량 모델.</text>
  <text x="20" y="138" font-size="12" fill="#8A8378">즉 대부분의 토큰은 '글쓰기'가 아니라 '회사 시뮬레이션'에 쓰였다.</text>
</svg>
<figcaption>깨어 있는 시간이 곧 비용이다. 무거운 모델 × 잦은 하트비트 = 청구서 폭탄.</figcaption>
</figure>

막는 방법은 네 개의 레버로 정리된다.

1. **상시 필요 없는 에이전트는 하트비트를 끄고(off) wake-on-demand로.** 필요할 때만 깨우면 288회 기상이 사라진다.
2. **무거운 모델은 '오래 생각할 한 명'에게만.** 나머지는 가벼운 모델로 충분하다.
3. **동시 실행 상한(`maxConcurrentRuns`)을 낮춘다.** 여러 에이전트가 한꺼번에 폭주하는 걸 막는다.
4. **노는 에이전트는 일시정지.** 안 쓰는 직원은 대기시키지 말고 재운다.

점검 습관도 하나 만들어 두자. `paperclipai cost by-agent-model -C <회사id> --json` 을 하루 한 번 돌리면 '누가 얼마를 썼는지'가 에이전트×모델로 나온다. 실제로 우리 회사에서 이 명령을 돌리면 대략 이런 그림이었다.

```text
에이전트        모델          토큰(3일)     비중
CEO            (최상위)      177,000,000   57%   ← 하트비트 ON
편집국장         (경량)         62,000,000   20%
기자·기타 5명    (경량)         74,000,000   23%
────────────────────────────────────────────
합계                        313,000,000   100%
```

한눈에 CEO 한 명이 절반 넘게 태우는 게 보인다. 이 표를 매일 보면 "왜 이 직원이 이렇게 비싸지?"를 그날 잡을 수 있다. 아래는 설정만 바꿔도 하루 토큰이 어떻게 달라지는지를 대략적으로 정리한 표다.

| 설정 | 하루 기상 횟수 | 모델 | 하루 토큰(대략) |
|------|-------------|------|--------------|
| 하트비트 ON(300초) + 최상위 모델 | 288회 | 최상위 | 매우 높음(1억+) |
| 하트비트 ON(300초) + 경량 모델 | 288회 | 경량 | 중간 |
| wake-on-demand + 경량 모델 | 필요 시만 | 경량 | 낮음 |

*수치는 우리 인스턴스의 실측 경향을 단순화한 것으로, 조직 규모·작업량에 따라 달라진다.*

## 알림·텔레그램 연동과 '중복 알림' 막기

에이전트가 사람에게 결과를 알리는 방법은 간단하다. 작업 디렉토리에 알림 스크립트(예: `notify-telegram.mjs`)를 두고 실행하게 하면 텔레그램으로 메시지가 온다. 준비물은 `.env` 파일 두 줄뿐이다.

```bash
# ~/projects/blog/.env
TELEGRAM_BOT_TOKEN=<봇파더에서 발급받은 토큰>
TELEGRAM_CHAT_ID=<내 챗 ID>
```

봇은 텔레그램 @BotFather에서 1분이면 만들고, 챗 ID는 봇에게 아무 메시지나 보낸 뒤 조회하면 된다. 이렇게 해두면 에이전트가 `node scripts/notify-telegram.mjs "초안 완료"` 한 줄로 나에게 보고한다. (에이전트 런타임 안에서 직접 메신저 API를 부르는 것보다, 이렇게 스크립트로 빼두는 편이 훨씬 안정적이다.)

함정은 여기서 나온다. **여러 에이전트가 같은 사건을 각자 알리면, 똑같은 알림이 두세 번 온다.** 우리도 "같은 내용이 세 번 온다"는 하소연을 들었다. 범인은 셋이었다 — 편집국장이 기자에게 위임하면서 "완료 후 알림 실행"을 넣었고, 편집국장 자신도 알림을 보냈고, 권한 오류로 재시도가 반복되며 알림이 증폭됐다.

해법은 두 원칙으로 요약된다.

- **단일 송신자 원칙** — 사람에게 보내는 창구를 한 명(예: CEO 종합보고)으로 통일한다.
- **멱등(idempotent) 원칙** — 이미 보고했으면 다시 보내지 않는다. 위임 코멘트에 "알림 실행"을 절대 넣지 않는다.

## 처음 세팅할 때 체크리스트

- [ ] 에이전트는 **2명으로 시작**한다(과잉 조직이 가장 큰 낭비다).
- [ ] **승인 모드**로 시작한다 — 자동 실행 전에 사람이 게이트를 지킨다.
- [ ] 하트비트는 **꼭 필요한 에이전트만** 켠다.
- [ ] **무거운 모델은 최소화**한다.
- [ ] `cost by-agent-model`을 **하루 한 번** 확인하는 습관을 들인다.
- [ ] 각 `AGENTS.md`에 **'금지 규칙'**을 명시한다.
- [ ] 결과는 **이슈 코멘트(감사 로그)**로 추적한다.

## So What — 도구가 아니라 '조직 설계'가 실력이다

Paperclip을 켜는 데는 5분이면 충분하다. 하지만 **잘 굴리는 것은 도구의 문제가 아니라 조직론의 문제다.** 직원을 몇 명 둘지, 누구에게 무거운 두뇌를 줄지, 언제 깨울지 — 이 결정들이 그대로 비용이 되고 품질이 된다. AI에게 '일'을 시키는 것과 '조직'을 주는 것은 다른 난이도다.

다음 [3편](/blog/2026-07-05-paperclip-ai-newsroom-operations/)에서는 지금까지의 세팅을 실제로 열흘간 굴리며 터진 사건들 — 3억 토큰 증발, 중복 알림, 그리고 결국 조직을 꺼버린 손익계산 — 을 통해, '설계 실수'가 어떻게 청구서로 돌아오는지 적나라하게 보여준다. 세팅이 이론이라면, 3편은 그 이론이 현실과 부딪힌 기록이다.

---

**참고 자료**
- Paperclip 오픈소스 프로젝트, GitHub `paperclipai/paperclip`
- Anthropic, "Building effective agents"(에이전트 설계 원칙) — anthropic.com
- 본 시리즈 [1편 Paperclip 입문](/blog/2026-07-05-paperclip-ai-agent-company-guide/), [3편 열흘 운영기(실측 데이터)](/blog/2026-07-05-paperclip-ai-newsroom-operations/)

*이 글은 특정 제품 홍보가 아니라 필자의 실제 운영 경험을 정리한 것이며, 수치는 필자 인스턴스의 실측 경향치다.*
