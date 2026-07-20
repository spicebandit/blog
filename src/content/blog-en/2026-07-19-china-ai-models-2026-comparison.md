---
title: "How Far Has China's AI Come? DeepSeek, Qwen & GLM Compared [2026]"
description: "In 2026 China holds four of the top five open-weight AI models, closing in on the US. We compare DeepSeek, Qwen, Kimi, and GLM against GPT, Claude, and Gemini on performance and price — plus the chip-control leash, the open-source strategy, and the historical backdrop."
pubDate: 2026-07-20T09:45:00+09:00
updatedDate: 2026-07-20T09:45:00+09:00
category: ai
tags: ["China AI", "DeepSeek", "Qwen", "AI model comparison"]
lang: en
koSlug: 2026-07-19-china-ai-models-2026-comparison
---

**China's AI in 2026, in one sentence: "It trails the US by a hair on performance, costs a fraction of the price, and its weapon is open source."** Just two years ago China's AI was called a "chaser trailing the US by years." As of mid-2026 it holds four of the top five open-weight (open-weights) models in the world ([BenchLM / industry leaderboards](https://www.turingpost.com/p/chinesemodels)). DeepSeek, Qwen (Alibaba), Kimi (Moonshot), and GLM (Zhipu / Z.ai) each lead in different domains, and the composite-score gap to the top US proprietary models (OpenAI, Anthropic, Google) has narrowed to roughly 9 points. And the crux of the story: all of this happened **while wearing the leash of US controls on the most advanced semiconductors.** This piece surveys China's five leading AI models, compares their performance and price against GPT, Claude, and Gemini, and examines the open-source strategy, the chip controls, and the historical backdrop behind it.

![skyscrapers in a Chinese city](https://images.unsplash.com/photo-1713173642147-30cbbdb176d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwY2hpbmElMjB0ZWNobm9sb2d5fGVufDF8MHx8fDE3ODQ0MTY1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Christian Lue](https://unsplash.com/@christianlue?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-very-tall-building-in-the-middle-of-a-city-qQT7l54ERZM?utm_source=spice-bandit-blog&utm_medium=referral)*

## China's Five Big Players — Who's Good at What

Where US AI converges on a few deep-pocketed giants — OpenAI, Anthropic, Google — China is the opposite: **many strong contenders split across different strengths.** As of mid-2026, five names stand out.

- **DeepSeek** — the protagonist of the January 2025 "DeepSeek shock" that rattled global markets. Its strength is extreme cost efficiency. R1 was reportedly trained for about $6 million — roughly 6% of the ~$100 million estimated for GPT-4 ([CSIS](https://www.csis.org/analysis/deepseek-huawei-export-controls-and-future-us-china-ai-race)). With a mixture-of-experts (MoE) architecture and innovations below Nvidia's CUDA layer, it proved "more with less."
- **Qwen (Alibaba)** — the king of versatility and ecosystem. It spans the widest lineup, from 9B to ~397B parameters, with strong multilingual ability. Above all, it **overtook Meta's Llama in Hugging Face downloads** to become the world's most-used open model family.
- **Kimi (Moonshot AI)** — specialized in agents. The K2 line uses an "agent swarm" that coordinates multiple agents in parallel, excelling on agentic benchmarks like web browsing and tool use. On July 16, 2026 Moonshot unveiled **Kimi K3, a flagship of roughly 2.8 trillion parameters**, claiming the title of "China's largest open-weight model" (detailed below).
- **GLM (Zhipu AI, aka Z.ai)** — top-tier open-weight for coding and agents. The GLM line is credited with beating Gemini and approaching top Claude on metrics like SWE-bench (real code-fixing). It drew attention for **training a large model on Huawei chips** ([winbuzzer](https://winbuzzer.com/2026/02/10/chinese-ai-firm-zhipu-trains-major-model-huawei-chips-xcxwbn/)).
- **The rest** — Baidu's Ernie, ByteDance's Doubao, Tencent's Hunyuan, and MiniMax are each expanding in search, content, and enterprise.

In short, China's AI isn't a single champion but **a collective of domain specialists.** Cost → DeepSeek, general-purpose/ecosystem → Qwen, agents → Kimi, coding → GLM. That division of labor itself shows the depth of China's AI ecosystem.

## Performance — How Much Has the US–China Gap Closed?

The real question is "does it work as well as GPT or Claude?" The sober mid-2026 answer: **"the very top is still the US, but the gap has shrunk astonishingly."** Aggregating several leaderboards, the composite-score gap between the best US proprietary model and the best Chinese model is around 9 points — closing far faster than the industry forecast.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 240" width="100%" height="auto" role="img" aria-label="The composite performance gap between the top US proprietary model and the top Chinese open model narrowed from the low 20s in 2024 to about 9 points in 2026">
  <text x="20" y="28" font-size="15" font-weight="700" fill="#23201D">US–China top-AI performance gap (composite-score diff, smaller = catching up)</text>
  <line x1="60" y1="190" x2="700" y2="190" stroke="#8A8378" stroke-width="1"/>
  <line x1="60" y1="60" x2="60" y2="190" stroke="#8A8378" stroke-width="1"/>
  <g font-size="11" fill="#8A8378">
    <text x="60" y="208" text-anchor="middle">early 2024</text>
    <text x="253" y="208" text-anchor="middle">late 2024</text>
    <text x="446" y="208" text-anchor="middle">late 2025</text>
    <text x="640" y="208" text-anchor="middle">mid 2026</text>
    <text x="52" y="70" text-anchor="end">20+</text>
    <text x="52" y="130" text-anchor="end">14</text>
    <text x="52" y="190" text-anchor="end">9</text>
  </g>
  <polyline points="60,72 253,110 446,150 640,180" fill="none" stroke="#C8102E" stroke-width="2.5"/>
  <circle cx="60" cy="72" r="4" fill="#C8102E"/><circle cx="253" cy="110" r="4" fill="#C8102E"/><circle cx="446" cy="150" r="4" fill="#C8102E"/><circle cx="640" cy="180" r="5" fill="#C8102E"/>
  <text x="640" y="170" text-anchor="middle" font-size="12" font-weight="700" fill="#C8102E">~9 pts</text>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">Composite-score gap of the top Chinese open model vs. the top US proprietary model (conceptual trend). Based on aggregated public leaderboards and reporting; varies by benchmark. Source: <a href="https://www.turingpost.com/p/chinesemodels">Turing Post</a> and others.</figcaption>
</figure>

In detail, Chinese models are said to already surpass the US top in specific areas. GLM reportedly scored in the high-70s% on SWE-bench Verified (real software bug-fixing), ahead of Gemini, and Kimi K2 is cited as exceeding top Claude on a web-browsing agent benchmark (BrowseComp) ([Turing Post](https://www.turingpost.com/p/chinesemodels)). But such figures swing with method and version, so the safe reading is: **"competitive or ahead on specific tasks; the overall top is still the US."**

| Category | Model (family) | Maker | Open | Standout strength |
|----------|----------------|-------|:----:|-------------------|
| Cost efficiency | DeepSeek | DeepSeek | ✅ | Ultra-low-cost train/inference, MoE |
| General/ecosystem | Qwen | Alibaba | ✅ | Widest lineup, multilingual, #1 downloads |
| Agents/general | Kimi K3 | Moonshot | ✅ | No. 3 leaderboard debut, front-end & agents |
| Coding/agents | GLM | Zhipu (Z.ai) | ✅ | Top SWE-bench, trained on Huawei chips |
| (Compare) top proprietary | GPT · Claude · Gemini | US 3 | ❌ | Best overall performance |

*Source: [Turing Post](https://www.turingpost.com/p/chinesemodels), [CSIS](https://www.csis.org/analysis/deepseek-huawei-export-controls-and-future-us-china-ai-race), and other 2026 public materials. Model versions and scores update over time.*

## Breaking Update — Moonshot Unveils Kimi K3 (July 2026)

Nothing dramatizes this trend more than **Kimi K3, the flagship Moonshot AI released on July 16, 2026.** At roughly **2.8 trillion parameters (2–3 trillion, per reports)**, it instantly became **the largest open-weight model ever to come out of China** ([TechCrunch](https://techcrunch.com/2026/07/16/moonshots-upcoming-kimi-3-is-expected-to-close-the-gap-with-anthropics-opus-4-8/)). The company had already shipped K2.6 (April) and K2.7 Code (June), building a presence in open coding models; K3 is the culmination.

Three things stand out.

- **Performance — into the top tier**: K3 debuted at **No. 3** on the Artificial Analysis composite leaderboard on release. The two spots ahead were held by US proprietary models like Anthropic's Claude Fable 5 and OpenAI's GPT-5.6 Sol — but K3 is cited as **beating them on a web front-end development benchmark (Arena)**. An open-weight model reaching No. 3 overall is, in itself, a real-time proof of this article's thesis that the gap has narrowed.
- **Openness — full weights due July 27**: Moonshot said it would **fully open K3's weights by July 27, 2026.** Releasing top-tier performance rather than locking it away is the latest edition of the "open-source strategic weapon" discussed below.
- **Meaning — from agents to the general frontier**: Where earlier Kimi was tagged "agent-specialized," K3 broadens into a general frontier spanning long-horizon coding and end-to-end knowledge work — a sign that Chinese models are moving from "strength on specific tasks" to "competing for the overall top."

Leaderboard rank swings with method and version, of course, and a "No. 3 debut" doesn't mean "best in real use." But the fact that a Chinese open model — trailing the overall top by around 9 points just half a year ago — now sits right behind the US proprietary leaders shows the "catch-up by a hair" this piece describes is still moving fast.

## Price Disruption — API Costs 5–30x Cheaper

As disruptive as performance, maybe more, is price. Chinese models charge API fees **5 to 30 times cheaper** than US rivals. In an extreme case, DeepSeek's V3.2 line is reported at about $0.28 per million input tokens — against roughly $10 for a top US model (GPT family; varies by tier and time), a **many-fold difference** ([TokenMix](https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide)).

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 14px;margin:1.5rem 0">
<svg viewBox="0 0 720 200" width="100%" height="auto" role="img" aria-label="API input price per million tokens: DeepSeek about $0.28, top GPT family about $10">
  <text x="20" y="28" font-size="15" font-weight="700" fill="#23201D">API input price (per 1M tokens, lower = cheaper)</text>
  <g font-size="13" fill="#23201D">
    <text x="150" y="78" text-anchor="end">DeepSeek V3.2</text>
    <rect x="160" y="62" width="14" height="24" rx="3" fill="#C8102E"/>
    <text x="184" y="80" font-weight="700" fill="#C8102E">~$0.28</text>
    <text x="150" y="128" text-anchor="end">China model range</text>
    <rect x="160" y="112" width="70" height="24" rx="3" fill="#8A8378"/>
    <text x="240" y="130" fill="#23201D">~$0.5–2</text>
    <text x="150" y="178" text-anchor="end">GPT family (top)</text>
    <rect x="160" y="162" width="500" height="24" rx="3" fill="#23201D"/>
    <text x="668" y="180" text-anchor="end" font-weight="700" fill="#fff">~$10</text>
  </g>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">Representative API input prices (bars are relative). Actual prices vary by model, tier, and time. Source: <a href="https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide">TokenMix</a> and others.</figcaption>
</figure>

This price gap isn't "cheap junk" — it's strategy. Even trailing the top by 9 points, a model that costs a fraction is a "good enough" choice for most real-world uses (summarizing, translating, coding assist, chatbots). And as global AI compute demand shifts from training to **inference**, cheap inference translates into market share. Barclays estimated that ~70% of 2026 AI compute demand would come from inference ([CFR](https://www.cfr.org/articles/chinas-ai-chip-deficit-why-huawei-cant-catch-nvidia-and-us-export-controls-should-remain)) — terrain that favors "cheap and good enough" Chinese models.

## Open Source as a Strategic Weapon — Qwen Overtakes Llama

The most underrated factor in China's rise is open source. Where the top US models (GPT, Claude, Gemini) are "closed" — weights withheld — China's leaders are mostly **open-weight.** The result is symbolic: Meta's Llama, once the byword for open-source AI, was overtaken by Alibaba's Qwen in Hugging Face downloads, and Chinese models surpassed US models in total downloads ([CSIS](https://www.csis.org/analysis/deepseek-huawei-export-controls-and-future-us-china-ai-race)).

![close-up of a circuit board](https://images.pexels.com/photos/6755081/pexels-photo-6755081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Tima Miroshnichenko](https://www.pexels.com/@tima-miroshnichenko) on [Pexels](https://www.pexels.com/photo/close-up-shot-of-a-chip-6755081/)*

Why open source? The US congressional advisory body USCC analyzes it as a **"Two Loops"** strategy ([USCC report](https://www.uscc.gov/sites/default/files/2026-03/Two_Loops--How_Chinas_Open_AI_Strategy_Reinforces_Its_Industrial_Dominance.pdf)). Give open models to the world for free and ① developers and firms build on Chinese models, letting China set the ecosystem standard, and ② that adoption loops back as demand for China's domestic industry (chips, cloud, applications). Instead of a head-on money fight with better-funded US incumbents, it's a **flanking route: give it away and capture the ecosystem.** Zhipu open-sourcing its GLM-Image model follows the same logic. For China, open source is not an ideal but **a latecomer's strategic weapon.**

## The Chip Leash — Export Controls and Huawei Ascend

All of this comes with a giant constraint: US semiconductor export controls. The US barred sales of Nvidia's most advanced AI chips (H100, A100) and even the export-grade cut-downs (H800, A800), and from January 2026 shifted the H200 and AMD MI325X to **case-by-case licensing** — removing even predictability ([Geopolitical Monitor](https://www.geopoliticalmonitor.com/us-export-controls-and-chinas-good-enough-ai-stack/)). The "fuel" of top-end chips can now be shut off at political discretion.

China's answer is self-sufficiency. Huawei plans to produce about 600,000 Ascend 910C chips in 2026 (roughly double the prior year), and about 1.6 million dies across the whole Ascend line. But the performance is sobering — a single Ascend 910C rates at roughly 60% of an Nvidia H100 for inference ([CFR](https://www.cfr.org/articles/chinas-ai-chip-deficit-why-huawei-cant-catch-nvidia-and-us-export-controls-should-remain)). Catching Nvidia on single-chip performance will be hard for a while. Yet as we saw, compute demand is tilting toward inference, the Ascend is "usable" there, and DeepSeek supporting its models to run directly on Huawei's CANN software means **the hardware–model ecosystem is starting to mesh.** Hence the assessment: controls slow China in the near term but are unlikely to stop it in the long run.

## Historical Context — From a "World No. 1 by 2030" Plan to the DeepSeek Shock

Today's landscape didn't appear overnight. China's AI rise is rooted in the **State Council's 2017 "New Generation AI Development Plan,"** which set a three-stage target — world-leading tier by 2020, partial world leadership by 2025, and **world No. 1 by 2030** — and mobilized the state, local governments, and firms. While the US chased "the most advanced model" through the private sector, China laid down "the widest ecosystem" through the state.

The moment that seared this into the world's eyes was the January 2025 "DeepSeek shock." News that an unknown Chinese startup had built a GPT-4-class model for under a tenth of the cost erased hundreds of billions of dollars from Nvidia's value in a single day. Historically, tech catch-up has usually come through such "asymmetric innovation" — rather than copying the leader's method, latecomers turn constraints (here, the chip shortage) into a different path (efficiency, open source). Just as 19th-century latecomer industrial nations caught up by imitating and improving on Britain's technology, China's AI chose a flanking move — "cheaper, more open models" — over the American head-on bet of "bigger, more expensive models."

This is exactly the **"advantages of backwardness"** that economic historian Alexander Gerschenkron articulated in his 1962 book *Economic Backwardness in Historical Perspective* — a late starter skips the leader's trial and error and, by state mobilization and workaround innovation, fills the gap of scarce capital and technology to catch up even faster. China, cut off from the decisive resource of chips and attempting an asymmetric breakthrough via efficiency and open source, is the textbook case. There's a closer parallel, too: in the 1980s Japan held ~80% of the world DRAM market, and in the 1990s Korea (Samsung, SK Hynix) overtook it by importing US technology and forcing through massive investment. That script — a latecomer stamping out "good enough, cheaper, faster" in a standardized market to flip the leader — looks strikingly like the one China's AI now runs, except that Korea, once the disruptive latecomer, sits on the other side of it this time. The 2017 plan and the 2025 DeepSeek shock show the flanking strategy was design, not accident.

## So What — What It Means for Korea and for Companies

China's AI rise reaches Korea in two ways. First, **an explosion of choice.** Companies can now put not only expensive top US models but "good enough and far cheaper" Chinese open models into real work; domestic dev tools and services increasingly run Qwen, DeepSeek, or GLM on the back end. Costs tens of times lower mean, for a startup or solo founder, tens of times more experiments you can actually run.

Second, **dependence and sovereignty.** Cheap open models are attractive, but dependence on one country's ecosystem carries data, security, and regulatory risk — precisely the lock-in the USCC's "Two Loops" aims for. That's why nations are weighing "sovereign AI," and Korea is no exception. The 2026 lesson is clear: **the axis of AI competition is shifting from "who has the most advanced model" to "who has the most widely used ecosystem."** The US still holds the performance frontier — but China is laying the "ground" beneath it, wide and open. That is the real picture this comparison reveals.

## Frequently Asked Questions (China AI)

**Q1. Has China's AI caught up to the US in 2026?**
The overall top is still the US (GPT, Claude, Gemini). But the gap is closing fast: Moonshot's Kimi K3, released in July 2026, debuted at No. 3 on the Artificial Analysis composite leaderboard — right behind the US proprietary leaders (and ahead of them on a front-end development benchmark). On specific areas like coding and agents, Chinese models (GLM, Kimi) match or lead on some leaderboards. A realistic summary: "the very top is the US; for most practical work, China is good enough too."

**Q2. Why is China's AI so cheap?**
Because of architectural innovations that train with fewer resources (MoE, as with DeepSeek) and a strategy of growing an ecosystem through open source. API prices run 5–30x cheaper than the US, with DeepSeek at times ~35x cheaper than the GPT family.

**Q3. Are US chip controls ineffective?**
In the near term they do slow China; Huawei's Ascend 910C is about 60% of an Nvidia H100 for inference. But as compute demand shifts to inference and China scales chip output, the prevailing view is that controls won't stop China in the long run.

**Q4. Which Chinese model should I pick?**
It depends on the use case. For lowest cost, DeepSeek; for general-purpose, multilingual, and ecosystem, Qwen; for autonomous agents, Kimi; for coding, GLM. All are open-weight, usable directly or via API. (This is general information, not a recommendation of any specific model or stock.)

---

*This article is a general explainer based on materials published as of July 2026, and is not advice recommending investment decisions on any company or security. Benchmark figures and model versions update over time, so verify the latest sources when adopting.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Has China's AI caught up to the US in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The overall top is still the US (GPT, Claude, Gemini). But the gap is closing fast: Moonshot's Kimi K3, released in July 2026, debuted at No. 3 on the Artificial Analysis composite leaderboard. On specific areas like coding and agents, Chinese models (GLM, Kimi) match or lead on some leaderboards. A realistic summary: the very top is the US; for most practical work, China is good enough too."
      }
    },
    {
      "@type": "Question",
      "name": "Why is China's AI so cheap?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Because of architectural innovations that train with fewer resources (MoE, as with DeepSeek) and a strategy of growing an ecosystem through open source. API prices run 5-30x cheaper than the US, with DeepSeek at times about 35x cheaper than the GPT family."
      }
    },
    {
      "@type": "Question",
      "name": "Are US chip controls ineffective?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In the near term they do slow China; Huawei's Ascend 910C is about 60% of an Nvidia H100 for inference. But as compute demand shifts to inference and China scales chip output, the prevailing view is that controls won't stop China in the long run."
      }
    },
    {
      "@type": "Question",
      "name": "Which Chinese AI model should I pick?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on the use case. For lowest cost, DeepSeek; for general-purpose, multilingual, and ecosystem, Qwen; for autonomous agents, Kimi; for coding, GLM. All are open-weight, usable directly or via API."
      }
    }
  ]
}
</script>
