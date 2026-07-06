---
title: "Toss Securities Open API — Setup, Usage, and How It Compares to Korea Investment (KIS)"
description: "A developer's guide to Toss Securities' Open API: what it offers, how to register and get tokens, OAuth/price/order scope, and where it beats or falls short of Korea Investment (KIS)."
pubDate: "2026-07-07T09:00:00+09:00"
category: ai
tags: ["toss-securities-api", "open-api", "trading-api", "korea-stock-api"]
lang: en
koSlug: 2026-07-07-toss-securities-open-api-guide
---

If you want to build an automated trading bot or a market-analysis tool, you need a brokerage API. For years that market was close to a one-horse race — Korea Investment & Securities (KIS) was effectively the only real door. Then in 2026, **Toss Securities opened up its Open API**, and individual developers suddenly had a second option. So what makes Toss's API different, how do you register and use it, and when you stack it up against the incumbent KIS, which one should you reach for? This piece walks through Toss Securities' Open API from a developer's angle: **what it offers → how to get access → how to use it → the pros and cons versus Korea Investment (KIS)**.

> ⚠️ This is a technical guide to using an API, not investment advice, and nothing here recommends buying or selling any specific security. API policies, fees, and coverage can change — always confirm against each provider's official documentation.

## What the Toss Securities Open API Is — What You Get

Toss Securities' Open API is a **REST API that serves market data, security master info, exchange rates, account details, and order functions for Korean (KRX) and U.S. stocks**. Per the official docs, the functionality splits into four categories.

| Category | What it gives you | Auth |
|---|---|---|
| **Auth** | OAuth 2.0 access token issuance | — |
| **Market & security data** | Current price, order book, executions, candles; security master; exchange rates; market hours | Token only |
| **Account & assets** | Account list, holdings lookup | Token + account header |
| **Order** | Create/amend/cancel orders, order lookup, buyable amount & fees | Token + account header |

The base URL is `https://openapi.tossinvest.com`, and every call requires an OAuth 2.0 token. Public data like quotes works with the token alone, but **APIs that touch your own assets — accounts and orders — need the token plus an account-identifier header (`X-Tossinvest-Account`)** sent alongside.

If I had to pick the single most distinctive trait, it's the **"documentation built to be read by AI coding agents."** On top of human-facing docs, Toss Securities publishes `llms.txt`, `overview.md`, and a **machine-parseable OpenAPI JSON spec**. In practice that means if you tell an AI coding tool like Cursor or Claude "grab me quotes through the Toss API," it can read the schema precisely and write working code. It reads like a deliberate attempt to lower the entry barrier to automated trading itself.

![Smartphone stock app next to a laptop](https://images.unsplash.com/photo-1612461313144-fc1676a1bf17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Dimitris Chapsoulas](https://unsplash.com/@synesthe2ia?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-on-black-laptop-computer-CQFT1j8Ig30?utm_source=spice-bandit-blog&utm_medium=referral)*

## How to Get Access — From Client Registration to Token

The Toss Securities API is an OAuth 2.0 flow: you get a **client_id and client_secret**, then use those to obtain an access token. The process goes like this.

1. **Confirm availability and terms**: Check the current status of the Toss Securities Open API's coverage and usage conditions on the official info page (there may be an application process or eligibility requirements, so read the official docs before you register).
2. **Register a client**: Log in to the Toss Securities PC web (WTS) and issue a `client_id` and `client_secret` under **Settings → Open API**.
3. **Issue an access token**: Call the token endpoint with the credentials you got.

```
POST https://openapi.tossinvest.com/oauth2/token
(grant_type=client_credentials, client_id, client_secret)
```

Because you create the credentials from the settings screen after logging into the Toss Securities web (WTS), it's relatively simple — no separate joint-certificate (공동인증서) procedure required. Never expose your `client_secret` anywhere external (GitHub and the like); manage it through environment variables.

## How to Use It — The Real Call Flow

You call the API by putting the token you received into an `Authorization: Bearer {access_token}` header. The main endpoints look like this.

```
# Current price lookup (token only)
GET  https://openapi.tossinvest.com/api/v1/prices

# Order book lookup
GET  https://openapi.tossinvest.com/api/v1/orderbook

# Candle (minute/daily) lookup
GET  https://openapi.tossinvest.com/api/v1/candles

# Holdings lookup (token + X-Tossinvest-Account header required)
GET  https://openapi.tossinvest.com/api/v1/... (account/holdings)

# Create order (token + account header required)
POST https://openapi.tossinvest.com/api/v1/... (order)
```

In Python, the skeleton from token issuance to a quote call is this short.

```python
import os, requests

# 1) Issue token
tok = requests.post("https://openapi.tossinvest.com/oauth2/token", data={
    "grant_type": "client_credentials",
    "client_id": os.environ["TOSS_CLIENT_ID"],
    "client_secret": os.environ["TOSS_CLIENT_SECRET"],
}).json()["access_token"]

# 2) Fetch quote
h = {"Authorization": f"Bearer {tok}"}
prices = requests.get("https://openapi.tossinvest.com/api/v1/prices",
                      headers=h, params={"code": "005930"}).json()
print(prices)
```

You only add the `X-Tossinvest-Account` header when you use the account and order APIs. Connectivity is currently offered as **REST only** — instead of real-time streaming (WebSocket), you poll for quotes over REST. The overall shape of the automated-trading logic is nearly identical to the KIS-based structure covered in the [stock-bot building series](/en/blog/claude-code-stock-agent-2-kis-api/) — you just swap the auth scheme and endpoint names over to Toss's.

Two things are worth handling from the start in production. First, the **rate limit**. Public APIs cap requests per second and per minute, so if your bot polls quotes on a short cycle, don't fire requests in a burst — space them out or cache (confirm the exact limits in the official OpenAPI spec). Second, **token expiry**. OAuth tokens have a lifetime, so you need logic that auto-reissues when they expire, or your bot will grind to a halt overnight. Both of these are fundamentals that apply to every brokerage API — KIS or Toss alike.

## Comparing with Korea Investment (KIS) — Pros and Cons

So how does it stack up against the incumbent, the KIS API? Here are the essentials in a table.

| Dimension | Toss Securities Open API | Korea Investment (KIS) API |
|---|---|---|
| Maturity | New (2026) | Mature and stable, plenty of references |
| Auth | OAuth2 + easy in-app approval (fingerprint) | OAuth2, app key & secret |
| Documentation | **AI-friendly** (llms.txt · OpenAPI JSON) | Extensive but somewhat complex |
| Coverage | **Stock-centric**, Korea & U.S. | Stocks + **derivatives, overseas, bonds, and more** |
| Real-time | REST polling (no WebSocket) | **WebSocket real-time** support |
| Community | Still small | Large, lots of examples & libraries |

To sum it up:

- **Toss Securities' strengths**: Registration and auth are simple (fingerprint approval), and the docs are optimized for AI coding, giving it a **low entry barrier for individuals starting automated trading for the first time.** It fits well for anyone who only needs Korean and U.S. stocks.
- **Toss Securities' limits**: Being new, its coverage is narrow (weak on derivatives, bonds, and financial data), it lacks real-time WebSocket so it's unsuitable for scalping, and its references and community are small.
- **KIS's strengths**: Its coverage is broad and stable — reaching derivatives, overseas stocks, and real-time — and it's rich in examples, libraries, and Q&A, so it's easy to get unstuck when you hit a wall.
- **KIS's limits**: The docs are voluminous and the initial setup is somewhat cumbersome.

## So What — Which One Should I Pick

The criterion is clear. **If your goal is "simple automated trading / market analysis on Korean and U.S. stocks," the Toss Securities API** is easier to start with. That's especially true if you're developing with AI coding tools, where Toss's AI-friendly docs are a big advantage. Conversely, **if you need broad, sophisticated functionality like derivatives, overseas, and real-time — or if references you can lean on when stuck matter to you — Korea Investment (KIS)** remains the safe choice.

The most pragmatic strategy is to **keep both doors open**. Opening an account and issuing an API key are free, so you can prototype quickly on Toss and expand to KIS when you hit its limits. The simple fact that there are now more brokerage-API options is a welcome change for individual developers — a door that just a few years ago was effectively the only one has now become two.

Take a step further, and Toss releasing its docs in a form built for AI coding agents to read (llms.txt · OpenAPI JSON) is symbolic. A brokerage has been the first to aim at the shift from an era where "a person read the docs and wrote the code" to one where you "hand the API to an AI and let it build the bot." And the lower the entry barrier to automated trading falls, the more — not less — important risk management and safeguards become. Don't forget: just because the tools got easier doesn't mean you can skip [safeguards like stop-losses and limits](/en/blog/claude-code-stock-agent-4-trade-safety/) — do that, and you'll simply be automating your losses quickly and accurately.

---

**Related reading**
- [Comparing Korea's major brokerage APIs](/en/blog/2026-06-27-korea-stock-broker-api-comparison/)
- [KIS API (Korea Investment) Python connection guide [Part 2]](/en/blog/claude-code-stock-agent-2-kis-api/)
- [Building a stock auto-trading bot with Claude Code [Part 1]](/en/blog/claude-code-stock-agent-1-design/)

**Sources**
- [Toss Securities Open API developer docs](https://developers.tossinvest.com/docs) (API categories, auth, endpoints)
- [Toss Securities Open API official overview](https://corp.tossinvest.com/ko/open-api) (service intro, registration)
- [KIS Developers — Korea Investment Open API](https://apiportal.koreainvestment.com/intro) (comparison target)

*※ To reiterate: this is not investment advice, and API policies and coverage should be confirmed against each provider's official documentation.*
