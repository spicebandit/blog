---
title: "MiroFish Install & System Guide — Build a 'Virtual Society' on Your Machine [Part 2]"
description: "Let's actually run MiroFish, the open-source AI prediction engine. A step-by-step guide to its system architecture, requirements (Python, Node, LLM API), the web UI / API / Docker channels, and source vs. Docker installation — with cost-saving tips."
pubDate: 2026-07-16T09:10:00+09:00
category: ai
tags: ["MiroFish", "install", "multi-agent", "setup"]
lang: en
koSlug: 2026-07-16-mirofish-ai-prediction-engine-2-install
---

> 📚 **Series — The Complete Guide to MiroFish**
> ① Concept, history, use cases · **② System overview & install** · ③ Beginner's guide · ④ Scaling it up

**To run MiroFish on your own machine you need exactly three things — a Mac with Python and Node installed (or Docker), one OpenAI-format LLM API key, and about five commands.** If [Part 1](/en/blog/2026-07-15-mirofish-ai-prediction-engine-1-concept/) gave you the concept — an engine that predicts the future by *building a virtual society* — Part 2 is where you get that engine into your hands and turn the key. The bottom line first: MiroFish is a web app made of two halves, a Python backend and a Vue frontend; you can install it straight from source or spin the whole thing up with Docker; and either way the real gate isn't installation but **which LLM you bolt on behind it and how you keep the cost under control.** This guide walks through system structure → requirements → access channels → installation → LLM/cost setup, so even a first-timer can follow along.

![programming code on a developer's screen](https://images.pexels.com/photos/7325498/pexels-photo-7325498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Al Nahian](https://www.pexels.com/@alnahian2003) on [Pexels](https://www.pexels.com/photo/computer-program-on-computer-screen-7325498/)*

## System Overview — What MiroFish Is Made Of

MiroFish isn't a single program but a **pipeline** of parts with different jobs. The five stages from Part 1 (knowledge graph → persona generation → dual-platform simulation → report → interaction) map, in software terms, onto three layers.

First, the **frontend** — what you see in the browser. Built with Vue and Node.js, it's the dashboard where you launch a simulation and watch the agents' conversations unfold in real time. It runs at `localhost:3000` by default.

Second, the **backend** — the actual brain. Written in Python, it does all the heavy lifting: extracting a knowledge graph from your seed text (GraphRAG), minting agent personas, running the simulation across two social platforms, and generating the report. It talks to the frontend as a REST API at `localhost:5001`.

Third, the **external services** — MiroFish doesn't hold intelligence itself; it borrows two external brains. One is the **LLM API** that lets agents speak and think (any OpenAI-format API works), the other is the **memory service** that stores each agent's long-term memory (the recommended setup uses Zep Cloud). Because of this design, MiroFish installs lightly — but most of the actual compute and cost happens in these external services.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px;margin:1.5rem 0">
<svg viewBox="0 0 720 220" width="100%" height="auto" role="img" aria-label="MiroFish system structure: frontend (3000) and backend (5001) communicate, and the backend calls the LLM API and memory service">
  <rect x="20" y="80" width="150" height="60" rx="8" fill="#fff" stroke="#23201D" stroke-width="1.5"/>
  <text x="95" y="105" text-anchor="middle" font-size="14" font-weight="700" fill="#23201D">Frontend</text>
  <text x="95" y="124" text-anchor="middle" font-size="11" fill="#8A8378">Vue · localhost:3000</text>

  <rect x="285" y="80" width="150" height="60" rx="8" fill="#fff" stroke="#C8102E" stroke-width="2"/>
  <text x="360" y="105" text-anchor="middle" font-size="14" font-weight="700" fill="#C8102E">Backend (brain)</text>
  <text x="360" y="124" text-anchor="middle" font-size="11" fill="#8A8378">Python · localhost:5001</text>

  <rect x="550" y="20" width="150" height="55" rx="8" fill="#FAF6EE" stroke="#8A8378" stroke-width="1.5"/>
  <text x="625" y="43" text-anchor="middle" font-size="13" font-weight="700" fill="#23201D">LLM API</text>
  <text x="625" y="61" text-anchor="middle" font-size="10.5" fill="#8A8378">OpenAI format</text>

  <rect x="550" y="145" width="150" height="55" rx="8" fill="#FAF6EE" stroke="#8A8378" stroke-width="1.5"/>
  <text x="625" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#23201D">Memory service</text>
  <text x="625" y="186" text-anchor="middle" font-size="10.5" fill="#8A8378">Zep Cloud (rec.)</text>

  <line x1="170" y1="110" x2="285" y2="110" stroke="#23201D" stroke-width="1.5"/>
  <polygon points="285,110 277,106 277,114" fill="#23201D"/>
  <polygon points="170,110 178,106 178,114" fill="#23201D"/>
  <text x="227" y="102" text-anchor="middle" font-size="10" fill="#8A8378">REST API</text>

  <line x1="435" y1="100" x2="550" y2="55" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <polygon points="550,55 541,55 546,63" fill="#C8102E"/>
  <line x1="435" y1="120" x2="550" y2="165" stroke="#C8102E" stroke-width="1.5" stroke-dasharray="4 3"/>
  <polygon points="550,165 541,165 546,157" fill="#C8102E"/>
</svg>
<figcaption style="font-size:0.85rem;color:#8A8378;text-align:center;margin-top:8px">MiroFish's three layers — the screen (frontend), the brain (backend), and the borrowed intelligence (LLM & memory). Most compute and cost lands on the external services at right.</figcaption>
</figure>

This structure matters because it tells you up front that **the difficulty of install and operation live in different places.** Getting the front and backend up takes a handful of commands. But to actually run a simulation you have to obtain and wire in the LLM and memory keys on the right — and that's where cost and configuration begin.

## Requirements — What to Install First

Before installing, check you have the following. The requirements listed by the repository are ([MiroFish GitHub](https://github.com/666ghj/MiroFish)):

| Item | Requirement | Note |
|------|-------------|------|
| OS | macOS-optimized | Windows support in progress; use Docker to work around |
| Python | 3.11 to 3.12 | 3.13 not yet recommended |
| Node.js | 18+ | For building/running the frontend |
| Python package manager | `uv` (latest) | Used instead of pip; auto-creates the venv |
| Node package manager | `npm` | Ships with Node |
| LLM API key | 1 OpenAI-format key | Recommended: Alibaba Qwen (qwen-plus) |
| Memory service key | Zep Cloud | Free monthly quota available |

*Source: MiroFish repository README ([GitHub](https://github.com/666ghj/MiroFish)), as of July 2026.*

Three spots trip up beginners most. **First, the Python version.** If you're on 3.13, create a separate 3.11 or 3.12 virtual environment. **Second, `uv`.** MiroFish uses the modern package manager `uv` instead of traditional pip; if you don't have it, install it with one line: `curl -LsSf https://astral.sh/uv/install.sh | sh`. **Third, the two API keys.** MiroFish is just a shell — the real intelligence is borrowed externally — so without the LLM key (Qwen, etc.) and memory key (Zep) it will install but won't simulate.

What about Windows users? MiroFish is currently macOS-optimized and native Windows execution isn't finished. In that case the **Docker** install below is the surest path — it runs in a Linux environment inside a container, independent of your OS.

## Access Channels — How You Reach MiroFish

Once installed, MiroFish isn't a one-door tool. Depending on your goal, you can reach it four ways.

- **Web UI (`localhost:3000`)** — the default, beginner-facing door. Configure a simulation in the browser and watch the agents' exchanges across the two platforms (Twitter-style and Reddit-style) in real time. Most people start here.
- **Backend REST API (`localhost:5001`)** — the door for programs. Use it when you want another service or script to trigger simulations automatically or post-process the results. It's the foundation for the automation and scaling covered in Parts 3 and 4.
- **Docker container** — both an install method and a distribution channel. `docker compose` brings up the front and backend together, which is handy when you want to transplant the whole of MiroFish onto a server or someone else's machine.
- **Direct agent chat** — the door to talking to a specific virtual persona inside the simulation. Ask an individual agent "why do you think that?" to dig into the reasoning behind the collective outcome. It's the channel where MiroFish's defining trait — giving you a *narrative*, not a number — shows best.

In short, the natural arc is **get a feel with the web UI, automate with the API as you grow, and deploy with Docker.** This part aims at the starting point: installation and getting the web UI running.

## Installation ① — Straight From Source

The standard route. If your Mac has Python, Node, and uv ready, follow these steps as-is. (Commands follow the repository README and may change with version updates, so check the [official repo](https://github.com/666ghj/MiroFish) as you install.)

**Step 1 — Download.** Clone the repository and enter the folder.

```bash
git clone https://github.com/666ghj/MiroFish.git
cd MiroFish
```

**Step 2 — Create the config file.** Copy the example to make your own `.env`.

```bash
cp .env.example .env
```

Then open `.env` and fill in your keys. The four core entries are:

```bash
LLM_API_KEY=your_llm_key
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus
ZEP_API_KEY=your_zep_key
```

`LLM_BASE_URL` and `LLM_MODEL_NAME` depend on which LLM you use. The example above is the recommended Alibaba Qwen (Bailian platform); if you use OpenAI or another compatible API, swap in the matching URL and model name.

**Step 3 — Install dependencies.** Install everything the front and backend need in one shot.

```bash
npm run setup:all
```

This single line handles both the Node dependencies and the Python dependencies (uv auto-creates the Python venv). To split them, run `npm run setup` (Node) and `npm run setup:backend` (Python) separately.

**Step 4 — Run.** From the project root, start the front and backend together.

```bash
npm run dev
```

When it comes up cleanly, the frontend responds at `http://localhost:3000` and the backend API at `http://localhost:5001`. Open `localhost:3000` in a browser and you'll see the MiroFish dashboard. To run them separately, use `npm run backend` and `npm run frontend`.

## Installation ② — Spin It All Up With Docker

If you're on Windows, or you'd rather not touch your system's Python and Node versions, Docker is the answer. As long as Docker Desktop (or Docker Engine) is installed, it's two lines.

```bash
cp .env.example .env      # fill in keys as above
docker compose up -d
```

`docker compose` builds the frontend and backend containers together and runs them in the background, wiring the same ports as the source method — front 3000, backend 5001. So the access addresses are identical. Docker's strength is **reproducibility** — the same environment is guaranteed on your Mac or a team server, which also helps with the large-scale, multi-simulation operation covered in Part 4.

Comparing the two:

| Item | Source install | Docker install |
|------|----------------|----------------|
| Prereqs | Python 3.11–3.12, Node 18+, uv | Docker only |
| Commands | 4 steps | 2 lines |
| OS | macOS recommended | OS-agnostic (Windows OK) |
| Editing/debugging | Easy to edit code directly | A bit clunkier inside a container |
| Best for | Devs who'll dig into the code | Quick runs · Windows users |

*Source: MiroFish repository deployment docs ([GitHub](https://github.com/666ghj/MiroFish)).*

## LLM Backend and Cost — This Is the Real Gate

Even after installing, you need an LLM behind it to run a simulation. MiroFish is designed to accept "any LLM API that follows the OpenAI SDK format" — so it isn't locked to one vendor. The repository's recommended default is the cost-effective **Alibaba Qwen (qwen-plus)**, with **Zep Cloud** (free monthly quota) for memory. You can of course swap in OpenAI or another compatible API — just change `LLM_BASE_URL` and `LLM_MODEL_NAME` in `.env`.

The point you must not skip is **cost**. A MiroFish simulation has hundreds to thousands of agents writing and reacting to each other over dozens of rounds, so LLM calls balloon exponentially as rounds grow. As we saw in Part 1, running 800–1,200 agents for 30–50 rounds racks up meaningful API spend. That's why the repository itself advises **"start with small simulations of fewer than 40 rounds first."** For beginners, the sound way to avoid burning money is to set the agent count and rounds to a minimum, confirm the pipeline runs end to end, then scale up gradually.

So the setup checklist is: ① Did you enter the LLM and Zep keys correctly in `.env`? ② Are Python 3.11–3.12, Node 18+, and uv in place? ③ Does `localhost:3000` open? ④ Is your first simulation small (minimum agents and rounds)? Pass those four and MiroFish starts running.

## So What — Install Takes 5 Minutes, Control Is Ongoing

The real lesson of installing MiroFish isn't "how easy it is" but "where the weight sits." Getting the front and backend up and the web UI running is five commands, a few minutes. As the "undergraduate in 10 days" from Part 1 symbolizes, **the barrier to building and installing has already collapsed.** The remaining bottleneck isn't code but operation — which LLM you attach to control cost, and what seed you feed to ask what. Getting the tool in hand is only the start; asking a meaningful question with it is entirely on the user.

In the next [Part 3], we'll cover the **beginner's hands-on guide to running your first simulation** with the MiroFish you just installed — what seed to feed and how, how to set agent count and rounds, and how to read the resulting report. Past concept and install, it's finally time to actually run a virtual society.

## Frequently Asked Questions (MiroFish Install)

**Q1. What do I need to install before using MiroFish?**
On macOS you need Python 3.11–3.12, Node.js 18+, and the Python package manager `uv`. You also need an LLM API key (OpenAI-format, Qwen recommended) to power the agents and a Zep Cloud key for memory, or the simulation won't run.

**Q2. Does it work on Windows?**
MiroFish is currently macOS-optimized and native Windows execution is in progress. Windows users can install via Docker (`docker compose up -d`) to run it inside a container regardless of OS.

**Q3. What are the install commands?**
For source: `git clone` → `cp .env.example .env` (enter keys) → `npm run setup:all` → `npm run dev`. Once running, the web UI is at `localhost:3000` and the backend API at `localhost:5001`. For Docker, fill in `.env` and run `docker compose up -d`.

**Q4. How much does it cost?**
MiroFish itself is free and open-source, but the LLM API calls behind it cost money. Running hundreds to thousands of agents over dozens of rounds spikes the calls, so the repository recommends starting with small simulations of fewer than 40 rounds.

---

*This article is a general installation explainer based on information and official repository docs published as of July 2026. Commands and requirements may change with version updates, so verify against the official repository when you install.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What do I need to install before using MiroFish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On macOS you need Python 3.11-3.12, Node.js 18+, and the Python package manager uv. You also need an LLM API key (OpenAI-format, Qwen recommended) to power the agents and a Zep Cloud key for memory, or the simulation won't run."
      }
    },
    {
      "@type": "Question",
      "name": "Does MiroFish work on Windows?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MiroFish is currently macOS-optimized and native Windows execution is in progress. Windows users can install via Docker (docker compose up -d) to run it inside a container regardless of OS."
      }
    },
    {
      "@type": "Question",
      "name": "What are the MiroFish install commands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For source: git clone, then cp .env.example .env to enter keys, npm run setup:all to install dependencies, and npm run dev to run. The web UI is at localhost:3000 and the backend API at localhost:5001. For Docker, fill in .env and run docker compose up -d."
      }
    },
    {
      "@type": "Question",
      "name": "How much does MiroFish cost to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MiroFish itself is free and open-source, but the LLM API calls behind it cost money. Running hundreds to thousands of agents over dozens of rounds spikes the calls, so the repository recommends starting with small simulations of fewer than 40 rounds."
      }
    }
  ]
}
</script>
