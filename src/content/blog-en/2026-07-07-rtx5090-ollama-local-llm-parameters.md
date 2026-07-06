---
title: "RTX 5090 Local LLM — How Many Billion Parameters Can It Run? VRAM Guide"
description: "How many billion-parameter models can an RTX 5090 (32GB) run in Ollama? A full breakdown of the VRAM math, feasibility and speed (tok/s) by model size, and the practical 32B vs 70B verdict."
pubDate: "2026-07-07T09:30:00+09:00"
category: ai
tags: ["rtx-5090", "local-llm", "ollama", "vram"]
lang: en
koSlug: 2026-07-07-rtx5090-ollama-local-llm-parameters
---

If you've bought an RTX 5090 — or you're weighing whether to — one question sits near the top of the list: **"How many billion parameters of local LLM will this thing actually run?"** The short answer: with its **32GB of VRAM, the RTX 5090 runs a 32B model very comfortably, and a 70B model only if you crank the quantization hard or offload part of it to the CPU.** This piece walks through *why* that's the answer — the VRAM math, feasibility and speed by model size, and hands-on Ollama tips — all in one place. If local LLMs are new to you, start with the [Local LLM Beginner's Guide [Part 1]](/en/blog/2026-07-02-local-llm-beginner-guide/).

## The Verdict First — What the RTX 5090 Can Do

The RTX 5090 ships with **32GB of GDDR7 VRAM**. For local LLMs, the thing that matters most isn't raw GPU compute — it's this **VRAM capacity**. When a model fits entirely in VRAM it runs fast; when it overflows, it slows to a crawl or won't run at all. Here's the one-line summary at 32GB:

- **7B–14B**: Roomy and very fast. Nothing to think about.
- **32B**: **The sweet spot.** Loads comfortably at Q4–Q8 quantization, and the speed is practical (40–55 tok/s).
- **70B**: Q4 (about 40GB) won't fit in 32GB. **Even Q3 (about 34GB) slightly overshoots 32GB**, so you need offloading — pushing part of the model to the CPU (force it on without offloading and you'll get around 20 tok/s; spill into system RAM and it drops to single digits).
- **100B and up**: Too much for a single 5090. You'd need multiple GPUs or aggressive quantization.

![Gaming graphics card](https://images.pexels.com/photos/34552811/pexels-photo-34552811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Matheus Bertelli](https://www.pexels.com/@bertellifotografia) on [Pexels](https://www.pexels.com/photo/close-up-of-gaming-graphics-card-fans-with-red-lighting-34552811/)*

## The VRAM Math — How Many B Is How Many GB?

"How many B will run" ultimately comes down to **does the model fit in VRAM**. You estimate the memory you need roughly like this:

> **Required VRAM ≈ (parameter count) × (bytes per parameter) + headroom for context**

Bytes per parameter are set by the level of **quantization**. Quantization is the technique of compressing a model's weights into fewer bits to shrink its memory footprint.

| Precision | Bytes/param | Quality | 70B example |
|---|---|---|---|
| FP16 (original) | 2 bytes | Best | ~140GB |
| Q8 | 1 byte | Near-original | ~70GB |
| Q4 (most common) | ~0.5 bytes | Practical balance | ~40GB |
| Q3 | ~0.4 bytes | Quality starts to degrade | ~30GB |

In other words, **the same model can need several times more or less memory depending on its quantization.** The most widely used level for local work is Q4 (a balance of quality and size), dropping to Q3 when VRAM is tight. On top of that, **the KV cache eats additional VRAM in proportion to context length** — meaning the longer the document you feed in, the more memory you need — so you should leave headroom above the numbers above.

## The Full Breakdown by Model Size — On an RTX 5090 (32GB)

Plug the math above into the 5090's 32GB and you get this table. Figures are for Q4, and speeds are approximate.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 280" width="100%" height="auto" role="img" aria-label="Bar chart of Q4 required memory by model size on an RTX 5090 with 32GB of VRAM. 8B about 5 gigabytes, 14B about 9 gigabytes, and 32B about 20 gigabytes all fit within 32 gigabytes. 70B about 40 gigabytes exceeds the limit.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">Required VRAM by Q4 model on an RTX 5090 (32GB)</text>
  <line x1="200" y1="40" x2="200" y2="230" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="205" y="52" fill="#C8102E" font-size="11" font-weight="bold">← 32GB limit line</text>
  <text x="150" y="76" fill="#23201D" font-size="13">8B</text>
  <rect x="70" y="62" width="20" height="20" fill="#E5DECF"/>
  <text x="95" y="76" fill="#8A8378" font-size="11">~5GB · very fast</text>
  <text x="140" y="116" fill="#23201D" font-size="13">14B</text>
  <rect x="70" y="102" width="36" height="20" fill="#E5DECF"/>
  <text x="112" y="116" fill="#8A8378" font-size="11">~9GB · fast</text>
  <text x="140" y="156" fill="#23201D" font-size="13">32B</text>
  <rect x="70" y="142" width="80" height="20" fill="#C8102E"/>
  <text x="156" y="156" fill="#23201D" font-size="11" font-weight="bold">~20GB · sweet spot (40–55 tok/s)</text>
  <text x="140" y="196" fill="#23201D" font-size="13">70B</text>
  <rect x="70" y="182" width="160" height="20" fill="#8A8378"/>
  <text x="234" y="196" fill="#8A8378" font-size="11">~40GB · over limit → needs Q3 or offloading</text>
  <text x="12" y="252" fill="#8A8378" font-size="11">* Approximate values based on Q4 file sizes. In practice, extra VRAM is needed in proportion to context length.</text>
  <text x="12" y="270" fill="#8A8378" font-size="11">* Speed (tok/s) is a rough figure that varies with hardware, model, and settings.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">Up to 32B fits comfortably within 32GB; 70B crosses the limit line and forces a compromise.</figcaption>
</figure>

To sum up, **the 5090's realistic ceiling is "32B at Q4, 70B at Q3."** A 32B model is about 20GB at Q4, so it leaves generous context headroom — and if you want, you can bump it up to Q6–Q8 for even higher quality. A 70B model, by contrast, blows well past 32GB at Q4, and even the quality-sacrificing Q3 (about 34GB) slightly overshoots 32GB, so offloading some layers to CPU memory becomes unavoidable. And that costs you a lot of speed.

## Ollama in Practice — How to Actually Run It

Run it through [Ollama](/en/blog/2026-07-02-local-llm-beginner-guide/) and most of this is automatic. When you pull a model, you pick the quantization with a tag.

```bash
# 32B model (the 5090's sweet spot)
ollama run qwen2.5:32b

# For 70B, tighten the quantization tag (Q3 family)
ollama run llama3.3:70b-instruct-q3_K_M
```

Three practical points worth remembering:

- **Ollama offloads automatically.** If a model is bigger than your VRAM, it doesn't die — it automatically pushes the overflowing layers to the CPU/RAM. But it slows down accordingly. Force a 70B onto a 5090 and it *will* run, but you have to accept the speed hit.
- **Mind your context length.** The longer the document you feed in, the more VRAM the KV cache eats. Even a 32B you'd been running with room to spare can get tight if you set a large context.
- **Check the tag (Q4_K_M, etc.).** The same model differs in size and quality depending on the tag. Make sure the default fits your VRAM before you pull it.

## 5090 vs 4090 vs Mac — a Quick Comparison

- **RTX 4090 (24GB)**: With 8GB less VRAM than the 5090, 70B is even tighter and 32B is effectively the ceiling. The 5090's 32GB is what opened the door to "you can at least touch a 70B, conditionally."
- **Mac (unified memory)**: A Mac's structure has the GPU share system RAM, so a 64GB or 128GB Mac can, from a pure VRAM standpoint, "load" larger models than a 5090. That said, the 5090 leads on bandwidth and compute speed, so for the same model the 5090 is generally faster. (Details by Mac model in the next post.)

## So What — "Enough for the Job" Beats "How Many B"

The real answer to "does a 5090 run 70B?" is closer to **"why bother?"** In many cases, **running a 32B comfortably at high-quality Q6–Q8 gives more real-world satisfaction than grinding a 70B out at Q3.** The performance of recent 32B-class models has climbed so much that most practical work — coding, summarization, document Q&A — is well served by 32B.

So here's the conclusion: it's most accurate to see the RTX 5090 as a **"local LLM machine that runs 32B smoothly."** The 70B is a "possible-but-with-compromises bonus." Rather than getting hung up on the hardware-spec number ("how many B"), decide first **what model size is enough for your work** — and the 5090 will comfortably handle most of an individual's local-AI needs.

---

**Local LLM Series**
- [Part 1 — Running AI on Your Own Computer](/en/blog/2026-07-02-local-llm-beginner-guide/)
- [Part 2 — Running a Local LLM on Your iPhone](/en/blog/2026-07-03-local-llm-iphone-guide/)
- [Hermes AI × LM Studio Local Integration](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)

**Sources**
- [ModelFit — RTX 5090 Local LLM Benchmarks](https://modelfit.io/gpu/rtx-5090/) (32GB, tok/s by model)
- [InsiderLLM — VRAM Requirements Cheat Sheet](https://insiderllm.com/guides/vram-requirements-local-llms/) (required VRAM by quantization)
- [ToolHalla — Best Local LLMs for RTX 5090 (2026)](https://toolhalla.ai/blog/best-local-llms-rtx-5090-2026) (model recommendations & quantization)
</content>
</invoke>
