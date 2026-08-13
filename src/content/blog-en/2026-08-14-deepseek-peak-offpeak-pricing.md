---
title: "DeepSeek API Prices Rise August 16 — Here's How Much"
description: "DeepSeek splits its API rates into peak and off-peak on August 16. Here are the increases by model, where the peak windows land in your time zone, and practical ways to hold the bill down."
pubDate: 2026-08-14T08:48:05+09:00
category: ai
tags: ["DeepSeek", "LLM costs", "AI infrastructure", "API pricing"]
lang: en
koSlug: 2026-08-14-deepseek-peak-offpeak-pricing
---

DeepSeek is changing how it bills for API calls starting 16:00 UTC on August 16, 2026. Until now, a token cost the same whether you sent it at noon or at midnight. From that moment on, the clock matters: rates split into a **peak** tier and an **off-peak** tier, and the company's own framing is that off-peak costs half of peak.

Here is the conclusion first. **This is not a discount program. It is a price increase.** Even the off-peak rate sits above what you pay today. Take output tokens on `deepseek-v4-pro`: the current price of $0.87 per million tokens becomes $1.98 off-peak and $3.96 at peak. **That is 2.3x if you run at the cheapest hour of the day, and 4.6x if you run at the most expensive one.**

And one more thing worth knowing before you plan around it: **where the peak window lands depends entirely on where you sit.** For teams in Seoul, Beijing, or Tokyo, the expensive hours are the working hours. For teams in San Francisco, the entire workday is off-peak.

![From above contemporary server cable trays without wires located in modern data center](https://images.pexels.com/photos/5050305/pexels-photo-5050305.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Brett Sayles](https://www.pexels.com/@brett-sayles) on [Pexels](https://www.pexels.com/photo/high-angle-shot-of-network-switch-5050305/)*

## What exactly is changing

Here is the full picture from DeepSeek's official pricing documentation. All figures are **US dollars per million tokens**.

### deepseek-v4-flash

| Item | Current (until Aug 16, 16:00 UTC) | Off-peak | Peak | vs. current |
|---|---|---|---|---|
| Input (cache hit) | $0.0028 | $0.007 | $0.014 | **2.5x / 5x** |
| Input (cache miss) | $0.14 | $0.22 | $0.44 | **1.6x / 3.1x** |
| Output | $0.28 | $0.66 | $1.32 | **2.4x / 4.7x** |

### deepseek-v4-pro

| Item | Current (until Aug 16, 16:00 UTC) | Off-peak | Peak | vs. current |
|---|---|---|---|---|
| Input (cache hit) | $0.003625 | $0.022 | $0.044 | **6.1x / 12.1x** |
| Input (cache miss) | $0.435 | $0.66 | $1.32 | **1.5x / 3.0x** |
| Output | $0.87 | $1.98 | $3.96 | **2.3x / 4.6x** |

*Source: DeepSeek API Docs, Models & Pricing, and the August 13, 2026 announcement "DeepSeek-V4-Pro GA Release." New rates take effect 16:00 UTC on August 16, 2026.*

<figure>
<svg viewBox="0 0 720 300" role="img" aria-label="Price comparison for deepseek-v4-pro output tokens per million. Current 0.87 dollars, off-peak 1.98 dollars, peak 3.96 dollars" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
  <text x="30" y="32" font-size="17" font-weight="700" fill="#23201D">deepseek-v4-pro output — even off-peak costs more than today</text>
  <text x="30" y="54" font-size="13" fill="#8A8378">USD per 1M tokens · lower is better</text>
  <line x1="150" y1="90" x2="150" y2="254" stroke="#E5DECF" stroke-width="1"/>
  <rect x="150" y="100" width="106" height="36" fill="#A8BDD2"/>
  <rect x="150" y="158" width="242" height="36" fill="#4E7FA8"/>
  <rect x="150" y="216" width="484" height="36" fill="#1B4F8A"/>
  <text x="140" y="123" font-size="13" fill="#23201D" text-anchor="end">Current</text>
  <text x="140" y="181" font-size="13" fill="#23201D" text-anchor="end">Off-peak</text>
  <text x="140" y="239" font-size="13" font-weight="700" fill="#1B4F8A" text-anchor="end">Peak</text>
  <text x="266" y="123" font-size="14" font-weight="700" fill="#23201D">$0.87</text>
  <text x="402" y="181" font-size="14" font-weight="700" fill="#23201D">$1.98  (2.3x)</text>
  <text x="620" y="239" font-size="14" font-weight="700" fill="#FAF6EE" text-anchor="end">$3.96  (4.6x)</text>
  <text x="30" y="285" font-size="12" fill="#8A8378">Source: DeepSeek API Docs, Models &amp; Pricing (checked 2026-08-14)</text>
</svg>
<figcaption>DeepSeek says off-peak is half of peak. True — but that half is still 2.3x what the same call costs today.</figcaption>
</figure>

The line that jumps out of the table is **cache-hit input**. On `deepseek-v4-pro`, $0.003625 becomes $0.044 at peak. **That is a 12x increase**, by far the steepest move on the sheet.

Cache hits are the discounted path you get when you send the same prefix over and over — the long system prompt, the tool definitions, the retrieved documents that don't change between calls. Cheap cache reads have been one of DeepSeek's structural advantages, and they mattered most to exactly the workloads people built on top of it: agents that replay a large instruction block on every step, batch pipelines that fan out thousands of near-identical requests. That advantage shrinks substantially.

It is worth holding two facts side by side, though. **The percentage increases are large, but the starting point was very low.** In absolute terms these are still not expensive tokens. Whether the change stings depends almost entirely on volume — a hobby project will not notice, and a pipeline burning billions of tokens a month will notice immediately.

Still, the fact that *caching* took the biggest hit is worth noting. A cache computes something once, holds onto it, and reuses it later — it is the closest thing this industry has to storage. **Putting the steepest price on that tells you what the supplier is currently rationing.**

### What it actually costs you

Assume a service that burns 10 million output tokens a day on v4-pro. Your real bill will depend on input volume and cache-hit rate, so treat this as an output-only comparison rather than a forecast.

| Usage pattern | Monthly output cost | vs. current |
|---|---|---|
| Current pricing | ~$261 | — |
| All traffic shifted to off-peak | ~$594 | +$333 |
| All traffic during peak | ~$1,188 | **+$927** |

*Basis: 10M output tokens/day x 30 days, v4-pro output rates only. Input tokens and cache hits excluded.*

The absolute numbers look modest, but two things deserve attention. First, **even moving everything to off-peak still costs 2.3x**. There is no schedule clever enough to get back to today's bill. Second, for identical usage, **when you run it swings the monthly total by $594.** A pipeline that can move is worth roughly half its own cost — which means teams with a heavy batch component have real money sitting in their cron configuration.

## Where the peak lands depends on your time zone

DeepSeek's peak windows are **01:00–04:00 UTC and 06:00–10:00 UTC**. Everything else is off-peak. Seven hours a day carry the 2x rate; seventeen do not.

Written in UTC that looks neutral. Mapped onto local clocks it is anything but.

| Region | Peak block 1 (UTC 01–04) | Peak block 2 (UTC 06–10) | Effect on a 09:00–18:00 workday |
|---|---|---|---|
| Seoul (UTC+9) | 10:00–13:00 | 15:00–19:00 | Most of the workday is peak |
| Beijing / Shanghai (UTC+8) | 09:00–12:00 | 14:00–18:00 | Essentially the entire workday |
| Frankfurt (CEST, UTC+2) | 03:00–06:00 | 08:00–12:00 | The whole morning is peak |
| London (BST, UTC+1) | 02:00–05:00 | 07:00–11:00 | Early morning is peak |
| San Francisco (PDT, UTC−7) | 18:00–21:00 | 23:00–03:00 | The entire workday is off-peak |

<figure>
<svg viewBox="0 0 720 345" role="img" aria-label="DeepSeek peak windows in UTC compared with local business hours in five regions. San Francisco business hours fall entirely in off-peak, while Seoul and Beijing overlap heavily with peak" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
  <text x="30" y="28" font-size="17" font-weight="700" fill="#23201D">Whose working day is expensive? It depends on the longitude</text>
  <text x="30" y="50" font-size="13" fill="#8A8378">Local 09:00–18:00 mapped onto the UTC clock · dark = peak (2x)</text>
  <rect x="170" y="72" width="450" height="26" fill="#A8BDD2"/>
  <rect x="188.75" y="72" width="56.25" height="26" fill="#1B4F8A"/>
  <rect x="282.5" y="72" width="75" height="26" fill="#1B4F8A"/>
  <text x="160" y="90" font-size="12" font-weight="700" fill="#23201D" text-anchor="end">DeepSeek rate</text>
  <text x="217" y="90" font-size="10" font-weight="700" fill="#FAF6EE" text-anchor="middle">01–04</text>
  <text x="320" y="90" font-size="10" font-weight="700" fill="#FAF6EE" text-anchor="middle">06–10</text>
  <line x1="170" y1="104" x2="620" y2="104" stroke="#8A8378" stroke-width="1"/>
  <text x="170" y="120" font-size="11" fill="#8A8378" text-anchor="middle">0</text>
  <text x="226" y="120" font-size="11" fill="#8A8378" text-anchor="middle">3</text>
  <text x="282" y="120" font-size="11" fill="#8A8378" text-anchor="middle">6</text>
  <text x="339" y="120" font-size="11" fill="#8A8378" text-anchor="middle">9</text>
  <text x="395" y="120" font-size="11" fill="#8A8378" text-anchor="middle">12</text>
  <text x="451" y="120" font-size="11" fill="#8A8378" text-anchor="middle">15</text>
  <text x="508" y="120" font-size="11" fill="#8A8378" text-anchor="middle">18</text>
  <text x="564" y="120" font-size="11" fill="#8A8378" text-anchor="middle">21</text>
  <text x="620" y="120" font-size="11" fill="#8A8378" text-anchor="middle">24</text>
  <text x="170" y="140" font-size="11" fill="#8A8378">UTC hour</text>
  <text x="632" y="140" font-size="10" fill="#8A8378">peak h</text>
  <rect x="170" y="152" width="168.75" height="16" fill="#A8BDD2"/>
  <rect x="188.75" y="152" width="56.25" height="16" fill="#1B4F8A"/>
  <rect x="282.5" y="152" width="56.25" height="16" fill="#1B4F8A"/>
  <text x="160" y="164" font-size="11" fill="#23201D" text-anchor="end">Seoul (UTC+9)</text>
  <text x="632" y="164" font-size="11" font-weight="700" fill="#23201D">6 / 9</text>
  <rect x="188.75" y="180" width="168.75" height="16" fill="#A8BDD2"/>
  <rect x="188.75" y="180" width="56.25" height="16" fill="#1B4F8A"/>
  <rect x="282.5" y="180" width="75" height="16" fill="#1B4F8A"/>
  <text x="160" y="192" font-size="11" fill="#23201D" text-anchor="end">Beijing (UTC+8)</text>
  <text x="632" y="192" font-size="11" font-weight="700" fill="#23201D">7 / 9</text>
  <rect x="301.25" y="208" width="168.75" height="16" fill="#A8BDD2"/>
  <rect x="301.25" y="208" width="56.25" height="16" fill="#1B4F8A"/>
  <text x="160" y="220" font-size="11" fill="#23201D" text-anchor="end">Frankfurt (UTC+2)</text>
  <text x="632" y="220" font-size="11" fill="#23201D">3 / 9</text>
  <rect x="320" y="236" width="168.75" height="16" fill="#A8BDD2"/>
  <rect x="320" y="236" width="37.5" height="16" fill="#1B4F8A"/>
  <text x="160" y="248" font-size="11" fill="#23201D" text-anchor="end">London (UTC+1)</text>
  <text x="632" y="248" font-size="11" fill="#23201D">2 / 9</text>
  <rect x="470" y="264" width="150" height="16" fill="#A8BDD2"/>
  <rect x="170" y="264" width="18.75" height="16" fill="#A8BDD2"/>
  <text x="160" y="276" font-size="11" fill="#23201D" text-anchor="end">San Francisco (UTC−7)</text>
  <text x="632" y="276" font-size="11" font-weight="700" fill="#8A8378">0 / 9</text>
  <rect x="170" y="294" width="12" height="12" fill="#1B4F8A"/>
  <text x="188" y="304" font-size="12" fill="#23201D">Peak — 2x rate</text>
  <rect x="320" y="294" width="12" height="12" fill="#A8BDD2"/>
  <text x="338" y="304" font-size="12" fill="#23201D">Off-peak — all other hours</text>
  <text x="30" y="332" font-size="12" fill="#8A8378">Source: DeepSeek API Docs, peak windows 01:00–04:00 and 06:00–10:00 UTC (checked 2026-08-14)</text>
</svg>
<figcaption>Seven peak hours a day, but they fall very differently depending on where you work. San Francisco's business day ends exactly as the first peak block begins; Beijing's starts inside it.</figcaption>
</figure>

The pattern is clean enough to state in one line: **the entire US West Coast workday is off-peak, Europe loses its whole morning to peak, and East Asia gets hit through most of its working hours.**

None of this is aimed at any particular foreign market. Read the windows in China Standard Time (UTC+8) and they resolve to 09:00–12:00 and 14:00–18:00 — a domestic workday with a lunch break carved out of the middle. **The schedule is designed around DeepSeek's home users**, and everyone else is simply positioned relative to that. If you happen to share a time zone with Beijing, you inherit the peak. If you are eight hours behind, you inherit a permanent discount you did nothing to earn.

For a team in Seoul or Tokyo, that means the hours in which you make the most calls are precisely the hours that cost the most. For a team in San Francisco, the new pricing is close to a non-event during business hours — the expensive windows land in the evening and overnight, when only scheduled jobs are running. Which is, of course, exactly backwards from what you would want if you were the one running the batch jobs.

## Why AI inference is starting to look like electricity

Step back for a second. Peak/off-peak pricing is not a software-industry invention. **The power sector has been doing this for the better part of 130 years.**

The logic behind time-of-use electricity rates is simple. **Electricity is hard to store, and generating capacity has to be built for the maximum demand you ever expect to serve.** If demand spikes for three hours a day, you can either build more plants to cover those three hours or use price to push some of that demand elsewhere. Pushing is cheaper. Industrial tariffs with seasonal and hourly differentials have been standard in many countries for decades, and every cheap-overnight-power scheme rests on the same arithmetic.

GPU inference has exactly the same physics.

| Property | Electricity | AI inference |
|---|---|---|
| Storability | Hard to store at scale | Compute-time cannot be stockpiled |
| Capacity planning | Built for maximum demand | GPUs provisioned for peak concurrency |
| Cost of idleness | Unused capacity in that hour is gone | Idle GPUs in that hour are gone |
| Available lever | Time-of-use rates, demand response | Time-of-use rates |

DeepSeek's stated rationale points in exactly that direction. The company describes the goal of the change as enabling **"more flexible workload scheduling"** — move what isn't urgent into the quiet hours. In the electricity business that is called demand response, and the mechanism is identical.

![black electric pylon under orange clouds during daytime](https://images.unsplash.com/photo-1543489816-c87b0f5f7dd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxoaWdoJTIwdm9sdGFnZSUyMHBvd2VyJTIwbGluZXMlMjB0cmFuc21pc3Npb24lMjB0b3dlcnxlbnwxfDB8fHwxNzg2NjYzNzU3fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Nikola Johnny Mirkovic](https://unsplash.com/@thejohnnyme?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-electric-pylon-under-orange-clouds-during-daytime-Z_dnvde5wxc?utm_source=spice-bandit-blog&utm_medium=referral)*

What makes the parallel more than a metaphor is that the two industries are physically stacked. Running a GPU takes electricity; cooling it takes more. Power is one of the load-bearing components of inference cost. Data center operators already pay time-of-use rates for that power — and now the inference services running on top of those data centers have begun charging time-of-use rates of their own. **The rate structure propagated one layer up the stack.**

**Electricity spilled to ground and an idle GPU are the same kind of loss.** Industries holding that kind of inventory end up dividing their prices by time, and AI inference has now joined the list.

## V4-Pro went GA on the same day

The pricing news did not arrive alone. On August 13, 2026, DeepSeek announced the **general availability of DeepSeek-V4-Pro**, and folded the rate change into the same notice.

The headline changes in V4-Pro:

- **Selectable reasoning effort**: three levels — low / high / max — letting you dial thinking depth to task difficulty. Supported on both v4-pro and v4-flash.
- **Native OpenAI Responses API support**: simplified configuration, clearly with Codex integration in mind.
- Available on web and app as **Expert Mode**.

The raw specs are aggressive too. Both v4-flash and v4-pro support a **1 million token context window with up to 384,000 output tokens**. Concurrency limits are 2,500 for flash and 500 for pro.

So the announcement is a bundle: better model, higher price. You can read that as capability justifying cost, or as a launch providing cover for a repricing. What is not ambiguous is this — **the new rate structure does not apply only to the new model. It applies to v4-flash as well**, including to workloads that gain nothing from the GA release.

## What to do about it

**1. Move batch jobs across the clock.** Anything that isn't latency-sensitive — document summarization, data cleaning, embedding generation, overnight reporting — halves in cost simply by running in an off-peak window. This is usually a cron-schedule edit, which makes it the highest-return change available.

**2. Real-time paths are the exception.** You cannot defer a chatbot response or a search query that a user is waiting on. For those, assume you eat the increase in full and re-derive your unit economics accordingly.

**3. Revisit your caching strategy.** Cache-hit pricing rose the most of any line item — up to 12x on v4-pro at peak. If your architecture assumed "cache reads are nearly free, so a long system prompt is fine," that assumption no longer holds. Trimming system prompts and reconsidering what really needs to sit in the cached prefix may now pay for itself.

**4. Current pricing holds until 16:00 UTC on August 16.** If you have a large backlog batch you have been putting off, running it before the cutover is the cheapest it will ever be. That is a one-time move, though, not a strategy.

**5. Redraw your comparison table.** DeepSeek's advantage was never raw capability — it was capability per dollar. When the dollar side moves by a factor of 2 to 5, the comparison against other providers changes shape. How much of the gap survives is not something anyone can tell you in the abstract; you have to run the numbers on your own workload mix.

## So what — is the cheap-AI era ending?

Read this purely as one company's pricing decision and you miss the more interesting part.

For roughly two years, LLM API prices have moved in one direction: down. Better models arriving at lower prices came to feel like a law of nature rather than a phase of a market. **This change is a counterexample to that trend — and, separately, a signal of something else.**

The more informative fact is not that prices went up. It is that **prices started being divided by time**. A single flat price is what you charge when supply comfortably exceeds demand; you have no reason to steer anyone. Splitting the rate by hour means capacity in specific hours is genuinely tight. When DeepSeek asks customers to spread their workloads out, that request is close to an admission that GPUs are short during those windows.

A distinction matters here. Time-of-use pricing has two possible uses: **cutting the price in the quiet hours to fill idle capacity**, and **raising the price in the busy hours to scatter concentrated demand**. The power industry has long leaned on the first. That is why overnight electricity is cheap.

**DeepSeek's change runs the other way. It raised the price in the valley too.** This is not a tariff designed to fill quiet hours; it is one designed to empty busy ones. The same instrument does opposite work depending on whether you have capacity to spare or capacity to ration, and a single line — the off-peak price — tells you which situation this rate card belongs to.

The next stage of this is already visible one industry over. Cloud computing has long offered reserved instances, which trade a one- or three-year commitment for a rate well below on-demand, and spot instances, which discount far more steeply in exchange for accepting interruption at any moment. That is structurally the same bargain the power sector struck through interruptible-load demand response: accept less certainty, pay less money. Batch-tier discounts already exist across several LLM APIs. **What is missing is not the idea — it is the confidence that demand has hardened enough to write those contracts against.**

So the thing to take from this repricing is not "DeepSeek got expensive." It is that **AI inference is crossing from being a commodity you spend freely into being a resource you have to manage — and the rate card noticed before the rest of us did.**

---

*This article is based on DeepSeek's published documentation and announcements. It is not a recommendation to use or avoid any particular service. Pricing and policies are set by the provider and can change; verify against the official documentation before making decisions.*

**Key sources**
- DeepSeek API Docs, "Models & Pricing" — rate tables, peak/off-peak window definitions, effective date (https://api-docs.deepseek.com/quick_start/pricing, checked 2026-08-14)
- DeepSeek, "DeepSeek-V4-Pro GA Release" announcement (https://api-docs.deepseek.com/news/news260813, 2026-08-13)
