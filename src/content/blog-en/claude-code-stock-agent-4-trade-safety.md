---
title: "Stock Bot Risk Management & Automated Trade Execution — Safety Gates, KIS API Orders, Manual Approval [Part 4]"
description: "Designing the risk manager and trade execution for a Claude Code stock bot: a deterministic execution gate, KIS API buy/sell, and a manual approval flow — with the code."
pubDate: 2026-06-22T09:00:00+09:00
category: ai
tags: ["ClaudeCode", "AutoTrading", "RiskManagement", "KIS API"]
lang: en
koSlug: claude-code-stock-agent-4-trade-safety
---

> 📚 **Series — Building a Stock-Investing Agent with Claude Code**
> [① Goals and Design](/blog/claude-code-stock-agent-1-design/) · [② Connecting the KIS API](/blog/claude-code-stock-agent-2-kis-api/) · [③ The Analyst Brains](/blog/claude-code-stock-agent-3-analysts/) · **④ Trading and Safety** · [⑤ Operations Automation](/blog/claude-code-stock-agent-5-operations/)

## From Analysis to Action

Up through the last installment, the bot could pick stocks, analyze them, and decide "hold/buy." But a decision alone is only half the job. In this installment we build the part that **actually buys and sells** based on that decision. This is the stage where money moves, so I took it as carefully as possible.

![A close-up view of a rusty padlock securing a weathered metal door, highlighting decay and security.](https://images.pexels.com/photos/16563043/pexels-photo-16563043.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [K](https://www.pexels.com/@kelly) on [Pexels](https://www.pexels.com/photo/padlock-in-rusty-lock-16563043/)*

## The Risk Manager — Staying Within the Balance

Even when the parent agent decides to "buy," you need a safety check to verify that it fits the account's situation. This is the heart of Goal #1: "operate within the balance."

I made one design decision here. I could have built the risk manager as an LLM agent, but when I looked at what it actually does, it was all numeric calculation: "Is there enough cash? What percentage of the portfolio is this?" Handing that to an LLM would be inaccurate, slow, and expensive. So I had **Python do the math precisely, and the LLM only add explanations** when needed.

In practice, when I tried to buy Samsung Electronics in a ₩100 million paper account, the system automatically sized the order to 41 shares (about ₩14.7 million) to fit the single-stock weight limit (15%). Even if I want 100 shares, if it exceeds the limit, it gets cut to 41. Even when the analysts say "buy," the risk manager adjusts the quantity, insisting "no more than 15% in a single name."

## The Execution Gate — A Non-Negotiable Last Line of Defense

This is the most important part. **The LLM does not place the actual order.** Every order must pass through deterministic code called the execution gate. Whether it comes from the LLM, a Telegram command, or a direct call, every order goes through here, no exceptions.

The hard rules the gate checks:

- **Kill switch**: if on, block unconditionally (emergency stop)
- **Quantity validity**: reject if 0 or less
- **Daily order limit**: block once N orders per day is exceeded
- **Duplicate-order prevention (idempotency)**: block if the same stock was already bought today
- **Mode check**: if manual, wait for human approval; if auto, place the order

Only after passing all five does a real KIS order go out. Even if the risk manager somehow misjudges, the gate filters it one final time. Since money is leaving the account, I doubled up the safety mechanisms.

![Close-up of wooden Scrabble tiles spelling SECURITY, symbolizing cybersecurity and protection.](https://images.pexels.com/photos/30965500/pexels-photo-30965500.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Markus Winkler](https://www.pexels.com/@markus-winkler-1430818) on [Pexels](https://www.pexels.com/photo/scrabble-tiles-spelling-the-word-security-30965500/)*

## The First Trade — The Bot Buys Its First Stock

When I ran the bot during market hours, a buy signal came up for SK hynix. The risk manager sized it at 5 shares, passed it through the gate, and submitted an actual market-order buy.

```
Current price ₩2,866,000 / recommended qty 5 shares / verdict approve
Order result: {'status': 'filled', 'order_no': '0000018686',
           'msg': 'Paper-trade buy order completed.'}
```

It filled, even issuing an order number. When I checked the balance, 5 shares of SK hynix were in the account. It was the first time the entire process, from analysis to actual holding, ran all the way through.

For the record, right after the buy the valuation P&L showed -0.3%, but that's not the bot buying poorly. It's the natural slippage that occurs at the moment of a market buy, due to the ask price and fees.

## Selling — Selling Matters as Much as Buying

Knowing only how to buy is half a system. For the sell trigger, I chose "signal reversal" as the main path. When the analysts look again and the view flips to bearish, it sells. Since the same brains that decide to buy also decide whether to sell, there's consistency.

But signal reversal alone leaves a dangerous hole. If an analyst lands on a wishy-washy neutral instead of "strong bearish," nothing sells, and the position can be left untouched even as the price drops sharply in the meantime. So I added **a stop-loss as a safety net** alongside it. No matter what the analysts say, if the return exceeds -7%, it sells unconditionally. This isn't an opinion; it's a matter of survival. One big loss can wreck the account.

The sell decision checks the stop-loss first (top priority), then looks at signal reversal via the analysts' re-evaluation. When I re-evaluated the SK hynix position I was holding, it scored a solid 80 overall and returned "keep holding." That was a reasonable decision — not impulsively selling something I'd just bought.

## The Combined Cycle — Look at What to Sell, Then What to Buy

I bundled buying and selling into a single cycle. The order matters. **Look at selling first.** You need cash from a sale before you can use that money to buy. Just like a real trader.

A single `python3 main.py` runs it like this.

```
─── Sell decision (held positions) ───
🔵 SK hynix -2.7% → keep holding (overall 80.0)
─── Buy decision (candidate stocks) ───
🟢 000660 BUY — buy signal exists but risk rejected (weight limit reached)
🟢 005930 BUY — buy proposal: 41 shares (awaiting approval)
⚪ 009150 HOLD — pass
```

An impressive moment showed up here. A buy signal came up for SK hynix again, but since it was already held, the risk manager blocked it with "occupies 15% of the account, no additional buy allowed." **Concentration prevention worked exactly as intended in a live run.**

## Manual Approval — The Bot Only Proposes, I Decide

I also built a proper way to use manual mode. The bot saves its proposals to `pending.json`, and I review and order them via an approval script.

```
Morning:  python3 main.py      → bot analyzes and proposes
Me:       python3 approve.py   → review the list and decide with y/n/s
```

When I actually ran it, it worked like this.

```
[1] Buy Samsung Electronics 41 shares (weighted score 55.5)
▶ Approve? y
✅ Order completed (order number 0000038876)
```

The bot analyzes and proposes, I review it one more time and approve, and only then does the actual order go out. It's a structure where the bot doesn't buy on its own and I hold the controls.

## Complete, and the Road Ahead

With this, the bot became a complete form that can buy, hold, and sell. In a single day, I validated everything with real data: from the KIS connection, to the three analysts, the aggregation, risk management, and actual fills. Goal #1 (analyze on its own and operate within the balance) fully works.

Of course, it's not the end. There's still road ahead.

- **Telegram integration**: proposals and approvals on my phone
- **Scheduling (launchd)**: automatic runs every morning and at close — the daily report from Goal #2
- **Handling paper-server limits**: use the stable live domain for queries
- **Switching to auto after validation**: only after enough trust has built up in manual

## What I Learned Building It

Across four installments, the three biggest lessons that stuck with me are these.

First, **drawing the line between what the LLM does well and what it can't be trusted with.** Interpretation and judgment to the LLM; numeric calculation, dates, and order placement to code. Making this boundary clear is what made the system trustworthy.

Second, **assuming external APIs are unstable at any moment.** Defensive fundamentals like retries, fallbacks, and caching — not flashy analysis — determined the survival of an unattended system.

Third, **making safety the default.** Paper trading, manual mode, a deterministic gate, doubled-up safety mechanisms. In a system where money is on the line, "caution" is not a cost but a necessity.

Automated trading is not magic that "guarantees making money." What this system really does is *execute rules consistently, without emotion, within set risk limits*. Validating actual performance on top of that is ultimately the job of backtesting and time.

Thank you for reading this long series. I hope this record serves as a map that helps anyone trying to build something similar avoid the pitfalls in advance.

---

📚 [← ③ The Analyst Brains](/blog/claude-code-stock-agent-3-analysts/) ·  **Next →** [⑤ Operations Automation](/blog/claude-code-stock-agent-5-operations/) ·  [① Start from Goals and Design](/blog/claude-code-stock-agent-1-design/)

*※ This article is a personal project build log, not a recommendation to buy or sell any specific stock and not investment advice. Automated trading carries the risk of loss, and all investment decisions and responsibility rest with you.*
