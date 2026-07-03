---
title: "Run a Local LLM on Your iPhone: Smartphone AI Guide, Part 2"
description: "How to run AI on an iPhone with no internet. App comparison (PocketPal, Locally by LM Studio, fullmoon), which models fit which iPhone, and a 10-minute setup guide — smartphone local LLMs as of July 2026."
pubDate: 2026-07-04T00:20:00+09:00
category: ai
tags: ["local-llm", "iphone-ai", "on-device-ai", "pocketpal"]
lang: en
koSlug: 2026-07-03-local-llm-iphone-guide
---

**Running a local LLM on an iPhone** — not on a MacBook, not on a gaming PC, but on the smartphone in your pocket. Bottom line up front: **it works.** As of July 2026, you can grab a free app from the App Store, download a 2–3GB small model, and have your first conversation with an AI on an iPhone in airplane mode — all within 10 minutes. There's a catch, though. What you can actually run are small models in the 1–4B (1 to 4 billion parameter) class, and the quality isn't a ChatGPT replacement so much as "a scaled-down personal assistant that happens to work offline." [Part 1 of this local LLM series](/en/blog/2026-07-02-local-llm-beginner-guide/) covered the computer-side fundamentals (quantization, GGUF, memory math); this Part 2 walks through, in order: ① how far iPhone hardware can actually take you, ② the difference between Apple Intelligence and running models yourself, ③ an app comparison with recommendations, ④ a step-by-step setup guide, and ⑤ realistic uses and limits. The core message is this: **the value of a local LLM on an iPhone comes not from performance, but from three properties — it's always in your pocket, it needs no signal, and nobody else can see it.**

## Does It Really Work on an iPhone? — Start with RAM by Model and iOS Memory Limits

As Part 1 stressed, the first gate for any local LLM is **memory**. Unlike Macs, Apple doesn't officially publish iPhone RAM specs, but the known figures are as follows (per [MacRumors](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/)). Notably, the iPhone 17 Pro line released in fall 2025 jumped from 8GB to 12GB of RAM — the largest memory increase in iPhone history, widely read as an upgrade aimed squarely at on-device AI.

| Model | RAM | Models you can realistically run (Q4 quantization) |
|------|-----|---------------------------------------------|
| iPhone 17 Pro / Pro Max / Air | 12GB | 3–4B class comfortably; 7–8B class worth trying (slow) |
| iPhone 17 (base) | 8GB | 3–4B class (Phi-4 Mini, Qwen 4B class) |
| iPhone 15 Pro / 16 series | 8GB | 3–4B class (Gemma 4 E2B, Llama 3.2 3B) |
| iPhone 14 Pro / 15 (base) | 6GB | 1–2B class (Llama 3.2 1B, SmolLM class) |
| iPhone SE / 13 (base) and older | 4GB or less | Effectively not recommended (even 1B class is a squeeze) |

*Sources: [MacRumors — iPhone 17 series RAM](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/), [PromptQuorum — Best Local LLM Apps for iPhone 2026](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026)*

There's one constraint here that makes phones fundamentally different from computers. iOS enforces a **per-app memory ceiling (the jetsam limit)** — any app that exceeds it gets killed by the system on the spot. The exact number varies by device and OS version, but based on figures reported in developer communities, a single app on an 8GB iPhone can use roughly 4GB or so (see this [Apple Developer Forums thread](https://developer.apple.com/forums/thread/688973)). In other words, the math of "I have 8GB of RAM, so a 7B model (about 4.2GB+ at Q4) should fit" usually ends with the app getting force-quit. The safe assumption is that **an iPhone's practical ceiling is a 3–4B-class model** — which is why quantization (the Q4 compression covered in Part 1) isn't optional here. It's mandatory.

What about speed? According to the [PromptQuorum guide](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026), which compiled measurements as of June 2026, an iPhone 16 Pro running Phi-4 Mini (3.8B, Q4) manages 10–15 tokens per second (14–20 in Metal-accelerated apps). Small 1B-class models reportedly hit 25–40 tokens per second on the latest devices ([Local AI Master](https://localaimaster.com/blog/run-llm-on-phone)). Considering that people read at roughly 5–7 tokens per second, that's **plenty fast for chat use**. Two things to brace for, though. Keep generating long-form text for 10–15 minutes and thermal throttling cuts speed by 30–50%; sustained inference reportedly drains the battery at 20–30% per hour. An iPhone local LLM is a tool for "short, frequent conversations" — not a long-report generator.

<figure>
<svg viewBox="0 0 800 260" role="img" aria-label="Bar chart comparing generation speed by model size on an iPhone 16 Pro-class device. 1B-class models 25 to 40 tokens per second, 3-4B-class models 10 to 20 tokens per second, human reading speed about 5 to 7 tokens per second" style="width:100%;height:auto;background:#fafafa;border:1px solid #eee;border-radius:8px;font-family:system-ui">
  <text x="20" y="30" font-size="16" font-weight="700" fill="#111">Generation speed by model size on an iPhone (16 Pro class, tokens/sec — higher is faster)</text>
  <g stroke="#e5e7eb" stroke-width="1">
    <line x1="220" y1="50" x2="220" y2="210"/>
    <line x1="355" y1="50" x2="355" y2="210"/>
    <line x1="490" y1="50" x2="490" y2="210"/>
    <line x1="625" y1="50" x2="625" y2="210"/>
    <line x1="760" y1="50" x2="760" y2="210"/>
  </g>
  <g font-size="12" fill="#6b7280">
    <text x="220" y="228" text-anchor="middle">0</text>
    <text x="355" y="228" text-anchor="middle">10</text>
    <text x="490" y="228" text-anchor="middle">20</text>
    <text x="625" y="228" text-anchor="middle">30</text>
    <text x="760" y="228" text-anchor="middle">40 tok/s</text>
  </g>
  <text x="212" y="80" font-size="13" fill="#374151" text-anchor="end">1B class (Llama 3.2 1B, etc.)</text>
  <rect x="220" y="62" width="337" height="26" rx="4" fill="#2563eb"/>
  <rect x="557" y="62" width="203" height="26" rx="4" fill="#93c5fd"/>
  <text x="560" y="80" font-size="13" font-weight="700" fill="#fff" text-anchor="end">25–40</text>
  <text x="212" y="130" font-size="13" fill="#374151" text-anchor="end">3–4B class (Phi-4 Mini, etc.)</text>
  <rect x="220" y="112" width="135" height="26" rx="4" fill="#9ca3af"/>
  <rect x="355" y="112" width="135" height="26" rx="4" fill="#d1d5db"/>
  <text x="498" y="130" font-size="13" fill="#374151">10–20</text>
  <text x="212" y="180" font-size="13" fill="#374151" text-anchor="end">Human reading speed (reference)</text>
  <rect x="220" y="162" width="81" height="26" rx="4" fill="#e5e7eb"/>
  <text x="309" y="180" font-size="13" fill="#6b7280">~5–7</text>
</svg>
<figcaption>Measured generation-speed ranges by model size (lighter shades show variation by app, quantization, and thermal state). Anything faster than reading speed is practical for chat. Sources: PromptQuorum (2026-06), Local AI Master</figcaption>
</figure>

## Two Paths — Apple Intelligence vs. Running Open Models Yourself

There are actually two routes to "local AI" on an iPhone, and knowing the difference makes choosing an app much easier.

A quick bit of background first. iPhones didn't start carrying dedicated AI hardware recently. The A11 Bionic chip in the iPhone 8 and X, launched in September 2017, shipped with Apple's first "Neural Engine" — 600 billion operations per second, used at the time for little more than Face ID and Animoji ([CNBC, Sept 2017](https://www.cnbc.com/2017/09/12/apple-unveils-a11-bionic-neural-engine-ai-chip-in-iphone-x.html)). Six years later, the Neural Engine in the A17 Pro (iPhone 15 Pro) reached 35 trillion operations per second — roughly a 60-fold increase ([Wikipedia — Apple A17](https://en.wikipedia.org/wiki/Apple_A17)). Long before LLMs arrived as software, the hardware had been quietly getting ready for nearly a decade.

**The first path is the one Apple paved for you.** Every recent iPhone already ships with a built-in **on-device foundation model of roughly 3B parameters** for Apple Intelligence. Apple compressed it down to as little as 2 bits per weight, and it supports 15 languages ([Apple ML Research](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)). Starting with iOS 26, the **Foundation Models framework** lets third-party apps call this built-in model for free, with no internet connection ([Apple Newsroom](https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/)). This is the route that brings "quiet AI features" into your apps — a journaling app summarizing your entries, a fitness app cleaning up your workout logs. But this model isn't built for general-purpose chat. Developers broadly agree it's strong at constrained tasks like date extraction, classification, and polishing sentences, and weak at free-form long-form generation. And as a user, you can't choose the model or swap it out.

**The second path is the subject of this article — downloading open models and running them yourself.** You take the small versions of the open models covered in Part 1 — Gemma, Qwen, Llama — and run them in a dedicated app. You pick the model, you can tweak the system prompt and temperature, and you can try the latest open models from outside the Apple ecosystem right away. The price is the small hassle of installing an app and downloading a model. If you want an analogy: the first path is the building's built-in HVAC; the second is installing an air conditioner of your own choosing in your own room. The rest of this article is a guide to the second path.

![space gray iPhone X](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [William Hook](https://unsplash.com/@williamtm?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/space-gray-iphone-x-9e9PD9blAto?utm_source=spice-bandit-blog&utm_medium=referral)*

## Local LLM Apps for iPhone Compared — as of July 2026

The App Store hosts quite a few local LLM apps, and 2026 has already reshuffled the field. The biggest news: **LM Studio — the desktop standard from Part 1 — acquired the iPhone app 'Locally AI' in April 2026** ([LM Studio blog](https://lmstudio.ai/blog/locally-ai-joins-lm-studio)), then in June shipped **LM Link**, a feature that lets your iPhone remotely use the big models running in LM Studio on your Mac or PC at home, over end-to-end encryption ([announcement](https://lmstudio.ai/blog/locally-lm-link)). The combo of "small models on the phone, big models at home over remote" is now officially supported. Here are the major apps at a glance.

| App | Price | Model format | Highlights | Best for |
|----|------|----------|------|--------------|
| **PocketPal AI** | Free (open source) | GGUF (load anything from Hugging Face) | iOS and Android, built-in benchmark, highly configurable | Most people starting out ★ |
| **Locally (by LM Studio)** | Free | MLX (Apple Silicon optimized) | LM Studio's official mobile app; LM Link for remote desktop models | Anyone who installed LM Studio in Part 1 |
| **fullmoon** | Free (open source) | MLX | Made by Mainframe, minimal UI, runs on iPhone, iPad, Mac, and Vision Pro | Fans of light, pretty apps |
| **Private LLM** | Paid (one-time, around $10) | Custom-optimized quantization | Siri and Shortcuts integration, 140+ curated models | Wiring AI into Shortcuts automations |
| **Enclave** | Local models free | GGUF | Chat with PDF documents, voice conversations (only cloud models are paid) | Heavy document-summarization users |
| **MLC Chat / LLM Farm** | Free (open source) | MLC-compiled / GGUF | Fast via Metal acceleration / exposes fine-grained parameters | Power users chasing speed and settings |
| **Apollo (Liquid AI)** | Free | LEAP / LFM2 family | Acquired by on-device specialist Liquid AI, tuned for its lightweight models | The curious about new lightweight models |

*Sources: [PromptQuorum (2026-06)](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026), [LM Studio blog](https://lmstudio.ai/blog/locally-ai-joins-lm-studio), [fullmoon](https://fullmoon.app/), [Enclave](https://enclaveai.app/), [Liquid AI](https://www.liquid.ai/blog/liquid-ai-launches-leap-and-apollo-bringing-edge-ai-to-every-developer) — prices and features are as observed at time of writing and may change.*

Choosing is simple. **First time? PocketPal AI.** It's free and open source, runs on both iOS and Android, and loads any GGUF model from Hugging Face — so everything you learned in Part 1 (picking Q4_K_M and so on) carries over directly. If you already set up LM Studio on your Mac following Part 1, the natural move is to start with **Locally** and add LM Link on top. If design is what you care about, go fullmoon; if Shortcuts automation is the goal, Private LLM is the alternative.

## The 10-Minute Setup Guide — First Chat with PocketPal

Here are the steps to your first conversation, using PocketPal AI. Apart from downloading the model over Wi-Fi up front, no internet is required at any point.

1. **Install the app**: Search the App Store for "PocketPal AI" and install it. It's free, with no account signup (it's an open-source project — [GitHub](https://github.com/a-ghorbani/pocketpal-ai)).
2. **Download a model**: In the Models tab at the bottom, pick a model from the recommendations that fits your device. On 8GB devices (15 Pro through 17), 3–4B class is safe; on 6GB devices, stick to 1B class (see the recommendation table below). Q4_K_M files run 1–3GB, so it's a few minutes on Wi-Fi.
3. **Load the model**: When the download finishes, tap the Load button next to the model. It's in memory within tens of seconds.
4. **First chat**: Say something in the Chat tab. If you want the full effect, **turn on airplane mode first** and then ask a question. The moment an answer streams out with zero signal is the highlight of this whole article.
5. **(Optional) Benchmark**: PocketPal has a built-in benchmark that measures your device's token speed. Swap models and quantization levels to map out exactly where your iPhone's limits are.

One caution — if you keep a model loaded while bouncing between other heavy apps (camera, games), iOS may kill the app to reclaim memory. When you're using a local LLM, it's best to stay in that app.

![black iphone 5 on brown wooden table](https://images.unsplash.com/photo-1596558450268-9c27524ba856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Thom Bradley](https://unsplash.com/@thombradley?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-iphone-5-on-brown-wooden-table-A6qNzfJXRGQ?utm_source=spice-bandit-blog&utm_medium=referral)*

## Recommended Models for iPhone — Sorted by Size

Part 1's formula (required memory ≈ parameters × 0.5 bytes × 1.2, at Q4) holds on iPhone too — you just need extra headroom because of the per-app memory ceiling. These are the small models proven on iPhones as of July 2026.

| Model | Size | Q4 file size (approx.) | Minimum recommended device | Highlights |
|------|------|-------------------|---------------|------|
| Llama 3.2 1B | 1B | ~0.8GB | 6GB RAM (14 Pro and up) | Lightest and fastest (25–40 tok/s class), mobile-tuned |
| Gemma 4 E2B | 2B effective | ~3GB | 8GB RAM (15 Pro and up) | Image recognition, strong multilingual — many real-world reports |
| Llama 3.2 3B | 3B | ~2GB | 8GB RAM | 128K context, well balanced |
| Phi-4 Mini | 3.8B | ~2.5GB | 8GB RAM | Top benchmarks in the 3–4B class, strong at reasoning and math |
| Qwen 3 4B class | 4B | ~2.5–3GB | 8GB RAM (comfortable at 12GB) | Excellent multilingual performance, including Korean |

*Sources: [Local AI Master — Run an LLM on Your Phone](https://localaimaster.com/blog/run-llm-on-phone), [PromptQuorum](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026), [XDA — a month on an iPhone 16 (2026-05)](https://www.xda-developers.com/replaced-chatgpt-claude-gemini-on-phone-with-local-llm/)*

If you'll be working in languages other than English — Korean, say — try the **Gemma and Qwen families** first; their multilingual performance is the most consistently verified. For reference, XDA's May 2026 hands-on chronicles a month spent with PocketPal + Gemma 4 E2B on an iPhone 16 (8GB): the reviewer praised responses as "naturally conversational" and noted that screenshot-based image analysis worked, while being candid about the limits we'll cover next.

## What It's Actually Good For — and What Not to Expect

Time for an honest reality check. Here's where an iPhone local LLM **genuinely earns its keep**:

- **Offline situations**: On a flight abroad, in areas with no roaming, on hikes and camping trips — translation, drafting, general-knowledge Q&A. An AI that needs no signal is more reassuring than you'd expect.
- **Privacy-sensitive notes**: Organizing a journal, health or financial questions, brainstorming sensitive ideas. The certainty that nothing is transmitted to any server is exactly the core value of local LLMs from Part 1.
- **Short, repetitive tasks**: Polishing text-message and email drafts, describing screenshot contents (with vision-capable models), summarizing key points. This is the sweet spot of 3–4B-class models.

The **things not to expect** are just as clear. First, quality. A 3–4B model sits well below even the desktop-class 20–30B models from Part 1, and comparing it to the latest cloud models is pointless. It's unsuited to complex reasoning, long code, or anything requiring factual precision, and hallucinations (plausible-sounding wrong answers) are frequent. Second, sustained use. Thermal throttling and battery drain make long generation jobs a structural mismatch. Third, conveniences. Web search, cross-session memory, tool calling — most of the cloud apps' creature comforts simply aren't there. In short, the honest expectation is **"last year's budget-tier AI in your pocket, plus total privacy, plus offline."**

A paragraph for Android users — the situation is nearly identical to the iPhone, and if anything the options are a bit wider. PocketPal AI is on [Google Play](https://play.google.com/store/apps/details?id=com.pocketpalai) too, so this article's setup guide works as-is, and Galaxy S24/S25-class devices (12GB RAM models) have looser per-app memory limits than iOS, sometimes letting them run slightly larger models on paper-equal hardware. Power users can even run llama.cpp directly via Termux.

![black iphone 4 displaying icons](https://images.unsplash.com/photo-1603515161074-3206aaeb03f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxpcGhvbmUlMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXBwfGVufDF8MHx8fDE3ODMwNDUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [James Yarema](https://unsplash.com/@jamesyarema?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-iphone-4-displaying-icons-G3q7mxXkP-M?utm_source=spice-bandit-blog&utm_medium=referral)*

## So What — Where Is AI on Your Phone Headed?

Let's wrap up. On the iPhone, local LLMs are no longer a question of "can it run?" but "what do you use it for?" And three moves in the first half of 2026 point the way. **Apple opened its built-in 3B model to every app in iOS 26**; **LM Studio acquired an iPhone app and bridged desktop to mobile**; and **the iPhone 17 Pro's RAM jumped to 12GB**. Platform, tooling, and hardware are all pointing in the same direction — on-device AI.

It's also the direction computing history keeps repeating. The power of room-sized mainframes came down to desktop PCs in the 1980s, then to the smartphones in our pockets in the 2000s — and AI is now traveling the same path, from data centers down to personal devices. Recall that in 2019, OpenAI judged its 1.5-billion-parameter GPT-2 risky enough to release only in stages, over nine months ([The Register, Nov 2019](https://www.theregister.com/2019/11/06/openai_gpt2_released/)). Seven years on, a model twice that size runs on an iPhone with no signal at all — and quite apart from any benchmark score, that scene is a milestone in its own right.

For beginners, the playbook follows the same logic as Part 1: no grand preparations. Today, grab PocketPal from the App Store, load one model that fits your device, and have a conversation in airplane mode. Those 10 minutes are enough to judge for yourself what it feels like when your phone carries its own AI — and what place that might take in your daily life. The next installment in this series will cover wiring local LLMs into real workflows: notes, documents, and automation.

## Frequently Asked Questions (FAQ)

**Q1. Can I use a ChatGPT-like AI on an iPhone with no internet?**
Yes. Download a 1–4B-class open model through a free app like PocketPal AI and you can chat even in airplane mode. Just note the quality is small-model tier, not the latest cloud AI.

**Q2. Which iPhone do I need?**
Anything with 8GB of RAM or more (iPhone 15 Pro, the 16 series, the 17 series) runs 3–4B-class models comfortably. 6GB devices (like the 14 Pro) handle up to 1–2B class; older devices with 4GB or less aren't recommended.

**Q3. How much does it cost?**
You can start for $0. Apps like PocketPal AI, Locally, and fullmoon, and open models like Gemma, Llama, and Qwen, are all free. Consider a paid app (like Private LLM) only when you need special features such as Siri integration.

**Q4. Apple Intelligence exists — why bother running models myself?**
Apple Intelligence's built-in model (about 3B) is a supporting engine woven into app features; you can't choose the model or use it as a free-form chatbot. Running models yourself gets you the pick of the latest open models and full control over settings.

**Q5. What about battery and heat?**
Short conversations are fine, but measurements report battery drain of around 20–30% per hour during sustained generation, and thermal throttling slows things down after 10+ minutes of continuous use. It's a tool built for short, frequent sessions.

---

**Sources & References**

- [Best Local LLM Apps for iPhone in 2026 — PromptQuorum (2026-06-19)](https://www.promptquorum.com/power-local-llm/best-local-llm-apps-iphone-2026)
- [Run an LLM on Your Phone (2026) — Local AI Master](https://localaimaster.com/blog/run-llm-on-phone)
- [Updates to Apple's On-Device and Server Foundation Language Models — Apple ML Research](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)
- [Apple's Foundation Models framework unlocks new intelligent app experiences — Apple Newsroom (2025-09)](https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/)
- [Locally AI joins LM Studio — LM Studio Blog (2026-04)](https://lmstudio.ai/blog/locally-ai-joins-lm-studio) · [LM Link announcement (2026-06-04)](https://lmstudio.ai/blog/locally-lm-link)
- [iPhone 17 series RAM — MacRumors (2025-09)](https://www.macrumors.com/2025/09/09/iphone-17-pro-iphone-air-ram-amounts/)
- [I replaced ChatGPT, Claude, and Gemini on my phone with a local LLM — XDA (2026-05-27)](https://www.xda-developers.com/replaced-chatgpt-claude-gemini-on-phone-with-local-llm/)
- [PocketPal AI — GitHub](https://github.com/a-ghorbani/pocketpal-ai) · [fullmoon](https://fullmoon.app/) · [Enclave AI](https://enclaveai.app/) · [Liquid Apollo](https://www.liquid.ai/blog/liquid-ai-launches-leap-and-apollo-bringing-edge-ai-to-every-developer)

*This article is based on publicly available information as of early July 2026; app prices, features, and model specifications may change with future updates.*

<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Can I use a ChatGPT-like AI on an iPhone without internet?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Download a 1-4B-class open model through a free app like PocketPal AI and you can chat with an AI even in airplane mode. The quality is small-model tier rather than the latest cloud AI."}}, {"@type": "Question", "name": "Which iPhone do I need to run a local LLM?", "acceptedAnswer": {"@type": "Answer", "text": "An iPhone with 8GB of RAM or more — the iPhone 15 Pro, 16 series, or 17 series — runs 3-4B-class models comfortably. 6GB devices handle small 1-2B-class models, and older devices with 4GB or less are not recommended."}}, {"@type": "Question", "name": "Are local LLMs on iPhone free?", "acceptedAnswer": {"@type": "Answer", "text": "You can start for free. Apps like PocketPal AI, Locally (LM Studio), and fullmoon, along with open models such as Gemma, Llama, and Qwen, are all free. Consider a paid app only when you need special features like Siri integration."}}, {"@type": "Question", "name": "How is running an open model yourself different from Apple Intelligence?", "acceptedAnswer": {"@type": "Answer", "text": "Apple Intelligence's built-in model (about 3B) works as a supporting engine inside app features via the Foundation Models framework in iOS 26, and users cannot choose the model. Running open models yourself gives you the choice of the latest models and full freedom over settings."}}, {"@type": "Question", "name": "What about battery drain and heat when running a local LLM on an iPhone?", "acceptedAnswer": {"@type": "Answer", "text": "Short conversations are fine, but measurements report battery drain of around 20-30% per hour during sustained generation, and speeds drop from heat after more than 10 minutes of continuous use. It suits short, frequent sessions."}}]}
</script>
