---
title: "Stock Bot LLM Analyst Design — Fundamental, Technical & News Agent Prompts and JSON Schema"
description: "Designing the brain of a Claude Code stock trading bot. Prompt design for three analysts (fundamental, technical, news), enforcing a JSON schema, LLM retries and fallback, and a stock screener — real implementation."
pubDate: 2026-06-21T09:00:00+09:00
category: ai
tags: ["ClaudeCode", "LLM", "Gemini", "PromptEngineering"]
lang: en
koSlug: claude-code-stock-agent-3-analysts
---

> 📚 **Series — Building a Stock Investing Agent with Claude Code**
> [① Purpose and Design](/blog/claude-code-stock-agent-1-design/) · [② Connecting the KIS API](/blog/claude-code-stock-agent-2-kis-api/) · **③ The Analysts' Brains** · [④ Trading and Safety Guards](/blog/claude-code-stock-agent-4-trade-safety/) · [⑤ Operations Automation](/blog/claude-code-stock-agent-5-operations/)

> **Prerequisite**: You need an LLM API key to serve as the analysts' brains. I got a Gemini API key from Google AI Studio and put it in the `GEMINI_API_KEY` field of the `.env` I created in [Part 2](/blog/claude-code-stock-agent-2-kis-api/). My default model was `gemini-2.5-flash` (cost is at the end of the article).

## Three Brains

Now it's time to build the heart of the bot: the analysts. I built three, but designed them so their tendencies complement one another.

- **Fundamental analyst — growth-oriented**: Prefers companies whose earnings are growing fast and whose ROE is high, not merely cheap stocks. Even with a high PER, it gives a generous score if growth justifies it.
- **Technical analyst — balanced**: Looks at both trend direction (momentum) and overbought/oversold conditions (mean reversion). It doesn't lean to one side.
- **News analyst — sensitive to bad news**: Its role isn't to find good stocks but to filter out danger signals that mean "don't buy" — a safety valve.

Two that look for good stocks, and one that prevents accidents. The three are set up to keep each other in check.

![Business professionals discussing financial graphs on a flipchart during a daylight meeting.](https://images.pexels.com/photos/7876668/pexels-photo-7876668.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [www.kaboompics.com](https://www.pexels.com/@karola-g) on [Pexels](https://www.pexels.com/photo/a-man-in-eyeglasses-studying-the-graph-on-the-board-7876668/)*

## Pinning the Output to a JSON Schema

The very first thing I did was nail down the analysts' output format. For the parent to take the three results and synthesize them, the format has to be consistent. So I defined a common JSON schema.

```json
{
  "analyst": "fundamental",
  "symbol": "005930",
  "stance": "neutral",       // bullish/neutral/bearish
  "score": 45,                // 0~100
  "confidence": 0.6,          // confidence level
  "key_points": ["..."],      // numeric evidence
  "risks": ["..."],
  "data_gaps": ["..."],       // items that couldn't be verified (no guessing)
  "as_of": "2026-06-19"
}
```

The key was including `confidence` and `data_gaps` (items that couldn't be verified). When an analyst lacks data, it honestly lowers its confidence and doesn't fill in missing information with guesses. This is to prevent it from saying "looks great!" off of empty data.

## At First I Asked via the Prompt; It Didn't Work, So I Forced It

The first call was a half-success. The analysis content was excellent (with Samsung Electronics at a PER of 55 and near its 52-week high, it cautiously went neutral), but the field names differed from our schema. It used `stock_code` instead of `symbol`, and left out `stance` entirely.

Merely asking via the prompt — "answer in this format" — leaves the LLM free to change things its own way. So I used the Gemini API's `responseSchema` feature to **enforce the structure**. Not a request, but enforcement. With this, it emits exactly the 9 defined fields, in the defined order.

## Hallucination Again — Making Up the Date

Once I enforced the schema, the format was correct — but this time it filled `as_of` (the data reference date) with **2023-10-27**. It's 2026. Not knowing today's date, the LLM hallucinated it as the time of its own training.

The fix is exactly the principle from Part 1. **Code handles what the LLM can't be trusted with.** After receiving the response, Python forcibly overwrites the date and the ticker code.

```python
result["as_of"] = datetime.now().strftime("%Y-%m-%d")
result["symbol"] = symbol
```

## Indicators by Python, Interpretation by the LLM

The technical analyst needs indicators like RSI, moving averages, and MDD. But if you throw 100 prices at an LLM and say "calculate the RSI," it's inaccurate and just burns tokens. So Python calculates the indicators precisely and hands them over as clean numbers, and the LLM only **interprets** those numbers.

```
100 daily candles → indicators.py computes RSI/MA/MDD → analyst only interprets
```

In practice, when I ran Samsung Electronics through the technical analyst, it answered like this: with a bullish alignment (uptrend) and an RSI of 63.2, "on the verge of overbought but healthy momentum, bullish, 75 points." That said, it flagged declining volume and proximity to the high as risk factors. It didn't just call everything rosy — it saw the weaknesses too.

![a computer circuit board with a brain on it](https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZGF0YSUyMGFuYWx5c2lzfGVufDF8MHx8fDE3ODE4NTEzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Steve A Johnson](https://unsplash.com/@steve_j?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-circuit-board-with-a-brain-on-it-_0iV9LmPDn0?utm_source=spice-bandit-blog&utm_medium=referral)*

## Survival of an Unattended System — Retries and Model Fallback

LLM calls are external API calls too, so they're unstable. In practice, `503 Service Unavailable` (server overload) came up often. So I put in two layers of defense.

1. **Retry (backoff)**: On a 503 or 429, retry with increasing waits — 1 second, 2 seconds, 4 seconds.
2. **Model fallback chain**: If that still fails, automatically switch to another model — `gemini-2.5-flash` → `flash-lite` → `2.0-flash`, in that order.

One thing I learned here: a 503 means that model's server is busy, so it isn't solved by "upgrading" to a pricier model. If anything, a lighter, different model might be idle. So the right move isn't "upgrade" but "try several candidates in turn." In fact, when the primary model got busy right after market close, the fallback kicked in several times and kept the bot alive.

## Operating Cost — Up to 300 Won a Day

The cost story everyone's most curious about. The analysts call the LLM multiple times per ticker even within a single day, but **on `gemini-2.5-flash`, the API cost was at most about 300 won per day**. Honestly, far cheaper than I'd expected before starting.

The reason is thanks to the design principle I set earlier. Heavy calculations like RSI, moving averages, and MDD are finished off by Python, and only **a few already-tidied numbers and a short instruction** are passed to the LLM. Because I don't dump all 100 prices on it, the input tokens are small, and the output is short too — a JSON of 9 fields. The boundary "the LLM only interprets" paid off not just in accuracy but **in cost as well**. I ran three analysts for less than the price of a single daily cup of coffee. (Prices can vary by model, usage, exchange rate, and timing.)

## Letting It Pick Stocks on Its Own — The Screener

At first I fed in ticker codes one by one. That was only half a system. The bot needs to decide "what to look at today" in the first place.

Here I made an important call. **You must not let the LLM do stock discovery.** If you say "pick some Korean stocks worth buying today," it'll hallucinate and spit out random tickers, pick based on outdated information, or invent nonexistent ticker codes. Stock discovery is the job of "filtering thousands of names by objective numeric criteria," and that's a job for data screening (code), not an LLM.

So I pulled the top names using KIS's trading-value ranking API, then narrowed the candidates through price and type filters (excluding ETFs and preferred shares). With a focus on liquid, mainstream names, it's safe even for market-order trading. The structure is two stages.

```
[Stage 1] Screener (code) — top trading value → 8 candidates
[Stage 2] Three analysts (LLM) — deep analysis of those candidates only
```

When I actually ran it, names like SK hynix, Samsung Electronics, Samsung Electro-Mechanics, and SK Square came up in real time at the top of trading value. That day, semiconductors were strong.

## The First Synthesized Decision

I called the three analysts in parallel and had the parent synthesize via a weighted average (fundamental 50%, technical 30%, news 20%). Running Samsung Electronics gave this.

- Fundamental 50 (neutral) — PER 55, valuation burden
- Technical 75 (bullish) — strong uptrend
- News 60 (neutral) — no data
- **Composite 59.5 → hold** (below the buy threshold of 65)

Technically tempting, but the fundamental burden held it back, so it held. The bot didn't buy impulsively; it judged calmly. With the three opinions properly checking one another, a reasonable conclusion came out.

I made the synthesis method switchable via config between weighted average and "unanimous consent" (buy only when all three are bullish). I started with the weighted average, leaving room to change it after backtesting.

## Next Up

The brain is complete. It picks stocks, analyzes them, and reaches a conclusion. But it still can't buy or sell. [In the next part, we build the risk manager (the safety valve that sets the quantity within the balance) and the execution gate (the deterministic line of defense that actually places orders), and go all the way to the moment the bot buys its first real stock.](/blog/claude-code-stock-agent-4-trade-safety/)

---

📚 [← ② Connecting the KIS API](/blog/claude-code-stock-agent-2-kis-api/) ·  **Next →** [④ Trading and Safety Guards](/blog/claude-code-stock-agent-4-trade-safety/)

*※ This article is a personal project write-up, not a recommendation to buy or sell any specific stock and not investment advice. Automated trading carries the risk of loss, and all investment decisions and responsibility rest with you.*
