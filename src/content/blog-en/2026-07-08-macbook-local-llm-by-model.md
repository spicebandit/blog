---
title: "Local LLMs on a MacBook — What Runs on 8, 16, 32, 64GB Unified Memory"
description: "Can a MacBook or MacBook Air run local LLMs? A buyer's guide to the model sizes each unified-memory tier (8/16/32/64GB) handles, the Air vs Pro difference, and how it compares to an RTX 5090."
pubDate: 2026-07-08T07:21:45+09:00
category: ai
tags: ["macbook", "local-llm", "apple-silicon", "ollama"]
lang: en
koSlug: 2026-07-08-macbook-local-llm-by-model
---

"Can a MacBook actually run a local LLM?" The answer is decided almost entirely by **not which MacBook you have, but how many GB of unified memory it has**. Bottom line up front: **16GB is comfortable up to ~14B, 32GB handles ~32B, and 64GB reaches for 70B**. What's interesting is that the MacBook turns out to be a surprisingly strong contender for local AI — because where a gaming GPU hits a wall at 24–32GB of VRAM, a Mac's unified memory means it can at least *load* the enormous 64GB and 128GB models. This article lays out, as a buyer's guide, which models are viable on a MacBook or MacBook Air by memory tier, how the Air and Pro differ, and how it all stacks up against an [RTX 5090](/en/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/).

## The MacBook's Quirk — 'Unified Memory' Is Your VRAM

On a regular PC, the CPU's RAM and the GPU's VRAM are separate. A local LLM only runs fast once it's loaded into the GPU's VRAM, so the graphics card's VRAM (typically 8–32GB) becomes your ceiling. An **Apple Silicon Mac, by contrast, shares a single pool of "Unified Memory" between the CPU and GPU**. In other words, a Mac's RAM *is* its VRAM, so on a 64GB Mac you can in principle devote most of that pool to the model.

This is the Mac's decisive advantage for local AI. Because you can secure **a lot of memory relatively cheaply**, it becomes possible for an individual to run a 70B-class large model on a single laptop. Two caveats come attached, though. First, macOS reserves a chunk for the system, so **the amount you can actually use is roughly 70% of the unified memory** (an 8GB Mac really only has 5–6GB free for a model). Second, capacity is one thing, but **memory bandwidth (speed) varies enormously by chip tier**, so the same model can feel wildly different in real-world speed (more on this below).

![MacBook on a desk](https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVzayUyMGFwcGxlfGVufDF8MHx8fDE3ODMyOTg5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Maxim Hopman](https://unsplash.com/@nampoh?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/silver-macbook-on-white-table-Hin-rzhOdWs?utm_source=spice-bandit-blog&utm_medium=referral)*

## What Runs at Each Memory Tier — At a Glance

Here's which models are practical at each unified-memory tier, based on Q4 quantization.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 300" width="100%" height="auto" role="img" aria-label="Viable local LLM sizes by MacBook unified memory. 8GB runs 3 to 4B, 16GB up to 14B, 24GB around 20B, 32GB around 32B, 64GB 70B, 128GB beyond 70B.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">Practical model size by MacBook unified memory (Q4)</text>
  <text x="12" y="58" fill="#23201D" font-size="13" font-weight="bold">8GB</text>
  <rect x="90" y="44" width="60" height="20" fill="#E5DECF"/>
  <text x="158" y="58" fill="#8A8378" font-size="12">3–4B (7–8B is tight) — entry / lightweight</text>
  <text x="12" y="94" fill="#23201D" font-size="13" font-weight="bold">16GB</text>
  <rect x="90" y="80" width="120" height="20" fill="#E5DECF"/>
  <text x="218" y="94" fill="#8A8378" font-size="12">~14B comfortably — the minimum to buy today</text>
  <text x="12" y="130" fill="#23201D" font-size="13" font-weight="bold">24GB</text>
  <rect x="90" y="116" width="180" height="20" fill="#E5DECF"/>
  <text x="278" y="130" fill="#8A8378" font-size="12">~20B class</text>
  <text x="12" y="166" fill="#23201D" font-size="13" font-weight="bold">32GB</text>
  <rect x="90" y="152" width="250" height="20" fill="#C8102E"/>
  <text x="348" y="166" fill="#23201D" font-size="12" font-weight="bold">32B class — the practical sweet spot</text>
  <text x="12" y="202" fill="#23201D" font-size="13" font-weight="bold">64GB</text>
  <rect x="90" y="188" width="360" height="20" fill="#C8102E"/>
  <text x="458" y="202" fill="#23201D" font-size="12" font-weight="bold">70B class</text>
  <text x="12" y="238" fill="#23201D" font-size="13" font-weight="bold">128GB</text>
  <rect x="90" y="224" width="480" height="20" fill="#8A8378"/>
  <text x="12" y="270" fill="#8A8378" font-size="11">* Usable memory is about 70% of unified memory. A long context needs more.</text>
  <text x="12" y="288" fill="#8A8378" font-size="11">* This is "does it load." Speed (tok/s) is a separate matter of chip tier (bandwidth).</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">"How far it loads" is set by memory; "how fast it runs" is set by the chip tier.</figcaption>
</figure>

To hit only the essentials — **8GB is tight even as a local-LLM starter kit.** Small 3–4B models work, but even a 7–8B model strains it. If you're buying new today, **16GB is the bare-minimum line** (recent MacBook Airs start at 16GB anyway), and if you're serious about it, **32GB is the value sweet spot** (32B-class recent models run comfortably). If you're aiming at 70B, you need 64GB or more.

## Air vs Pro — It's Not Just About Memory

Even at the same 16GB, a MacBook Air and a MacBook Pro give you a different local-LLM experience. There are two reasons.

- **Memory bandwidth**: How fast the model can be read in governs generation speed (tok/s). The base M-series chip (Air) has lower bandwidth, and it widens several-fold as you move to Pro, Max, and Ultra. In other words, **the same model runs far faster on a MacBook Pro (Max) than on an Air.** Even with plenty of capacity, a narrow bandwidth makes large models feel sluggish.
- **Heat (throttling)**: The MacBook Air **has no fan.** Work that hammers the GPU for a long stretch, like an LLM, builds up heat and gradually shaves off performance (throttling). It's fine for brief use, but for long generations or sustained work, the fan-equipped MacBook Pro is more stable.

To sum up — **if you'll run small models lightly and on the go, a MacBook Air (16–24GB) is plenty**, and **if you'll run 32B-and-up often and long and speed matters, a MacBook Pro (Pro/Max, 32–64GB+)** is the right call.

![MacBook Pro on a desk](https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxtYWNib29rJTIwbGFwdG9wJTIwZGVzayUyMGFwcGxlfGVufDF8MHx8fDE3ODMyOTg5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Giorgio Trovato](https://unsplash.com/@giorgiotrovato?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-on-white-table-8krX0HkXw8c?utm_source=spice-bandit-blog&utm_medium=referral)*

## Hands-On — Running Ollama on a MacBook

The easiest way to run a local LLM on a Mac is [Ollama](/en/blog/2026-07-02-local-llm-beginner-guide/). Install it and it **automatically detects and uses Apple Silicon's Metal backend**, so there's no separate GPU setup to do.

```bash
# 16GB MacBook — 8~14B recommended
ollama run llama3.1:8b

# 32GB MacBook — 32B-class sweet spot
ollama run qwen2.5:32b
```

Two practical tips. First, **watch memory pressure.** When the model plus context exceeds your usable memory, macOS starts swapping and slows to a crawl. If memory pressure is yellow or red in Activity Monitor, step down a tier to a smaller model or stronger quantization. Second, **context length eats memory too** — the longer the document you feed in, the more headroom you need, so it's safest to keep one tier of margin below the ceilings in the chart above.

## MacBook vs RTX 5090 — Which Should You Pick

If you're weighing a MacBook against a gaming GPU for local AI, they have opposite personalities.

| Item | MacBook (unified memory) | RTX 5090 (32GB) |
|---|---|---|
| Max model | 70B at 64GB+, beyond that at 128GB | 32B comfortably, 70B is a compromise |
| Speed (bandwidth) | Varies by chip tier (Max/Ultra fast) | Very fast (~1.8TB/s) |
| Strengths | Cheap large memory, quiet, low power, portable | Raw speed, blazing-fast small models |
| Weaknesses | Lower bandwidth than a GPU | 32GB capacity ceiling, power & noise |

In one line — **"large models, quietly and on the move" is the MacBook; "small-to-mid models at maximum speed" is the 5090.** The detailed 5090 breakdown is in [How Many Billion Parameters an RTX 5090 Can Run](/en/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/).

## So What — How Should You Buy a MacBook for Local AI

Compress the buying criteria into one sentence — **"generous on capacity for the future, matched on tier to your use case."** If you plan to use local LLMs seriously, I recommend **16GB minimum, 32GB if you can.** You can't add memory later (Apple Silicon is soldered on-chip), so bumping one tier at purchase pays off for years. If speed also matters, go for a MacBook Pro's Pro/Max chip; if you'll use it lightly, a MacBook Air at 16–24GB is plenty.

Above all — before the hardware numbers, first decide **"what size model is enough for my work."** Practical tasks like summarizing, coding, and document Q&A are usually well served by 14–32B, and if so, there's no need to chase a top-end 128GB model. For most individuals, **a 32GB MacBook is the realistic sweet spot for local AI.**

---

**Local LLM Series**
- [Part 1 — Getting Started with Local LLMs](/en/blog/2026-07-02-local-llm-beginner-guide/)
- [Part 2 — Running a Local LLM on Your iPhone](/en/blog/2026-07-03-local-llm-iphone-guide/)
- [Hermes AI × LM Studio Local Integration](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)
- [How Many Billion Parameters an RTX 5090 Can Run](/en/blog/2026-07-07-rtx5090-ollama-local-llm-parameters/)

**Sources**
- [SitePoint — Local LLMs on Apple Silicon (2026)](https://www.sitepoint.com/local-llms-apple-silicon-mac-2026/) (models by memory tier)
- [InsiderLLM — Best Local LLMs for Mac 2026](https://insiderllm.com/guides/best-local-llms-mac-2026/) (M1–M5 benchmarks)
- [ModelFit — Best LLM for MacBook by RAM tier](https://modelfit.io/guides/best-llm-for-macbook/) (recommendations by RAM tier)
</content>
</invoke>
