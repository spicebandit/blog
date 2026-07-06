---
title: "KIS API (Korea Investment & Securities Open API) Python Guide — Real Traps and Fixes [Part 2]"
description: "A hands-on guide to connecting the Korea Investment & Securities KIS Open API in Python. Real traps and fixes — the 1-minute token limit, paper server, SSL errors — from building a Claude Code stock bot."
pubDate: 2026-06-20T09:00:00+09:00
updatedDate: "2026-07-06T20:30:00+09:00"
category: ai
tags: ["ClaudeCode", "KIS API", "AlgoTrading", "Python"]
lang: en
koSlug: claude-code-stock-agent-2-kis-api
---

> 📚 **Series — Building a Stock Investing Agent with Claude Code**
> [① Purpose and Design](/blog/claude-code-stock-agent-1-design/) · **② Connecting the KIS API** · [③ The Analysts' Brains](/blog/claude-code-stock-agent-3-analysts/) · [④ Trading and Safety Guards](/blog/claude-code-stock-agent-4-trade-safety/) · [⑤ Operations Automation](/blog/claude-code-stock-agent-5-operations/)

## From the Foundation Up

No matter how smart the analysts are, they're useless without data to feed them. So the very first thing I built was the connection to the Korea Investment & Securities (KIS) Open API. Quotes, balance, daily candles, and later even orders — every channel through which the bot talks to the market passes through here.

Structurally, I separated it from the bot proper (`stockbot`) and placed it in a shared module called `kis-core`. Keeping authentication and communication in one place means I can reuse it from other programs later.

```
~/projects/kis-core/
   ├── config.py          # Branch domains/TR_IDs for paper vs. live
   ├── token_manager.py   # Token issuance and caching
   ├── client.py          # Quotes, balance, daily candles, orders
   └── .env               # App keys (excluded from git)
```

## Before You Begin — Getting Keys and Installing (how-to)

To build along, you first need two keys: a **brokerage API key** and an **LLM API key**. Here's the exact order I did it in.

**1) Apply for the Korea Investment & Securities Open API**
- On the KIS developer portal (KIS Developers), apply to use the Open API and get issued an **App Key and App Secret**.
- Going straight to a live account is risky, so **apply for a paper-trading account as well**. All validation in this series was done with paper trading (100 million won in virtual funds).

**2) Get a Gemini API key**
- This is the LLM key that will serve as the brains of the three analysts. Get it from Google AI Studio. (Model choice and cost are covered in detail in [Part 3](/blog/claude-code-stock-agent-3-analysts/).)

**3) Python environment and packages**
- Python 3.x plus `requests` for HTTP communication is enough to get started. On macOS, also grab `certifi` because of the SSL issue we'll get to later.
```bash
pip install requests certifi
```

**4) Keep keys in `.env`, not in code**
Don't hard-code the issued keys into the source; put them in `.env` and exclude it from git (add `.env` to `.gitignore`).
```
KIS_APP_KEY=your_issued_app_key
KIS_APP_SECRET=your_issued_app_secret
KIS_ACCOUNT=50193178-01     # Paper-trading account number
KIS_ENV=vps                 # vps=paper, prod=live
GEMINI_API_KEY=your_issued_gemini_key
```
Separating things this way prevents the accident of accidentally pushing keys to a public repository. With the prep done, let's look at the traps I actually hit.

![a computer screen with a bunch of code on it](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGFwaSUyMGNvZGV8ZW58MXwwfHx8MTc4MTg1MTMzOHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Chris Ried](https://unsplash.com/@cdr6934?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk?utm_source=spice-bandit-blog&utm_medium=referral)*

## Trap One — The 1-Minute Token Limit

The KIS API authenticates with an OAuth token. But issuance has a constraint: **you can reissue a token only once per minute**. At first, not knowing this, I called it repeatedly while testing and got this error.

```json
{"error_code":"EGW00133","error_description":"접근토큰 발급 잠시 후 다시 시도하세요(1분당 1회)"}
```

The solution is to issue the token once, cache it to a file, and reuse it. Since a token is valid for 24 hours, you don't issue one on every call — you only refresh it just before expiry. On top of that, if multiple processes try to issue at the same time they collide, so I used a file lock to ensure only one issuance happens at a time.

```python
def get_token():
    tok = _cached_valid()      # Reuse a valid cache if one exists
    if tok:
        return tok
    with open(LOCK_FILE, "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)   # Prevent concurrent issuance
        tok = _cached_valid()  # Another process may have refreshed it while we held the lock
        if tok:
            return tok
        # Actual issuance + save to cache
```

Later I even added logic so that when the bot hits the 1-minute limit, it doesn't die — it waits 62 seconds and retries automatically. If you're going to run it unattended, this kind of self-recovery is essential.

## Trap Two — The Paper Server's Mood Swings

KIS uses different domains and ports for live accounts versus paper-trading accounts. Paper is `openapivts.koreainvestment.com:29443`, live is `:9443`. Order TR_IDs also get a `V` prefix on paper (e.g., buy is `VTTC0802U`). So I made it possible to switch between the two with a single line of config.

The problem was that the paper-trading server **intermittently spits out 500 errors**. I first noticed it on daily-candle queries: the same request would sometimes work and sometimes not. The longer the data period, the more often it failed.

This wasn't something to paper over with a stopgap — it had to be defended against structurally. So I put **retry + automatic period shrinking** logic into the query function.

```python
def inquire_daily(symbol, days=90, retries=3):
    for d in [days, 70, 50, 30]:        # Stepping the period down
        for attempt in range(retries):   # Retry within each period
            try:
                res = requests.get(...)
                if res.status_code == 500:
                    time.sleep(0.8); continue   # Transient error → retry
                ...
                return data
            except RequestException:
                time.sleep(0.8)
    raise RuntimeError("Period shrinking and retries all failed")
```

Even when the server gets cranky now and then, the bot rides it out on its own, and in the worst case still secures 30 days of data. Later I applied this retry logic uniformly to balance queries and current-price queries as well.

## Trap Three — SSL Certificates

When I made my first external call on the Mac, I got this error.

```
[SSL: CERTIFICATE_VERIFY_FAILED] unable to get local issuer certificate
```

This isn't a code bug — it's a very common problem where the macOS Python can't find its bundle of SSL certificates. Running the certificate-install script that ships with Python fixes it.

```bash
/Applications/Python*/Install\ Certificates.command
# or
python3 -m pip install --upgrade certifi
```

![lines of HTML codes](https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxwcm9ncmFtbWluZyUyMGFwaSUyMGNvZGV8ZW58MXwwfHx8MTc4MTg1MTMzOHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Florian Olivo](https://unsplash.com/@florianolv?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/lines-of-html-codes-4hbJ-eymZ1o?utm_source=spice-bandit-blog&utm_medium=referral)*

## First Success — Querying the Balance

After clearing the traps one by one, the balance query finally worked.

```
[모의투자(vps)] 계좌 50193178-01
----------------------------------------
예수금:     99,985,092원
평가금액:   99,985,092원
총손익:             +0원
----------------------------------------
보유 종목 없음
```

The 100 million won I'd requested for paper trading showed up as deposited cash. It was the moment the whole flow — token issuance → balance query — ran end to end for the first time. It may look like a trivial number, but it meant the foundation for the bot communicating with a real account was in place, which felt pretty reassuring.

Once I added current-price and valuation (PER/PBR/EPS) queries plus daily-candle queries on top of this, all the data the analysts would feed on was ready. When I first received real data, I got tripped up again by an unexpected format (e.g., EPS coming back as a decimal string like `'6564.00'`), but the standard way to catch these little bugs is to run them in paper trading ahead of time, one at a time.

## What I Learned

The biggest lesson at this stage wasn't about analysis logic — it was the importance of defensive code. **You have to assume external APIs will, at any time, slow down, return the wrong format, and temporarily die.** Retries, caching, fallbacks, timeouts — not flashy, but in the end these basics are what determine whether an unattended system survives.

[In the next part, we finally build the bot's "brain."](/blog/claude-code-stock-agent-3-analysts/) That's the process of designing the prompts for the three analysts, actually calling the LLM, and getting back the first analysis results.

## Follow Along — Issuing KIS API Keys in 5 Steps

To connect the Korea Investment & Securities (KIS) Open API yourself, prepare in this order.

1. **Open an account**: Create a Korea Investment & Securities account (via their non-face-to-face app). **Also apply for a paper-trading account** to validate your automated trading.
2. **Register as a developer**: Register as a developer on KIS Developers (apiportal.koreainvestment.com).
3. **Get your App Key and App Secret**: Once you register an app, you'll receive an **APP KEY** and an **APP SECRET**. These two values are the core of authentication.
4. **Check your account details**: Confirm the first 8 digits of your account number (CANO) and the product code (ACNT_PRDT_CD, usually `01`).
5. **Store them in environment variables (.env)**: Don't put the issued values directly in your code — manage them in `.env`.

```
KIS_ENV=vps          # paper trading (vps) / live (prod)
KIS_APP_KEY=...
KIS_APP_SECRET=...
KIS_CANO=00000000
KIS_ACNT_PRDT_CD=01
```

**Common traps (know them up front)**
- After issuing an access token, there's **roughly a 1-minute limit before you can reissue** → you have to cache and reuse the token so you don't get blocked.
- The paper-trading server intermittently throws 500s and timeouts → **retry logic is essential**.
- Live and paper trading use different domains and TR_IDs → branch on the `KIS_ENV` value so you don't accidentally send an order to a live account.

---

📚 [← ① Purpose and Design](/blog/claude-code-stock-agent-1-design/) ·  **Next →** [③ The Brains of the Three Analysts](/blog/claude-code-stock-agent-3-analysts/)

*※ This article is a personal project write-up, not a recommendation to buy or sell any specific stock and not investment advice. Automated trading carries the risk of loss, and all investment decisions and responsibility rest with you.*
