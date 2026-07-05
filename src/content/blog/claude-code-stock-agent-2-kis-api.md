---
title: "KIS API(한국투자증권 Open API) Python 연결 가이드 — 실전 함정과 해결법 [2편]"
description: "한국투자증권 KIS Open API를 Python으로 연결하는 실전 가이드. 토큰 1분 제한·모의투자 서버·SSL 에러 등 실제 부딪힌 함정과 해결법을 Claude Code 주식봇 개발 경험에서 공개합니다."
pubDate: 2026-06-20T09:00:00+09:00
category: "ai"
tags: ["ClaudeCode", "KIS API", "한국투자증권", "주식자동매매", "Python"]
---

> 📚 **연재 — 클로드코드로 주식투자 에이전트 만들기**
> [① 목적과 설계](/blog/claude-code-stock-agent-1-design/) · **② 한투 API 연결** · [③ 분석가 두뇌](/blog/claude-code-stock-agent-3-analysts/) · [④ 매매와 안전장치](/blog/claude-code-stock-agent-4-trade-safety/) · [⑤ 운영 자동화](/blog/claude-code-stock-agent-5-operations/)

## 토대부터

분석가가 아무리 똑똑해도 먹일 데이터가 없으면 소용없다. 그래서 가장 먼저 한국투자증권(KIS) Open API 연결부터 만들었다. 시세, 잔고, 일봉, 그리고 나중엔 주문까지 — 봇이 시장과 대화하는 모든 통로가 여기를 지난다.

구조는 봇 본체(`stockbot`)와 분리해 `kis-core`라는 공용 모듈로 뒀다. 인증·통신을 한곳에 모아두면 나중에 다른 프로그램에서도 재사용할 수 있기 때문이다.

```
~/projects/kis-core/
   ├── config.py          # 모의/실전 도메인·TR_ID 분기
   ├── token_manager.py   # 토큰 발급·캐싱
   ├── client.py          # 시세·잔고·일봉·주문
   └── .env               # 앱키 (git 제외)
```

## 시작 전 준비 — 키 발급과 설치 (how-to)

따라 만들려면 먼저 열쇠 두 개가 필요하다. **증권사 API 키**와 **LLM API 키**다. 내가 한 순서 그대로 정리하면 이렇다.

**1) 한국투자증권 Open API 신청**
- KIS 개발자 포털(KIS Developers)에서 Open API 사용을 신청하고 **앱키(App Key)·앱시크릿(App Secret)**을 발급받는다.
- 처음부터 실계좌로 가면 위험하니 **모의투자 계좌를 함께 신청**한다. 이 시리즈의 모든 검증은 모의투자(가상자금 1억)로 했다.

**2) Gemini API 키 발급**
- 분석가 3명의 두뇌로 쓸 LLM 키다. Google AI Studio에서 발급받는다. (모델 선택·비용은 [3편](/blog/claude-code-stock-agent-3-analysts/)에서 자세히)

**3) 파이썬 환경과 패키지**
- 파이썬 3.x에 HTTP 통신용 `requests`면 일단 시작할 수 있다. macOS는 뒤에 나올 SSL 문제 때문에 `certifi`도 챙긴다.
```bash
pip install requests certifi
```

**4) 키는 코드가 아니라 `.env`에 분리**
발급받은 키는 소스에 박지 말고 `.env`에 넣어 git에서 제외한다(`.gitignore`에 `.env` 추가).
```
KIS_APP_KEY=발급받은_앱키
KIS_APP_SECRET=발급받은_앱시크릿
KIS_ACCOUNT=50193178-01     # 모의투자 계좌번호
KIS_ENV=vps                 # vps=모의, prod=실전
GEMINI_API_KEY=발급받은_제미나이_키
```
이렇게 분리해두면 실수로 키를 공개 저장소에 올리는 사고를 막는다. 준비가 끝났으니, 이제 실제로 부딪힌 함정들을 보자.

![a computer screen with a bunch of code on it](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGFwaSUyMGNvZGV8ZW58MXwwfHx8MTc4MTg1MTMzOHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Chris Ried](https://unsplash.com/@cdr6934?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 첫 번째 함정 — 토큰 1분 제한

KIS API는 OAuth 토큰으로 인증한다. 그런데 발급에 제약이 있다. **토큰 재발급은 1분에 한 번만** 가능하다. 처음엔 이걸 모르고 테스트하느라 연달아 호출했더니 이런 에러가 떴다.

```json
{"error_code":"EGW00133","error_description":"접근토큰 발급 잠시 후 다시 시도하세요(1분당 1회)"}
```

해결책은 토큰을 한 번 발급받으면 파일에 캐싱해서 재사용하는 것이다. 토큰은 24시간 유효하므로, 매 호출마다 발급하지 않고 만료 직전에만 갱신하면 된다. 게다가 여러 프로세스가 동시에 발급을 시도하면 충돌하므로, 파일 락(file lock)으로 한 번에 하나만 발급하게 막았다.

```python
def get_token():
    tok = _cached_valid()      # 유효한 캐시가 있으면 재사용
    if tok:
        return tok
    with open(LOCK_FILE, "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)   # 동시 발급 방지
        tok = _cached_valid()  # 락 잡은 사이 다른 프로세스가 갱신했을 수도
        if tok:
            return tok
        # 실제 발급 + 캐시 저장
```

나중엔 1분 제한에 걸렸을 때 봇이 죽지 않고 62초 기다렸다가 자동으로 재시도하는 로직까지 더했다. 무인으로 돌릴 거라면 이런 자가 복구가 필수다.

## 두 번째 함정 — 모의투자 서버의 변덕

KIS는 실전 계좌와 모의투자 계좌의 도메인·포트가 다르다. 모의는 `openapivts.koreainvestment.com:29443`, 실전은 `:9443`이다. 주문 TR_ID도 모의는 앞에 `V`가 붙는다(예: 매수 `VTTC0802U`). 그래서 설정 한 줄로 둘을 전환할 수 있게 만들었다.

문제는 모의투자 서버가 **간헐적으로 500 에러를 뱉는다**는 것이었다. 일봉 조회에서 처음 발견했는데, 같은 요청인데 어떤 때는 되고 어떤 때는 안 됐다. 데이터 기간이 길수록 더 자주 실패했다.

이건 임시방편으로 넘길 문제가 아니라 구조적으로 막아야 했다. 그래서 조회 함수에 **재시도 + 기간 자동 축소** 로직을 넣었다.

```python
def inquire_daily(symbol, days=90, retries=3):
    for d in [days, 70, 50, 30]:        # 기간을 단계적으로 줄여가며
        for attempt in range(retries):   # 각 기간마다 재시도
            try:
                res = requests.get(...)
                if res.status_code == 500:
                    time.sleep(0.8); continue   # 일시 오류 → 재시도
                ...
                return data
            except RequestException:
                time.sleep(0.8)
    raise RuntimeError("기간 축소·재시도 모두 실패")
```

서버가 가끔 토라져도 봇이 알아서 버티고, 최악의 경우에도 30일치는 확보한다. 나중에 이 재시도 로직을 잔고조회·현재가 조회에도 공통으로 적용했다.

## 세 번째 함정 — SSL 인증서

맥에서 첫 외부 호출을 했더니 이런 에러가 났다.

```
[SSL: CERTIFICATE_VERIFY_FAILED] unable to get local issuer certificate
```

이건 코드 버그가 아니라 macOS 파이썬이 SSL 인증서 묶음을 못 찾아서 생기는 아주 흔한 문제다. 파이썬에 같이 설치된 인증서 설치 스크립트를 실행하면 해결된다.

```bash
/Applications/Python*/Install\ Certificates.command
# 또는
python3 -m pip install --upgrade certifi
```

![lines of HTML codes](https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxwcm9ncmFtbWluZyUyMGFwaSUyMGNvZGV8ZW58MXwwfHx8MTc4MTg1MTMzOHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Florian Olivo](https://unsplash.com/@florianolv?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/lines-of-html-codes-4hbJ-eymZ1o?utm_source=spice-bandit-blog&utm_medium=referral)*

## 첫 성공 — 잔고 조회

함정들을 하나씩 넘고 나서 드디어 잔고 조회가 됐다.

```
[모의투자(vps)] 계좌 50193178-01
----------------------------------------
예수금:     99,985,092원
평가금액:   99,985,092원
총손익:             +0원
----------------------------------------
보유 종목 없음
```

모의투자 신청 금액 1억이 예수금에 찍혔다. 토큰 발급 → 잔고 조회까지 전 과정이 처음으로 끝까지 돌아간 순간이었다. 별것 아닌 숫자 같지만, 봇이 실제 계좌와 통신하는 토대가 섰다는 뜻이라 꽤 든든했다.

여기에 현재가·밸류에이션(PER·PBR·EPS) 조회와 일봉 조회까지 붙이니, 분석가들이 먹을 데이터가 다 준비됐다. 실제 데이터를 처음 받아봤을 때 예상과 다른 형식(예: EPS가 `'6564.00'` 같은 소수점 문자열)에 또 한 번 막혔지만, 이런 잔버그는 모의투자로 미리 돌려보며 하나씩 잡는 게 정석이다.

## 배운 것

이 단계에서 가장 크게 배운 건 분석 로직이 아니라 방어 코드의 중요성이었다. **외부 API는 언제든 느려지고, 틀린 형식을 주고, 일시적으로 죽는다고 가정해야 한다.** 재시도, 캐싱, 폴백, 타임아웃 — 화려하진 않지만 무인 시스템의 생존을 좌우하는 건 결국 이런 기본기였다.

[다음 편에서는 드디어 봇의 "두뇌"를 만든다.](/blog/claude-code-stock-agent-3-analysts/) 분석가 3명의 프롬프트를 설계하고, LLM을 실제로 호출해 첫 분석 결과를 받아보는 과정이다.

---

📚 [← ① 목적과 설계](/blog/claude-code-stock-agent-1-design/) ·  **다음 편 →** [③ 분석가 3명의 두뇌](/blog/claude-code-stock-agent-3-analysts/)

*※ 이 글은 개인 프로젝트 제작기로, 특정 종목의 매수·매도 권유나 투자 조언이 아닙니다. 자동매매는 손실 위험이 있으며 모든 투자 판단과 책임은 본인에게 있습니다.*
