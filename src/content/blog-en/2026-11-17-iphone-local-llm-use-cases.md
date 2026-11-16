---
title: "iPhone Local LLM: 6 Things It's Actually Good For"
description: "You installed a local LLM on your iPhone — now what? Six real uses, measured against November 2026 speed, battery, thermal and context-window numbers that decide what's worth trying."
pubDate: 2026-11-17T05:33:41+09:00
category: ax
tags: ["local-llm", "iphone-ai", "on-device-ai", "shortcuts"]
lang: en
koSlug: 2026-11-17-iphone-local-llm-use-cases
---

**iPhone local LLM use cases** — this one is for people who installed the app, downloaded a model, had their first chat, and then got stuck. Short answer: there are six places where a local LLM on an iPhone genuinely earns its keep. ① Places with no signal. ② Documents that must not leave the device. ③ Translation, summarizing, and rewriting. ④ Shortcuts automation. ⑤ Short assist tasks for developers. ⑥ And the judgment call that matters most — knowing when to hand the job to the cloud. Installation, app comparisons, and which model fits which iPhone are already covered in [Run a Local LLM on Your iPhone (Part 2)](/en/blog/2026-07-03-local-llm-iphone-guide/), so none of that is repeated here. What this post adds is **measured numbers as of November 2026**. Without knowing how fast it actually runs, how quickly heat cuts that speed in half, and how much text you can actually paste in, every judgment about use cases comes out wrong.

| The three most common questions | One-line answer |
|---|---|
| **What is it actually good for?** | Translation, summarizing, rewriting, classification, Shortcuts automation. Not fact-checking, not arithmetic |
| **How fast is it?** | Measured on A19 (iPhone Air): ~35 tok/s at 2B, 14.7 tok/s at 4B — 2 to 6× human reading speed (reference: 5–7 tok/s) |
| **What about battery and heat?** | 5% battery across 20 back-to-back inferences; throughput bends down from the third run, ending −41.5% |

## 1. How fast is it really, right now — 18 models measured

Bottom line: **about 35 tokens/sec at 2B, 14.7 at 4B.** That's up from the "10–20 tok/s for 3–4B models" quoted in the July post, and more importantly, the model generation has turned over entirely.

The table below comes from pocket-ai-lab, which ran 18 models over 40 runs on an iPhone Air (A19, 11.5GB RAM, iOS 26.6.1) between September 3 and October 23, 2026. What makes it usable is that the protocol is published: a thermal gate before each run (up to 60s cooldown), a cold-load measurement, a warm-up generation, three repeated decode probes, and grading by deterministic rules rather than by another LLM. The quality score normalizes a 118-task suite to a 0–100 scale.

| Model | Format | Decode (tok/s) | Peak memory | Quality | Throttling |
|---|---|---|---|---|---|
| LFM2 1.2B | GGUF | **77.3** ± 0.4 | 249 MB | 58.5 | none |
| Qwen 3.5 0.8B | GGUF | 73.7 ± 0.2 | 598 MB | 46.6 | none |
| Qwen 3.5 2B | GGUF | 36.6 ± 1.3 | 1,054 MB | 64.4 | none |
| LFM2 2.6B | GGUF | 35.9 ± 0.7 | 266 MB | 60.2 | none |
| Gemma 4 E2B | GGUF | 35.0 ± 2.3 | 1,490 MB | 63.6 | none |
| Llama 3.2 3B | GGUF | 26.9 ± 0.6 | 721 MB | 59.3 | none |
| Llama 3.2 3B | MLX | 23.9 ± 3.3 | 2,568 MB | 59.3 | −23% |
| Phi-3.5 Mini | GGUF | 23.2 ± 1.2 | 1,739 MB | 66.1 | −9% |
| Gemma 3 4B | GGUF | 20.7 ± 1.6 | 2,175 MB | 60.2 | −14% |
| Qwen 3.5 4B | GGUF | 14.7 ± 2.7 | 1,252 MB | **68.6** | −31% |
| Qwen2-VL 7B | MLX | 11.6 ± 4.8 | 5,461 MB | 63.6 | −59% |
| Llama 3.1 8B | MLX | 7.6 ± 3.8 | 5,121 MB | 57.6 | −66% |
| Qwen 2.5 1.5B | Core ML | 3.0 ± 0.3 | 4,354 MB | 24.6 | none |

*Source: [pocket-ai-lab — iPhone LLM benchmarks](https://ananasdda.github.io/pocket-ai-lab/benchmarks/) (iPhone Air, A19, iOS 26.6.1, measured 2026-09-03 to 10-23; excerpt from the full 18-model set). Sorted by decode speed, with the Core ML conversion placed last for comparison.*

Three facts in this table translate directly into use-case decisions.

**First, the same model can cost three times the memory depending on format.** Llama 3.2 3B used 721MB as GGUF and 2,568MB as MLX. The quality score is identical at 59.3 either way. You're paying 3.5× the memory for the same intelligence, so on 8GB-and-under devices it makes sense to look at GGUF first — and memory headroom *is* context headroom, which §4 gets to. The most extreme case sits at the bottom of the table: the Core ML build of Qwen 2.5 1.5B is only a 1.5B model, yet it consumed 4,354MB, ran at 3.0 tok/s, and scored 24.6 — last place in the set. **Format choice moves the outcome more than model choice does.**

**Second, speed and quality run in opposite directions.** The fastest model, LFM2 1.2B, scores 58.5. The highest-scoring model, Qwen 3.5 4B, is among the slowest at 14.7 tok/s. "Fastest model" and "smartest model" are different objects, and the right move is to keep both and switch. Short, frequent hits like classification and tagging belong to the 1–2B class; anything that has to rewrite a sentence belongs to the 4B class.

**Third, above 4B, heat takes over.** The 7–8B models are slow to begin with, and their variance (±3.8–4.8) runs to roughly half the mean. That's throttling of −59% to −66% showing up inside the measurement, and it doesn't feel like "a bit slow" — it feels like the app has stopped responding.

<figure>
<svg viewBox="0 0 820 420" role="img" aria-label="Bar chart of decode speed by model measured on iPhone Air with A19 chip. LFM2 1.2B 77.3 tokens per second, Qwen 3.5 0.8B 73.7, Qwen 3.5 2B 36.6, LFM2 2.6B 35.9, Gemma 4 E2B 35.0, Llama 3.2 3B 26.9, Phi-3.5 Mini 23.2, Qwen 3.5 4B 14.7, Llama 3.1 8B 7.6, human reading speed about 6 tokens per second" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">Decode speed by model (tok/s — higher is faster) · quality score in parentheses</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">Measured on iPhone Air (A19, 11.5GB RAM, iOS 26.6.1) · Sept–Oct 2026 · source: pocket-ai-lab</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="250" y1="62" x2="250" y2="364"/>
    <line x1="380" y1="62" x2="380" y2="364"/>
    <line x1="510" y1="62" x2="510" y2="364"/>
    <line x1="640" y1="62" x2="640" y2="364"/>
    <line x1="770" y1="62" x2="770" y2="364"/>
  </g>
  <!-- row 1 -->
  <text x="242" y="83" font-size="12" fill="#23201D" text-anchor="end">LFM2 1.2B (GGUF)</text>
  <rect x="250" y="70" width="502" height="18" rx="3" fill="#1B4F8A"/>
  <text x="742" y="83" font-size="12" font-weight="700" fill="#FAF6EE" text-anchor="end">77.3 (58.5)</text>
  <!-- row 2 -->
  <text x="242" y="113" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 0.8B</text>
  <rect x="250" y="100" width="479" height="18" rx="3" fill="#A8BDD2"/>
  <text x="719" y="113" font-size="12" fill="#23201D" text-anchor="end">73.7 (46.6)</text>
  <!-- row 3 -->
  <text x="242" y="143" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 2B</text>
  <rect x="250" y="130" width="238" height="18" rx="3" fill="#4E7FA8"/>
  <text x="496" y="143" font-size="12" fill="#23201D">36.6 (64.4)</text>
  <!-- row 4 -->
  <text x="242" y="173" font-size="12" fill="#23201D" text-anchor="end">LFM2 2.6B</text>
  <rect x="250" y="160" width="233" height="18" rx="3" fill="#A8BDD2"/>
  <text x="491" y="173" font-size="12" fill="#23201D">35.9 (60.2)</text>
  <!-- row 5 -->
  <text x="242" y="203" font-size="12" fill="#23201D" text-anchor="end">Gemma 4 E2B</text>
  <rect x="250" y="190" width="228" height="18" rx="3" fill="#4E7FA8"/>
  <text x="486" y="203" font-size="12" fill="#23201D">35.0 (63.6)</text>
  <!-- row 6 -->
  <text x="242" y="233" font-size="12" fill="#23201D" text-anchor="end">Llama 3.2 3B (GGUF)</text>
  <rect x="250" y="220" width="175" height="18" rx="3" fill="#A8BDD2"/>
  <text x="433" y="233" font-size="12" fill="#23201D">26.9 (59.3)</text>
  <!-- row 7 -->
  <text x="242" y="263" font-size="12" fill="#23201D" text-anchor="end">Phi-3.5 Mini (GGUF)</text>
  <rect x="250" y="250" width="151" height="18" rx="3" fill="#4E7FA8"/>
  <text x="409" y="263" font-size="12" fill="#23201D">23.2 (66.1)</text>
  <!-- row 8 -->
  <text x="242" y="293" font-size="12" fill="#23201D" text-anchor="end">Qwen 3.5 4B (GGUF)</text>
  <rect x="250" y="280" width="96" height="18" rx="3" fill="#1B4F8A"/>
  <text x="354" y="293" font-size="12" font-weight="700" fill="#23201D">14.7 (68.6 — top quality)</text>
  <!-- row 9 -->
  <text x="242" y="323" font-size="12" fill="#23201D" text-anchor="end">Llama 3.1 8B (MLX)</text>
  <rect x="250" y="310" width="49" height="18" rx="3" fill="#A8BDD2"/>
  <text x="307" y="323" font-size="12" fill="#23201D">7.6 (57.6 · throttled −66%)</text>
  <!-- row 10 -->
  <text x="242" y="353" font-size="12" fill="#8A8378" text-anchor="end">Human reading speed (ref.)</text>
  <rect x="250" y="340" width="39" height="18" rx="3" fill="#E5DECF"/>
  <text x="297" y="353" font-size="12" fill="#8A8378">~6</text>
  <g font-size="11" fill="#8A8378">
    <text x="250" y="382" text-anchor="middle">0</text>
    <text x="380" y="382" text-anchor="middle">20</text>
    <text x="510" y="382" text-anchor="middle">40</text>
    <text x="640" y="382" text-anchor="middle">60</text>
    <text x="770" y="382" text-anchor="middle">80 tok/s</text>
  </g>
  <text x="20" y="408" font-size="11" fill="#8A8378">Dark bars: fastest (LFM2 1.2B) and highest quality (Qwen 3.5 4B). They sit at opposite ends.</text>
</svg>
<figcaption>The speed leader and the quality leader are at opposite ends of the table. On an iPhone you're better off keeping two models for different jobs than picking one "best" model. Source: pocket-ai-lab (Oct 2026).</figcaption>
</figure>

## 2. Battery and heat — how many minutes before it halves

Bottom line: **20 back-to-back inferences cost 5% battery, and throughput bends down from the third run, ending 41.5% below peak.** This is the evidence behind the "short and frequent" rule.

The source is a paper published in March 2026 (revised June), "LLM Inference at the Edge: Mobile, NPU, and GPU Performance Efficiency Trade-offs Under Sustained Load." On an iPhone 16 Pro, the authors fed a 258-token prompt to Qwen 2.5 1.5B (4-bit) twenty times in a row while recording device state.

| Metric | iPhone 16 Pro (MLX) | Galaxy S24 Ultra | RTX 4050 (ref.) |
|---|---|---|---|
| Peak throughput | 40.49 tok/s | — | 131.70 ± 2.87 tok/s |
| Sustained (Hot) throughput | 23.67 ± 0.28 tok/s | 10.38 ± 0.44 tok/s | — |
| Drop from peak | **−41.5%** | 4.2% CV in the stable window (run 8 onward) | — |
| Battery over 20 runs | 5% (100% → 95%) | 7% | n/a |
| Energy per token | not measurable under iOS | 146.4 ± 10.8 mJ | 297.3 ± 6.5 mJ |

*Source: Tummalapalli et al., [LLM Inference at the Edge (arXiv:2603.23640)](https://arxiv.org/abs/2603.23640), submitted 2026-03, revised 2026-06. Qwen 2.5 1.5B 4-bit, 258-token prompt, 20 repetitions.*

The detail worth staring at is **when the transition happens**. The paper records the device moving through Normal (runs 1–2) → Warm (runs 3–16) → Hot (runs 17–20), with throughput falling roughly 38% the moment it entered Warm. So the slowdown doesn't arrive "after about ten minutes." It arrives on **the third request**. If your first answer on an iPhone local LLM feels unusually quick, that isn't your imagination — it's the only Normal-state answer you get.

Heat setting the performance ceiling isn't a phone-specific problem; it's a structural condition two decades old. Dennard scaling, published in 1974, held that shrinking transistors would keep power density constant — but leakage current didn't shrink with size, and the law broke down in the mid-2000s ([Dennard et al., IEEE JSSC SC-9(5), 1974](https://doi.org/10.1109/JSSC.1974.1050511)). After that, the limit on a chip shifted from "how many can you fit" to "how many can you keep switched on at once," and a 2011 ISCA paper named the area you have to leave dark **dark silicon**, calculating that 21% of the chip must stay off at 22nm and over 50% at 8nm ([Esmaeilzadeh et al., ISCA 2011](https://www.microsoft.com/en-us/research/publication/dark-silicon-and-the-end-of-multicore-scaling/)). An iPhone, with no fan and no heatsink, is the most extreme form of that constraint. The curve bending at run three isn't a defect in the app — it's twenty years of narrowing thermal budget showing up in your palm.

It's also worth noting from the same table that the Android side is slower but steadier. The Galaxy S24 Ultra managed 10.38 tok/s with only 4.2% variance in its stable window. The iPhone starts fast and cools off fast; the Android holds a lower number for longer. If you're thinking about handing either device a long job, that difference in character matters more than the spec sheet.

One more point on energy. "The Battery Price of edge AI," published in July 2026, compared an iPhone 14 and a Pixel 8 against server inference and reported that — under the study's modeling assumptions — local inference carries **5 to 7 times the environmental impact per token than batched server inference.** Per the abstract, 88–90% of that impact is embodied carbon in the device rather than electricity, because battery degradation pulls replacement cycles forward. Four-bit quantization was the most efficient configuration tested. The numbers confirm something worth stating plainly: the value of a local LLM is not efficiency. It's **privacy and availability**.

<figure>
<svg viewBox="0 0 820 300" role="img" aria-label="Bar chart of throughput by thermal state during sustained inference on iPhone 16 Pro. Normal state 40.49 tokens per second, Warm state about 25, Hot state 23.67" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">Throughput by thermal state — it bends at run three</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">iPhone 16 Pro · Qwen 2.5 1.5B (4-bit) · 258-token prompt × 20 runs · source: arXiv:2603.23640</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="200" y1="62" x2="200" y2="238"/>
    <line x1="336" y1="62" x2="336" y2="238"/>
    <line x1="471" y1="62" x2="471" y2="238"/>
    <line x1="607" y1="62" x2="607" y2="238"/>
    <line x1="742" y1="62" x2="742" y2="238"/>
  </g>
  <text x="192" y="92" font-size="13" fill="#23201D" text-anchor="end">Normal (runs 1–2)</text>
  <rect x="200" y="74" width="549" height="34" rx="4" fill="#1B4F8A"/>
  <text x="739" y="96" font-size="14" font-weight="700" fill="#FAF6EE" text-anchor="end">40.49 tok/s</text>
  <text x="192" y="152" font-size="13" fill="#23201D" text-anchor="end">Warm (runs 3–16)</text>
  <rect x="200" y="134" width="340" height="34" rx="4" fill="#4E7FA8"/>
  <text x="530" y="156" font-size="14" font-weight="700" fill="#FAF6EE" text-anchor="end">~25 (−38%)</text>
  <text x="192" y="212" font-size="13" fill="#23201D" text-anchor="end">Hot (runs 17–20)</text>
  <rect x="200" y="194" width="321" height="34" rx="4" fill="#A8BDD2"/>
  <text x="511" y="216" font-size="14" font-weight="700" fill="#23201D" text-anchor="end">23.67 (−41.5%)</text>
  <g font-size="11" fill="#8A8378">
    <text x="200" y="256" text-anchor="middle">0</text>
    <text x="336" y="256" text-anchor="middle">10</text>
    <text x="471" y="256" text-anchor="middle">20</text>
    <text x="607" y="256" text-anchor="middle">30</text>
    <text x="742" y="256" text-anchor="middle">40 tok/s</text>
  </g>
  <text x="20" y="282" font-size="12" fill="#23201D">Across the same 20 runs, battery fell 100% → 95%. Heat cuts performance first; battery follows.</text>
</svg>
<figcaption>The key point: degradation isn't a problem of "long sessions," it's a problem of "the third request." Source: arXiv:2603.23640 (rev. June 2026).</figcaption>
</figure>

## 3. Planes, subways, no roaming — the most reliable use

Bottom line: **this is the surest of the six. Just reset your expectations for Korean and other distant-language translation.**

Once the model is loaded into memory there are zero network requests, so it works in the air, underground, or abroad with data switched off. Parts 1 and 2 already established that, so the only question here is what you actually hand it in that environment.

| Situation | Where the local LLM wins | Where a dedicated app wins |
|---|---|---|
| Drafting an email in flight | Polishing a draft, changing tone, pulling out three key points | — |
| A menu abroad | Vision models can describe a photo and guess ingredients or method | Word-level translation is faster and more accurate in Apple Translate's offline mode |
| Reading a long document on the subway | Paragraph-by-paragraph summaries, explaining unfamiliar terms | Whole-document summaries are out of reach — see §4 |
| Conversation while traveling | Building sentences, suggesting situational phrasing | Real-time speech interpretation |
| Notes on a hike or camping trip | Voice input → cleanup, generating checklists | — |

Translation deserves its own note. To be straight about it: **public data systematically measuring how well phone-sized models handle Korean, by device and by model, is still thin.** The 118-task suite cited in §1 is an aggregate score and multilingual work is only part of it — Qwen 3.5 2B's 64.4 should not be read as evidence about Korean. What you *can* lean on is the model vendors' own documentation. Qwen's model card states support for "over 29 languages, including … Korean" ([Qwen2.5-7B-Instruct model card](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)), so for Korean work **trying the Qwen 3.5 family first will cost you less time.** That published multilingual claim is from the Qwen2.5-generation documentation; the 3.5 family is chosen on the assumption that it continues the same line. In short, the recommendation rests on vendor documentation and community assessment, not third-party measurement, and it's worth saying so.

Offline reference tools have always looked like this. When Grolier put the full text of its 21-volume *Academic American Encyclopedia* (roughly 30,000 articles, 9 million words) onto a single CD-ROM in 1985, it shipped as a text-only edition — no illustrations, no maps ([Academic American Encyclopedia](https://en.wikipedia.org/wiki/Academic_American_Encyclopedia)). People accepted the stripped-down version, because always having it on hand with full-text search was worth more than the pictures. A local model on an iPhone is the same trade. You take a worse model in exchange for one that's there when the signal isn't.

The practical conclusion: **treat it as a tool that drafts, not one that translates for you.** Polishing or summarizing text in a language you already read is genuinely useful at today's quality level. Trusting it with a language you don't read is not.

![A woman records a video of the sky through an airplane window using her smartphone.](https://images.pexels.com/photos/15923452/pexels-photo-15923452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Asad Photo Maldives](https://www.pexels.com/@asadphoto) on [Pexels](https://www.pexels.com/photo/woman-recording-video-through-airplane-window-15923452/)*

## 4. Sensitive documents — privacy is real, context is the wall

Bottom line: **it's true that the data never leaves the device, but long documents won't fit in the first place.** On an iPhone 16-class device (6GB RAM), reported usable context sits around 1,024–1,500 tokens.

The reason is the KV cache. During inference the model holds the keys and values for every token it has read, and that store grows linearly with context length and does not shrink mid-run. The formula and the actual numbers make the height of the wall visible.

```text
kv_bytes = 2 × n_layers × n_heads × head_dim × seq_len × dtype_bytes
e.g. 32 layers, 32 heads, head_dim 128, float16, 2,048 tokens
  = 2 × 32 × 32 × 128 × 2048 × 2 ≈ 1.07 GB
```

Add roughly 1.7GB of weights for a 3B model palettized to 4-bit and you're at **2.8GB total**. In the source's own words that is "well past the jetsam threshold" on a 6GB device, and iOS terminates an app that crosses the limit immediately. This is where the classic failure comes from: an app that behaves perfectly during testing with short prompts dies the moment you paste in a long document.

<figure>
<svg viewBox="0 0 820 260" role="img" aria-label="Bar chart of memory use for a 3B 4-bit model. Weights alone 1.7 gigabytes; adding a 2048-token KV cache reaches 2.77 gigabytes, past the estimated 2 gigabyte limit for 6GB devices" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;font-family:system-ui">
  <text x="20" y="28" font-size="16" font-weight="700" fill="#23201D">Pasting the document is what crosses the line (3B, 4-bit)</text>
  <text x="20" y="48" font-size="12" fill="#8A8378">Weights 1.7GB + 2,048-token KV cache 1.07GB ≈ 2.77GB · dashed line = estimated jetsam limit on 6GB devices</text>
  <g stroke="#E5DECF" stroke-width="1">
    <line x1="210" y1="62" x2="210" y2="186"/>
    <line x1="404" y1="62" x2="404" y2="186"/>
    <line x1="598" y1="62" x2="598" y2="186"/>
    <line x1="791" y1="62" x2="791" y2="186"/>
  </g>
  <text x="202" y="96" font-size="13" fill="#23201D" text-anchor="end">Weights only</text>
  <rect x="210" y="76" width="329" height="32" rx="4" fill="#4E7FA8"/>
  <text x="529" y="97" font-size="13" font-weight="700" fill="#FAF6EE" text-anchor="end">1.70 GB</text>
  <text x="202" y="156" font-size="13" fill="#23201D" text-anchor="end">+ 2,048-token context</text>
  <rect x="210" y="136" width="329" height="32" rx="4" fill="#4E7FA8"/>
  <rect x="539" y="136" width="207" height="32" rx="4" fill="#1B4F8A"/>
  <text x="736" y="157" font-size="13" font-weight="700" fill="#FAF6EE" text-anchor="end">2.77 GB</text>
  <line x1="597" y1="66" x2="597" y2="182" stroke="#23201D" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="604" y="76" font-size="12" font-weight="700" fill="#23201D">est. limit 2GB</text>
  <g font-size="11" fill="#8A8378">
    <text x="210" y="204" text-anchor="middle">0</text>
    <text x="404" y="204" text-anchor="middle">1.0</text>
    <text x="598" y="204" text-anchor="middle">2.0</text>
    <text x="791" y="204" text-anchor="middle">3.0 GB</text>
  </g>
  <text x="20" y="232" font-size="12" fill="#23201D">The dark segment is context (KV cache). The longer the document, the more only that segment grows.</text>
  <text x="20" y="250" font-size="11" fill="#8A8378">Cross the limit and iOS kills the app (jetsam) — a failure that never shows up in a build or a unit test.</text>
</svg>
<figcaption>Why the answer is to split the document, not to grow the model. Formula and memory figures: MVP Factory technical note (2026-11-10). The 2GB line is the author's estimate, not in the source.</figcaption>
</figure>

So the working rule becomes "split the document," not "get a bigger model." As a rough guide, English runs about 4 characters per token, so 1,500 tokens is on the order of **1,000 words** — and languages like Korean are less token-efficient still, costing roughly 1–1.5 tokens per character. Tokenizers vary, so treat any of this as an approximation.

| Document | Rough length | Works locally? | How |
|---|---|---|---|
| A bundle of texts or chat messages | A few hundred words | ✓ | Paste as-is |
| One-page lab result or medical report | ~500 words | ✓ (terminology only) | Explaining terms and pulling key points. Diagnosis is out of scope |
| Employment or lease agreement | 1,500–4,000 words | △ | Ask clause by clause |
| Business plan or IR deck | 10,000+ words | ✗ | Not realistic locally |
| Transcript or meeting minutes | 5,000+ words | ✗ | Summarize in sections, repeatedly |

There's one trap here that you must not miss. **If you don't pick On-Device in the Shortcuts "Use Model" action, the data leaves the device.** Apple's support documentation lists the options as On-Device (no network needed), Cloud (Private Cloud Compute), Cloud Pro (extended context), and Extension Model (ChatGPT). PCC is a privacy architecture Apple designed carefully, but it is still computation off the device, and Extension Model is a third party outright. That's where the principle comes from: if the on-device tier isn't guaranteed, don't use it for sensitive material. When you need verifiable data residency, your options are On-Device only, or a local model you run yourself.

"Trusting" and "verifying" is not a new distinction, either. When Phil Zimmermann released PGP in 1991, the point wasn't that the cipher was stronger — it was that encryption happened on your own computer, so you didn't have to trust anyone in the middle ([Pretty Good Privacy](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)). The distinction this section draws — PCC as well-engineered trust, On-Device as a structure that needs no trust — sits in that lineage.

Medical records warrant one more step of caution. A study benchmarking on-device models on clinical reasoning tasks ("Medicine on the Edge," Feb 2025) reported that compact general-purpose models like Phi-3 Mini strike a good speed-accuracy balance but that top accuracy belongs to medically fine-tuned models, and that on older devices memory is a tighter constraint than compute. In short, **explaining terminology and pulling out key points is the safe range; judgment and diagnosis are outside it.** This post is not medical or legal advice.

## 5. Shortcuts automation — what actually gets automated

Bottom line: **two routes. Apple's built-in model via the Use Model action (nothing to install), or an app's App Intents (you pick the model).** For Korean-language work, both became viable after October 26, 2026.

Apple's requirements are spelled out in the documentation. The Use Model action needs iOS 27 or later on an iPhone 15 Pro, 15 Pro Max, or iPhone 16 and later, and its input can include results from previous actions, variables, calendar events, reminders, and photos. Korean joined the Siri AI languages in iOS 27.2 (French, Japanese, Korean, Portuguese, Spanish — 2026-10-26). The documentation also notes that daily usage limits may apply to the server-side options.

A full app-by-app comparison lives in [Part 2](/en/blog/2026-07-03-local-llm-iphone-guide/). The table below looks at **one axis only: Shortcuts and automation support.**

| Route | Requirement | Model choice | Cost | Where it fits |
|---|---|---|---|---|
| **Apple Use Model (On-Device)** | iOS 27+, 15 Pro / 16 and later | No (built-in ~3B) | Free | Structured work: classification, extraction, rewriting |
| **PocketPal AI** | Shortcuts support since v1.11.5 (2025-10-24) | Free choice (any GGUF) | Free (MIT) | When you want to swap models |
| **PocketPal local API server** | v1.23.0, Plus feature — still marked POC | Free choice | One-time purchase (included in source builds) | Calling the phone's model from other apps or devices |
| **Private LLM** | v1.9.18 (2026-10-28) | Curated open models (Llama, Gemma, Phi, Qwen families) | One-time $4.99 | When you want a Siri voice trigger too |
| **Locally (LM Studio) + LM Link** | v1.67.0 (2026-11-04) | MLX, LFM3, Bonsai 2, etc. | Free | Handing off to the big model on your home Mac |

*Sources: [Apple Support — Use Apple Intelligence in Shortcuts](https://support.apple.com/guide/shortcuts/use-apple-intelligence-in-shortcuts-tpg3vrvwmclv/ios), [Apple Newsroom (2026-10-26)](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/), [PocketPal AI on GitHub](https://github.com/a-ghorbani/pocketpal-ai), [Private LLM](https://privatellm.app/blog/run-local-gpt-on-ios-complete-guide)*

The reason automation changes how a local LLM feels is simple: **once the cost of opening a chat window and typing disappears, how often you use it changes.** Three recipes worth actually wiring up:

1. **Share sheet → summary → note.** Push an article or PDF from the share sheet into a shortcut that produces "three key points plus one thing to verify," then file it in Notes by date. Include a step that truncates the input to a few hundred words, or you'll hit the jetsam problem from §4.
2. **Classify incoming messages → adjust notifications.** Have an automation feed a message's text to the model, get back a single word — promo, work, personal — and switch Focus modes on the result. A 1–2B model is plenty, and the responses are short enough that heat never becomes a factor.
3. **Voice memo → extract tasks.** Feed dictated text in and pull out only the action items, then push them into Reminders. PocketPal handles voice input with on-device Whisper, so the whole loop closes offline.

What the three share tells you the right scope for a local model: **short input, shorter output, and easy recovery when it's wrong.** Anything that has to produce long new prose runs into heat, context, and quality simultaneously.

## 6. For developers — commit messages, regex, error explanations

Bottom line: **commit-message drafts, explaining a regex, and first-pass error triage are worth it. Code generation and debugging are not.**

The evidence is in §1's quality measurement. pocket-ai-lab records that **instruction following was the single biggest differentiator between models**, while **math was weak across the board, at 1 to 5 correct out of 8 tasks.** That pairing maps directly onto development work. "Rewrite this and keep the format" works. "Figure it out and get the number right" does not.

| Task | Local 3–4B | Why |
|---|---|---|
| git diff → commit message draft | ✓ | Summarize input, follow a format. Pure instruction-following |
| Read and explain a regex | ✓ | Pattern interpretation is a short transform |
| First-pass error message explanation | ✓ | Common phrasings, so even small models land it |
| Suggest variable or function names | ✓ | Short output, verifiable instantly |
| **Writing** a regex | △ | Plausible-but-wrong patterns are common. Always test |
| Writing or refactoring a function | ✗ | 1,500 tokens ≈ 40–60 lines of code. It doesn't fit to begin with |
| Tracking down a bug | ✗ | Cross-file reasoning — a small model's weakest spot |
| Complexity analysis or numeric work | ✗ | Math is where the measurements are worst |

One genuinely new capability arrived in 2026. **The local API server that PocketPal v1.23.0 (2026-11-10) shipped as a proof of concept** exposes the model running on your phone to other devices on the same network through an OpenAI-compatible endpoint. That means a script on your Mac can hit the model on your phone, which makes the phone usable as an always-on inference node that draws almost no power. The release notes still carry the POC label, though, so it's early to build anything you depend on around it. In the opposite direction, Locally's **LM Link** (covered in Part 2) picked up Liquid AI's LFM3 models, image understanding with Bonsai 2, and faster connections in v1.67.0 (2026-11-04).

Put simply, for a developer an iPhone local LLM is **not a coding tool but an offline dictionary and format converter.** Push past that line and you hit the walls from §1, §2, and §4 in sequence.

![person facing computer desktop](https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxkZXZlbG9wZXIlMjB3cml0aW5nJTIwY29kZSUyMGxhcHRvcCUyMHRlcm1pbmFsfGVufDF8MHx8fDE3OTQ4NTk2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [charlesdeluvio](https://unsplash.com/@charlesdeluvio?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/person-facing-computer-desktop-pjAH2Ax4uWk?utm_source=spice-bandit-blog&utm_medium=referral)*

## 7. What it can't do — where to hand off to the cloud

Bottom line: **if any one of five conditions applies, hand it off.** ① You need a fact verified. ② Arithmetic is involved. ③ The input exceeds ~1,500 tokens. ④ Being wrong is expensive. ⑤ You need several generations back to back.

| The question to ask | If it trips | Why |
|---|---|---|
| Can I verify the answer myself? | No → cloud | A small model's hallucinations read fluently, which makes them more dangerous |
| Does it involve numbers or dates? | Yes → cloud | Math scored 1–5 out of 8 in the 118-task suite |
| Is the input over ~1,000 words? | Yes → cloud | The KV cache crosses the jetsam limit and the app dies |
| Does being wrong cost money, health, or a contract? | Yes → cloud plus a human | Local is a draft generator, not a verifier |
| Am I making three or more requests in a row? | Yes → plug in, or go cloud | Throughput falls 38% from the third run |
| Do I need current information? | Yes → cloud | The weights are frozen at training time |

Flip it around and **when all four of these are true, local is the better choice**: the data must not leave the device, you can't count on a signal, the input is short, and the output is short. Those four coincide more often than you'd expect. Classifying incoming messages, explaining terms on a lab report, drafting an email in flight, writing a commit message — every example in the preceding sections sits inside that intersection.

## 8. What's gone stale since July — the November 2026 update

Bottom line: **four things changed.** The iOS generation, the model generation, the hardware, and the criteria for picking a format. The setup steps and app-selection logic in the July post still hold.

| Item | July 2026 | November 2026 |
|---|---|---|
| iOS | 26 — Foundation Models framework opened | **27** (released 2026-09-14) — image input, and a LanguageModel protocol that lets you swap in Claude, Gemini, or others behind the same code |
| Apple Intelligence in Korean | Rolling out | **Siri AI added Korean in iOS 27.2 (2026-10-26)** |
| Recommended models | Llama 3.2 1B/3B, Gemma 4 E2B, Phi-4 Mini, Qwen 3 4B | **LFM2 1.2B/2.6B, Qwen 3.5 0.8B/2B/4B, Ternary Bonsai 2, LFM3** |
| Flagship device | iPhone 17 Pro — 12GB RAM | **iPhone 18 Pro — 12GB LPDDR5X, 96-bit bus for +50% memory bandwidth, 32-core Neural Engine** |
| Format choice | Both GGUF and MLX introduced | **At equal quality, GGUF uses 3.5× less memory** (Llama 3.2 3B: 721MB vs 2,568MB) |

The model-side shift deserves one more line. **Ternary Bonsai 2**, released by PrismML on October 15, 2026, represents weights using only −1, 0, and +1, fitting 2B into 0.43GB, 4B into 0.95GB, and 9B into 2GB (Apache 2.0, built on Qwen3.5). Published figures put the 2B at 120 tok/s and the 9B at 34 tok/s on an iPhone 18 Pro Max. All of that is **vendor-reported**, though, and the loss from compression isn't even across task types. The published vision retention is 89.0% for 2B, 91.3% for 4B, and 92.5% for 9B, but the 2B drops to 77.5% on document understanding (Omni_doc), and knowledge-and-reasoning retention is 82.9% for the 2B with GPQA Diamond at 67.7% — a bigger loss than vision. In other words, **the abilities that go first are recall and long-chain reasoning** — which hurts less for the short transform work this post recommends, and more for the work §7 says to hand off. The direction is still clear: **if "9B in 2GB" holds up, the context wall from §4 is the first one to fall**, because smaller weights leave more memory for the KV cache. Waiting for third-party measurements is the safe move.

The hardware is moving the same way. Token generation speed is bound more by memory bandwidth than by compute, and the iPhone 18 Pro widened its memory bus from 64-bit to 96-bit for a 50% bandwidth gain (the bus width comes from reported die analysis). That the Neural Engine core count also doubled (16 → 32) is the headline, but bandwidth is the number that matters more for local LLMs.

This bottleneck has a name, and it's older than you'd think. In his 1977 Turing Award lecture, John Backus called the structure that pumps data one word at a time between CPU and memory the **"von Neumann bottleneck"** ([Backus, CACM 21(8), 1978](https://dl.acm.org/doi/10.1145/359576.359579)). Half a century later the Neural Engine is up to 32 cores, but the requirement to re-read weights from memory for every single token it emits hasn't changed. That's why "how many bits wide is the bus" decides how a local LLM feels more than "how many cores."

![Silver Apple iPhone 18 Pro -- still in a box](https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Apple_iPhone_18_Pro_box_%282026-11-12%29.jpg/1280px-Apple_iPhone_18_Pro_box_%282026-11-12%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail)
*Image: Olgierd Rudak · [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Apple_iPhone_18_Pro_box_(2026-11-12).jpg) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)*

## So What — carry a map of the boundaries, not a spec sheet

The difference between people who install a local LLM on their iPhone and give up and people who keep using it isn't the device or the model. It's **whether they know where the boundaries are.**

On-device compute was never a small cloud. When the Neural Engine first arrived in the iPhone with the 2017 A11 (up to 600 billion operations per second), the job it took on wasn't general AI — it was Face ID and Animoji ([Apple Newsroom, 2017-09](https://www.apple.com/newsroom/2017/09/the-future-is-here-iphone-x/)). It didn't replace the server; it claimed one task that must not leave the device and cannot wait for a signal. Nine years on, the local LLM is standing in the same place. **The boundary gets drawn first, and the uses come from inside it.**

The numbers draw that boundary fairly sharply. Speed at 2B is 35 tok/s, more than five times reading speed, so it isn't actually slow. Heat costs 38% from the third run, which means use it in short bursts. Context tops out around 1,000 words, which means split the document. Quality is strong on instruction following and weak on math, which means delegate the transforms and keep the judgment. Those four sentences are the whole post, and the six use cases above are just combinations drawn from inside them.

And the boundary isn't fixed. In the four months from July to November, iOS opened up enough to swap third-party models behind the same code, 9B fit into 2GB, and memory bandwidth widened by 50%. The wall moves on a roughly four-month cadence. So the thing to do isn't to wait and see when it gets good enough — it's to **take one task of your own that satisfies today's four conditions (short input, short output, data that can't leave the device, no signal) and wire it into a shortcut.** Once that one works, the rest follow in as the wall moves.

## FAQ

**Q1. What's the most realistic thing to use an iPhone local LLM for?**
Transform tasks where both input and output are short. Classifying incoming messages, polishing email drafts, explaining terminology, drafting commit messages, pulling out three key points. The value is highest when you wire it into a shortcut that runs automatically.

**Q2. Can it summarize long documents?**
No. On 6GB-class devices, usable context is reported at 1,024–1,500 tokens (roughly 1,000 words of English). Go past that and the KV cache grows until iOS kills the app. Splitting by clause or section and asking repeatedly is the realistic approach.

**Q3. How bad are the battery and heat in practice?**
In a measurement of 20 back-to-back inferences with a 1.5B model on an iPhone 16 Pro, battery fell 5% and throughput dropped about 38% from the third run (entering the Warm state), ending 41.5% below peak. Used in short bursts, you barely notice.

**Q4. Should I use it for translation?**
It's useful for polishing or summarizing text in a language you already read, but it's early to trust it with one you don't. Public data systematically measuring phone-sized models on Korean and similar languages is still thin, so the fastest route is to compare on your own material. Starting with the Qwen family — whose model card names Korean among its supported languages — will cost you less time.

**Q5. Does the Shortcuts "Use Model" action send my content off the device?**
Not if you select On-Device. But Cloud and Cloud Pro go to Private Cloud Compute, and Extension Model goes to ChatGPT. For sensitive documents, pin it to On-Device or use a local model you installed yourself.

**Q6. How do I set it up in the first place?**
This post covers everything after setup. App installation, model selection, and per-device RAM guidance are in [Run a Local LLM on Your iPhone (Part 2)](/en/blog/2026-07-03-local-llm-iphone-guide/); the fundamentals like quantization and GGUF are in [Part 1](/en/blog/2026-07-02-local-llm-beginner-guide/).

---

**References**

- [pocket-ai-lab — iPhone LLM benchmarks: tok/s, memory and quality](https://ananasdda.github.io/pocket-ai-lab/benchmarks/) (iPhone Air, A19, iOS 26.6.1, measured 2026-09-03 to 10-23) · [per-device recommendations (2026-10-27)](https://ananasdda.github.io/pocket-ai-lab/best-local-llm-iphone/)
- Tummalapalli et al., [LLM Inference at the Edge: Mobile, NPU, and GPU Performance Efficiency Trade-offs Under Sustained Load (arXiv:2603.23640)](https://arxiv.org/abs/2603.23640), submitted 2026-03, revised 2026-06
- [The Battery Price of edge AI: A study of the Environmental Impact of LLM Inference on Mobile Devices (arXiv:2609.11940)](https://arxiv.org/html/2609.11940v1), 2026-07
- [Medicine on the Edge: Comparative Performance Analysis of On-Device LLMs for Clinical Reasoning (arXiv:2502.08954)](https://arxiv.org/abs/2502.08954), 2025-02
- [Apple Support — Use Apple Intelligence in Shortcuts on iPhone or iPad](https://support.apple.com/guide/shortcuts/use-apple-intelligence-in-shortcuts-tpg3vrvwmclv/ios) · [Apple Newsroom — Siri AI in more languages (2026-10-26)](https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/)
- [PocketPal AI on GitHub (MIT)](https://github.com/a-ghorbani/pocketpal-ai) · [App Store (v1.23.0)](https://apps.apple.com/us/app/pocketpal-ai/id6502579498)
- [Locally AI by LM Studio — App Store (v1.67.0, 2026-11-04)](https://apps.apple.com/us/app/locally-ai-by-lm-studio/id6741426692) · [Private LLM — official guide](https://privatellm.app/blog/run-local-gpt-on-ios-complete-guide)
- [PrismML — Introducing Ternary Bonsai 2 2B, 4B, and 9B (2026-10-15)](https://prismml.com/news/bonsai-2-family)
- [MVP Factory — Wiring CoreML to on-device LLMs: KV-cache, ANE, and the token budget for iPhone 16 (2026-11-10)](https://mvpfactory.io/blog/wiring-coreml-to-a-quantized-on-device-llm-for-streaming-text-generation-kv)
- [Qwen2.5-7B-Instruct model card](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) — the "over 29 languages, including Korean" claim · [Qwen2.5 Technical Report (arXiv:2412.15115)](https://arxiv.org/abs/2412.15115) — training scale and benchmarks (incl. KMMLU)
- A20 Pro specifications: [Wikipedia — Apple A20 Pro](https://en.wikipedia.org/wiki/Apple_A20_Pro) · [MacRumors — What M6 tells us about A20 (2026-09-05)](https://www.macrumors.com/2026/09/05/what-m6-tells-us-about-a20/)
- Historical background: [Dennard et al., IEEE JSSC SC-9(5), 1974](https://doi.org/10.1109/JSSC.1974.1050511) · [Esmaeilzadeh et al., Dark Silicon and the End of Multicore Scaling, ISCA 2011](https://www.microsoft.com/en-us/research/publication/dark-silicon-and-the-end-of-multicore-scaling/) · [Backus, 1977 ACM Turing Award Lecture (CACM 21(8), 1978)](https://dl.acm.org/doi/10.1145/359576.359579) · [Apple Newsroom — iPhone X and A11 Bionic (2017-09)](https://www.apple.com/newsroom/2017/09/the-future-is-here-iphone-x/) · [Pretty Good Privacy](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)

*The speed, battery, and thermal figures in this post are not the author's own measurements but published third-party results, cited above; they vary with device, iOS version, ambient temperature, and app version. App prices and versions were verified on November 17, 2026 (the Private LLM price quoted in Part 2 was a currency conversion at the time; the current App Store price is a one-time $4.99). This is not medical, legal, or investment advice.*

<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What is the most realistic use for an iPhone local LLM?", "acceptedAnswer": {"@type": "Answer", "text": "Transform tasks where both input and output are short: classifying incoming messages, polishing email drafts, explaining terminology, drafting commit messages, and pulling out key points. The value is highest when wired into a shortcut that runs automatically."}}, {"@type": "Question", "name": "Can an iPhone local LLM summarize long documents?", "acceptedAnswer": {"@type": "Answer", "text": "Not reliably. On 6GB-class iPhones, usable context is reported at 1,024 to 1,500 tokens, roughly 1,000 words of English. Beyond that the KV cache grows until iOS terminates the app. Splitting the document by clause or section and asking repeatedly is the realistic approach."}}, {"@type": "Question", "name": "How much battery and heat does running a local LLM on an iPhone cause?", "acceptedAnswer": {"@type": "Answer", "text": "In a published measurement of 20 back-to-back inferences with a 1.5B model on an iPhone 16 Pro, battery fell 5% and throughput dropped about 38% from the third run, ending 41.5% below peak. Used in short bursts the impact is barely noticeable."}}, {"@type": "Question", "name": "Should I use an iPhone local LLM for translation?", "acceptedAnswer": {"@type": "Answer", "text": "It is useful for polishing or summarizing text in a language you already read, but early to trust with one you do not. Public data systematically measuring phone-sized models on languages like Korean is still thin, so comparing on your own material is fastest. The Qwen family, whose model card names Korean among its supported languages, is a reasonable starting point."}}, {"@type": "Question", "name": "Does the Shortcuts Use Model action send content off the device?", "acceptedAnswer": {"@type": "Answer", "text": "Not if you select On-Device. Cloud and Cloud Pro route to Private Cloud Compute, and Extension Model routes to ChatGPT. For sensitive documents, pin the action to On-Device or use a local model you installed yourself."}}]}
</script>
