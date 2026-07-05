---
title: "초보자를 위한 Supabase 사용법 — 요금제·주의점·회사 성장까지 [입문]"
description: "코딩 초보도 30분이면 백엔드를 만드는 Supabase 완벽 입문. 프로젝트 생성부터 인증·DB 사용법, 무료 요금제의 함정(1주 자동 정지), 그리고 밸류 10.5조 회사로 큰 성장 스토리까지."
pubDate: 2026-07-06T09:30:00+09:00
category: ai
tags: ["supabase", "백엔드", "데이터베이스", "노코드"]
---

앱이나 웹사이트를 만들 때 가장 막막한 부분이 '백엔드' — 데이터를 저장하고, 로그인을 처리하고, 파일을 올리는 서버 쪽이다. **Supabase(수파베이스)**는 이 백엔드를 코드 몇 줄로 대신 해주는 도구다. 데이터베이스·회원가입·파일저장·실시간 기능을 한 곳에서 클릭 몇 번으로 세팅할 수 있어서, 서버를 한 번도 만들어본 적 없는 초보도 30분이면 첫 데이터를 저장할 수 있다. 이 글은 Supabase가 뭔지, 초보가 어떻게 시작하는지, 요금제와 꼭 알아야 할 함정(특히 무료 플랜의 '자동 정지'), 그리고 2년 만에 기업가치가 5배로 뛴 이 회사의 성장 스토리까지 한 번에 정리한다.

## Supabase가 뭔데? — 5분 개념 정리

한 문장으로: **Supabase는 "오픈소스 파이어베이스(Firebase) 대안"**이다. 구글의 파이어베이스가 백엔드를 손쉽게 해주는 대표 서비스인데, Supabase는 그와 비슷한 편의성을 제공하면서 **표준 데이터베이스인 PostgreSQL(포스트그레스)** 위에 지었다는 게 핵심 차별점이다.

이게 왜 중요하냐면 — 파이어베이스는 구글만의 독자 방식이라 나중에 다른 데로 옮기기 어렵지만, Supabase는 전 세계 개발자가 30년간 써온 표준 SQL 데이터베이스라 **"갇히지 않는다"**. 나중에 서비스가 커져도 데이터를 그대로 들고 나갈 수 있다. 초보에겐 쉬운 도구이면서, 전문가에겐 진짜 데이터베이스인 셈이다.

이 "갇히지 않는다"는 약속이 왜 이렇게 강하게 먹혔는지는 역사를 보면 안다. 백엔드를 대신 해주는 서비스(BaaS)의 원조 격은 2011년 나온 Parse였다. 편리함으로 인기를 끌었지만 2013년 페이스북에 인수됐고, 2017년 초 서비스가 완전히 종료되면서 수많은 개발자가 자기 데이터를 부랴부랴 다른 곳으로 옮겨야 했다. 같은 2011년 등장해 2014년 구글에 인수된 Firebase 역시 편리한 대신 구글 생태계에 묶인다는 점은 그대로였다. 개발자들은 이 과정에서 "남의 독자 플랫폼에 데이터를 맡기면, 그 회사의 사정에 내 서비스의 운명이 걸린다"는 교훈을 얻었다. 2020년 등장한 Supabase가 굳이 새 방식을 발명하지 않고 표준 PostgreSQL 위에 편의 기능을 얹은 건 바로 이 학습의 산물이다. 표준 DB라면 서비스 제공자가 사라져도 데이터는 내 손에 남기 때문이다.

Supabase가 한 데 묶어 제공하는 것은 대략 다섯 가지다.

- **Database(데이터베이스)**: PostgreSQL. 표(테이블)에 데이터를 저장. 표 만들기·조회를 웹 화면에서 클릭으로 한다.
- **Auth(인증)**: 회원가입·로그인. 이메일, 구글·카카오 같은 소셜 로그인을 코드 몇 줄로.
- **Storage(스토리지)**: 이미지·파일 업로드/다운로드.
- **Realtime(실시간)**: 데이터가 바뀌면 화면에 즉시 반영(채팅·협업 앱에 유용).
- **Edge Functions / Vector**: 서버리스 함수, 그리고 AI 임베딩(벡터 검색)까지.

![프로그래밍 코드가 보이는 노트북](https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZyUyMGxhcHRvcHxlbnwxfDB8fHwxNzgzMjU4NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Arnold Francisca](https://unsplash.com/@clark_fransa?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-macbook-pro-wit-programming-codes-display-f77Bh3inUpE?utm_source=spice-bandit-blog&utm_medium=referral)*

## 초보자 시작하기 — 프로젝트 생성부터 첫 데이터까지

Supabase의 최대 장점은 시작이 정말 쉽다는 것이다. 신용카드 없이 무료로 바로 만들 수 있다. 순서는 이렇다.

1. **가입 & 프로젝트 생성**: supabase.com에서 깃허브(GitHub) 계정으로 가입 → "New Project" 클릭 → 프로젝트 이름과 DB 비밀번호를 정하면 몇 분 뒤 내 전용 데이터베이스가 생긴다.
2. **테이블 만들기**: 왼쪽 메뉴의 Table Editor에서 "New Table" → 엑셀 표를 만들듯 컬럼(열) 이름과 형식을 정한다. 예를 들어 여행 후기 앱이면 `title`, `content`, `created_at` 컬럼을 만드는 식이다. SQL을 몰라도 클릭으로 된다.
3. **API 키 챙기기**: 프로젝트 설정의 API Keys에서 `URL`과 `anon key`를 복사한다. 이 두 개가 내 앱과 Supabase를 연결하는 열쇠다.
4. **클라이언트 라이브러리 연결**: 내 앱 코드에서 Supabase 라이브러리를 불러와 위 키를 넣으면 끝. 자바스크립트 기준으로는 정말 몇 줄이다.

```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('내-프로젝트-URL', '내-anon-key')

// 데이터 저장
await supabase.from('reviews').insert({ title: '제주 3박4일', content: '...' })

// 데이터 조회
const { data } = await supabase.from('reviews').select('*')
```

이게 전부다. 서버를 직접 세우거나 SQL 쿼리를 손으로 짜지 않아도, 위 몇 줄로 데이터가 저장되고 읽힌다. 지원 범위도 넓어서 **React·Next.js·Vue·SvelteKit 같은 웹 프레임워크는 물론 Flutter·React Native·Swift(iOS)·Kotlin(안드로이드)** 등 모바일까지 공식 퀵스타트가 준비돼 있다. 최근에는 커서(Cursor)·클로드 같은 AI 코딩 도구가 Supabase 연동 코드를 자동으로 짜주기 때문에, "AI에게 시켜서 백엔드를 붙이는" 흐름의 사실상 표준이 됐다.

## 핵심 기능 자세히 — 인증·실시간·AI까지

초보가 가장 자주 쓰는 건 앞의 Database지만, Supabase가 사랑받는 진짜 이유는 **귀찮은 걸 대신 해준다**는 데 있다.

- **Auth(인증)**: 로그인 기능을 직접 만들면 보안 처리가 까다롭고 위험하다. Supabase는 이메일 인증, 비밀번호 재설정, 구글·카카오·애플 소셜 로그인을 내장 기능으로 제공한다. 게다가 **RLS(Row Level Security)**라는 강력한 권한 장치가 있어서 "이 데이터는 작성한 본인만 볼 수 있다" 같은 규칙을 DB 차원에서 강제할 수 있다.
- **Realtime(실시간)**: 데이터가 바뀌는 순간 다른 사용자 화면에도 즉시 반영된다. 채팅, 실시간 예약 현황, 협업 문서 같은 데 쓴다.
- **Storage(스토리지)**: 프로필 사진·첨부파일을 올리고 내려받는 기능. 대용량 파일도 처리한다.
- **Vector(벡터/AI)**: PostgreSQL의 `pgvector` 확장으로 AI 임베딩을 저장하고 유사도 검색을 할 수 있다. 챗봇의 "내 문서 기반 답변(RAG)" 같은 AI 기능을 별도 벡터DB 없이 여기서 구현한다.

## 요금제 총정리 — 무료로 어디까지 되나

Supabase는 무료로 시작해서 필요할 때만 올리는 구조다. 2026년 기준 요금제를 정리하면 다음과 같다.

| 플랜 | 월 요금 | DB 용량 | 월 활성사용자(MAU) | 파일 스토리지 | 특징 |
|------|--------|---------|-------------------|--------------|------|
| **Free** | $0 | 500 MB | 5만 명 | 1 GB | 프로젝트 2개, 백업 없음, **1주 미사용 시 자동 정지** |
| **Pro** | $25~ | 8 GB (+$0.125/GB) | 10만 명 (+$0.00325/명) | 100 GB | 자동 정지 없음, 일일 백업, 종량제 |
| **Team** | $599 | Pro와 동일 구조 | 〃 | 〃 | SOC2·ISO 인증, 14일 백업, 우선 지원 |
| **Enterprise** | 맞춤 | 맞춤 | 맞춤 | 맞춤 | HIPAA, 전용 지원, BYO 클라우드 |

*출처: [Supabase 공식 요금제 페이지](https://supabase.com/pricing) (2026년 기준)*

핵심은 이렇다. **개인 프로젝트·학습·MVP는 무료로 충분**하다. 실제 사용자를 받는 서비스로 키우면 Pro($25)로 올리는데, Pro는 기본 한도를 넘으면 종량제로 추가 과금된다. 다행히 **Pro는 기본적으로 지출 상한(Spend Cap)이 켜져 있어** 예상 밖 폭탄 청구를 막아준다 — 상한을 넘으면 추가 리소스를 막을 뿐 요금이 무한정 오르지 않는다.

![데이터센터 서버랙](https://images.pexels.com/photos/37730211/pexels-photo-37730211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/close-up-of-a-blue-server-rack-in-datacenter-37730211/)*

## 이용 특이사항 — 무료 플랜의 '자동 정지' 함정 (꼭 읽기)

무료로 쓰는 사람이 반드시 알아야 할 것이 하나 있다. **무료 플랜 프로젝트는 1주일간 아무 접속이 없으면 자동으로 '일시정지(pause)'된다.** 정지되면 데이터베이스가 얼어붙어 읽기·쓰기가 막히고, 사이트에 접속하면 그제서야 다시 깨어난다. 개인 사이트를 띄워놨는데 "가끔 사이트가 안 열리다가 내가 접속하면 살아나는" 현상이 바로 이것이다. 고장이 아니라 무료 플랜의 정상 동작이다.

여기서 가장 중요한 오해를 짚자. **일시정지는 삭제가 아니다.** 정지 상태에서도 데이터는 그대로 보관되고, 복원(다시 접속)하면 100% 돌아온다. 다만 조건이 있다.

- **정지 후 90일**까지는 대시보드에서 클릭 한 번으로 복원된다.
- **90일을 넘기면** 대시보드 복원이 막힌다. 이때도 백업 파일을 다운로드해 새 프로젝트로 옮기는 우회로는 있지만 번거롭다.
- 무료 플랜은 **자동 백업이 없다**는 점도 기억하자. 중요한 데이터라면 가끔 수동으로 내보내(export) 두는 게 안전하다.

그래서 실제 운영하는 사이트를 무료로 둔다면 두 가지 대응이 있다. **① Pro($25)로 올리면 정지 자체가 사라진다.** 아니면 **② 무료를 유지하되, 주 1회 자동으로 DB를 한 번 건드리는 '깨우기 핑'을 걸어** 정지를 예방하는 방법도 흔히 쓴다(간단한 예약 작업으로 구현). 방문자가 실제로 있는 서비스라면 매번 정지됐다 깨는 건 UX에 나쁘니, Pro 승격이나 깨우기 자동화 중 하나는 해두는 편이 좋다.

## 회사 이야기 — 2년 만에 기업가치 5배, 'AI 코딩'이 밀어올린 성장

도구를 넘어 회사로서의 Supabase도 흥미롭다. 2020년 폴 코플스톤(Paul Copplestone, CEO)과 앤트 윌슨(Ant Wilson, CTO)이 창업한 이 스타트업은 유명 액셀러레이터 Y컴비네이터(2020년 여름 배치) 출신이다. 창업 초기 사이트 소개 문구를 "실시간 포스트그레스"에서 **"오픈소스 파이어베이스 대안"**으로 바꾸자 사흘 만에 호스팅 DB가 8개에서 800개로 폭증했다는 일화가 유명한데, 이 한 줄의 포지셔닝이 회사를 띄운 결정적 계기였다. 애매한 기술 설명 대신 "누구나 아는 서비스(파이어베이스)의, 갇히지 않는 버전"이라는 메시지가 개발자의 가려운 곳을 정확히 긁은 것이다.

주목할 건 최근 2년의 폭발적 성장이다. 투자 유치 흐름만 봐도 속도가 남다르다.

| 시점 | 라운드 | 조달액 | 기업가치 | 주도 |
|------|--------|--------|----------|------|
| 2025.04 | Series D | 2억 달러 | **20억 달러** | Accel |
| 2025.10 | Series E | 1억 달러 | **50억 달러** | Accel·Peak XV |
| 2026.06 | Series F | 5억 달러 | **105억 달러** | GIC |

*출처: [Fortune](https://fortune.com/2025/04/22/exclusive-supabase-raises-200-million-series-d-at-2-billion-valuation/), [TechCrunch](https://techcrunch.com/2025/10/03/supabase-nabs-5b-valuation-four-months-after-hitting-2b/), [CNBC](https://www.cnbc.com/2026/06/04/database-startup-supabase-raises-500-million-10point5-billion-valuation.html)*

1년 2개월 만에 기업가치가 **20억 → 105억 달러로 5배** 넘게 뛰었다. 누적 투자액은 10억 달러를 넘어섰고, 개발자 이용자는 1,000만 명에 육박한다(직전 라운드 8개월 만에 두 배). 이들이 만든 데이터베이스 생성량은 1년 새 600% 늘었다.

이 성장의 뒤에는 명확한 배경이 있다. **AI 코딩(이른바 '바이브 코딩', vibe coding) 붐**이다. 커서·클로드·롤러블 같은 AI 도구로 비개발자까지 앱을 뚝딱 만드는 시대가 되면서, "그 앱들이 데이터를 저장할 백엔드"가 폭발적으로 필요해졌다. Supabase는 AI가 코드를 짜 붙이기 가장 쉬운 백엔드로 자리 잡으며 그 수요를 정통으로 받아냈다. 도구의 성장과 시대의 흐름이 정확히 맞물린 사례다.

## So What — 초보에게 왜 최고의 출발점인가

정리하면 Supabase의 매력은 **"쉽게 시작하지만 갇히지 않는다"**는 한 문장에 있다. 클릭으로 백엔드를 만들 만큼 초보 친화적이면서, 그 밑바탕이 표준 PostgreSQL이라 서비스가 커져도 그대로 확장·이전할 수 있다. 무료로 배우고 검증한 뒤, 사용자가 붙으면 Pro로 올리는 자연스러운 성장 경로가 있다.

다만 무료로 실서비스를 돌린다면 이 글의 '자동 정지' 함정만은 꼭 기억하자 — 데이터가 삭제되는 건 아니지만, 90일 방치와 백업 부재는 실제 리스크다. 배움과 프로토타입엔 무료로 충분하고, 진짜 사용자를 받기 시작하는 순간이 Pro 승격(또는 깨우기 자동화)을 고민할 시점이다. 그리고 회사 자체가 2년 만에 기업가치 5배로 큰 만큼, 당분간 이 생태계에 투자와 기능이 계속 쏟아질 가능성이 높다는 점도 초보가 이 도구에 시간을 들일 이유가 된다.

---

**출처**
- [Supabase 공식 요금제](https://supabase.com/pricing) (Free/Pro/Team/Enterprise 요금·한도, 무료 정지 정책)
- [Supabase 공식 시작 가이드](https://supabase.com/docs/guides/getting-started) (기능·지원 프레임워크)
- [Supabase Docs — 90일 정지 후 복원](https://supabase.com/docs/guides/troubleshooting/restore-project-after-90-days-pause) (정지·복원·데이터 보존 정책)
- [Fortune (2025)](https://fortune.com/2025/04/22/exclusive-supabase-raises-200-million-series-d-at-2-billion-valuation/) · [TechCrunch (2025)](https://techcrunch.com/2025/10/03/supabase-nabs-5b-valuation-four-months-after-hitting-2b/) · [CNBC (2026)](https://www.cnbc.com/2026/06/04/database-startup-supabase-raises-500-million-10point5-billion-valuation.html) (투자·성장)
