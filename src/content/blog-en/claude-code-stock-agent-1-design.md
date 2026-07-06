---
title: "Building a Stock Trading Bot with Claude Code — The Full Architecture, From Design to Operation [Part 1]"
description: "A 5-part series on building a Korean stock trading bot with Claude Code and a multi-agent design. Part 1 covers the why and the architecture — KIS API, LLM analysts, and safety guards."
pubDate: 2026-06-19T09:00:00+09:00
updatedDate: "2026-07-06T20:30:00+09:00"
category: ai
tags: ["ClaudeCode", "AlgoTrading", "MultiAgent", "LLM"]
lang: en
koSlug: claude-code-stock-agent-1-design
---

## Getting Started

One day a thought struck me. "LLMs are good at analysis, and I can pull market data through a brokerage API — so if I tie the two together, couldn't I build a bot that analyzes stocks for me?"

So I decided to build it. The goal is simple.

1. **Analyze on its own** based on market conditions, and trade stocks that look like high-probability winners **within the account's balance**.
2. Report the balance and trade history at the open and close of each trading day.
3. Tell me the current balance or trade history anytime I ask.
4. For any ticker I designate, review it and then either buy it or discard it.

This series is a record of that process. It isn't an article that tidies up finished code and shows it off — it captures the actual journey of getting stuck and fixing things as I went. That's the only way someone following along can avoid the same traps.

![Man standing at a whiteboard planning UX design concepts in a modern office setting.](https://images.pexels.com/photos/1181343/pexels-photo-1181343.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Christina Morillo](https://www.pexels.com/@divinetechygirl) on [Pexels](https://www.pexels.com/photo/man-wearing-blue-dress-shirt-facing-whiteboard-1181343/)*

## Why Multi-Agent?

At first I thought, "Can't I just hand one LLM the prompt 'analyze this stock and tell me whether to buy it'?" But that's risky. If you ask a single model to look at the financials, the chart, and the news, and reach a conclusion all at once, the analysis turns mushy. People work the same way, don't they? You have a financial expert, a chart expert, and a news analyst, each separate — and a different person who synthesizes their opinions and makes the decision.

So I split up the roles. My reference was the common structure shared by multi-agent trading frameworks: a layered architecture where analysts each gather information, synthesis and judgment happen on top of that, and finally risk is checked before execution.

The core principle boils down to one thing. **Analysts look only at data, without bias; decisions happen at the synthesis stage; and execution is handled by deterministic code.**

## The Overall Architecture

The design I landed on looks like this.

**Layer 1 — Three analysts (read-only, run in parallel)**
- Fundamental analyst: Is the company good at making money, and is the current share price cheap or expensive?
- Technical analyst: How is the chart trending, and is now a good time to buy?
- News analyst: Are there any bad or good catalysts in disclosures or news?

These three only produce opinions (scores); they don't buy or sell directly. Each digs deep into its own domain, and they run in parallel at the same time to keep things fast.

**Layer 2 — Synthesis and judgment (the parent)**
This gathers the three analysts' scores and decides "so, do we buy or not?" Here I made one important design decision. I did not include a biased agent like the "aggressive investment strategist" you often see. If "buy aggressively" is baked into an agent's identity, it gets pulled toward buying regardless of what the analysis says. Instead, the parent itself builds out both the bullish case and the bearish case to keep things balanced.

**Layer 3 — Risk manager**
No matter how good a stock is, if the state of the account doesn't allow it, the risk manager blocks it. "What percentage of the account would this stock be? Aren't we going all-in on a single name? Is there enough cash?" Goal #1's "trade within the balance" is exactly this role.

**Layer 4 — Execution gate (deterministic code)**
This is the most important part. The LLM does not place the actual orders. An order is only sent if it passes **non-negotiable hard rules** like the kill switch, the daily loss limit, and the single-name position cap. The LLM only proposes "let's buy" — the actual "place order" button is pressed solely by the deterministic gate.

![graphical user interface, application](https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzdG9jayUyMHRyYWRpbmclMjBhdXRvbWF0aW9ufGVufDF8MHx8fDE3ODE4NTEzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Anne Nygård](https://unsplash.com/@polarmermaid?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface-application-x07ELaNFt34?utm_source=spice-bandit-blog&utm_medium=referral)*

## What LLMs Are Good At, and What You Can't Trust Them With

There's one principle I held to throughout the work. **Let the LLM handle what it's good at (interpretation and judgment), and let code handle what you can't trust the LLM with (number crunching, dates, ticker codes).**

For example, technical indicators like RSI or moving averages are calculated precisely in Python and then handed to the analyst. If you throw 100 prices at an LLM and say "calculate the RSI," it's both inaccurate and expensive. Likewise, the risk manager's quantity calculations are all done in Python. When it comes to money, not a single won can be off.

In fact, late in the project the LLM made up the analysis date (`as_of`) as 2023, the time of its own training. Not knowing today's date, it filled it in with a hallucination. I solved this kind of thing by having the code forcibly stamp today's date.

## Safety First

Since this is a system where real money moves, I put safety first from start to finish.

- **Start with a paper account**: Only after thoroughly validating with fake money do I even consider going live.
- **Manual mode by default**: The bot only proposes — "should I buy this?" — and it actually buys only after I approve. Once trust is built, I switch it to auto.
- **Swappable LLM design**: The analysts' brains are abstracted so I can swap in Claude or Gemini at will. If you pin the output to a JSON schema, whatever model you use looks the same from the parent's point of view.

## Want to Follow Along? — Prerequisites and Roadmap

For those who want to build it themselves, let me first lay out the prerequisites and the order needed for the whole series.

**Things worth preparing in advance**
- A brokerage account + open API application: based on Korea Investment & Securities (KIS). Along with your live account, apply for a **paper-trading account** too (for validation).
- Python 3.x installed
- An LLM API key: for the analyst's brain (e.g., a free Gemini key from Google AI Studio)
- A Telegram bot: for receiving reports and approving on your phone (details in Part 5)

**Difficulty and time**: If you can read a bit of code, that's enough. Roughly 30 minutes to an hour per part, and about one weekend day for the whole thing to get a first version running.

**Series roadmap**
- Part 1 (this article): Why and with what architecture — the design
- Part 2: Connecting the brokerage API (KIS) — the foundation for quotes, balances, and orders
- Part 3: Designing the three LLM analysts — the brain behind the judgment
- Part 4: Risk and safety guards — safe even if you buy the wrong thing
- Part 5: Automated execution and Telegram — unattended operation

**The most important principle**: Don't go straight to a live account. Always validate thoroughly with paper trading first, then move on to small-scale live trading.

## Coming Up Next

That's enough on design. From the next part on, it's real code. [Part 2 starts with issuing API keys and setup (the prerequisites), then covers connecting to the Korea Investment & Securities API](/blog/claude-code-stock-agent-2-kis-api/), which is the foundation for everything. I'll be honest about the traps I actually ran into and how I solved them — the 1-minute token issuance limit, the paper-trading server's capricious 500 errors, and more. If you want to build along, start from "Before You Begin" in Part 2.

The whole way through, what I felt was that in a system like this, far more important than fancy analysis logic is **assuming external APIs can be unstable at any time and defending against that**. More on that next time.

---

📚 **Next →** [② Connecting the Korea Investment & Securities API](/blog/claude-code-stock-agent-2-kis-api/)

*※ This article is a personal project write-up, not a recommendation to buy or sell any specific stock and not investment advice. Automated trading carries the risk of loss, and all investment decisions and responsibility rest with you.*
