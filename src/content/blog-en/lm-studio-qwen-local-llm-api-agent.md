---
title: "Run Qwen Locally with LM Studio: API & AI Agents"
description: "Run Qwen3.5 9B on an M5 MacBook Air with LM Studio and you get an OpenAI-compatible API. Here's how to wire it into any agent framework by changing one line — and where local LLMs still fall short."
pubDate: 2026-07-09T13:45:00+09:00
category: ai
tags: ["LM Studio", "Qwen", "Local LLM", "AI Agents"]
lang: en
koSlug: lm-studio-qwen-local-llm-api-agent
---

Let's start with the bottom line. **On an M5 MacBook Air with 16GB of unified memory, you can download Qwen3.5 9B in LM Studio and, with a single click, spin up an OpenAI-compatible API server at `http://localhost:1234/v1`.** The magic word here is *compatible*. Nearly every agent framework written against the OpenAI SDK will connect to your local model just by pointing `base_url` at that address. No monthly subscription, no per-token billing, and your data never leaves the laptop. There's a catch, of course — speed and the reliability of tool calling. This guide walks the whole path: from download to agent wiring, and honestly, what works and what doesn't.

First, model selection. The **Qwen3.5 "Small" lineup**, released March 2, 2026, ships five dense models — **0.8B, 2B, 4B, 9B, and 27B** — all under an Apache 2.0 license with a 262K-token context window. The sweet spot for the M5 MacBook Air's memory budget is the **9B**. Quantized to 4-bit it lands around 5.5GB, so it fits comfortably in 16GB of unified memory, and it strikes a usable balance across 100+ languages (Korean included), tool calling, and reasoning. The larger 27B is for 32GB configs; the lighter 4B is your fallback when you want to spare heat and battery. That's why this guide is built around the 9B.

![macbook pro on brown wooden table](https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGV2ZWxvcGVyJTIwY29kaW5nfGVufDF8MHx8fDE3ODM1NzE0MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Joshua Reddekopp](https://unsplash.com/@joshuaryanphoto?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-on-brown-wooden-table-SyYmXSDnJ54?utm_source=spice-bandit-blog&utm_medium=referral)*

## Why local LLMs, and why now — the math the M5 changed

Just three or four years ago, "running a large language model on a laptop" was practically a joke. A GPT-3-class model demanded a fistful of A100s in a datacenter — not something an individual could touch. Two currents crossing changed the picture. One is the maturing of **quantization**: since 2023, formats like GGUF, GPTQ, and AWQ have shown that compressing 32-bit floating-point weights down to 4-bit doesn't collapse performance. The trigger for that wave was **llama.cpp**, released by Georgi Gerganov in March 2023. This open-source project made Meta's LLaMA weights run in C/C++ even on a CPU, and the GGUF quantization format it later spawned turned "run an LLM on a personal computer" into reality. The engine LM Studio wraps in a friendly GUI traces its roots right back here.

The other current is Apple Silicon's **unified memory** architecture. Because the CPU and GPU share a single memory pool, you can put your entire system memory toward loading a model — unlike a PC boxed in by 8GB of graphics-card VRAM. The M5 MacBook Air, released in March 2026, is where this trend currently lands. Per Apple, the M5 pairs a 10-core CPU with an 8-to-10-core GPU (depending on configuration) and **153GB/s of memory bandwidth** (28% faster than M4), and can be configured from 16GB up to 24GB or 32GB. With a "Neural Accelerator" embedded in each GPU core to help with matrix math, real-world token generation on a 9B-class model climbs to tens of tokens per second. In other words, work that took a server a few years ago now runs on a coffee's worth of electricity in a café.

Why does that matter? Cloud APIs are convenient, but they bill you three ways — **money** (per-token charges), **latency** (the network round trip), and **privacy** (your input passes through someone else's server). A local LLM removes all three at once. For solo developers and one-person companies handling internal documents, private notes, or unreleased code they'd rather not send out, "AI that ends inside my own laptop" is an appealing trade-off even at a slight performance cost.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0">
<svg viewBox="0 0 640 300" width="100%" height="auto" role="img" aria-label="Approximate 4-bit quantized memory footprint by Qwen3.5 dense size, with the 16GB MacBook Air usable limit">
<text x="20" y="28" font-family="sans-serif" font-size="16" font-weight="700" fill="#23201D">Memory by Qwen3.5 size (4-bit, approx.) — lower is lighter</text>
<text x="20" y="48" font-family="sans-serif" font-size="12" fill="#8A8378">Gray dashed line = practical ceiling on a 16GB MacBook Air (model + context headroom)</text>
<line x1="150" y1="80" x2="150" y2="250" stroke="#E5DECF" stroke-width="1"/>
<rect x="150" y="90" width="16" height="24" fill="#8A8378"/>
<text x="110" y="107" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">0.8B</text>
<text x="174" y="107" font-family="sans-serif" font-size="12" fill="#23201D">~0.7GB</text>
<rect x="150" y="128" width="55" height="24" fill="#8A8378"/>
<text x="110" y="145" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">4B</text>
<text x="213" y="145" font-family="sans-serif" font-size="12" fill="#23201D">~2.5GB</text>
<rect x="150" y="166" width="121" height="24" fill="#C8102E"/>
<text x="110" y="183" font-family="sans-serif" font-size="13" font-weight="700" fill="#23201D" text-anchor="end">9B</text>
<text x="279" y="183" font-family="sans-serif" font-size="12" fill="#23201D">~5.5GB · comfy on 16GB</text>
<rect x="150" y="204" width="363" height="24" fill="#23201D"/>
<text x="110" y="221" font-family="sans-serif" font-size="13" fill="#23201D" text-anchor="end">27B</text>
<text x="521" y="221" font-family="sans-serif" font-size="12" fill="#23201D">~16.5GB · needs 32GB</text>
<line x1="392" y1="80" x2="392" y2="250" stroke="#8A8378" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="392" y="270" font-family="sans-serif" font-size="11" fill="#8A8378" text-anchor="middle">16GB usable ceiling</text>
</svg>
<figcaption style="font-family:sans-serif;font-size:12px;color:#8A8378;margin-top:8px">Quantized sizes are approximations that vary by build and context length. You must leave memory for the OS and apps, so "total memory" is not your model budget.</figcaption>
</figure>

## Spinning up Qwen in LM Studio — from download to server

A quick note on why Qwen became the de facto default for local LLMs. In 2023, Meta released Llama as effectively open-weight, opening the door to an ecosystem of "download the weights and run them on my own machine." Latecomers like Mistral, Alibaba's Qwen, and DeepSeek followed with open models and quickly narrowed the performance gap. Qwen in particular fields a dense lineup down to very small sizes with strong multilingual support (Korean included), which makes it a favorite in memory-constrained laptop environments.

LM Studio is a desktop tool that lets you handle local LLMs "like installing an app." Its core value is a GUI you can use without knowing a single terminal command. Here's the sequence.

**1) Install and download the model.** Grab the app from [lmstudio.ai](https://lmstudio.ai), launch it, and type `qwen3.5-9b` into the search box up top. Pick a quantization — beginners should start with **Q4_K_M** (4-bit, a good quality/size balance). On a Mac, choose an **MLX** build when available. MLX is Apple's Silicon-specific machine learning framework, and the same model generates tokens noticeably faster on M1–M5 chips than a generic GGUF build does.

**2) Sanity-check in chat first.** When the download finishes, load the model in the chat tab on the left and trade a few messages. This is where you gauge whether the speed (tokens per second) and Korean/English quality are good enough. Qwen3.5 9B lets you toggle between a "thinking" mode and a non-thinking mode, so you can match deep reasoning or fast responses to the task, and its 262K-token context leaves room to drop in whole documents at once.

**3) Turn on the API server.** Head to the **Developer** tab on the left and flip the top toggle to **Running**. That's it — an OpenAI-compatible HTTP server is now live at `http://localhost:1234`. If the GUI feels like overkill, `lms server start` in the terminal gives you a headless launch. Confirm the server is up with a single line:

```bash
curl http://localhost:1234/v1/models
```

If a JSON list of loaded models comes back, you're set. Use the exact model ID string from that response as your `model` value in code (a mismatch throws an error).

| Config | Unified memory | Recommended Qwen3.5 size | Feel |
|--------|---------------|--------------------------|------|
| M5 base | 16GB | **9B** (MLX Q4) | Smooth for chat and coding help |
| M5 mid | 24GB | 9B (with headroom) | Longer context, easier multitasking |
| M5 max | 32GB | 27B (tight) / 9B (roomy) | Heavier work possible; watch heat and speed |

*Sources: [Apple Newsroom, "MacBook Air with M5" (2026-03)](https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/); [Qwen3.5 Small Models — Artificial Analysis](https://artificialanalysis.ai/articles/qwen3-5-small-models). Per-size memory figures are build-dependent approximations.*

![Detailed view of a server rack with a focus on technology and data storage.](https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/close-up-of-computer-hardware-17489157/)*

## The OpenAI-compatible API in three minutes — endpoints, curl, Python

The real power of the LM Studio server is that **it mimics OpenAI's API spec exactly**. Because the request/response JSON shapes match OpenAI's, code written for OpenAI works by changing only the address.

There's some history worth noting here. As GPT-3's API led the way from 2020 to 2022, countless libraries, tutorials, and agent frameworks were built against OpenAI's request/response format, and that format hardened into a **de facto standard**. When local runtimes (LM Studio, Ollama, vLLM, and others) arrived later, they didn't force a new spec — they advertised "OpenAI compatibility" because it was the fastest way to ride an ecosystem that already existed. Today's convenience, where a single `base_url` line swaps cloud for local, is the dividend of that standardization. Per the official docs, the supported endpoints are:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v1/models` | GET | List loaded models |
| `/v1/chat/completions` | POST | Chat (the workhorse) |
| `/v1/responses` | POST | Newer spec for tool use and agents |
| `/v1/embeddings` | POST | Embeddings (for search/RAG) |
| `/v1/completions` | POST | Legacy text completion |

*Source: [LM Studio Developer Docs — OpenAI Compatibility](https://lmstudio.ai/docs/developer/openai-compat)*

The most common call — a chat completion via the Python `openai` SDK — is this short. Since it's local, the API key can be anything; by convention people use `lm-studio` or `not-needed`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",   # ← this one line is the whole trick
    api_key="lm-studio",                    # any value works locally
)

resp = client.chat.completions.create(
    model="qwen3.5-9b",   # use the exact ID returned by /v1/models
    messages=[{"role": "user", "content": "Give me 3 advantages of a local LLM"}],
    temperature=0.7,
)
print(resp.choices[0].message.content)
```

Only `base_url` changed, from a cloud address to `localhost`. Everything else is identical to using OpenAI. That single swap is exactly what makes the agent wiring in the next section possible.

## Wiring the API into AI agents — the magic of one line

An agent, in the end, is "a structure where the LLM picks tools itself, calls them, and walks through multiple steps to finish a task." You don't have to build that from scratch. Most agent frameworks on the market sit on top of the OpenAI SDK, so **if you just point the OpenAI client's address at localhost**, they run on your local model. The principle is the same as the previous section.

| Framework | How to connect | Note |
|-----------|---------------|------|
| **LangChain** | `ChatOpenAI(base_url="http://localhost:1234/v1")` | Instantly localizes chains and RAG |
| **OpenAI Agents SDK** | Point the client `base_url` at localhost | The official agent loop, run locally |
| **LlamaIndex / smolagents / AutoGen** | Change the OpenAI client's base URL | "Anything that takes an OpenAI address works" |
| **n8n and other no-code** | Set a Custom Base URL on the OpenAI node | Folds into workflow automation |

*Sources: [LM Studio Developer Docs](https://lmstudio.ai/docs/developer); [LM Studio — Tool Use](https://lmstudio.ai/docs/developer/openai-compat/tools)*

Go one step deeper and you reach **tool/function calling**. LM Studio supports OpenAI-style function calling on both `/v1/chat/completions` and `/v1/responses`. Tell the model "here are some functions, call them if you need to," and it returns calls like `get_weather("Seoul")` as JSON. With the Python SDK, a high-level `model.act(...)` call **runs multiple rounds of tool calls automatically**, turning the model into an autonomous agent that can create files and run programs on your local machine. Conceptually it's identical to building an agent on a cloud API — the only difference is that no invoice arrives.

To sum up, the stack layers like this: **model (Qwen3.5 9B) → runtime (LM Studio, OpenAI-compatible server) → agent framework (LangChain, etc.) → tools (files, web, DB).** Because each layer meshes through a standard spec, scaling the model up to 27B later or swapping frameworks doesn't force you to rewrite the rest. That lego-block replaceability is the real asset of a local stack.

## The limits of a local agent — what works and what doesn't

Read only this far and it's all rosy, but the limits deserve honesty. The verdict: **"chat, summarization, and coding help are excellent; complex multi-step autonomous agents are still dicey."**

**First, the reliability of tool calling.** A 2026 independent evaluation measured 13 local LLMs on tool calling across 40 test cases — and intriguingly, **bigger did not mean better at tool calling.** A relatively small model beat larger ones in some cases. Flip that around and it means you can't blindly trust a 9B model either; depending on the model and build, it may fill function arguments incorrectly or skip a call entirely. For an autonomous agent to complete 10 steps, each step's tool call has to be nearly flawless — and on small local models that reliability still trails cloud frontier models.

**Second, speed and context.** A single laptop's compute is no match for a datacenter. The 9B model is smooth in short conversations, but in agent work that actually fills the 262K context and loops many times, responses slow down and heat and battery drain climb. The longer you set the context window, the more memory it eats.

**Third, top-end quality.** On subtle reasoning, up-to-date knowledge, and complex code generation, local 9B–27B models still lag the big cloud models. So the realistic answer isn't "all local" — it's **hybrid**. Hand privacy-sensitive or repetitive work to local Qwen, and route only the hard, rare tasks to the cloud. That's the cost/quality equilibrium.

| Works well | Still be careful |
|-----------|------------------|
| Offline chat, translation, summarization | 10+ step fully autonomous agents |
| Code completion and refactoring help | Precise multi-tool orchestration |
| RAG over internal/personal docs (local search) | Repeated processing of very long context |
| Automating repetitive work (zero cost) | Top-tier reasoning and latest knowledge |

*Source: [jdhodges, "I Tested 13 Local LLMs on Tool Calling" (2026)](https://www.jdhodges.com/blog/local-llms-on-tool-calling-2026-pt1-local-lm/)*

## So what — who benefits, and why

The point of the M5 MacBook Air + LM Studio + Qwen3.5 9B combo is *not* "replace GPT for free." That's an overstatement. The real point is that **the marginal cost of AI experimentation converges to zero**. Run agents this way and that on a cloud API and the per-token charges pile up until you hesitate to experiment. On a local stack you can run a prompt 10,000 times with no added bill. For solo developers, one-person companies, and students, that's the freedom to fail as much as you like.

The history of the PC foretold this. In the 1970s and '80s, computation was locked inside mainframes owned by a few — until the microprocessor pulled that power down onto the desk and made it a personal tool. The scene of AI, once confined to datacenters, descending to the laptop looks like the second act of that same downsizing. And as before, the forces prying it open are cheap hardware and an **open standard**.

So here's how to begin. ① Pull Qwen3.5 9B (MLX) into LM Studio and validate quality in chat. ② Turn on the API server in the Developer tab, change `base_url`, and call it from a few lines of Python. ③ Once you're comfortable, attach a simple tool-calling agent with LangChain or the OpenAI Agents SDK. ④ And design for hybrid from the start — local as the default, cloud only for the hard stuff. AI that ends inside your laptop is no longer a hobby; it's a working tool. That the key to the door is a single `base_url` line is the loveliest part of this whole shift.

> This article summarizes general tool usage and technology trends and is not advice on any specific product purchase or investment. Model and app specs and performance change by version, so confirm the latest details in the official documentation.
