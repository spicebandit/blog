---
title: "Stock Trading APIs Compared — KIS, Kiwoom, Toss"
description: "Comparing open APIs from Korean brokers (KIS, Kiwoom, Toss, LS, Daishin) for automated trading and market data. REST vs OCX, auth, paper trading, and OS support — a developer's guide."
pubDate: 2026-06-27T09:00:00+09:00
category: ai
tags: ["stock API", "automated trading", "broker API", "open API"]
lang: en
koSlug: 2026-06-27-korea-stock-broker-api-comparison
---

A broker's open API is "the official channel to control your brokerage account with code." Once you hook up a stock trading API, you can receive market data in real time and place buy/sell orders automatically, or pull data without ever opening a chart window to run quant analysis or market-data bots. Even though they all carry the same "open API" label, every broker connects in a completely different way, with different authentication procedures and different operating systems (OS) they run on. Pick the wrong one and you end up "trying to deploy it to a Linux server, only to give up because it's Windows-only." This article compares Korea Investment & Securities, Kiwoom, Toss Securities, LS, and Daishin **from an automated-trading and market-data standpoint**, as a practical guide to choosing the API that fits your environment.

First, let me be clear: this article **compares APIs as developer tools**, not as investment advice. It does not recommend buying or selling any particular security, and all responsibility for investment decisions and the operation of automated trading rests with you. **This is not investment advice.**

![graphical user interface, application](https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmclMjBzY3JlZW58ZW58MXwwfHx8MTc4MjQ5MTQyOXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Anne Nygård](https://unsplash.com/@polarmermaid?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface-application-x07ELaNFt34?utm_source=spice-bandit-blog&utm_medium=referral)*

## The Key Divide: 1st-Gen OCX vs 2nd-Gen REST

The very first thing that separates broker APIs is the "technology generation." This single line determines all the other differences.

**1st generation — OCX/COM approach.** Kiwoom OpenAPI+, Daishin Creon, and LS XingAPI fall into this category. You install a Windows-only component (OCX/COM) on your PC, and the broker's own program (e.g., Kiwoom's HeroMoon) has to be **running resident** in the background for it to work. In other words, it's a setup where "you keep a Windows PC powered on, and on top of it your trading program talks to the broker's program." It's usually tied to a 32-bit environment and can't be deployed to a Linux server or the cloud. On the other hand, because it's been around so long, there's an abundance of documentation and examples.

**2nd generation — REST/WebSocket/gRPC approach.** Korea Investment & Securities' KIS, Toss Securities Open API, LS OpenAPI, and Kiwoom's new Open API NEXT fall here. You obtain a token over HTTP and call orders/queries with it, so it's **OS-agnostic.** You can connect with any language — Python, JavaScript, and so on — and deploy it to a Linux cloud server for 24/7 unattended operation. Real-time market data comes through WebSocket (or a gRPC stream).

To sum up, the core of the choice is this: **"If you're going to run it unattended on the cloud/Linux, go 2nd-gen REST; if you already have Windows-based assets, go 1st-gen."** The whole market is also rapidly shifting toward REST/gRPC, so if you're starting fresh today, 2nd gen is the default.

## Broker-by-Broker Comparison Table

The table below pulls out only the key items relevant to automated trading and market-data retrieval. Fees and exact call limits (requests per minute) change policy frequently, so I won't state them as fixed. **Be sure to check the latest values on each broker's developer center.**

| Broker | Approach | Authentication | Paper Trading | OS/Server | Notes |
|---|---|---|---|---|---|
| Korea Investment & Securities (KIS) | REST + WebSocket | App key/secret → access token | Supported | OS-agnostic, cloud OK | Most mature, rich official GitHub/Python resources, free |
| Kiwoom OpenAPI+ | OCX/COM (1st gen) | HeroMoon login resident | Supported | Windows 32-bit only | Large user base and many examples, heavy legacy constraints |
| Kiwoom Open API NEXT | REST/gRPC (2026) | Token-based | Needs checking | OS-agnostic oriented | Transitioning to new REST, introducing gRPC real-time |
| Toss Securities Open API | REST | OAuth2.0 client credentials | Needs checking | OS-agnostic, server-to-server auth | Easiest entry, domestic + US stocks, in-app pre-application |
| LS Securities | XingAPI (OCX) + LS OpenAPI (REST) | OCX resident / token | Supported | Both offered | Legacy and new in parallel, migration transition period |
| Daishin Creon | COM (1st gen) | HTS login resident | Needs checking | Windows only | Windows COM-based, established user base |

> Paper trading and detailed support scope can vary over time, so I've marked them "needs checking." Before you build on it, it's safest to check each developer center's documentation.

## Who Each Broker Suits

**Korea Investment & Securities KIS Developers.** Since 2022 it has offered a REST API and real-time WebSocket, and it supports paper trading too. Its official GitHub repository (koreainvestment/open-trading-api) has well-organized Python examples and it's free, so among Korean individual developers it's effectively close to a standard. Its biggest strength is that **there's the most documentation, so when you get stuck you can usually solve it by searching.** I'd recommend it as the top pick for anyone building their first automated trading system or trying to run market-data bots and quant strategies in Python.

**Kiwoom Securities.** For a long time it grew the individual automated-trading ecosystem on the 1st-gen OpenAPI+ (OCX/COM). You have to keep HeroMoon running resident on a Windows PC and you're tied to a 32-bit environment, but in return there's a vast amount of blogs, books, and examples. In 2026 it's introducing REST and gRPC with the new 'Open API NEXT,' moving into the 2nd generation. It suits **people who already have existing Kiwoom-based code or are comfortable with a resource-rich 1st-gen environment**, and those who are willing to migrate to the new REST.

**Toss Securities.** Newly launched in 2026, its Open API uses REST and OAuth2.0 client credentials (server-to-server auth). It supports order automation for domestic (KRX) and US stocks, and you can get started with no separate fees once you complete in-app pre-application and account opening. Its **barrier to entry is the lowest**, making it a good fit for the mobile generation or anyone who wants to casually try wiring up automated orders.

**LS Securities (formerly Ebest) and Daishin Securities.** LS offers both the 1st-gen XingAPI (OCX) and the new LS OpenAPI (REST), giving you wide transitional options. Daishin's Creon is a classic 1st-gen, Windows COM-based offering with a solid existing Creon user base. For **anyone who already has assets with that broker**, both are natural choices.

![a computer screen with a bunch of code on it](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBsYXB0b3B8ZW58MXwwfHx8MTc4MjQ5MTQzNXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Chris Ried](https://unsplash.com/@cdr6934?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-screen-with-a-bunch-of-code-on-it-ieic5Tq8YMk?utm_source=spice-bandit-blog&utm_medium=referral)*

## What Does the Auth Flow Look Like

2nd-gen REST APIs have almost identical authentication flows. It's the OAuth2.0 token pattern: "first get a token using your issued keys, then call orders/queries with that token in the header." Below is KIS-style pseudocode (actual endpoints and field names follow the developer center documentation).

```python
import requests

BASE = "https://openapi.example-broker.com"  # live/paper servers are separate

# 1) Issue an access token with the app key/secret
res = requests.post(f"{BASE}/oauth2/tokenP", json={
    "grant_type": "client_credentials",
    "appkey": APP_KEY,
    "appsecret": APP_SECRET,
})
token = res.json()["access_token"]

# 2) Query the current price with the token in the header
headers = {"authorization": f"Bearer {token}", "appkey": APP_KEY, "appsecret": APP_SECRET}
price = requests.get(f"{BASE}/quotations/price",
                     headers=headers, params={"symbol": "005930"})

# 3) Subscribe to real-time quotes via a separate WebSocket (or gRPC stream)
```

Toss Securities' client credentials follow the same skeleton. Tokens have an expiration time, so add caching and auto-reissue logic, and don't hardcode keys and secrets into your code — keep them in environment variables. 1st-gen OCX/COM doesn't issue tokens like this; instead it's a setup where "the program attaches to an HTS login session," so the very concept of authentication is different.

## Selection Guide — So What?

Let me boil it down to three situations.

- **Automated-trading beginners / Python market bots and quant:** Korea Investment & Securities KIS. It's free with an overwhelming amount of resources, so even when you get stuck you can solve it by searching. Validate first with paper trading.
- **24/7 unattended operation on the cloud:** 2nd-gen REST/gRPC (KIS, Toss, LS OpenAPI, Kiwoom NEXT). Deploy it to a Linux server and you won't have to keep a PC on. 1st gen requires a resident Windows machine and is unsuitable for this use case.
- **Easiest to start / includes US stocks:** Toss Securities. With just in-app pre-application, you can quickly wire up OAuth-based order automation.
- **If you already have Windows assets:** Kiwoom OpenAPI+, Daishin Creon, LS XingAPI. If you already have code that works, there's no need to force a migration — but do keep an eye on the roadmap toward the new REST.

My view is clear. **If you're starting fresh today, 2nd-gen REST is the default**, and among those, KIS offers the best bang for the buck relative to the learning curve. I see OCX/COM as a reasonable choice "only when you already have assets there."

One final word of warning. Automated trading can produce **real losses** from a single line of buggy code, overfitting (strategies that only look good in backtests), or sudden market swings — **and that responsibility rests entirely with you.** Be sure to validate thoroughly in paper trading, build in safeguards like order size and daily loss limits in your code, and start with a small amount. To emphasize again: this article is merely a comparison of developer tools and **is not investment advice.**
