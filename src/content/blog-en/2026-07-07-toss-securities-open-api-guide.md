---
title: "Toss Securities Open API — Setup, Usage, and How It Compares to Korea Investment (KIS)"
description: "A developer's guide to Toss Securities' Open API: what it offers, how to register and get tokens, OAuth/price/order scope, and where it beats or falls short of Korea Investment (KIS)."
pubDate: 2026-07-07T07:05:49+09:00
updatedDate: 2026-10-07T09:14:38+09:00
category: ax
tags: ["toss-securities-api", "open-api", "trading-api", "korea-stock-api"]
lang: en
koSlug: 2026-07-07-toss-securities-open-api-guide
---

If you want to build an automated trading bot or a market-analysis tool, you need a brokerage API. Unlike the first generation — Windows-only OCX controls that required a PC left running with the HTS resident — **the REST approach, where a token is all you need and the OS doesn't matter**, was a door Korea Investment & Securities (KIS) held open largely alone from 2022. In 2026 that choice widened with **Toss Securities' Open API**. What started in May as a staged rollout to pre-registered applicants became a **full service for all customers on August 13, 2026** — if you have a Toss Securities account today, you can issue credentials. So what makes Toss's API different, how do you register and use it, and when you stack it up against the incumbent KIS, which one should you reach for? This piece is ordered **quickstart (credentials → first quote in 10 minutes) → your first order → the registration traps → reference for scope, endpoints, limits, realtime, and errors → pros and cons versus Korea Investment (KIS)**. **If you're new, start with the quickstart right below**; if you've already wired this up, skip straight to the reference sections.

Here are the three most-asked questions, answered up front.

| Question | Answer |
|---|---|
| **Where do I register?** | Log in to the Toss Securities **WTS (desktop web) → Settings > Open API** and issue your `client_id` and `client_secret`. On the same screen, register your calling IP under **Allowed IP management** — unregistered IPs get a 403. |
| **Is real-time (WebSocket) available?** | **Yes.** Subscribe to trades, orderbook, and your own order events at `wss://openapi-ws.tossinvest.com/ws/v1`. Two concurrent connections per account, 100 subscriptions per connection. |
| **Can two processes each hold their own token?** | **No — they must share one.** Only one access token is valid per client, and issuing a new one instantly kills the previous token with `401 token-revoked`. |

> ⚠️ This is a technical guide to using an API. It is not investment advice and does not recommend buying or selling any security. API policies, fees, and coverage change, so always check each provider's official documentation.
>
> *Updated October 7, 2026 — endpoint inventory, per-group rate limits, and error codes were rebuilt against the official specs (REST v1.2.19 / realtime v1.2.2). Most importantly, **the WebSocket realtime API that did not exist at first publication has since shipped**, so that section was rewritten entirely.*

## Quickstart — From Credentials to Your First Quote in 10 Minutes

If you're starting out, following just this section will print Samsung Electronics' current price in your terminal. The endpoint inventory, limit tables, and error codes further down are **the place you come back to when you're stuck** — skip them for now.

**Four things you need**

| Requirement | How to check |
|---|---|
| A Toss Securities account | Open one in the Toss app. As of 2026-08-13 the API is available to all customers |
| Desktop web (WTS) login | The credential screen exists **only on desktop web**, not in the mobile app |
| **A static public IP** | Run `curl ifconfig.me`. Register that value as an allowed IP. On home routers or mobile networks the IP shifts and you get an instant 403 |
| Python + requests | `pip install requests` |

**Three steps to credentials**

1. Log in to the Toss Securities **WTS (desktop web) → Settings > Open API** → issue `client_id` and `client_secret` (use the copy button — typing them by hand introduces stray whitespace)
2. At the bottom of the same screen, **Allowed IP management** → register the IP you found above
3. Put them in environment variables and run the code below

```bash
export TOSS_CLIENT_ID='c_...'
export TOSS_CLIENT_SECRET='s_...'
```

**Code you can paste and run as-is**

```python
# quickstart.py — issue a token, then fetch Samsung Electronics and Apple quotes
import os, requests

BASE = "https://openapi.tossinvest.com"

# 1) Get an access token (valid 24 hours)
res = requests.post(f"{BASE}/oauth2/token", data={
    "grant_type": "client_credentials",
    "client_id": os.environ["TOSS_CLIENT_ID"],
    "client_secret": os.environ["TOSS_CLIENT_SECRET"],
})
res.raise_for_status()
token = res.json()["access_token"]

# 2) Fetch quotes (token is enough — no account header needed)
res = requests.get(f"{BASE}/api/v1/prices",
                   headers={"Authorization": f"Bearer {token}"},
                   params={"symbols": "005930,AAPL"})
res.raise_for_status()

for item in res.json()["result"]:
    print(f"{item['symbol']:8} {item['lastPrice']:>10} {item['currency']}")

# Your remaining budget comes back in a header
print("calls remaining:", res.headers.get("X-RateLimit-Remaining"))
```

Running it gives you this.

```
005930        72000 KRW
AAPL         185.70 USD
calls remaining: 14
```

That's "connected." You haven't touched an account or an order, so no money can move.

**Almost everyone gets stuck on one of these three**

| Symptom | Cause | Fix |
|---|---|---|
| **403** `access_denied` / `IP address not allowed` | IP not registered, or your IP changed | Re-check with `curl ifconfig.me` and register again. On a home router the IP rotates frequently |
| **401** `invalid_client` | Wrong `client_id` / `client_secret` (including leading or trailing whitespace) | Re-copy with the WTS copy button. Unrelated to allowed IPs |
| **400** `account-header-required` | You called an account or order API without the account header | Add the `X-Tossinvest-Account` header (see the first order below) |

The third one never appears on quote calls. It shows up the moment you move to accounts, holdings, or orders.

## Your First Order — One Share, Safeguards First

To reach an order you first need your account identifier (`accountSeq`) and you must send it in the `X-Tossinvest-Account` header. **From here, real money moves.** Toss Securities' Open API has **no paper-trading environment, so even your first order executes on a live account** — hard-code a notional ceiling before you begin.

```python
# first_order.py — find the account, enforce a safeguard, buy 1 share at limit
import os, uuid, requests

BASE = "https://openapi.tossinvest.com"
MAX_ORDER_KRW = 100_000   # ★ Safeguard: the code blocks anything above this

# Note: issuing a new token instantly revokes the previous one.
#       In production, issue once in one place and share it from a cache.
res = requests.post(f"{BASE}/oauth2/token", data={
    "grant_type": "client_credentials",
    "client_id": os.environ["TOSS_CLIENT_ID"],
    "client_secret": os.environ["TOSS_CLIENT_SECRET"],
})
res.raise_for_status()        # catches 403 (allowed IP) and 401 (credentials) right here
token = res.json()["access_token"]
h = {"Authorization": f"Bearer {token}"}

# 1) Pull accountSeq from the account list
accounts = requests.get(f"{BASE}/api/v1/accounts", headers=h).json()["result"]
print(accounts)   # [{'accountNo': '12345678901', 'accountSeq': 1, 'accountType': 'BROKERAGE'}]
ha = {**h, "X-Tossinvest-Account": str(accounts[0]["accountSeq"])}

# 2) Pre-flight check — never send a request that breaches the ceiling
symbol, qty, price = "005930", 1, 70000
assert symbol.isdigit(), "this safeguard assumes a Korean symbol (KRW) — US prices are in USD"
assert qty * price <= MAX_ORDER_KRW, f"safeguard tripped: {qty * price:,} KRW over limit"

# 3) Limit buy — clientOrderId prevents duplicate orders
res = requests.post(f"{BASE}/api/v1/orders", headers=ha, json={
    "clientOrderId": f"first-{uuid.uuid4().hex[:8]}",
    "symbol": symbol, "side": "BUY",
    "orderType": "LIMIT", "timeInForce": "DAY",
    "quantity": str(qty), "price": str(price),
})
print(res.status_code, res.json())
# success → {'result': {'orderId': '0d5QIHjm...', 'clientOrderId': 'first-a1b2c3d4'}}
# failure → {'error': {'code': 'order-hours-closed', ...}} — the cause arrives in `code`
```

If you boil it down to **three rules to follow from day one**:

1. **Hard-code a notional ceiling.** One `assert` before the request, as above, is what stops an order with an extra zero. With no paper trading, it's your only net.
2. **Always send `clientOrderId`.** If the network drops and you retry with the same value, it's treated as **the same order**. Without it, you buy twice. The key is valid for 10 minutes.
3. **Code as if "order sent ≠ order filled."** Save the `orderId` from the response and poll `GET /api/v1/orders/{orderId}` for status. Getting rejected with `422 order-hours-closed` outside market hours is normal behavior, not a bug. If it hasn't filled yet, you can call `POST /api/v1/orders/{orderId}/cancel` with that same `orderId` — that's your escape hatch from a practice order.
4. **Korean orders require the account's investor-directed exchange to be set to integrated (SOR).** The Open API doesn't support exchange-specific orders, so if that setting points at KRX or NXT, **even flawless code** is rejected with `422 investor-exchange-not-integrated`. You can't fix this in code — it's an account setting. If your first order keeps failing with a 422, check there first.

Once that runs, everything else is a question of what more you can call. From here down, the article is reference: scope, limits, realtime, and errors.

## What the Toss Securities Open API Is — What You Get

The Toss Securities Open API is a **REST API covering quotes, stock information, exchange rates, accounts, and orders for Korean (KRX + NXT combined) and US equities**, with a separate **WebSocket API for realtime streaming** bolted on. The REST base is `https://openapi.tossinvest.com`; the WebSocket is a single endpoint, `wss://openapi-ws.tossinvest.com/ws/v1`.

| Category | What you get | Auth |
|---|---|---|
| **Auth** | OAuth 2.0 access token issuance, JWKS | — |
| **Market Data** | Current price, orderbook, recent trades, price limits, candles | Token only |
| **Stock Info** | Stock master, buy warnings, investor trading trends, program trading, short selling, credit trading, securities lending | Token only |
| **Market Info** | Exchange rates, KR/US market calendar | Token only |
| **Rankings & Indicators** | Stock rankings, domestic index and government bond prices and candles, investor trading value | Token only |
| **Account & Asset** | Account list, holdings | Token + account header |
| **Order** | Create, modify, cancel, query orders; conditional orders (OCO/OTO); buying power, sellable quantity, commissions | Token + account header |
| **Realtime (WebSocket)** | Trade ticks, orderbook updates, own order events | Token (handshake header) |

Public data like quotes works with just a token, but **anything touching your own assets — account, asset, order, conditional order — also requires the account identifier header (`X-Tossinvest-Account: {accountSeq}`)**. Omit it and you get `400 account-header-required` — by far the most common first-integration error.

What's worth noticing is that **short selling, securities lending, credit trading, program trading, and investor-level trading trends** all sit inside the Stock Info category. Contrary to the impression that "Toss only gives you plain quotes," you can pull supply-and-demand data per symbol. What you can't pull: **trading in derivatives (futures and options) or bonds, and financial statements** — government bond levels are available as market-indicator quotes, but they aren't tradeable here. That's where the boundary is drawn.

One more defining trait: **documentation built to be read by AI coding agents.** Alongside human-facing docs, Toss publishes `llms.txt`, a markdown integration guide, and machine-parsable **OpenAPI 3.0 JSON and AsyncAPI 3.0 JSON**. Every endpoint, limit, and error code in this article was pulled straight out of those spec files. Point Cursor or Claude at them and say "fetch quotes with the Toss API," and the tool reads the exact schema. It reads like a deliberate attempt to lower the barrier to automated trading itself.

![Smartphone stock app and a laptop](https://images.unsplash.com/photo-1612461313144-fc1676a1bf17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Dimitris Chapsoulas](https://unsplash.com/@synesthe2ia?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-on-black-laptop-computer-CQFT1j8Ig30?utm_source=spice-bandit-blog&utm_medium=referral)*

## Registration in Detail — Two Traps You Will Hit

Expanded against the official guide, the quickstart's three steps are really four.

1. **Register a client** — log in to the Toss Securities WTS (desktop web) and issue `client_id` and `client_secret` under **Settings > Open API**.
2. **Register allowed IPs** — at the bottom of that same menu, **Allowed IP management**, add the IPs that will call the API. Calls from any IP not on the list are blocked with a 403.
3. **Issue an access token** — call `POST /oauth2/token` using the Client Credentials Grant.
4. **Call the API** — pass the token as `Authorization: Bearer {access_token}`, and add `X-Tossinvest-Account` for account, asset, order, and conditional-order calls.

If you just want to verify the token with curl first:

```bash
curl -X POST https://openapi.tossinvest.com/oauth2/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d "client_id=$TOSS_CLIENT_ID" \
  -d "client_secret=$TOSS_CLIENT_SECRET"
```

The response follows the standard OAuth2 shape: `token_type: "Bearer"` and **`expires_in: 86400` — a 24-hour lifetime.** No refresh token is issued, so when it expires you simply call the same endpoint again.

Two traps catch almost everyone on their first try.

**First, there is exactly one token per client.** Issue a new one and the previous token is revoked immediately, rejected with `401 token-revoked`. If you run your Korean-equity bot and your US-equity bot as separate processes and each fetches its own token, the two will take turns killing each other's. The symptom — "works fine, then a sudden 401, reissue, works again, then 401" — is miserable to diagnose. **Put token issuance behind a single owner (cache it in a file, Redis, whatever) and have every process read that one value.**

**Second, allowed IPs only work if the IP is static.** On a cloud instance, serverless runtime, or mobile tethering, the public IP shifts between calls and you get a permanent 403. The official FAQ says plainly: secure a static IP, then register it (cloud and data-center ranges are not blocked as such). If your plan was to run the bot on serverless, sort out a fixed egress path — a NAT gateway or equivalent — at design time.

Never expose `client_secret` publicly (GitHub included); keep it in environment variables or a secrets manager.

## How to Use It — The Full Endpoint Map

Here are the REST endpoints per the official OpenAPI spec (v1.2.19). These are the real paths from the spec file, not approximations.

| Method · Path | What it does | Account header |
|---|---|---|
| `POST /oauth2/token` | Issue access token | — |
| `GET /api/v1/prices` | Current price (up to 200 symbols) | — |
| `GET /api/v1/orderbook` | Orderbook (combined KRX + NXT) | — |
| `GET /api/v1/trades` | Recent trades (max 50) | — |
| `GET /api/v1/price-limits` | Upper/lower price limits | — |
| `GET /api/v1/candles` | Candles (`1m`, `1d`; max 200) | — |
| `GET /api/v1/stocks` | Stock master data | — |
| `GET /api/v1/stocks/all` | All symbols by market | — |
| `GET /api/v1/stocks/{symbol}/warnings` | Buy warnings | — |
| `GET /api/v1/stocks/{symbol}/investor-trading` | Investor trading trend | — |
| `GET /api/v1/stocks/{symbol}/program-trades` | Program trading trend | — |
| `GET /api/v1/stocks/{symbol}/short-selling` | Short-selling trend | — |
| `GET /api/v1/stocks/{symbol}/credit-trades` | Credit trading trend | — |
| `GET /api/v1/stocks/{symbol}/securities-lending` | Securities lending trend | — |
| `GET /api/v1/exchange-rate` | KRW↔USD exchange rate | — |
| `GET /api/v1/market-calendar/KR` · `/US` | Market hours and holidays by session | — |
| `GET /api/v1/rankings` | Stock rankings (volume, gainers/losers, etc.) | — |
| `GET /api/v1/market-indicators/prices` | Index prices | — |
| `GET /api/v1/market-indicators/{symbol}/candles` | Index candles | — |
| `GET /api/v1/market-indicators/{symbol}/investor-trading` | Investor trading value (KOSPI, KOSDAQ) | — |
| `GET /api/v1/accounts` | Account list (to find `accountSeq`) | — |
| `GET /api/v1/holdings` | Holdings | Required |
| `POST /api/v1/orders` | Create order | Required |
| `GET /api/v1/orders` | List orders | Required |
| `GET /api/v1/orders/{orderId}` | Order detail | Required |
| `POST /api/v1/orders/{orderId}/modify` · `/cancel` | Modify / cancel order | Required |
| `POST` · `GET /api/v1/conditional-orders` | Create conditional order (SINGLE / OCO / OTO), list | Required |
| `GET` · `DELETE /api/v1/conditional-orders/{conditionalOrderId}` | Conditional order detail, cancel | Required |
| `POST /api/v1/conditional-orders/{conditionalOrderId}/modify` | Modify conditional order | Required |
| `GET /api/v1/buying-power` | Buying power | Required |
| `GET /api/v1/sellable-quantity` | Sellable quantity | Required |
| `GET /api/v1/commissions` | Trading commissions | Required |

*Source: [Toss Securities Open API — OpenAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json) (v1.2.19, verified 2026-10-07)*

The calling code is already covered — the quickstart and first-order examples above are the skeleton, and you reach any row in this table by swapping the endpoint and parameters. That said, **four fields in the order request are worth knowing.**

- **`clientOrderId` (idempotency key)**: resend the same value and you get the original order result back. It stays valid for 10 minutes. It is the only thing standing between a network timeout retry and a duplicate order, so **there is no reason for an automated bot to skip it.** The server does not generate one for you.
- **`timeInForce`**: `DAY` (default), `CLS` (at the close, US limit orders only), `OPG` (at the opening auction, Korean market only). `LIMIT` + `CLS` is what gives you an LOC order.
- **`confirmHighValueOrder`**: **orders of ₩100 million or more are rejected with `400 confirm-high-value-required` unless this flag is `true`.** It's a fat-finger guard.
- **Fractional and amount-based orders**: `orderAmount` (notional) is **US market orders only**, and fractional quantities are allowed **only on US market sell orders**. Both are accepted only from the regular session open until **one hour before the close**; outside that window you get `422 amount-order-outside-regular-hours` or `422 fractional-quantity-outside-regular-hours`.

## Rate Limits — Counted Per Group, Separately

Short answer: **limits are requests per second (TPS) per client × API group**, and the official limit table lists 18 groups (17 of which are tagged on actual endpoint descriptions). Hammering quotes doesn't eat into your order budget, which is structurally friendly. But **the account list and the all-symbols endpoint are capped at one call per second**, so any code that calls those inside a loop stalls immediately.

| Rate Limits Group | Per second | APIs |
|---|---|---|
| `MARKET_DATA_CHART` | 20 | Candles |
| `MARKET_DATA` | 15 | Price, orderbook, trades, price limits |
| `STOCK_TRADING_TREND` | 10 | Short selling, credit, lending, program trading |
| `ORDER` | 10 | Create / modify / cancel order |
| `MARKET_INDICATOR` · `MARKET_INDICATOR_PRICE` | 10 | Market indicators |
| `CONDITIONAL_ORDER_HISTORY` | 10 | Conditional order queries |
| `ORDER_INFO` | 6 (3 during 09:00–09:10 KST) | Buying power, sellable quantity, commissions |
| `AUTH` · `ASSET` · `STOCK` · `RANKING` · `ORDER_HISTORY` · `CONDITIONAL_ORDER` · `MARKET_INDICATOR_CHART` | 5 | Token, holdings, stock info, rankings, order history |
| `MARKET_INFO` | 3 | Exchange rate, market calendar |
| `ACCOUNT` · `STOCK_ALL` | **1** | Account list · all symbols by market |

*Source: [Toss Securities Open API integration guide — Rate Limits](https://openapi.tossinvest.com/openapi-docs/overview.md) (verified 2026-10-07). Limits may be adjusted without prior notice.*

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 450" style="width:100%;height:auto" role="img" aria-label="Bar chart of Toss Securities Open API per-second rate limits by group: candles 20, market data 15, orders 10, order info 6, token and holdings 5, market info 3, account list and all symbols 1.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">Per-second limits by group — the bottleneck is account list &amp; all-symbols (1/sec)</text>
<text x="0" y="40" font-size="12" fill="#8A8378">Unit: requests per second (TPS) · counted separately per client × group</text>
<line x1="190" y1="52" x2="190" y2="408" stroke="#E5DECF" stroke-width="1" />
<text x="182" y="76" font-size="12.5" fill="#23201D" text-anchor="end">Candles (CHART)</text>
<rect x="190" y="60" width="520" height="24" fill="#4E7FA8" rx="2" />
<text x="718" y="77" font-size="12.5" fill="#23201D">20</text>
<text x="182" y="110" font-size="12.5" fill="#23201D" text-anchor="end">MARKET_DATA</text>
<rect x="190" y="94" width="390" height="24" fill="#4E7FA8" rx="2" />
<text x="588" y="111" font-size="12.5" fill="#23201D">15</text>
<text x="182" y="144" font-size="12.5" fill="#23201D" text-anchor="end">Trading trends</text>
<rect x="190" y="128" width="260" height="24" fill="#A8BDD2" rx="2" />
<text x="458" y="145" font-size="12.5" fill="#23201D">10</text>
<text x="182" y="178" font-size="12.5" fill="#23201D" text-anchor="end">ORDER</text>
<rect x="190" y="162" width="260" height="24" fill="#4E7FA8" rx="2" />
<text x="458" y="179" font-size="12.5" fill="#23201D">10</text>
<text x="182" y="212" font-size="12.5" fill="#23201D" text-anchor="end">Market indicators</text>
<rect x="190" y="196" width="260" height="24" fill="#A8BDD2" rx="2" />
<text x="458" y="213" font-size="12.5" fill="#23201D">10</text>
<text x="182" y="246" font-size="12.5" fill="#23201D" text-anchor="end">ORDER_INFO</text>
<rect x="190" y="230" width="156" height="24" fill="#A8BDD2" rx="2" />
<text x="354" y="247" font-size="12.5" fill="#23201D">6 (3 at the open)</text>
<text x="182" y="280" font-size="12.5" fill="#23201D" text-anchor="end">Token · holdings · stock</text>
<rect x="190" y="264" width="130" height="24" fill="#A8BDD2" rx="2" />
<text x="328" y="281" font-size="12.5" fill="#23201D">5</text>
<text x="182" y="314" font-size="12.5" fill="#23201D" text-anchor="end">FX · market calendar</text>
<rect x="190" y="298" width="78" height="24" fill="#A8BDD2" rx="2" />
<text x="276" y="315" font-size="12.5" fill="#23201D">3</text>
<text x="182" y="348" font-size="12.5" fill="#23201D" text-anchor="end">Account list</text>
<rect x="190" y="332" width="26" height="24" fill="#1B4F8A" rx="2" />
<text x="224" y="349" font-size="12.5" font-weight="700" fill="#1B4F8A">1</text>
<text x="182" y="382" font-size="12.5" fill="#23201D" text-anchor="end">All symbols</text>
<rect x="190" y="366" width="26" height="24" fill="#1B4F8A" rx="2" />
<text x="224" y="383" font-size="12.5" font-weight="700" fill="#1B4F8A">1</text>
<line x1="190" y1="408" x2="710" y2="408" stroke="#E5DECF" stroke-width="1" />
<text x="190" y="426" font-size="11" fill="#8A8378">0</text>
<text x="320" y="426" font-size="11" fill="#8A8378">5</text>
<text x="450" y="426" font-size="11" fill="#8A8378">10</text>
<text x="580" y="426" font-size="11" fill="#8A8378">15</text>
<text x="704" y="426" font-size="11" fill="#8A8378">20</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">Because the groups are split, heavy quote polling leaves your order budget untouched. Conversely, the account list and all-symbols endpoints allow one call per second — call either inside a loop and you hit 429 right away. Source: Toss Securities Open API integration guide (verified 2026-10-07).</figcaption>
</figure>

The practical move for limit management is **reading the headers**. `X-RateLimit-*` is attached to both normal and 429 responses; `Retry-After` appears only on a 429.

| Header | Meaning |
|---|---|
| `X-RateLimit-Limit` | Currently allowed requests per second (burst capacity) |
| `X-RateLimit-Remaining` | Tokens left in the bucket (0 on a 429) |
| `X-RateLimit-Reset` | Estimated seconds until one token refills |
| `Retry-After` | Recommended retry delay on a 429 |

It's a token bucket, so **watching `X-RateLimit-Remaining` fall and throttling yourself preemptively** is more stable than taking a 429 and backing off. If you do get a 429, honor `Retry-After` and retry with exponential backoff (1s → 2s → 4s, with jitter).

## WebSocket Realtime — What to Subscribe To, and How

This is the part that changed most since the original version. **The Toss Securities Open API now offers WebSocket realtime streaming.** The constraint of scraping quotes by REST polling is gone.

![Code on a monitor](https://images.pexels.com/photos/374563/pexels-photo-374563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Digital Buggu](https://www.pexels.com/@digitalbuggu) on [Pexels](https://www.pexels.com/photo/computer-screen-screengrab-374563/)*

The structure is simple. There is one endpoint, `wss://openapi-ws.tossinvest.com/ws/v1`, and the handshake carries **the same access token as REST** in an `Authorization: Bearer` header (missing or expired token → 401; unregistered IP → 403, using the same allowlist as REST). You pick what you want via the `type` field of the subscription message.

The subscription model is **declarative (full-replace)**. There is no subscribe/unsubscribe action — **the single JSON array you send *is* your entire current subscription.** A new array replaces everything, anything omitted is dropped, and an empty array `[]` clears all.

```json
[
  {"id": "req-1"},
  {"type": "trade:kr",     "codes": ["005930", "000660"]},
  {"type": "orderbook:us", "codes": ["AAPL", "TSLA"]},
  {"type": "personal:order", "codes": ["3"]}
]
```

What goes in `codes` depends on `type`. `trade:kr` and `orderbook:kr` take six-digit Korean symbol codes; `trade:us` and `orderbook:us` take US tickers; and **`personal:order` takes your account's `accountSeq`, not a symbol** (mistake that for a ticker and the subscription is rejected). An ack frame confirms or rejects each declaration, echoing back the `id` if you supplied one.

Pushed frames look like this.

```json
{"type": "message", "topic": "trade:us:AAPL",
 "data": {"price": "243.26", "volume": "8",
          "timestamp": "2026-06-18T23:30:00.000+09:00", "currency": "USD"}}
```

The limits are spelled out in the spec with actual numbers.

| Item | Limit | On exceeding |
|---|---|---|
| Concurrent connections | **2 per account** | The new connection is accepted and **the oldest one is terminated** |
| Subscriptions per connection | **100** (total across `codes`) | `too-many-topics` error frame |
| Declaration frequency | **5 per second** | `rate-limit-exceeded` error frame (no `Retry-After`, unlike REST — wait about a second and re-declare) |

*Source: [Toss Securities Open API — AsyncAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/asyncapi.json) (realtime spec v1.2.2, verified 2026-10-07)*

Subscriptions are counted **per channel × symbol pair**. Watch both trades and orderbook for Samsung Electronics and that's two. So if you want "trades plus orderbook," your real ceiling is 50 symbols.

Three things to handle in production. **First, keepalive.** The server closes the connection **if it receives nothing from the client for 180 seconds — and data the server sends you does not reset that timer.** In other words, sitting there passively consuming a flood of trade ticks will still get you dropped. The recommended pattern is an uppercase `PING` text frame (not JSON) every 60 seconds, expecting a `pong`. **Second, reconnection.** On a server deploy you get a `server-shutdown` error frame first, but when you're dropped for idling or pushed out by the connection cap, **the socket can simply close with no close code.** Detect the drop, reconnect with exponential backoff, and re-declare your subscriptions. **Third, close the old connection before reconnecting.** If you don't, each new connection evicts the previous one and you get an endless loop of disconnects — the classic self-inflicted failure when the cap is two.

Also note that realtime orderbook arrives as a **full snapshot, not a delta**. Every frame carries the complete ask and bid ladder at that moment, so you never merge incremental state on the client. Easier to implement; larger frames.

### Delivery Guarantees — How Far You Can Trust Order Events

This is the part that bears directly on bot reliability, and it's easy to miss: **the delivery guarantee differs by channel.**

| Channel | Guarantee | What it means |
|---|---|---|
| Market data (`trade`, `orderbook`) | **LOSSY** | If your consumer falls behind, intermediate frames can be dropped. Latest state always wins, and **no sequence number is provided to detect gaps** |
| Orders (`personal:order`) | **LOSSLESS** | The backlog is preserved rather than skipped. But **if consumption stalls for more than 2 seconds, the connection is terminated** |

Market data being LOSSY means that if you aggregate WebSocket trade ticks into your own minute bars, **the volume can diverge from the official candles.** When aggregation matters, use the candle API; use WebSocket for "what's the price right now."

The more consequential detail is the caveat on the order channel. **The LOSSLESS guarantee holds only within a connection session.** Order events that occur while you're disconnected are **never redelivered.** So a bot that updates positions purely off `personal:order` will drop a fill after one 3 a.m. disconnect and keep running on stale state. **Immediately after reconnecting, you must resynchronize with `GET /api/v1/orders`** — the official guide requires this step explicitly.

### Where Polling Still Belongs

The arrival of WebSocket doesn't make polling useless. The subscription cap is **100 per connection**, so screening across hundreds of symbols is still REST's job. Conversely, when the symbol count is small and reaction time matters, WebSocket wins outright. Here's the comparison for watching 100 symbols on a one-second cadence.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 240" style="width:100%;height:auto" role="img" aria-label="Bar chart comparing calls per second needed to watch 100 symbols every second: REST polling needs 100 per second, the market data group allows 15 per second, and WebSocket needs zero additional calls after one subscription declaration.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">Watching 100 symbols every second — lower is better</text>
<text x="0" y="40" font-size="12" fill="#8A8378">Unit: calls required per second</text>
<line x1="210" y1="52" x2="210" y2="196" stroke="#E5DECF" stroke-width="1" />
<text x="202" y="76" font-size="12.5" fill="#23201D" text-anchor="end">REST polling (needed)</text>
<rect x="210" y="60" width="500" height="26" fill="#1B4F8A" rx="2" />
<text x="222" y="78" font-size="12.5" font-weight="700" fill="#FAF6EE">100 — 6.7× the limit</text>
<text x="202" y="118" font-size="12.5" fill="#23201D" text-anchor="end">MARKET_DATA limit</text>
<rect x="210" y="102" width="75" height="26" fill="#A8BDD2" rx="2" />
<text x="293" y="120" font-size="12.5" fill="#23201D">15</text>
<text x="202" y="160" font-size="12.5" fill="#23201D" text-anchor="end">WebSocket subscription</text>
<rect x="210" y="144" width="3" height="26" fill="#4E7FA8" />
<text x="221" y="162" font-size="12.5" fill="#23201D">0 — one declaration, then the server pushes (within the 100-sub cap)</text>
<line x1="210" y1="196" x2="710" y2="196" stroke="#E5DECF" stroke-width="1" />
<text x="210" y="214" font-size="11" fill="#8A8378">0</text>
<text x="335" y="214" font-size="11" fill="#8A8378">25</text>
<text x="460" y="214" font-size="11" fill="#8A8378">50</text>
<text x="585" y="214" font-size="11" fill="#8A8378">75</text>
<text x="700" y="214" font-size="11" fill="#8A8378">100</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">The price endpoint accepts up to 200 symbols per call, so in practice one request can cover 100 symbols. But when you need per-symbol orderbook or trades, call volume scales with symbol count — and that's exactly the range WebSocket should take over. Limit source: Toss Securities integration guide (verified 2026-10-07).</figcaption>
</figure>

The practical conclusion: **WebSocket for a watchlist of 100 or fewer, REST for anything wider.** A two-tier design is close to correct. The fact that the price endpoint takes up to 200 symbols per call matters a lot here — scan broadly with one request, watch closely by subscription, and you conserve both budgets.

## Common Errors — Fixing Them Straight From the Code

Short answer: **branch on the `code` field, not the HTTP status.** The official OpenAPI spec says it outright in the `message` field description: because the message "may be returned as an empty string where internal policy restricts disclosure," clients are advised to map their own messages from `code`. The envelope looks like this.

```json
{"error": {"requestId": "01HXYZABCDEFG123456789",
           "code": "invalid-request",
           "message": "Invalid order side.",
           "data": {"field": "side", "allowedValues": ["BUY", "SELL"]}}}
```

`requestId` matches the `X-Request-Id` response header and is the value to attach when you contact support. `data` carries resolution hints — which field was wrong, what the correct tick size is — so **logging `code` together with `data`** cuts debugging time more than anything else.

Once you wire up automated trading, these are the codes you'll actually meet.

| HTTP | `code` | Cause | What to do |
|---|---|---|---|
| 401 | `invalid_client` (token step) | Wrong `client_id` / `client_secret` | Re-copy with the WTS copy button. Check for stray whitespace or newlines. Unrelated to allowed IPs |
| 400 | `invalid_request` (token step) | The **request format**, not the values | Confirm `application/x-www-form-urlencoded` and that `grant_type` isn't missing |
| 403 | `access_denied` / `edge-blocked` | IP not on the allowlist | Register it under Settings > Open API > Allowed IP management. Get a static IP if it's dynamic |
| 401 | `token-revoked` | Another process reissued the token | Centralize token issuance and share the cache |
| 401 | `expired-token` | 24-hour expiry | Add reissue logic; refresh proactively before expiry |
| 400 | `account-header-required` | `X-Tossinvest-Account` missing | Add the account header to account / asset / order calls |
| 400 | `confirm-high-value-required` | Order of ₩100M or more | Set `confirmHighValueOrder: true` |
| 400 | `invalid-request` (tick size) | KR limit price off the tick grid | The correct `tickSize` comes back in `data` — round to it |
| 409 | `opposite-pending-order-exists` | An open order on the opposite side of the same symbol | Cancel the pending order, then re-submit |
| 409 | `already-filled` · `already-canceled` | Modify/cancel target already closed | Re-query order status and branch |
| 422 | `idempotency-key-conflict` | Same `clientOrderId`, different order contents | Generate a new key whenever the order changes |
| 422 | `order-hours-closed` | Outside acceptable order hours | Check the session via the market calendar API and wait |
| 422 | `investor-exchange-not-integrated` | Account's investor-directed exchange isn't integrated (SOR) (KR) | Not fixable in code — change the account setting to integrated (SOR) |
| 422 | `insufficient-buying-power` | Not enough buying power | Check `/buying-power` right before ordering |
| 422 | `insufficient-sellable-quantity` | Not enough sellable quantity | Check `/sellable-quantity` first — holdings ≠ sellable |
| 422 | `price-out-of-range` | Price outside the daily limits | Check `/price-limits` and clamp the price |
| 409 | `request-in-progress` | A request with the same `clientOrderId` is already in flight | Don't retry — wait, then confirm via order query |
| 422 | `prerequisite-required` | Terms / risk disclosures not completed (e.g. US leveraged ETFs) | Complete the flow **in the Toss app** on that symbol's purchase screen. Not possible via API |
| 429 | `rate-limit-exceeded` · `edge-rate-limit-exceeded` | Per-second limit exceeded | Honor `Retry-After` plus exponential backoff |

*Sources: [Toss Securities Open API integration guide — error responses](https://openapi.tossinvest.com/openapi-docs/overview.md), [OpenAPI JSON](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json), and [FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) (verified 2026-10-07)*

The nastiest of these is **`opposite-pending-order-exists`**. If an open order sits on the opposite side of the same symbol, you're rejected with a 409 **even when the prices don't overlap**. Any strategy that stacks scaled buys alongside a target sell has to be redesigned around that constraint. The official FAQ also warns that repeating small orders by the hundreds within a short window can be judged abusive and trigger a temporary trading restriction — so if your strategy slices orders, hard-code a frequency ceiling.

## Data Coverage and Terms of Use — Know These Before You Design

Candle and trade data come with a few preconditions. All of the following is from the official FAQ.

| Item | Detail |
|---|---|
| Historical data start | Korea from **2022-11-23**, US from **2021-11-30**. Nothing earlier |
| Candle intervals / count | `1m` and `1d` only; max 200 per call (paginate backwards with `before`) |
| Recent trades | Max 50, **no backward pagination** — you cannot retrieve a full day of trades |
| 1-minute `timestamp` | **Bar close time.** The `09:01` bar covers `09:00:00.000–09:00:59.999` |
| Korean quote scope | **KRX + NXT combined.** No exchange-select parameter and no exchange field in responses |
| Korean 1-minute coverage | 08:01–20:00 (pre-market open through after-market close) |
| 1-min sum ≠ daily bar | Expected. Minute bars cover continuous trading only; daily bars include off-hours close, block, and basket trades |
| US quote basis | **Not NBBO.** Based on a subset of US exchanges, and the source can differ by session |
| Delisted symbols | Historical quotes unavailable (`404 stock-not-found`) |

*Source: [Toss Securities Open API FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) (verified 2026-10-07)*

Design a backtest and you'll hit the first and last rows of that table. **Korean data starting in November 2022** means just over three years of history, and delisted symbols being unavailable means **survivorship bias is unavoidable**. If you need a decade of history or validation that includes delisted names, source your price data elsewhere. If "the last few years, currently listed names" is enough for your strategy, it's a non-issue.

And **the most important constraint isn't technical — it's the terms.** The official FAQ's data-use policy is blunt:

> Information provided through the API must be used solely for the investor's own trading purposes. Not only is commercial use excluded, but distribution to third parties is strictly prohibited even for non-commercial purposes.

In other words, **you cannot build a service that shows this data to anyone else.** Your bot trading your own account is fine; publishing a quote dashboard or pushing alerts to a friend is outside the permitted scope. If you were planning to grow a side project into a service, read that sentence **before** you write the code.

## Comparing with Korea Investment (KIS) — Pros and Cons

![Smartphone and a development screen](https://images.unsplash.com/photo-1612043273453-8f005184fb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHw1fHxtb2JpbGUlMjBzdG9jayUyMHRyYWRpbmclMjBhcHAlMjBzbWFydHBob25lfGVufDF8MHx8fDE3ODMyOTc2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Michael Förtsch](https://unsplash.com/@michael_f?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-samsung-android-smartphone-turned-on-displaying-google-search-wZw0B9u_1pg?utm_source=spice-bandit-blog&utm_medium=referral)*

The arrival of WebSocket moved the axis of comparison. "Does it do realtime?" used to be the fork in the road; now both do, so **asset coverage and the availability of a paper-trading environment** are what actually decide it.

| Item | Toss Securities Open API | Korea Investment (KIS) API |
|---|---|---|
| Maturity | New — general availability 2026-08-13 | Mature and stable, plenty of references |
| Asset coverage | Korean and US **equities** | Equities plus **domestic/overseas futures & options, listed bonds** |
| Supply-demand data | Short selling, lending, credit, program trading, investor trends | Broadly available |
| Derivatives / bonds | None | Yes |
| Realtime | **WebSocket available** (2 connections × 100 subscriptions) | WebSocket available |
| Published rate limits | **Per-group TPS stated numerically in the spec** | Hard to find the numbers on the portal |
| Paper trading | None (live accounts only) | **TESTBED available** |
| Documentation | **AI-friendly** (llms.txt, OpenAPI/AsyncAPI JSON) | Extensive but somewhat complex |
| Community | Still small | Large, with many examples and libraries |

*Sources: [Toss Securities Open API docs](https://developers.tossinvest.com/docs) · [KIS Developers API service list](https://apiportal.koreainvestment.com/apiservice-category) (verified 2026-10-07). KIS's specific rate limits were not confirmable on the official portal, so numeric comparison is omitted.*

To summarize:

- **Toss's strengths**: simple registration and auth, documentation optimized for AI coding, and **limits and error codes published numerically in the spec**, which makes operational design straightforward. A good fit if Korean and US equities are all you need.
- **Toss's limits**: no derivatives, bonds, or financial statements; **no paper-trading environment, so your first order is on a live account**; history only from November 2022, which is thin for long backtests; a still-small community; and a terms-of-use ban on redistributing data.
- **KIS's strengths**: broad coverage through futures, options, bonds, and overseas derivatives; TESTBED for simulated validation; and abundant examples, libraries, and Q&A when you get stuck.
- **KIS's limits**: voluminous docs and a somewhat fiddly initial setup.

**The paper-trading gap matters more than it sounds.** The first version of your order logic is almost always wrong, and on Toss that wrong code executes with real money. Think about it: in the first-generation OCX era the safeguard was baked into the premise — the bot only ran while the HTS was up and a human was logged in, so somebody was in front of the screen. REST removed that premise, and a paper-trading environment is what fills the gap it left. Toss took the second generation's convenience without, so far, taking that compensating piece. So if you start there, hard-code quantity and notional ceilings as a safeguard **in your very first commit**.

## So What — Which One Should I Pick

The criterion is clear. **If your goal is automated trading or market analysis on Korean and US equities, Toss Securities' API is the easier start** — especially if you develop with AI coding tools, since you can hand the OpenAPI and AsyncAPI JSON straight over, which genuinely saves time. Conversely, **if you need derivatives or bonds, want to validate in a paper-trading environment first, or care about having references to fall back on, Korea Investment's KIS** remains the safer pick.

### Where the Time Actually Goes — And It Isn't the API

One thing worth adding. When people build their first auto-trading bot, they spend the most time on "which brokerage API is best" — and then discover that **API integration is a small slice of the work.** The code to grab a token, pull quotes, and submit an order takes half a day.

The time goes everywhere else.

**Order-state tracking is the first.** Submitting an order isn't filling it. It may partially fill, sit in modification, or get canceled at the close. Code that assumes "I sent the order, so I own it" will one day buy the same stock twice. Toss gives you two tools against this: the `clientOrderId` idempotency key and the `personal:order` WebSocket channel. The first prevents duplicate retries; the second pushes state changes to you. But as covered above, **order events during a disconnect are never redelivered, so tracking is only complete once you add a post-reconnect resync against the order query.** Skip both and poll the order list, and — as the official FAQ notes — **each order comes back as a single row with an average fill price**, so you cannot reconstruct the sequence of partial fills.

**Market hours are the second.** Regular session, off-hours single-price auctions, holidays, and daylight-saving time for US stocks. Hard-code any of this and it will eventually be wrong. That's exactly why Toss offers a market-calendar endpoint, and using it beats maintaining your own calendar (in the Korean market calendar, an `integrated` value of `null` means the market is closed).

**State recovery after a restart is the third.** If your bot dies at 3 a.m. and comes back up, it should have no idea what positions it holds — that's what happens when state lives only in memory. Make it a rule to re-read holdings from the account API. **The broker's record is the truth; your program's variables are just a cache.**

So rather than spending days choosing a brokerage, pick one and go hit those three problems. Swapping APIs costs less than you think, and all three show up no matter which broker you chose.

The most pragmatic strategy is **keeping both doors open**. Opening an account and issuing API credentials is free, so prototype fast on Toss and expand to KIS when you hit a wall.

What widened isn't the number of options so much as the **kind of door**. The first generation — Kiwoom's OpenAPI+, Daishin's Creon, LS's xingAPI — ran on Windows-only OCX/COM controls, so running a bot meant keeping a PC on with the HTS resident. KIS Developers broke that premise first, in April 2022, announcing it as "the first Korean brokerage to provide a trading interface with no HTS connection or separate software install." Kiwoom followed in March 2025 with a REST API supporting Windows, macOS, and Linux, and Toss is the most recent entry in that line. **The real change for individual developers is that there are now several doors you can put on a Linux server and run unattended around the clock.**

Step back a little further and Toss's decision to **declare machine-readable specs (OpenAPI, AsyncAPI JSON) the source of truth and treat human docs as the derivative** is telling. Toss isn't the first brokerage to aim at AI-assisted coding — Kiwoom shipped an "AI coding assistant" alongside its 2025 REST API, generating strategy code from natural-language questions. But the approach differs. Where that one has you use a tool the brokerage built, Toss publishes the spec files so you can hand them to **the AI tooling you already use** — the exact opposite direction from the first generation, which made you install a vendor runtime on your own PC. And the lower the entry barrier to automated trading falls, the more — not less — important risk management becomes. Don't forget: just because the tools got easier doesn't mean you can skip [safeguards like stop-losses and limits](/en/blog/claude-code-stock-agent-4-trade-safety/) — do that, and you'll simply be automating your losses quickly and accurately. All the more so on an API with no paper-trading environment.

---

**Related reading**
- [Comparing Korea's major brokerage APIs](/en/blog/2026-06-27-korea-stock-broker-api-comparison/)
- [KIS API (Korea Investment) Python connection guide [Part 2]](/en/blog/claude-code-stock-agent-2-kis-api/)
- [Building a stock auto-trading bot with Claude Code [Part 1]](/en/blog/claude-code-stock-agent-1-design/)

**Sources**
- [Toss Securities Open API developer docs](https://developers.tossinvest.com/docs) — interactive API reference
- [OpenAPI 3.0 JSON (REST spec v1.2.19)](https://openapi.tossinvest.com/openapi-docs/latest/openapi.json) — primary source for endpoints, schemas, errors
- [AsyncAPI 3.0 JSON (realtime spec v1.2.2)](https://openapi.tossinvest.com/openapi-docs/latest/asyncapi.json) — primary source for WebSocket channels, subscriptions, limits
- [Integration guide overview](https://openapi.tossinvest.com/openapi-docs/overview.md) — registration flow, rate limits, error code table
- [Toss Securities Open API FAQ](https://openapi.tossinvest.com/openapi-docs/faq.md) — candle aggregation rules, data coverage, terms of use
- [Toss Securities newsroom — Open API general availability](https://corp.tossinvest.com/ko/news-room/detail?id=52615) (shift to all customers, 2026-08-13)
- [KIS Developers — Korea Investment Open API](https://apiportal.koreainvestment.com/apiservice-category) (comparison)
- [Newspim — Korea Investment launches "KIS Developers"](https://www.newspim.com/news/view/20220414000474) (2022-04-14, "first Korean brokerage with no HTS connection or separate install")
- [Pinpoint News — Kiwoom Securities launches "Kiwoom REST API"](https://www.pinpointnews.co.kr/news/articleView.html?idxno=330671) (2025-03-24, Windows/macOS/Linux support)

*※ To restate: this is not investment advice, and API policies, coverage, and limits can change without notice — always verify against each provider's official documentation.*
