---
title: "What Is AI-RAN? What \"Base Stations Become AI Servers\" Actually Means"
description: "AI-RAN runs cellular signal processing and AI inference on the same hardware inside a base station. But three businesses with completely different economics hide under one name — and the money only works in one of them."
pubDate: 2026-11-25T05:36:51+09:00
category: ai
tags: ["AI-RAN", "6G", "data center power", "NVIDIA"]
lang: en
koSlug: 2026-11-25-ai-ran-what-is-it-base-station-gpu
---

**Short answer.** AI-RAN runs **cellular signal processing and AI inference on the same hardware** inside a base station. You put a GPU at the cell site and lease out the compute the radio network isn't using. Platform products have been announced, but **commercial availability is a 2027 target.** Nokia's public roadmap reads: pilots in 2026, commercial start in 2027, mass deployment in 2028.

Here's the thing. "Base stations become AI servers" bundles **three businesses whose money behaves completely differently.** One pays off today without buying any new hardware. One swings between an 8.2x and a 0.51x return. One doesn't have an identified customer yet. The project Korea funded with ₩45 billion is the **first** one. What NVIDIA points at when it cites a $200 billion RAN market is the **second**. Same name, different stories.

This piece exists to separate the three. It is not an opinion on any company's stock, and it is not investment advice.

| Common question | One-line answer |
|---|---|
| What is AI-RAN? | Running cellular signal processing and AI compute on the same accelerated hardware at the cell site |
| Can I use it now? | No. 2026 is trials and testbeds. Nokia's roadmap says commercial start 2027, mass deployment 2028 |
| Does it make money? | It splits. The software-only path pencils out; the GPU path swings **16x on the price of AI tokens alone** |

![a tower with several cell phones on top of it](https://images.unsplash.com/photo-1643155193188-38eb08e2b54f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxjZWxsJTIwdG93ZXIlMjBhbnRlbm5hfGVufDF8MHx8fDE3OTU1NTA5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [David Arrowsmith](https://unsplash.com/@devarrowsmith?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-tower-with-several-cell-phones-on-top-of-it-SsAFdirwkXc?utm_source=spice-bandit-blog&utm_medium=referral)*

## What AI-RAN actually is — start by splitting it in three

The AI-RAN Alliance launched at MWC on 26 February 2024, driven by SoftBank and NVIDIA. As of October 2026 it counts **more than 142 organizations across 17-plus countries** (it was 132 at MWC in February 2026). Executive members include ARM, Ericsson, Microsoft, Nokia, NVIDIA, Samsung, SoftBank, T-Mobile, SK Telecom, Qualcomm, Vodafone, Northeastern University, the University of Tokyo and DeepSig.

What matters is that the Alliance **split itself into three working groups.** Miss that split and every press release starts to sound like the same announcement.

| Track | What it does | New hardware? | Where the money comes from |
|---|---|---|---|
| **AI for RAN** | AI improves radio performance itself — channel estimation, interference mitigation, scheduling, mobility | None (software on installed gear) | Better spectral efficiency → **deferred capacity upgrades** |
| **AI and RAN** | Cellular and AI workloads **share the same infrastructure**, with compute allocated dynamically | GPUs required | **Leasing compute** to outside AI tenants |
| **AI on RAN** | Using the network and edge to **deliver AI services** | Edge infrastructure | Service revenue (customer not yet identified) |

*Sources: AI-RAN Alliance working group structure; Light Reading, "Nvidia threatens to reshape telecom with AI-plus-RAN plan"*

The money flows differently in each. **AI for RAN is a cost story.** Raise spectral efficiency through software without buying hardware, and a cell you were going to have to upgrade next year can wait another year. The avoided spend *is* the return.

**AI and RAN is a revenue story.** Buy the GPU, install it, sell the compute, recover the capex. The investment goes out first and the return depends entirely on who shows up to buy. That structural difference is the fork in the road for every number that follows.

## NVIDIA's numbers — where $5-per-$1 and 219% come from

The figures NVIDIA and SoftBank published on 12 November 2024 are specific. Read them knowing they are a two-year-old estimate. From NVIDIA's newsroom:

> "NVIDIA and SoftBank estimate that telco operators can earn roughly **$5 in AI inference revenue from every $1 of capex** it invests in new AI-RAN infrastructure."

And the return figure:

> "**Taking into account its opex and capex costs,** SoftBank estimates it can achieve a **return of up to 219%** for every AI-RAN server it adds to its infrastructure."

The assumption holding all of this up sits in the next sentence. This is the foundation of the entire AI-RAN narrative.

> "Traditional telco networks are designed to handle peak loads and, on average, have used **only one-third of that capacity**. With the common computing capability provided by AI-RAN, it is expected that telcos now have the opportunity to monetize the **remaining two-thirds** capacity for AI inference services."

So the logic runs: networks are built for peak, they idle at a third of capacity, sell the other two-thirds. Clean. Note, though, that **both companies produced this estimate themselves**, and both profit if the architecture sells. SoftBank's outdoor trial in Kanagawa did demonstrate carrier-grade 5G while running AI inference on spare capacity concurrently, and at Keio University's Shonan Fujisawa Campus a **single GH200 server handled 20 cells on a 100MHz 4T4R profile** while simultaneously serving video to 100 devices, LLM-driven quadruped robots and autonomous-driving AI. The technology demonstrably works. Economics is the open question.

## The academic model answers with a range — 8.2x and 0.51x together

A model that re-ran those estimates numerically appeared in March 2026: "A Techno-Economic Framework for Cost Modeling and Revenue Opportunities in Open and Programmable AI-RAN" (arXiv 2603.28680) by Gabriele Gemmi, Michele Polese and Tommaso Melodia of Northeastern University. It combines 5G Layer-1 processing benchmarks with realistic traffic models and LLM inference demand profiles to compute cost and revenue jointly.

**This paper isn't a fully independent party either.** Polese chairs the Alliance's AI-and-RAN working group, and Northeastern is a founding executive member alongside SoftBank and NVIDIA. Since this article later proposes "who produced the number?" as a checklist item, that standard belongs on its own sources too.

The paper opens coldly:

> "The large-scale deployment of 5G networks has **not delivered the expected return on investment** for mobile network operators, raising concerns about the economic viability of future 6G rollouts. … However, **the economic case for such systems remains unsubstantiated**."

That premise isn't unique to 5G. The UK's 3G spectrum auction closed at £22.5 billion in April 2000; Germany's, four months later, raised €50.5 billion. Both were underwritten by projected revenue from video calling and mobile internet. In the five years after the 1996 US Telecommunications Act, the industry poured over $500 billion into plant, mostly borrowed. At a 2002 Senate hearing, FCC chairman Michael Powell put industry debt at "a trillion dollars"; corporate bondholders recovered around 20 cents on the dollar.

Korea's version is shorter and sharper. KT and SK Telecom invested ₩2.1 trillion after launching WiBro commercially in 2006. Subscribers peaked at 1.04 million in December 2012 and fell to 334,000 by January 2018. Cumulative revenue: ₩230 billion — one-tenth of the investment. They switched off the transmitters at midnight on 31 December 2018. Every generation arrived with a promise to earn somewhere other than the monthly bill, and every time the recovery came from the monthly bill.

The paper's conclusion, though, is upbeat: across scenarios spanning token depreciation, demand dynamics and GPU serving densities, "the additional capital and operational expenditures of GPU-heavy deployments are offset by AI-on-RAN revenue, yielding a **return on investment of up to 8x**."

The word to read there is "up to." In October 2026, RCR Wireless analyst Vish Nandlall re-ran the same model on a 10-year basis. The result isn't a cliff — it's a staircase. If efficiency gains offset falling token prices, 8.2x. If prices slide somewhat faster, 2.7x. Faster still, about 1.3x. Under the most aggressive assumption, **0.51x** — half your capital back.

<figure>
<svg viewBox="0 0 680 312" role="img" aria-label="Return multiple falls from 8.2x to 2.7x, 1.3x and 0.51x as token price assumptions get more aggressive" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">Same hardware, same model — a 16x spread</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">10-year return multiple on AI inference atop base-station GPUs. Higher is better</text>
<line x1="150" y1="80" x2="150" y2="252" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="107" font-size="13" fill="#23201D" text-anchor="end">Efficiency offsets</text>
<rect x="150" y="86" width="460" height="32" fill="#A8BDD2"/>
<text x="598" y="108" font-size="14" font-weight="700" fill="#23201D" text-anchor="end">8.2x</text>
<text x="140" y="149" font-size="13" fill="#23201D" text-anchor="end">Token price dips</text>
<rect x="150" y="128" width="151" height="32" fill="#A8BDD2"/>
<text x="311" y="150" font-size="14" font-weight="700" fill="#23201D">2.7x</text>
<text x="140" y="191" font-size="13" fill="#23201D" text-anchor="end">Dips further</text>
<rect x="150" y="170" width="73" height="32" fill="#4E7FA8"/>
<text x="233" y="192" font-size="14" font-weight="700" fill="#23201D">1.3x</text>
<text x="140" y="233" font-size="13" fill="#23201D" text-anchor="end">Most aggressive</text>
<rect x="150" y="212" width="29" height="32" fill="#1B4F8A"/>
<text x="233" y="234" font-size="14" font-weight="700" fill="#1B4F8A">0.51x — capital lost</text>
<line x1="206" y1="80" x2="206" y2="252" stroke="#8A8378" stroke-width="1" stroke-dasharray="4 3"/>
<text x="206" y="272" font-size="12" fill="#8A8378" text-anchor="middle">1.0x = break-even</text>
<text x="24" y="298" font-size="12" fill="#8A8378">Source: Gemmi/Polese/Melodia (arXiv 2603.28680) model, recalculated by RCR Wireless</text>
</svg>
<figcaption>Token price is the decisive variable. Identical hardware and model, 16x apart end to end.</figcaption>
</figure>

**This is the whole argument about AI-RAN economics.** 8.2x isn't a lie and neither is 0.51x. They're opposite ends of the same overbuild scenario. And the variable separating them is the one an operator cannot control — **the price of AI inference.** Recall how fast token pricing has fallen over the past two years, and decide for yourself which end looks more realistic.

## The "sell it when it's idle" premise wobbles

NVIDIA's logic rests on idling at a third of capacity and selling the rest. In popular retelling it becomes "lease the GPU out overnight when traffic is light." The problem: **the hours you have to sell and the hours anyone wants to buy don't line up.**

That same academic model reports that RAN demand and LLM demand **collide hardest between 2pm and 6pm.** Which makes sense. People and companies use AI during working hours, and cellular traffic peaks when people are awake. At 3am, when compute is free, the demand to buy it has gone home too. "Spare capacity" and "sellable capacity" are not the same quantity.

The example everyone reaches for — idle capacity turned into a business — is Amazon Web Services. Except that story isn't true. Benjamin Black, co-author of the original 2003 AWS proposal, has flatly rejected the retail-leftover-servers legend: "Why won't this die? It's completely false." His account: "From day one, every part of AWS was purpose-built for AWS." The 2003 memo was about separating applications from infrastructure, and EC2 shipped in 2006 on dedicated capacity. The largest precedent for compute leasing as a business came from **the side that built capacity to sell, not the side that sold leftovers.** NVIDIA's "remaining two-thirds" leans on the latter.

Nandlall's arithmetic is more concrete. To recover a $4 million hardware premium on 200 GPUs over five years, assuming $1 of contribution margin per GPU-hour, **roughly 60% of all available hours must earn money.** That barely covers capital — maintenance and reserved headroom aren't in the figure yet.

Operators have said the same out loud. Dr Dongwook Kim of SK Telecom's 6G Tech Team told the Intelligent RAN Forum in September 2026 that "the biggest risk with AI-RAN is **repeating the mistakes of 5G**," not technical failure. With 5G, mobile edge computing and network slicing got fully specified and never reached commercial service. Demand didn't show up — and supply ran late too. Slicing presumes a 5G standalone core, and BT EE only switched 5G SA on in September 2024; a promise to ship "static slices" by the end of 2025 went unmet. As of 2026, none of the UK's three operators sells commercial slicing.

Read the original promise and it gets uncanny. In September 2014, six companies — Huawei, IBM, Intel, Nokia Networks, NTT DOCOMO and Vodafone — published a joint white paper on mobile edge computing stating that "operators can open the radio network edge to third-party partners, allowing them to rapidly deploy innovative applications and services towards mobile subscribers, enterprises and other vertical segments." Chapter 2 was titled "Evolution of the mobile base station." ETSI announced a new Industry Specification Group on 30 October that year, started work in December, and committed to five deliverables by mid-2015 — terminology, service scenarios, technical requirements, a PoC framework and a reference architecture. The specifications shipped on schedule. Twelve years later, BT operates exactly one AWS Wavelength site, opened in Manchester in March 2023, and a BT Wholesale executive has said there are no current plans to add more. Today, Nokia and Vodafone sit on the AI-RAN Alliance executive roster, and NTT DOCOMO appears on Nokia's list of AI-RAN operators. The same companies are writing the same sentence twelve years later.

The Alliance's AI-on-RAN working group rescoping itself in October 2026 around services rather than technology — edge inference, physical AI, semantic communications, multimodal spectrum sensing — comes from the same recognition. RCR Wireless summarized the concern of Alliance chair Alex Jinsung Choi (principal fellow at SoftBank's Research Institute of Advanced Technology) this way:

> "The central question for telco-based edge inference is to determine **when it provides real advantages** to have the compute close to the user."

The question is no longer whether it works. It's **why it has to be the base station.**

## Power and cooling — the problem the energy side sees

This part rarely makes it into telecom coverage. Putting GPUs in base stations means **touching the electrical installation at tens of thousands of scattered sites.**

Start with where the energy goes. Per NGMN, **about three-quarters** of a mobile network's electricity is consumed in the radio access network. Within the RAN, base station equipment accounts for 50%, cooling 40%, everything else 10%. Within base station equipment, the **radio unit takes roughly 80% in 4G and about 90% in 5G**, with the baseband unit at 13% and main control at 7%. Even carrying no traffic, a radio with its primary band active draws about 207W continuously — 152W of internal electronics plus 55W to keep the RF chain ready.

For absolute numbers per site: a 6G energy-design survey citing a 2021 GSMA study (arXiv:2509.11289) puts annual consumption at a typical network site at about **28,665 kWh**. Divide by 8,760 hours and you get roughly **3.3kW** on average. The original GSMA report isn't identified, so treat this as a re-cited approximation.

Now add an accelerator. The NVIDIA GH200 module used in SoftBank's trial is specified at a TDP **programmable from 450W to 1,000W** (CPU + GPU + memory), with cooling listed as "air cooled or liquid cooled." That pulling 1kW of heat out of a base station cabinet with air is hard is this article's judgment, not NVIDIA's guidance.

<figure>
<svg viewBox="0 0 680 264" role="img" aria-label="Average site power of 3.3 kilowatts rises to between 3.75 and 4.3 kilowatts when one accelerator is added" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">One accelerator adds 14–31% to site power</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">Annual average power at one mobile site plus GH200 module TDP. Lower is better</text>
<line x1="150" y1="80" x2="150" y2="206" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="124" font-size="13" fill="#23201D" text-anchor="end">Radio only</text>
<rect x="150" y="100" width="308" height="36" fill="#A8BDD2"/>
<text x="446" y="123" font-size="13.5" font-weight="700" fill="#23201D" text-anchor="end">3.3kW</text>
<text x="140" y="184" font-size="13" fill="#23201D" text-anchor="end">+ accelerator</text>
<rect x="150" y="160" width="308" height="36" fill="#A8BDD2"/>
<rect x="458" y="160" width="42" height="36" fill="#1B4F8A"/>
<rect x="500" y="160" width="51" height="36" fill="#4E7FA8"/>
<text x="561" y="183" font-size="13.5" font-weight="700" fill="#1B4F8A">Up to 4.3kW</text>
<rect x="150" y="218" width="12" height="12" fill="#1B4F8A"/>
<text x="168" y="229" font-size="12" fill="#8A8378">Min 450W</text>
<rect x="300" y="218" width="12" height="12" fill="#4E7FA8"/>
<text x="318" y="229" font-size="12" fill="#8A8378">Max 1,000W</text>
<text x="24" y="254" font-size="12" fill="#8A8378">Source: GSMA 2021 survey via arXiv:2509.11289; NVIDIA GH200 datasheet</text>
</svg>
<figcaption>One site is barely a kilowatt. The issue is what happens when you multiply by 340,000.</figcaption>
</figure>

One site is not a big number. But Korea had **340,343 5G base stations as of Q3 2024** per published figures — roughly 4x the 92,840 of 2019, the first commercial year. By operator: SK Telecom 121,046, KT 111,505, LG Uplus 107,792. No reliable primary source confirms a 2025–2026 count, so the 2024 figure stands.

Here's some simple arithmetic. **The calculations below are my own multiplication of public figures, not anyone's business plan.**

| Assumption | Added power | Added annual energy |
|---|---|---|
| One server per 20 cells (SoftBank trial ratio, ~17,000 servers) | ~17MW | ~0.15TWh |
| 1kW at 10% of base stations | ~34MW | ~0.30TWh |
| 1kW at 30% of base stations | ~102MW | ~0.89TWh |
| 1kW at 100% of base stations | ~340MW | ~2.98TWh |

*Basis: 340,343 5G base stations (Q3 2024), 1kW per accelerator, 8,760 hours/year. Station count per Electronic Times (2024-10-31)*

**Note that the first and last rows differ by 20x.** One kilowatt per station is a ceiling assumption. If one accelerator server covers 20 cells as in SoftBank's trial, you need about 17,000 servers and about 17MW — an order of magnitude lower. Read it from either end and the number isn't something the grid can't carry.

The problem isn't the total. It's the **distribution.** The 340MW ceiling matches a large data center campus, but the character is entirely different. A 340MW data center takes one grid interconnection at one location. AI-RAN means **reworking the electrical supply at tens of thousands of separate points.** (Station counts are per-operator, per-band radio stations, so the physical site count is well below 340,000 — many sites are shared.) Base station supply capacity was sized for radio equipment, and inserting a kilowatt-class accelerator plus its cooling into a structure where radios consume 80–90% of equipment power changes the design premise.

Ownership complicates it further. For the past decade operators treated base stations not as revenue assets but as **costs to spin off.** Vodafone announced the separation of 61,700 European towers in June 2019 and listed Vantage Towers in Frankfurt on 18 March 2021 at €24 a share, raising about €2.2 billion — Europe's largest IPO that year. The rationale was debt: Vodafone's net debt stood near €69 billion. In November 2022 it moved more equity into a joint venture with KKR and GIP at a €16.1 billion valuation. Telefónica sold Telxius towers to American Tower; Cellnex bought CK Hutchison's towers across six European countries for roughly €10 billion. So "put a GPU in the base station" means a company that no longer owns many of its sites wants to install a kilowatt-class heat source on somebody else's tower and rebuild the power and cooling. Assets sold off as cost centers in the 2010s are being renamed revenue assets in the 2020s. The lease renegotiation may well arrive before the electrical contractor's quote.

Hence the industry's own objection: **is it justified to raise RAN spending and energy consumption at the same time?** Sebastian Barros, who has built RAN roadmaps and published AI research, put the mismatch this way:

> "The GPU looks like a **Ferrari engine dropped into a bicycle**: technically impressive, but absurd in context."

His unit-cost comparison points the same direction. An existing 5G baseband unit runs about $10,000; a Hopper-generation GPU board runs $25,000–$40,000. **2.5x to 4x** on one board.

<figure>
<svg viewBox="0 0 680 236" role="img" aria-label="An existing 5G baseband unit costs about 10,000 dollars while a GPU board costs 25,000 to 40,000 dollars" style="width:100%;height:auto;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px">
<text x="24" y="36" font-size="17" font-weight="700" fill="#23201D">Unit cost — one board, 2.5–4x the price</text>
<text x="24" y="58" font-size="12.5" fill="#8A8378">Price per compute board at the cell site. Lower is better</text>
<line x1="150" y1="80" x2="150" y2="206" stroke="#E5DECF" stroke-width="1"/>
<text x="140" y="124" font-size="13" fill="#23201D" text-anchor="end">Existing 5G BBU</text>
<rect x="150" y="100" width="105" height="36" fill="#A8BDD2"/>
<text x="265" y="123" font-size="13.5" font-weight="700" fill="#23201D">~$10,000</text>
<text x="140" y="184" font-size="13" fill="#23201D" text-anchor="end">GPU board</text>
<rect x="150" y="160" width="262" height="36" fill="#1B4F8A"/>
<rect x="412" y="160" width="158" height="36" fill="#4E7FA8"/>
<text x="400" y="183" font-size="13.5" font-weight="700" fill="#FAF6EE" text-anchor="end">$25,000 – $40,000</text>
<text x="24" y="226" font-size="12" fill="#8A8378">Source: Sebastian Barros, "We are getting AI-RAN wrong"</text>
</svg>
<figcaption>The hardware alone is 2.5–4x. Power and cooling come on top.</figcaption>
</figure>

![Detailed view of server racks with glowing lights in a data center environment.](https://images.pexels.com/photos/17489153/pexels-photo-17489153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [panumas nikhomkhai](https://www.pexels.com/@cookiecutter) on [Pexels](https://www.pexels.com/photo/light-on-computer-17489153/)*

## Where exactly did Korea's ₩45 billion go?

This is where the three-way split earns its keep. The budget for the AI-RAN Global Leadership Project, led by ETRI:

| Phase | Period | Government R&D funding |
|---|---|---|
| Phase 1 | 2026–2028 | ₩29.0 billion |
| Phase 2 | 2029–2030 | ₩16.0 billion |
| **Total** | **5 years** | **up to ₩45.0 billion** |
| (Year 1) | Apr–Dec 2026 | up to ₩9.0 billion |

*Source: IT Daily, "AI-RAN project toward 6G launches — ETRI, three carriers, NVIDIA participate"*

ETRI leads; SK Telecom, KT and LG Uplus are co-researchers; NVIDIA and HFR are collaborators; the Next Generation Mobile Communications Association (NGMA) and Seoul National, Yonsei, Sungkyunkwan and Ajou universities participate.

**But this project is not AI and RAN.** The stated deliverables are AI-RAN software, an AI-RAN virtual network platform and a research testbed on live base stations, aimed at automating and optimizing traffic handling, resource management and fault response. That is **making the base station itself smarter (AI for RAN)** — not having base stations process outside AI workloads.

Why does that matter? Because **it's the one track of the three with the clearest economics.** The analyst work above also ranked "AI software on the installed RAN" as investment priority number one. The 10% spectral efficiency gain Ericsson measured from AI link adaptation on SoftBank's commercial 5G network requires no new hardware. Take a cell sitting at 91% utilization down to 83% and you **defer a $200,000 upgrade by a year** — about $18,000 in present value at a 10% cost of capital. Unglamorous, but the number holds.

And consider the scale. ₩45 billion over five years is **₩9 billion a year.** That is not money for equipping 340,000 base stations. It is an R&D budget; actual procurement attaches to spectrum auctions and 6G commercialization. Korea's Ministry of Science and ICT did name "nationwide deployment of intelligent base stations (AI-RAN)" alongside 2030 6G commercialization in its 2026 Hyper AI Network Strategy — but a strategy document's target year and this year's disbursed R&D budget are numbers at different altitudes. **In other words, don't read the headline "government invests ₩45 billion in AI-RAN" as an equipment order.**

## When does it actually ship? The published timeline

For readers who came for a date, here is only what public sources state.

| Date | What happened / is planned |
|---|---|
| 26 Feb 2024 | AI-RAN Alliance launches at MWC |
| 12 Nov 2024 | NVIDIA and SoftBank publish AI-RAN revenue estimates ($5 per $1, 219%) |
| 28 Oct 2025 | NVIDIA invests **$1 billion in Nokia** at $6.01/share; ARC-Pro announced |
| 26 Feb 2026 | SK Telecom completes AI-RAN trial with Nokia and HFR on NVIDIA GPU-based general-purpose servers |
| Feb 2026 | 33 demos across the Alliance's three working groups at MWC |
| Apr 2026 | ETRI's AI-RAN Global Leadership Project begins year one |
| 15 Jul 2026 | Nokia announces the **industry's first commercial AI-RAN platform** (anyRAN + NVIDIA Aerial) |
| 17 Oct 2026 | T-Mobile, Nokia and NVIDIA complete the **world's first AI-RAN call** on a commercial cell site in Bellevue, WA (announced 21 Oct) |
| Late 2026 | Pilots, per Nokia's roadmap |
| 2027 | **Commercial availability target** (T-Mobile US); 50% spectral efficiency gain target |
| 2028 | **Mass deployment** target; 100%+ spectral efficiency gain target |
| 2030 | Korea's 6G commercialization target |

*Sources: NVIDIA newsroom (2024-11-12, 2025-10-28), Nokia newsroom and blog, RCR Wireless (2026-10-14), IT Daily*

The market figure NVIDIA cites is a **RAN market expected to exceed a cumulative $200 billion by 2030** (citing Omdia), with AI-RAN as an opportunity inside it. Spectral efficiency gains are at the 20%-plus demonstrated stage today. The operators Nokia names on AI-RAN are T-Mobile US, Vodafone, BT, Orange, Deutsche Telekom, Elisa, SoftBank, NTT DOCOMO and Indosat Ooredoo Hutchison — nine. Nokia has said it will monetize through a **software subscription** model and has not published pricing. Here too, the money moves first on the software side.

## So what should you watch?

One sentence: **this is operators trying to stay infrastructure providers in the AI era; the technology is proven; the economics are certain in only one of the three tracks.**

A checklist for the next press release you read.

1. **Which of the three is it?** When you see "AI-RAN trial succeeds," check whether it raised radio performance through software (AI for RAN) or ran outside AI workloads on an installed GPU (AI and RAN). It's far more often the former.
2. **Does the return figure say "up to"?** 8.2x and 0.51x are two ends of the same model. Ask which assumption produced the number.
3. **Who produced the estimate?** $5-per-$1 and 219% are a 2024 estimate co-authored by the party selling the hardware and the party buying it. The academic model answers with a range — and its authors sit inside the Alliance too.
4. **R&D budget or equipment order?** There are two orders of magnitude between ₩9 billion a year and 340,000 base stations.
5. **Does it mention power and cooling?** Any article that says "put a GPU in the base station" without addressing a 450–1,000W accelerator and how its heat leaves the cabinet has omitted the most expensive line item. For an operator that no longer owns its sites, add lease renegotiation.
6. **Is there a named customer?** The "5G mistake" Dr Kim warned about was a failure of demand *and* supply at once. The moment a name appears for **who buys the compute** is the moment a technology narrative becomes a business.

One last thing. Whether a base station can become an AI server is settled. But this isn't the first time it was settled. After that 2014 white paper promised to "open the radio network edge to third parties," the specifications shipped on schedule and the demos were completed. Twelve years on, BT has one edge site. **Proof does not produce deployment** — that was the lesson of the last cycle.

Which makes it significant who raised "when does it provide real advantages" first this time. Alex Jinsung Choi was SK Telecom's CTO from 2012 to 2017, went through Deutsche Telekom's T-Labs, chaired the O-RAN Alliance from June 2022 to June 2024, and then took the AI-RAN Alliance chair. The person who executed MEC and slicing opened the next cycle by asking about demand rather than technology. That is the most concrete evidence available that the industry learned something. It is also true that asking is not answering.

And the largest precedent for compute leasing as a business came from the side that built capacity to sell, not the side that sold leftovers. If that holds, the fork for this industry isn't "can we run AI on base station GPUs?" It's **"will we redesign the base station for AI from scratch?"** For work that means touching the electrical installation at tens of thousands of sites, the answer had better be clearer than "let's use what's spare."

*This article is industry analysis based on public market, policy and technology information. It is not investment advice regarding any security.*

## Sources

- [NVIDIA Newsroom — NVIDIA and SoftBank Corp. Accelerate Japan's Journey to Global AI Powerhouse](https://nvidianews.nvidia.com/news/nvidia-and-softbank-accelerate-japans-journey-to-global-ai-powerhouse) (2024-11-12; $5 per $1, 219%, one-third utilization premise, Kanagawa trial)
- [NVIDIA Newsroom — NVIDIA and Nokia to Pioneer the AI Platform for 6G](https://nvidianews.nvidia.com/news/nvidia-nokia-ai-telecommunications) (2025-10-28; $1B investment, ARC-Pro, $200B cumulative RAN market by 2030)
- [Gemmi, Polese, Melodia — A Techno-Economic Framework for Cost Modeling and Revenue Opportunities in Open and Programmable AI-RAN (arXiv:2603.28680)](https://arxiv.org/abs/2603.28680) (2026-03-30; up to 8x ROI, "economic case remains unsubstantiated")
- [RCR Wireless — Which AI-RAN investment makes sense for an operator?](https://rcrwireless.com/20261013/analyst-angle/which-ai-ran-investment-makes-sense-for-an-operator-nandlall) (2026-10-13; 8.2x→2.7x→1.3x→0.51x, 60% of hours at $1/GPU-hour margin, 2–6pm demand conflict, Ericsson 10%)
- [RCR Wireless — AI-RAN Alliance moves to implementation blueprints and edge business models](https://rcrwireless.com/20261014/ai-infrastructure/ai-ran-alliance-moves-to-implementation-blueprints-and-edge-business-models) (2026-10-14; 142+ organizations across 17+ countries, AI-on-RAN scope, Choi's framing)
- [RCR Wireless — "Biggest risk with AI-RAN is repeating mistakes of 5G", says SK Telecom](https://rcrwireless.com/20260928/ai-infrastructure/biggest-risk-with-ai-ran-is-repeating-mistakes-of-5g-says-sk-telecom) (2026-09-28; Dr Dongwook Kim, 6G Tech Team)
- [SoftBank — From Proof-of-Concept to Commercial Deployment of AI-RAN](https://www.softbank.jp/en/corp/technology/research/topics/224/) (Keio SFC GH200 trial, one server for 20 cells, commercial network from FY2026)
- [SoftBank — Alex Jinsung Choi, Principal Fellow](https://www.softbank.jp/en/corp/technology/research/team/mem_alexchoijinsung/) · [AI-RAN Alliance Announces Appointment of Dr. Alex Jinsung Choi as Chair (2024-08-15)](https://www.businesswire.com/news/home/20240815774457/en/AI-RAN-Alliance-Announces-Appointment-of-Dr.-Alex-Jinsung-Choi-as-Chair)
- [Nokia blog — From the lab to the live network: Nokia, T-Mobile and NVIDIA complete world's first AI-RAN call](https://www.nokia.com/blog/from-the-lab-to-the-live-network-nokia-t-mobile-and-nvidia-complete-worlds-first-ai-ran-call/)
- [Light Reading — Nvidia threatens to reshape telecom with AI-plus-RAN plan](https://www.lightreading.com/ai-machine-learning/nvidia-threatens-to-reshape-telecom-with-ai-plus-ran-plan) (AI for RAN / AI and RAN / AI on RAN definitions)
- [Sebastian Barros — We are getting AI-RAN wrong](https://sebastianbarros.substack.com/p/we-are-getting-ai-ran-wrong) ($10k BBU vs $25–40k GPU board, 350–400W per board)
- [IT Daily — AI-RAN project toward 6G launches: ETRI, three carriers, NVIDIA participate](http://www.itdaily.kr/news/articleView.html?idxno=239169) (₩45bn, phase budgets, participants, project scope)
- [Electronic Times — Seoul-area concentration of 5G base stations eases](https://www.etnews.com/20241031000312) (340,343 stations in Q3 2024, per-operator counts)
- [NGMN — Network Energy Efficiency Phase 2](https://www.ngmn.org/wp-content/uploads/NGMN_Network_Engergy_Efficiency_Phase2.pdf) (RAN ~three-quarters; within RAN, base station equipment 50% and cooling 40%; radio unit 80% in 4G and ~90% in 5G; BBU 13%)
- [Energy-Aware 6G Network Design: A Survey (arXiv:2509.11289)](https://arxiv.org/pdf/2509.11289) (2021 GSMA survey re-cited — 28,665 kWh per site per year)
- [RCR Wireless — Energy measurement in open RAN](https://www.rcrwireless.com/20260323/opinion/readerforum/energy-open-ran) (207W idle radio breakdown)
- [NVIDIA GH200 Grace Hopper Superchip Datasheet](https://resources.nvidia.com/en-us-grace-cpu/grace-hopper-superchip) (TDP programmable 450–1,000W; air cooled or liquid cooled)
- [ETSI — Mobile-Edge Computing Introductory Technical White Paper (2014-09)](https://portal.etsi.org/portals/0/tbpages/mec/docs/mobile-edge_computing_-_introductory_technical_white_paper_v1%2018-09-14.pdf) · [ETSI announces first meeting of new MEC group (2014-10-30)](https://www.etsi.org/newsroom/news/838-2014-10-news-etsi-announces-first-meeting-of-new-standardization-group-on-mobile-edge-computing)
- [The Mobile Network — BT's single Manchester edge site, no current plans for more](https://the-mobile-network.com/2025/12/bt-marks-aws-based-mec-service-launches-for-2026/) · [Light Reading — 5G network slicing not ready for prime time in UK](https://www.lightreading.com/5g/5g-network-slicing-not-ready-for-prime-time-in-uk)
- [Network World — The myth about how Amazon's Web service started just won't die](https://www.networkworld.com/article/936248/the-myth-about-how-amazon-s-web-service-started-just-won-t-die.html) (rebuttal of the idle-server origin story)
- [DCD — Vodafone spins off telco tower assets as Vantage Towers](https://www.datacenterdynamics.com/en/news/vodafone-spins-telco-tower-assets-vantage-towers/) · [Dgtl Infra — Vodafone Sells Stake in €16.2bn Vantage Towers to KKR and GIP](https://dgtlinfra.com/vodafone-vantage-towers-kkr-gip/)
- [Wikipedia — Telecoms crash](https://en.wikipedia.org/wiki/Telecoms_crash) (£22.5bn UK and €50.5bn German auctions, Powell's "trillion dollars") · [Electronic Times — KT and SK Telecom shut down WiBro](https://www.etnews.com/20180313000261) (₩2.1tn invested, ₩230bn cumulative revenue)
</content>
