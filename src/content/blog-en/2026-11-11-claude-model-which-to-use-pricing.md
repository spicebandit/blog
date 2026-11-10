---
title: "Which Claude Model Should You Use? 5.2 vs 5.5 Pricing Explained"
description: "Claude Fable 5.2 shipped on November 9, bringing the lineup to four models. Here's what each one costs, how to switch models in Claude Code, and the four changes that will break your code — all from the official docs."
pubDate: 2026-11-11T05:23:33+09:00
category: ai
tags: ["Claude", "Claude Code", "LLM Pricing", "AI Dev Tools"]
lang: en
koSlug: 2026-11-11-claude-model-which-to-use-pricing
---

**Short answer.** As of November 11, 2026 there are four Claude models, and **most work should start on `claude-opus-5-5`** — $4 per million input tokens, $20 per million output. The official docs say it outright: "most workloads start with Claude Opus 5.5." The newly released **Claude Fable 5.2 (`claude-fable-5-2`) sits a tier above** at exactly double the price ($8/$40), and the docs spell out when to reach for it: **when your evals on Opus 5.5 at `xhigh` or `max` effort still fall short.** Short of that, you're paying twice as much for nothing.

This piece lays out the pricing, the personality, and the changed rules for all four models. First, one-line answers to the three questions people actually arrive with.

| Question | One-line answer |
|------|----------|
| Which model should I use? | Default to **Opus 5.5**. Use **Sonnet 5.5** for everyday coding and high-volume work, **Haiku 5.5** for classification and extraction at scale, and **Fable 5.2** only for work Opus can't finish |
| What does Fable 5.2 cost? | **$8** in / **$40** out per MTok — a **20% cut** from Fable 5.1 ($10/$50). Batch is half ($4/$20), fast mode is double ($16/$80) |
| How do I switch models in Claude Code? | `/model fable` mid-session (or `opus`, `sonnet`, `haiku`). To make it stick, set `"model"` in `~/.claude/settings.json` or export `ANTHROPIC_MODEL` |

![Open laptop with visible code on screen on a wooden desk in a modern, cozy workspace.](https://images.pexels.com/photos/34803986/pexels-photo-34803986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Daniil Komov](https://www.pexels.com/@dkomov) on [Pexels](https://www.pexels.com/photo/modern-laptop-displaying-code-in-cozy-workspace-34803986/)*

## The answer first: all four models on one page

Everything below comes from the official model comparison table (platform.claude.com, retrieved 2026-11-11). All four models share a 1M-token context window, a 128K max output on synchronous calls, text and image input, and a June 2026 reliable knowledge cutoff.

| Model | API model ID | Input $/MTok | Output $/MTok | Cache hit $/MTok | API default effort | Relative latency |
|------|-------------|------------|------------|----------------|----------------|-----------|
| **Claude Fable 5.2** | `claude-fable-5-2` | **$8** | **$40** | $0.20 (0.025×) | `high` | Moderate |
| **Claude Opus 5.5** | `claude-opus-5-5` | **$4** | **$20** | $0.20 (0.05×) | `medium` | Moderate |
| **Claude Sonnet 5.5** | `claude-sonnet-5-5` | **$2** | **$10** | $0.10 (0.05×) | `high` | Fast |
| **Claude Haiku 5.5** | `claude-haiku-5-5` | **From $0.10** | **From $0.50** | From $0.01 | `medium` | Fastest |

*Sources: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (Anthropic official docs, retrieved 2026-11-11)*

That "from" on Haiku 5.5 carries a condition. **Prompts up to 100,000 tokens bill at $0.10/$0.50; go over that threshold and the rate jumps five-fold to $0.50/$2.50.** Any design that shovels a long document wholesale into Haiku is far more expensive than the first line of the price table suggests. Cache hits move with it, from $0.01 to $0.05.

**Claude Mythos 5.2**, which appears alongside Fable throughout the docs, has identical specs and pricing — but it's only available to organizations cleared through an Anthropic verification program such as the Cyber Verification Program. For everyone else, read it as a footnote to Fable 5.2.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:28px 0">
<svg viewBox="0 0 700 300" role="img" aria-label="Bar chart comparing input and output prices per million tokens across four Claude models. Fable 5.2 is the most expensive at 8 dollars input and 40 dollars output; Haiku 5.5 is the cheapest at 0.10 and 0.50 dollars." style="width:100%;height:auto">
<text x="12" y="22" font-size="14" font-weight="700" fill="#23201D">Price per million tokens — lower is cheaper (USD)</text>
<text x="12" y="40" font-size="11" fill="#8A8378">Top bar = input · Bottom bar = output</text>
<line x1="120" y1="56" x2="120" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="220" y1="56" x2="220" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="320" y1="56" x2="320" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="420" y1="56" x2="420" y2="262" stroke="#E5DECF" stroke-width="1"/>
<line x1="520" y1="56" x2="520" y2="262" stroke="#E5DECF" stroke-width="1"/>
<!-- Fable 5.2 -->
<text x="112" y="76" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">Fable 5.2</text>
<rect x="120" y="60" width="80" height="14" fill="#4E7FA8"/>
<text x="208" y="71" font-size="11" fill="#23201D">$8</text>
<rect x="120" y="78" width="400" height="14" fill="#1B4F8A"/>
<text x="528" y="89" font-size="11" font-weight="700" fill="#1B4F8A">$40</text>
<!-- Opus 5.5 -->
<text x="112" y="134" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">Opus 5.5</text>
<rect x="120" y="118" width="40" height="14" fill="#A8BDD2"/>
<text x="168" y="129" font-size="11" fill="#23201D">$4</text>
<rect x="120" y="136" width="200" height="14" fill="#4E7FA8"/>
<text x="328" y="147" font-size="11" fill="#23201D">$20</text>
<!-- Sonnet 5.5 -->
<text x="112" y="192" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">Sonnet 5.5</text>
<rect x="120" y="176" width="20" height="14" fill="#A8BDD2"/>
<text x="148" y="187" font-size="11" fill="#23201D">$2</text>
<rect x="120" y="194" width="100" height="14" fill="#A8BDD2"/>
<text x="228" y="205" font-size="11" fill="#23201D">$10</text>
<!-- Haiku 5.5 -->
<text x="112" y="250" font-size="12" font-weight="700" text-anchor="end" fill="#23201D">Haiku 5.5</text>
<rect x="120" y="234" width="2" height="14" fill="#A8BDD2"/>
<text x="130" y="245" font-size="11" fill="#8A8378">$0.10</text>
<rect x="120" y="252" width="5" height="14" fill="#A8BDD2"/>
<text x="133" y="263" font-size="11" fill="#8A8378">$0.50 (prompts up to 100K tokens)</text>
<text x="116" y="280" font-size="10" fill="#8A8378">0</text>
<text x="212" y="280" font-size="10" fill="#8A8378">10</text>
<text x="312" y="280" font-size="10" fill="#8A8378">20</text>
<text x="412" y="280" font-size="10" fill="#8A8378">30</text>
<text x="512" y="280" font-size="10" fill="#8A8378">40</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;margin-top:8px">The output rate is what decides the bill. Fable 5.2 costs 2× Opus 5.5, 4× Sonnet 5.5, and 80× Haiku 5.5 at its lower tier ($0.50/MTok). Source: Anthropic Pricing docs, retrieved 2026-11-11.</figcaption>
</figure>

Put it in concrete terms. **For one job that burns 1M input tokens and 200K output tokens** (no cache hits, list price, simple arithmetic), Fable 5.2 runs $16, Opus 5.5 $8, and Sonnet 5.5 $4. Haiku 5.5 comes to **$1.00** — the first line of the table ($0.10/$0.50) would suggest $0.20, but a 1M-token input is ten times over the 100K threshold, so the higher tier ($0.50/$2.50) applies. Read only one line of the price table and you'll be off by five-fold.

For a team running agents dozens of times a day, those multiples land directly on the monthly invoice.

## What changed on November 9: Fable 5.2 is 20% cheaper than its predecessor

Fable 5.2 and Mythos 5.2 were **released on November 9, 2026**. The retirement commitment in the docs reads "not sooner than November 9, 2027" — so the model ID is good for at least a year.

The price came down across the board.

| Item | Fable 5.1 (previous) | Fable 5.2 | Change |
|------|------------------|-----------|------|
| Input | $10 / MTok | **$8 / MTok** | −20% |
| Output | $50 / MTok | **$40 / MTok** | −20% |
| 5-minute cache write | $12.50 / MTok | $10 / MTok | −20% |
| 1-hour cache write | $20 / MTok | $16 / MTok | −20% |
| Cache hits and refreshes | $0.25 / MTok | $0.20 / MTok | −20% (same 0.025× multiplier) |

*Sources: [Pricing](https://platform.claude.com/docs/en/about-claude/pricing), [What's new in Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2)*

For capability, Anthropic's own published benchmarks are what we have. The useful comparison isn't just against the previous Fable — it's **against Opus 5.5, the tier below**, because that's the decision you're actually making.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:28px 0">
<svg viewBox="0 0 700 390" role="img" aria-label="Bar chart comparing benchmark scores for Fable 5.1, Opus 5.5 and Fable 5.2. FrontierCode 2.0 scores 32.4, 45.5 and 49.1 percent; AutomationBench scores 31.4, 42.5 and 51.4 percent; AA-Briefcase scores 61.5, 61.2 and 66.1 percent." style="width:100%;height:auto">
<text x="12" y="22" font-size="14" font-weight="700" fill="#23201D">Benchmark scores (%, higher is better)</text>
<text x="12" y="40" font-size="11" fill="#8A8378">Light bar = Fable 5.1 · Mid bar = Opus 5.5 · Dark bar = Fable 5.2</text>
<line x1="230" y1="56" x2="230" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="335" y1="56" x2="335" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="440" y1="56" x2="440" y2="352" stroke="#E5DECF" stroke-width="1"/>
<line x1="545" y1="56" x2="545" y2="352" stroke="#E5DECF" stroke-width="1"/>
<!-- FrontierCode 2.0 -->
<text x="222" y="84" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">FrontierCode 2.0</text>
<rect x="230" y="62" width="113" height="11" fill="#A8BDD2"/>
<text x="349" y="71" font-size="10" fill="#8A8378">32.4</text>
<rect x="230" y="75" width="159" height="11" fill="#4E7FA8"/>
<text x="395" y="84" font-size="10" fill="#23201D">45.5</text>
<rect x="230" y="88" width="172" height="11" fill="#1B4F8A"/>
<text x="408" y="97" font-size="10" font-weight="700" fill="#1B4F8A">49.1</text>
<!-- FrontierSWE v2 -->
<text x="222" y="146" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">FrontierSWE v2</text>
<rect x="230" y="124" width="197" height="11" fill="#A8BDD2"/>
<text x="433" y="133" font-size="10" fill="#8A8378">56.3</text>
<rect x="230" y="137" width="218" height="11" fill="#4E7FA8"/>
<text x="454" y="146" font-size="10" fill="#23201D">62.3</text>
<rect x="230" y="150" width="245" height="11" fill="#1B4F8A"/>
<text x="481" y="159" font-size="10" font-weight="700" fill="#1B4F8A">69.9</text>
<!-- AutomationBench -->
<text x="222" y="208" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">AutomationBench</text>
<rect x="230" y="186" width="110" height="11" fill="#A8BDD2"/>
<text x="346" y="195" font-size="10" fill="#8A8378">31.4</text>
<rect x="230" y="199" width="149" height="11" fill="#4E7FA8"/>
<text x="385" y="208" font-size="10" fill="#23201D">42.5</text>
<rect x="230" y="212" width="180" height="11" fill="#1B4F8A"/>
<text x="416" y="221" font-size="10" font-weight="700" fill="#1B4F8A">51.4</text>
<!-- Terminal-Bench-Science 0.1 -->
<text x="222" y="270" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">Terminal-Bench-Science 0.1</text>
<rect x="230" y="248" width="184" height="11" fill="#A8BDD2"/>
<text x="420" y="257" font-size="10" fill="#8A8378">52.6</text>
<rect x="230" y="261" width="205" height="11" fill="#4E7FA8"/>
<text x="441" y="270" font-size="10" fill="#23201D">58.7</text>
<rect x="230" y="274" width="261" height="11" fill="#1B4F8A"/>
<text x="497" y="283" font-size="10" font-weight="700" fill="#1B4F8A">74.6</text>
<!-- AA-Briefcase v1.1 -->
<text x="222" y="332" font-size="11" font-weight="700" text-anchor="end" fill="#23201D">AA-Briefcase v1.1</text>
<rect x="230" y="310" width="215" height="11" fill="#A8BDD2"/>
<text x="451" y="319" font-size="10" fill="#8A8378">61.5</text>
<rect x="230" y="323" width="214" height="11" fill="#4E7FA8"/>
<text x="450" y="332" font-size="10" fill="#23201D">61.2</text>
<rect x="230" y="336" width="231" height="11" fill="#1B4F8A"/>
<text x="467" y="345" font-size="10" font-weight="700" fill="#1B4F8A">66.1</text>
<text x="226" y="372" font-size="10" fill="#8A8378">0</text>
<text x="326" y="372" font-size="10" fill="#8A8378">30</text>
<text x="431" y="372" font-size="10" fill="#8A8378">60</text>
<text x="536" y="372" font-size="10" fill="#8A8378">90</text>
</svg>
<figcaption style="font-size:12px;color:#8A8378;margin-top:8px">Coding (FrontierCode 2.0) and automation (AutomationBench) gained close to 20 points over the previous Fable. On knowledge work (AA-Briefcase), Fable 5.2 scores 66.1% against Opus 5.5's 61.2% — a 4.9-point gap — and on the same benchmark's Elo, Opus 5.5 leads 1800 to 1785. All scores at each model's highest available effort. Source: Anthropic product page (claude/fable), retrieved 2026-11-11.</figcaption>
</figure>

**What this chart really measures is scope of application, not price.** Coding, scientific computation, and automation all pulled away from the previous Fable by roughly 20 points, with a clear margin over Opus 5.5 as well. But on the knowledge-work benchmark the rubric gap narrows to 4.9 points, and **on that benchmark's Elo rating Opus 5.5 actually comes out ahead — 1800 versus 1785.** If your team's bread and butter is summarizing documents and drafting reports, moving to Fable 5.2 "because it's newest" doubles the bill for an improvement you may not feel at all. These are vendor-published numbers too, which is another reason the official advice — sweep effort against your own eval set first — comes before any model swap.

## Why the price table alone will mislead you: cache, batch, and fast mode

Real invoices aren't decided by the base rates in that table. Three other variables matter more.

**First, the cache hit rate.** Prompt caching uses a different multiplier per model. The docs split the lineup into three groups.

| Cache hit multiplier | Models |
|---------------|-----------|
| **0.025× base input** | Fable 5.2 · Mythos 5.2 · Fable 5.1 · Mythos 5.1 |
| **0.05×** | Opus 5.5 · Sonnet 5.5 |
| **0.1× (standard)** | Every other model |

That produces one genuinely interesting number. **Fable 5.2's cache hit rate ($0.20) is identical to Opus 5.5's ($0.20)** — the base input price is double, but reading from cache costs exactly the same, because the multipliers are 0.025× against 0.05×.

So **in a long agent session that reuses the same system prompt and tool definitions across dozens of turns, the input-cost gap between the two models shrinks dramatically.** It doesn't vanish, though: cache *writes* are still double (5-minute $10 vs $5, 1-hour $16 vs $8), and any input that misses the cache is double. What's left is the output gap ($40 vs $20) plus cache writes. At the other extreme — one-shot calls with a fresh prompt every time — you pay the full 2× printed in the table. Which means the cost of adopting Fable 5.2 is simply different for a team that has designed its caching than for one that hasn't.

None of this structure is new. Cache pricing is a **two-part tariff** — you pay above the base rate to write (1.25–2×) and a sliver to read (0.025–0.05×) — and cloud computing shipped the same shape seventeen years ago. The EC2 Reserved Instances that AWS announced on March 12, 2009 charged **$325 up front plus $0.030 per hour** for a one-year Small instance, against $0.10 per hour on demand. Tariffs like this always behave the same way: **the discount only reaches whoever designed for reuse, while the team whose prompt changes every call pays the write premium and never sees a hit.**

**Second, the Batch API.** Anything that can run asynchronously gets 50% off both input and output. That puts Fable 5.2 at $4/$20 — the same as Opus 5.5 at list price. Overnight analysis, classification runs, and bulk refactors belong here.

**Third, fast mode.** Fable 5.2 and Mythos 5.2 support fast mode on Messages API requests at $16/$80, double list price, for what the docs describe as up to 2.5× higher output speed. That's worth paying for in an interactive UI where a human is waiting. Use it on work that could have gone to batch and you're paying **double list price, or four times the batch rate** — and note that fast mode and the Batch API can't be combined.

The 50% batch discount and the 2× fast-mode premium are really two ends of one axis: **pricing not the computation but *when you want the result*.** Cloud got there first here too. When AWS introduced Spot Instances in December 2009, the workloads it named as a good fit were image and video conversion and rendering, data processing, financial modeling, web crawling, and load testing — essentially the same list the docs now point toward the Batch API. What changed is the billing unit: instance-hours became tokens.

![Showing blue LED screens giving MAC address and serial number. White cables are Ethernet cables.](https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Rear_of_rack_at_NERSC_data_center_-_closeup.jpg/1280px-Rear_of_rack_at_NERSC_data_center_-_closeup.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail)
*Image: Derrick Coetzee from Berkeley, CA, USA · [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg) · [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en)*

There's one more hidden variable. **The tokenizer changed.** The current tokenizer, introduced with the Opus 4.7 generation, produces **roughly 30% more tokens for the same text** (Sonnet 4.6 and earlier use the previous one), and the exact increase depends on content and workload shape. So moving from Sonnet 4.6 to Sonnet 5.5 cuts the rate from $3 to $2, but the token count rises — and your actual savings are smaller than the table implies. That's precisely why the docs tell you to re-measure your own prompts with `count_tokens` before switching. Limit-related failures of the kind covered in [Claude error messages and how to fix them](/en/blog/2026-08-26-claude-error-messages-fix-guide/) can compound with that token increase.

## How to switch models in Claude Code: one command

Short answer: **mid-session, it's `/model`.** Append an alias, or run it bare to open the interactive picker.

```bash
# Switch mid-session
/model fable          # the Fable line
/model opus           # latest Opus
/model sonnet         # latest Sonnet
/model haiku          # fast Haiku
/model opusplan       # plan with Opus, execute with Sonnet
/model default        # back to the account default

# Set at launch
claude --model fable

# Environment variable
export ANTHROPIC_MODEL=claude-fable-5-2
```

To make it permanent, write it into `~/.claude/settings.json`.

```json
{
  "model": "opus",
  "modelSettings": {
    "claude-opus-5-5": { "effortLevel": "medium" }
  }
}
```

There's also a top-level `"effortLevel"`, but **it doesn't apply to Opus 5.5 and newer.** For the 5.5-generation models, effort has to be set per model ID inside `modelSettings` as shown above. Set it only at the top level and your config will save cleanly and do nothing.

**Which model an alias resolves to depends on how you connect.** This is the source of the "why does `/model sonnet` give me an older model on my work account?" confusion.

| Access path | `opus` | `sonnet` | `haiku` |
|-----------|--------|----------|---------|
| Anthropic API | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
| Claude Platform on AWS | Opus 5.5 | Sonnet 4.6 | Haiku 4.5 |
| Amazon Bedrock · Google Cloud Agent Platform | Opus 5.5 | Sonnet 4.5 | Haiku 4.5 |
| Microsoft Foundry | Opus 4.6 | Sonnet 4.5 | Haiku 4.5 |

*Source: [Claude Code — Model configuration](https://code.claude.com/docs/en/model-config) (retrieved 2026-11-11)*

The `fable` alias is path-dependent too, which is why **the safe move when you need a specific model is to name the model ID (`claude-fable-5-2`) rather than an alias.** The default model is Opus 5.5 on Pro, Max, Ultra, Team, Enterprise, and the Anthropic API alike (Microsoft Foundry is the exception, at Sonnet 4.5). Fable 5.2 is available to all Claude API customers, in Claude Code, and — per Anthropic's product page — on claude.ai for Pro, Max, Ultra, Team, and Enterprise.

**Effort is a more important lever than model choice.** The docs say so directly: "Tuning effort is often a better lever than switching models." In Claude Code you change it with `/effort`.

```bash
/effort high          # low · medium · high · xhigh · max
/effort ultracode     # dynamic workflow planning mode
export CLAUDE_CODE_EFFORT_LEVEL=high
```

Fable 5.2, Opus 5.5, Sonnet 5.5, and Haiku 5.5 all support the full five-step ladder. **The one thing to watch is that the defaults differ between the API and Claude Code** — on the API, Fable 5.2 and Sonnet 5.5 default to `high` while Opus 5.5 and Haiku 5.5 default to `medium`, whereas Claude Code starts all four at `medium`. The Fable 5.2 docs are unambiguous about where to go from there: **start at the `high` default, step up to `xhigh` only for your hardest long-running coding and agentic work where you've measured a gain, and reserve `max` for probing the model's ceiling.**

## Four changes that will break your code

If you swap the model ID and ship, the failure points are known. The docs group them as the four changes that can break your code.

| Symptom / condition | Cause | Fix |
|-------------------|------|------|
| `The block is bound to a different conversation` (400) | Editing an earlier turn invalidates thinking blocks, and Fable 5.2 applies this prefix check to **every account regardless of when it was created** | Never change `system`, `tools`, or earlier messages — **only append** to `messages`. As a stopgap, send the `thinking-binding-controls-2026-08-01` beta header with `prefix_mismatch_behavior: "drop_block"` |
| Reasoning context disappears after a model switch (no error) | Fable 5.2's thinking blocks are read **only by Fable 5.2 and Mythos 5.2.** Hand them to any other model and they're silently dropped (the request succeeds and dropped blocks aren't billed) | Audit any router or fallback that mixes models. Fable 5.2's permitted fallback targets are Opus 4.8 and Opus 5 |
| Computer use tool returns 400 | The older `computer_20251124` is rejected on every platform except Amazon Bedrock | Declare the `computer_toolset_20260801` toolset instead |
| Advisor tool returns 400 | With Fable 5.2 as the executor, the advisor must also be Fable 5.2 or Mythos 5.2 | Set the advisor definition's `model` to `claude-fable-5-2` — but note that changing `tools` only takes effect in a new conversation |

On top of those, **two Messages API rules apply to every request.** Code arriving from the Opus 5 generation or earlier will almost certainly hit both.

- **Adaptive thinking is always on and can't be turned off.** Both `thinking: {"type": "enabled", "budget_tokens": N}` and `{"type": "disabled"}` return a 400. Omit `thinking` entirely or send `{"type": "adaptive"}`, and control depth with effort.
- **Forced tool use isn't supported.** A `tool_choice` of `{"type": "any"}` or `{"type": "tool", "name": ...}` returns a 400. If you need schema-valid JSON, keep `tool_choice: {"type": "auto"}` and either set `strict: true` (strict tool use) or use JSON outputs.

On the parameter side, confirm you aren't sending `temperature`, `top_p`, or `top_k`. And one constraint has nothing to do with code at all: **Fable 5.2 and Mythos 5.2 require 30-day data retention and aren't available under zero data retention unless Anthropic expressly authorizes it.** For an organization that contracted on ZDR — finance, public sector — that single line decides whether adoption is possible, which means checking the contract terms comes before comparing model capability.

## So how do you actually choose?

The docs offer two starting strategies.

**Efficiency-first (Option 1)** — build on Haiku 5.5, test it properly, and move up only where you find a capability gap. Suited to early prototypes, latency-sensitive services, and high-volume straightforward work.

**Capability-first (Option 2)** — build on Opus 5.5, optimize your prompts for it, then claw back efficiency by lowering effort or stepping down models. Suited to complex reasoning, scientific and mathematical work, and high-autonomy agents. And **move to Fable 5.2 when your evals at `xhigh` or `max` still fall short.**

The selection matrix:

| When you need | Start with | Example work |
|-----------|------------|-----------|
| The highest available capability | Fable 5.2 | Agent sessions that run for hours, multistep deep research, analysis carried through to a finished document, spreadsheet, or deck |
| Complex agentic coding and enterprise work | Opus 5.5 | Multihour autonomous coding agents, large-scale refactoring, complex systems engineering, vision-heavy workflows, computer use |
| Speed plus capability for everyday coding and agents | Sonnet 5.5 | Code generation, data analysis, content creation, visual understanding, agentic tool use |
| The lowest latency and price | Haiku 5.5 | Real-time applications, high-volume processing, subagent tasks |

*Source: [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)*

One more design choice pays off heavily in practice: **mix the models.** The two patterns the docs describe are (1) a cheaper executor that escalates only the hard decisions to a stronger advisor, and (2) an orchestrator that farms bulk work out to lower-cost workers. Because most tokens get billed at the lower rate, you reach the same quality for less than running everything on one frontier model. Claude Code's `opusplan` — plan with Opus, execute with Sonnet — is that idea shipped as a product feature.

**Which brings us to the single conclusion of this piece: a new model existing is not a reason to switch.** Fable 5.2 is genuinely cheaper and stronger than its predecessor, yet the official docs still say to start most workloads on Opus 5.5 and treat Fable 5.2 as a conditional step up. The knowledge-work Elo, where Opus 5.5 leads, tells the same story. Before you double your bill, there are three cheaper things to try: **raise effort one notch, audit your cache design, and measure against your own eval set.** Fable 5.2 is the model built for what's left over when all three come up short.

For the same question asked of other vendors, see [DeepSeek's peak and off-peak pricing](/en/blog/2026-08-14-deepseek-peak-offpeak-pricing/) and our [breakdown of Kimi K3's pricing economics](/en/blog/2026-07-20-kimi-k3-pricing-economics-analysis/).

## Sources

- Anthropic, [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — per-model IDs, context windows, pricing, and default effort (retrieved 2026-11-11)
- Anthropic, [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — input/output, cache write and cache hit rates for every model, batch discount, tokenizer note (retrieved 2026-11-11)
- Anthropic, [What's new in Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2) — the four breaking changes, thinking and `tool_choice` rules, fast mode and batch pricing, data retention requirement (retrieved 2026-11-11)
- Anthropic, [Claude Fable 5.2 model page](https://platform.claude.com/docs/en/models/fable-5-2/overview) — release date (2026-11-09), retirement commitment, per-platform model IDs (retrieved 2026-11-11)
- Anthropic, [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) — starting strategies and the model selection matrix (retrieved 2026-11-11)
- Anthropic, [Claude Code — Model configuration](https://code.claude.com/docs/en/model-config) — `/model` and `/effort` commands, alias resolution table, per-plan defaults, `effortLevel` scope (retrieved 2026-11-11)
- Anthropic, [Claude Fable product page](https://www.anthropic.com/claude/fable) — benchmark scores (FrontierCode 2.0, FrontierSWE v2, AutomationBench, Terminal-Bench-Science 0.1, AA-Briefcase v1.1) and plan availability (retrieved 2026-11-11)
- Amazon Web Services, [Announcing Amazon EC2 Reserved Instances](https://aws.amazon.com/blogs/aws/announcing-ec2-reserved-instances/) — $325 up front plus $0.030/hour versus $0.10/hour on demand (2009-03-12)
- Amazon Web Services, [Amazon Web Services Announces Spot Instances for Amazon EC2](https://press.aboutamazon.com/2009/12/amazon-web-services-announces-spot-instances-for-amazon-ec2) — bidding and interruption terms, and the list of suitable workloads (2009-12)

*This article is not a recommendation to purchase any product. Prices and specifications are subject to vendor policy changes — always check the current values in the official documentation before making a decision.*
