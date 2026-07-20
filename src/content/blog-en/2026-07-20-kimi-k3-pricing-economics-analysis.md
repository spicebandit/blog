---
title: "Kimi K3 Deep Dive — Pricing, Performance & Economics [2026]"
description: "Moonshot's Kimi K3, dubbed 'the second DeepSeek,' rattled Big Tech stocks. We break down what the 2.8-trillion-parameter open-weight model actually is, its API and app pricing, and whether it's truly economical — measured against DeepSeek, Claude, and GPT."
pubDate: 2026-07-20T10:30:00+09:00
updatedDate: 2026-07-20T10:30:00+09:00
category: ai
tags: ["Kimi K3", "Moonshot", "AI pricing", "China AI"]
lang: en
koSlug: 2026-07-20-kimi-k3-pricing-economics-analysis
---

**The bottom line first: Moonshot AI's Kimi K3 is called "the second DeepSeek," but its character is the opposite.** Where DeepSeek stunned the world in early 2025 with "price destruction," Kimi K3 — released on July 16, 2026 — shook the board by **opening frontier-class performance as open weights, not by being cheap.** It debuted near the top of the field on the Artificial Analysis Intelligence Index at roughly 57 points (No. 3–4 depending on how you count) ([Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5), [MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)), and that news alone was enough to rattle the sentiment around US Big Tech and semiconductor stocks — Korean outlets ran headlines like "The Counterattack of China's 'Kimi K3.'" This piece digs into **what kind of service K3 is, how its pricing is structured, and whether it's actually economical** — placed side by side with DeepSeek, Claude, and GPT. (This is general information analysis, not a recommendation of any model or security.)

![a code editor screen](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZyUyMHNjcmVlbnxlbnwxfDB8fHwxNzg0NTA4NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Ilya Pavlov](https://unsplash.com/@ilyapavlov?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_source=spice-bandit-blog&utm_medium=referral)*

## What Is Kimi K3 — The Service's Three Faces

In one line, Kimi K3 is a **multimodal reasoning-and-agent model of roughly 2.8 trillion parameters.** Its architecture is a sparse mixture-of-experts (Stable LatentMoE) that activates only 16 of 896 experts per token ([MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)). In other words, it is "2.8 trillion in size but doesn't run all of it every time," pairing massive scale with inference efficiency. It has a 1 million (1,048,576) token context window, native vision that reads images, and — distinctively — **always-on reasoning.**

The key point is that K3 isn't a single product; it ships in **three forms at once.**

- **① Open weights** — the model's core weights are released for anyone to download and run on their own servers. Moonshot said it would **fully open K3's weights by July 27, 2026**, under a Modified MIT license whose only added clause — an attribution requirement — triggers only above 100 million monthly active users. For most developers and firms, it is effectively unrestricted open source.
- **② API** — billed per token via Moonshot's official platform (platform.kimi.ai), OpenRouter, and others. The path to plug in directly with no infrastructure of your own.
- **③ Consumer app / subscription** — used as a chatbot on kimi.com and the iOS app. Try it free, then subscribe to raise context length, agent credits, and the code multiplier.

This "open weights + API + app" triple structure is itself the strategy: give it away to widen the ecosystem (open weights), and monetize convenience through API and subscriptions. K3's primary use is clear too — not simple Q&A, but **long-horizon coding across large repositories, tool use, debugging, and agentic loops that iterate against images, logs, tests, and runtime feedback.**

## Breaking Down the Pricing — API vs. App Subscription

Start with what everyone wants to know: the price. K3's API and consumer subscription are entirely separate systems.

**API pricing (per 1M tokens)**

| Item | Price | Note |
|------|------|------|
| Input (cache miss) | $3.00 | New context |
| Input (cache hit) | $0.30 | Repeated context, 90% off |
| Output | $15.00 | Includes reasoning tokens |
| Context window | 1M (1,048,576) tokens | **No length-based surcharge (flat)** |

*Source: [Kimi API Platform](https://platform.kimi.ai/docs/pricing/chat-k3), [eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing) (as of July 2026). Taxes separate.*

**Consumer app subscription (monthly)**

| Tier | Monthly | Annual (effective/mo) |
|------|:------:|:------:|
| Free | $0 | — |
| Moderato | $19 | $15 |
| Allegretto | $39 | $31 |
| Allegro | $99 | $79 |
| Vivace | $199 | $159 |

*Source: [eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing). In the Chinese domestic market it starts at ¥199 (~$28), with a 10–30% top-up bonus event running July 15–August 11, 2026. Even the free tier lets you try K3 within standard rate limits on the app and kimi.com.*

Two things stand out. First, **the API is flat-priced across the full 1M-token context** — no "long-context premium" even when you feed in long documents or large codebases, unlike Claude and GPT. Second, the app subscription runs five steps from Free to Vivace, with higher tiers granting more context length, agent credits, and "Kimi Code" multiplier — a design that rewards heavy users with higher subscriptions.

![data center servers](https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/computer-server-in-data-center-room-17489163/)*

## Economics — So, Cheap or Expensive?

The core question. The answer: **"The sticker price isn't cheap. K3's economics come not from the price tag but from 'repeat-work caching' and 'cost per unit of performance.'"**

First, positioning. K3's $3/$15 (input/output) is no DeepSeek-style ultra-low price. It's **identical to Anthropic's Claude Sonnet**, and actually a touch pricier than GPT-5.6 Sol (~$2.5/$15) and Gemini 3 Pro (~$2/$12). It is cheaper than Claude Opus (~$5/$25) ([eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing)). Against its own camp's DeepSeek V4, however, it's **about 13–21x pricier on output tokens** (roughly 21x vs. the budget V4 Flash, and around 13x even on a blended basis vs. the higher V4 Pro). In short, K3 is not a model that competes on price — it sells **frontier performance at a slightly-below-frontier price, and open on top of that.**

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 250" width="100%" height="auto" role="img" aria-label="API output price per million tokens across major models: DeepSeek about 0.7 dollars, Gemini 3 Pro 12, GPT-5.6 Sol and Claude Sonnet and Kimi K3 15, Claude Opus 25">
  <text x="20" y="26" font-size="15" font-weight="700" fill="#23201D">API output price per 1M tokens (lower = cheaper, $)</text>
  <g font-size="12.5" fill="#23201D">
    <text x="150" y="62" text-anchor="end">DeepSeek V4</text>
    <rect x="160" y="48" width="18" height="20" rx="3" fill="#8A8378"/>
    <text x="186" y="63" fill="#23201D">~$0.7</text>
    <text x="150" y="92" text-anchor="end">Gemini 3 Pro</text>
    <rect x="160" y="78" width="288" height="20" rx="3" fill="#E5DECF"/>
    <text x="456" y="93" fill="#23201D">~$12</text>
    <text x="150" y="122" text-anchor="end">GPT-5.6 Sol</text>
    <rect x="160" y="108" width="360" height="20" rx="3" fill="#E5DECF"/>
    <text x="528" y="123" fill="#23201D">~$15</text>
    <text x="150" y="152" text-anchor="end">Kimi K3</text>
    <rect x="160" y="138" width="360" height="20" rx="3" fill="#C8102E"/>
    <text x="528" y="153" font-weight="700" fill="#C8102E">$15</text>
    <text x="150" y="182" text-anchor="end">Claude Sonnet</text>
    <rect x="160" y="168" width="360" height="20" rx="3" fill="#E5DECF"/>
    <text x="528" y="183" fill="#23201D">$15</text>
    <text x="150" y="212" text-anchor="end">Claude Opus</text>
    <rect x="160" y="198" width="500" height="20" rx="3" fill="#23201D"/>
    <text x="668" y="213" text-anchor="end" font-weight="700" fill="#fff">~$25</text>
  </g>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">Kimi K3 sits in the "frontier price band" alongside Claude Sonnet, not the ultra-cheap DeepSeek tier. Prices vary by tier and time. Source: <a href="https://www.eesel.ai/blog/kimi-k3-pricing">eesel AI</a> and others.</figcaption>
</figure>

So where do the economics come from? Three places.

**First, prompt caching.** K3's real weapon is the $0.30 cache-hit price ([eesel AI](https://www.eesel.ai/blog/kimi-k3-pricing)). In coding and agent work that resends the same context (a large codebase, a long instruction), cache-hit rates routinely exceed 90% — and in that case the repeated portion of the input drops from **$3.00 to $0.30, a 90% cut.** Run the math and the effect is stark. Take a typical coding call where 100K tokens are cached with 2K new input and 3K output: without caching it's 102K×$3 + 3K×$15 ≈ **$0.351**; with a cache hit it's 100K×$0.30 + 2K×$3 + 3K×$15 ≈ **$0.081** — about **77% cheaper** (illustrative calculation from the price sheet). K3's pricing is optimized for "workloads with lots of repeated context."

**Second, cost per unit of performance.** K3 substantially outscores its open-camp peers on coding benchmarks. On Moonshot's own harness it posts DeepSWE 67.5 (vs. GLM-5.2's 46.2) and FrontierSWE 81.2 (vs. GLM-5.2's 67.3) ([MarkTechPost](https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/)). Even at a slightly higher token price, solving more of the problem in one pass can lower the "total cost to finish one task." Economics should be measured by **cost per task completed**, not the per-token rate.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 200" width="100%" height="auto" role="img" aria-label="Coding benchmark comparison of Kimi K3 and GLM-5.2: DeepSWE K3 67.5 vs GLM 46.2, FrontierSWE K3 81.2 vs GLM 67.3, K3 ahead">
  <text x="20" y="26" font-size="15" font-weight="700" fill="#23201D">Coding benchmark comparison (higher = better, pts)</text>
  <g font-size="12.5" fill="#23201D">
    <text x="160" y="66" text-anchor="end">DeepSWE · K3</text>
    <rect x="170" y="52" width="328" height="20" rx="3" fill="#C8102E"/>
    <text x="506" y="67" font-weight="700" fill="#C8102E">67.5</text>
    <text x="160" y="94" text-anchor="end">DeepSWE · GLM-5.2</text>
    <rect x="170" y="80" width="224" height="20" rx="3" fill="#E5DECF"/>
    <text x="402" y="95" fill="#23201D">46.2</text>
    <text x="160" y="134" text-anchor="end">FrontierSWE · K3</text>
    <rect x="170" y="120" width="396" height="20" rx="3" fill="#C8102E"/>
    <text x="574" y="135" font-weight="700" fill="#C8102E">81.2</text>
    <text x="160" y="162" text-anchor="end">FrontierSWE · GLM-5.2</text>
    <rect x="170" y="148" width="328" height="20" rx="3" fill="#E5DECF"/>
    <text x="506" y="163" fill="#23201D">67.3</text>
  </g>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">On coding harnesses, K3 (red) leads the open rival GLM-5.2. Vendor self-reported figures; independent numbers may differ. Source: <a href="https://www.marktechpost.com/2026/07/18/kimi-k3-vs-deepseek-v4-pro-vs-glm-5-2-open-trillion-scale-moe-models-compared-on-benchmarks-license-and-serving-cost/">MarkTechPost</a>.</figcaption>
</figure>

**Third, the open-weight option.** Once the weights land on July 27, organizations handling large-scale or sensitive data can run K3 **on their own infrastructure with no per-token API cost.** Factor in data sovereignty and regulatory compliance and there's value the API rate alone can't capture. That said, self-hosting 2.8 trillion parameters demands serious GPU and ops capability, so self-hosting economics hold only at sufficiently large volume.

There's a trap, too. K3 runs with **reasoning always maxed out (reasoning_effort=max, locked)**, so it burns many output tokens (reasoning included), and there is no cheaper non-reasoning variant. Point K3 at simple summarizing, classification, or chatbot work that needs no reasoning and you get "overkill spec at overkill cost." **K3's economics apply strictly to long-horizon coding and complex agent workloads.**

## Is It "The Second DeepSeek"? Why the Market Paid Attention

As the attached Financial News report argues, K3's release went beyond a new-model launch into an **investment question.** The more high-performance AI models pour out cheap and open, the louder the doubt grows over whether US Big Tech's astronomical AI capex "earns its keep." Right after K3's release, sentiment around related semiconductor and Big Tech names wobbled, and the market watched the **capex commitments** of large clouds like Microsoft closely.

Wall Street's read backs this up. Morgan Stanley judged that China's cutting-edge large language models have achieved **"comprehensive catch-up" across scale, performance, and price** ([futunn](https://news.futunn.com/en/post/76208320/kimi-k3-debuts-amid-great-anticipation-morgan-stanley-china-s)), and Goldman Sachs said Chinese open-source models have reached **"a critical inflection point"** in global adoption amid intensifying high-end competition ([futunn](https://news.futunn.com/en/post/76225859/goldman-sachs-comments-on-kimi-k3-chinese-open-source-models)). If DeepSeek shook the market on "cheap" in early 2025, K3 delivered the same kind of shock on "performance + openness."

That said, keep a cool head. A top-tier "debut" doesn't equal "best in real use," and leaderboard ranks swing with method and version. Always mind the gap between vendor self-reported numbers and independent verification. Regardless of the "shock," any adoption decision has to pass validation on your own workload.

## Historical Context — Open Weights, the Latecomer's Weapon

K3's openness strategy didn't come from nowhere. The move of "giving away the standard for free" to catch a leader recurs throughout IT history. In the 1990s–2000s Linux opened its source against costly Unix and took over the server ecosystem; in 2007–2008 Google's Android took the smartphone-OS standard through open source (AOSP). Go back further and Netscape open-sourcing its browser in 1998 (Mozilla) to fight Microsoft IE's monopoly follows the same grammar — **answer a market disadvantage with openness.** "If I can't be the most advanced, I'll turn the board itself into a commons and erode the leader's monopoly rents" — China's AI now carries that logic forward.

It overlaps with the **"advantages of backwardness"** that economic historian Alexander Gerschenkron articulated in his 1962 book *Economic Backwardness in Historical Perspective*. A late starter skips the leader's trial and error and fills gaps in capital and technology with workaround strategies to catch up faster. What Gerschenkron saw in 19th-century Germany and Russia was "scarce capital filled by big banks and the state as detours"; in 2020s Chinese AI that detour has only changed form — state subsidy, an open-weight ecosystem, caching optimization — while the logic of "leaping over constraints via institutional substitutes" is identical. DeepSeek attempting an asymmetric breakthrough via "efficiency," K3 via "openness + performance," is the textbook case. That it was achieved while wearing the leash of US advanced-semiconductor controls makes it, too, a case of constraint forcing workaround innovation.

## So What — What It Means for Korean Developers and Companies

K3's practical message is clear. **First, a new option — a "frontier-class open model" — now exists.** For long-horizon coding or complex agent pipelines that until now required Claude Opus or top GPT, K3 offers comparable performance a bit cheaper, with downloadable weights on top. The more your work repeats context, the more caching drives the effective cost down.

**Second, it's not a cure-all.** For simple chatbots, summarizing, and classification that need no reasoning, low-cost models like DeepSeek and Qwen remain overwhelmingly more economical. Always-on reasoning and a $15 output rate are priced for "heavy work," and are waste on light work. **The axis of model choice is shifting from "cheap vs. expensive" to "is my work reasoning/agent-type or simple-type?"**

Ultimately, the real picture K3 reveals is this — Chinese AI has moved beyond "cheap models" into **"a phase of releasing frontier performance as open."** The US still holds the performance frontier, but open weights are rapidly filling in "just below" it. Whether you're a solo developer or a startup in Korea, the answer to "what should I use" is no longer one model but **a workload-by-workload portfolio.** (This article is general information analysis, not a recommendation to invest in or buy any security or product. Price and performance figures update over time; verify the latest sources when adopting.)

## Frequently Asked Questions (Kimi K3)

**Q1. Is Kimi K3 free?**
The consumer app (kimi.com / iOS) has a free tier you can try within standard rate limits. Heavy use requires a subscription from $19/mo (Moderato) to $199/mo (Vivace), or the per-token API. And once the weights open on July 27, you can download and run it on your own servers.

**Q2. How much is the API?**
$3.00 input and $15.00 output per 1M tokens, with repeated context (cache hits) at just $0.30 input — 90% cheaper. The context window is 1M tokens with no length surcharge. It's in the same price band as Claude Sonnet.

**Q3. It's pricier than DeepSeek — why use it?**
Because the performance differs. K3 is strong at long-horizon coding and complex agent work, and with good caching the effective cost of repeat work drops sharply. For simple summarizing or chatbots, DeepSeek is far more economical. Choosing by "type of work" is the key.

**Q4. Is K3 open source?**
It's an open-weight model that publishes its weights. The license is Modified MIT, with an attribution clause that applies only above 100 million monthly active users — effectively unrestricted for most developers and firms.

---

*This article is a general explainer based on materials published as of July 2026, and is not advice to invest in or buy any company, security, or product. Benchmark and price figures update with time and method, so verify the latest sources when adopting.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Kimi K3 free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The consumer app (kimi.com / iOS) has a free tier you can try within standard rate limits. Heavy use requires a subscription from $19/mo (Moderato) to $199/mo (Vivace), or the per-token API. Once the weights open on July 27, you can also download and run it on your own servers."
      }
    },
    {
      "@type": "Question",
      "name": "How much does the Kimi K3 API cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "$3.00 input and $15.00 output per 1M tokens, with repeated context (cache hits) at just $0.30 input, 90% cheaper. The context window is 1M tokens with no length surcharge. It is in the same price band as Claude Sonnet."
      }
    },
    {
      "@type": "Question",
      "name": "It is pricier than DeepSeek, so why use Kimi K3?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because the performance differs. K3 is strong at long-horizon coding and complex agent work, and with good caching the effective cost of repeat work drops sharply. For simple summarizing or chatbots, DeepSeek is far more economical. Choosing by type of work is the key."
      }
    },
    {
      "@type": "Question",
      "name": "Is Kimi K3 open source?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is an open-weight model that publishes its weights. The license is Modified MIT, with an attribution clause that applies only above 100 million monthly active users, effectively unrestricted for most developers and firms."
      }
    }
  ]
}
</script>
