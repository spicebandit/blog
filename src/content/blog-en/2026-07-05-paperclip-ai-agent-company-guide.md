---
title: "Run a Company Staffed by AI Employees — Paperclip Guide [Part 1]"
description: "Can you actually run a company staffed by AI employees? With open-source Paperclip you give AI agents titles, reporting lines, and budgets — from a one-line npx install to your first org chart."
pubDate: "2026-07-06T08:00:00+09:00"
category: ai
tags: ["ai employees", "ai agent company", "paperclip", "multi-agent"]
lang: en
koSlug: 2026-07-05-paperclip-ai-agent-company-guide
---

A company that runs on AI employees — it sounds like science fiction, but you can actually build one today with open-source tools. Using one AI agent well and running several of them **as an organization** are two entirely different problems. The open-source tool **Paperclip** tackles the second one head-on — it treats your agents as "AI employees," gives them job titles and reporting lines, puts them on monthly budgets, and blocks them from changing strategy without sign-off. It is, quite literally, a platform for building **a company staffed by AI employees.** Installation is a single line, `npx paperclipai onboard --yes`, and since it's MIT-licensed open source, there's no account and no cost. If the [Hermes series](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) was about hiring a single agent, this two-part series is about founding a company with them. Part 1 (this article) covers the concepts, installation, and first setup; [Part 2](/en/blog/2026-07-05-paperclip-ai-newsroom-operations/) covers the (expensive) lessons from actually running an AI newspaper on it for ten days.

## What Is Paperclip? "If Agents Are Employees, Paperclip Is the Company"

Paperclip's official site introduces itself in one sentence: "Manage a team of AI agents to run your business. Org charts, budgets, governance, and goals — all in one deployment." In other words, you deploy and manage an agent team together with its org chart, budgets, governance, and goals, all at once. The analogy circulating in the community is even more intuitive: **"If OpenClaw (or Hermes) is the employee, Paperclip is the company those employees work for."**

Concretely, Paperclip is a self-hosted app made up of a Node.js server and a React dashboard. Register an agent, and you get all of this:

| Concept | Meaning in a company | Behavior in Paperclip |
|------|----------------|---------------------|
| Org Chart | Titles and reporting lines | Each agent gets a role, a manager, and permissions |
| Goal | Company mission, quarterly targets | Every task is linked to a goal and tracked |
| Issue | Work ticket | Assigned to an agent; progress and comments logged |
| Heartbeat | Clocking in | Agents wake up on a schedule and check for work |
| Budget | Department budget | Monthly token budget per agent; auto-stop on overrun |
| Governance | Board approval | Hiring and strategy changes require human sign-off |

The core design philosophy lives in those last two rows. Even if an agent runs wild, **the budget stops it** ("When they hit the limit, they stop" — the official wording), and important decisions **cannot proceed without human approval** ("You're in charge. Approve hires, override strategy, pause or terminate any agent at any time"). The two biggest anxieties around autonomous agents — runaway costs and loss of control — are pinned down using the machinery of a very old institution: the company.

It's also refreshingly agnostic about which agents you bring. Per the official docs, it hooks up to Claude Code, Codex, Cursor, OpenClaw, HTTP/webhook bots, and even Bash agents. As the slogan goes: "If it can receive a heartbeat, it's hired."

![Team gathered around a whiteboard](https://images.unsplash.com/photo-1681949270990-cecd4728d2e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxvcmdhbml6YXRpb24lMjBjaGFydCUyMHRlYW13b3JrJTIwb2ZmaWNlfGVufDF8MHx8fDE3ODMyMTY3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Sable Flow](https://unsplash.com/@sableflow?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-group-of-women-standing-around-a-white-board-pNodosEZ5Oc?utm_source=spice-bandit-blog&utm_medium=referral)*

## Why the "Company" Metaphor? Multi-Agent's Oldest Problem

Anyone who has run more than a couple of agents knows the pattern. Two or three you can juggle across a few chat windows — beyond that, three questions blow up at once. **Who is doing what** (visibility), **who gets to tell whom what to do** (authority), and **how much is this costing me** (spend). This isn't really an AI problem; it's an organizational problem, and humanity has spent centuries solving it with the institution we call the company. Titles, reporting lines, approvals, budgets — Paperclip simply ports those battle-tested mechanisms into software.

Dig into the history even a little and the metaphor gains real weight. The joint-stock company traces back to the Dutch East India Company in 1602, but what was invented then was a device for pooling capital, not for managing people. The **managerial hierarchy** — titles, reporting lines, internal approvals — was first systematized by 19th-century American railroads. Once employees and trains were scattered across thousands of kilometers and no single owner could see everything, middle managers, reporting structures, and internal accounting were invented. This story, chronicled by business historian Alfred Chandler in *The Visible Hand* (1977), was precisely an answer to those same three questions — visibility, authority, and cost. Agents multiplying until you need an org chart is a rerun of railroads growing until they needed managers.

This approach isn't the only answer. You can wire agents together like a pipeline with scripts (orchestration frameworks), or let them talk to each other freely (swarms). Paperclip's differentiator is that it's a **hierarchy with a human sitting permanently as board chair**. Every conversation is tracked as a ticket ("Every conversation traced. Every decision explained.") and final authority always stays with the human. For a solo entrepreneur, it's the closest thing to "having an AI department that reports to me."

## Installation: One npx Line, Five-Minute Setup

There are exactly two requirements: **Node.js 20+ and pnpm 9.15+**. Ready? Then:

```bash
npx paperclipai onboard --yes
```

Here's what that one line does: (1) automatically creates an embedded PostgreSQL database (no separate DB install needed), (2) starts the API server at `http://localhost:3100`, and (3) opens the React dashboard. Everything runs on your own machine — no Paperclip account, no external server. If you'd rather build from source, clone it from GitHub:

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip && pnpm install && pnpm dev
```

Next comes incorporation. Via the CLI:

```bash
paperclipai company create --name "MyStartup" --goal "블로그를 성장시킨다"
```

Doing it through the dashboard GUI works the same. At this point you have an empty company — time to hire your employees (agents).

## Designing Your First Org: Start Minimal

You register agents from the Agents menu in the dashboard. There are four main things to decide at registration:

1. **Type** — which executor to attach: Claude Code, Codex, Cursor, OpenClaw, etc.
2. **Working directory** — the project folder this agent can read and write (e.g., your blog repo)
3. **Model** — assignable per agent. A manager role does not automatically deserve your top-tier model — a lesson I learned the expensive way (see Part 2)
4. **Instructions** — the agent's job description. Role, quality bar, how to report, and what not to do all go here

Once registration is done, governance kicks in. Say the editor-in-chief agent proposes "let's hire another reporter" — that hire halts in pending-approval status with the board (you) and shows up as an approval item on the dashboard. Externally visible actions like publishing or deploying can be gated behind the same approval checkpoint. Every ticket (issue) records which agent commented what and which decisions were made, so you can later trace "how did we end up here?" — exactly as the official line puts it: "Every conversation traced. Every decision explained." How you structure the org is, in practice, all there is to using Paperclip — and the one principle I took away from real operations (detailed in Part 2) is this: **don't imitate a human company; design backward from the work.**

Taking blog operations as an example, a minimal configuration looks like this:

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 260" width="100%" height="auto" role="img" aria-label="Minimal AI org chart for running a blog. A three-tier structure: the human (board) on top, an editor-in-chief agent below, and a reporter agent and a dev agent under that.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">Minimal org chart for a blog (1 human + 3 agents)</text>
  <rect x="240" y="40" width="160" height="40" fill="#C8102E" rx="6"/>
  <text x="320" y="65" fill="#FAF6EE" font-size="14" font-weight="bold" text-anchor="middle">Me (Board / Approvals)</text>
  <line x1="320" y1="80" x2="320" y2="110" stroke="#8A8378" stroke-width="2"/>
  <rect x="240" y="110" width="160" height="40" fill="#23201D" rx="6"/>
  <text x="320" y="135" fill="#FAF6EE" font-size="13" text-anchor="middle">Editor-in-Chief Agent</text>
  <line x1="320" y1="150" x2="180" y2="185" stroke="#8A8378" stroke-width="2"/>
  <line x1="320" y1="150" x2="460" y2="185" stroke="#8A8378" stroke-width="2"/>
  <rect x="100" y="185" width="160" height="40" fill="#E5DECF" rx="6"/>
  <text x="180" y="210" fill="#23201D" font-size="13" text-anchor="middle">Reporter Agent</text>
  <rect x="380" y="185" width="160" height="40" fill="#E5DECF" rx="6"/>
  <text x="460" y="210" fill="#23201D" font-size="13" text-anchor="middle">Dev (CTO) Agent</text>
  <text x="12" y="248" fill="#8A8378" font-size="11">* Content approval stays with the human. Editor delegates to the reporter; the dev agent only touches code and deploys.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">Permission boundaries matter more than titles — who can publish, and who can touch code.</figcaption>
</figure>

Two things I'll flag up front (full evidence in Part 2):

- **Ration your heartbeats.** A heartbeat is the clock-in schedule that wakes agents periodically, and the shorter you set it, the more exponentially tokens leak. Start with everything on wake-on-demand, and only enable heartbeats for agents that genuinely need round-the-clock monitoring.
- **Set budgets first.** Per-agent monthly budgets aren't an after-the-fact safeguard; they're a seatbelt you fasten in advance. Starting small and raising later is far cheaper than the other direction.

## How Is This Different from Hermes? It's a Different Layer

Agents like [Hermes](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) and Paperclip aren't competitors — they're **different layers of the stack**. If Hermes, Claude Code, and OpenClaw are the "individuals who do the work," Paperclip is the "organizational infrastructure" that binds them together. In fact, the agents you register in Paperclip are exactly these tools.

| | Agents (Hermes, etc.) | Paperclip |
|---|---|---|
| What it does | Performs actual work (coding, research, writing) | Assigns, tracks, budgets, approves |
| Analogy | Employee | Company (HR, finance, approval systems) |
| When you need it | Right now | When you have 3+ agents that need to collaborate |
| Model lock-in | Varies by model | Model-agnostic ("Model-Agnostic") |

Which makes the adoption path natural. First learn to run one agent well ([Hermes Part 1](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) and [Part 2](/en/blog/2026-06-29-hermes-agent-practical-use-cases/)), get a feel for the cost structure with local models ([Part 3](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)), and then, the moment your agent count outgrows your ability to manage it, layer Paperclip on top.

## So What: Agent Management Is the Next Bottleneck

If 2023 was the year of "AI can write" and 2024–25 was the year of "AI can work," the bottleneck has now clearly shifted to **"how do we manage the AIs that are working?"** Personal agents are already abundant. What's scarce is the management layer that binds them together, and Paperclip is an open-source attempt to build that layer using the most familiar institution we have: the company.

One caveat before you go — organizations aren't free. Just as human companies carry overhead, AI companies do too, and that overhead is billed in tokens. In the next installment, I open the books on actually founding an AI newspaper on top of this tool and running it for ten days: the incident where 300 million tokens evaporated in three days, the root cause of the bug that sent the same notification three times, and the question of whether a five-person AI company was overkill for a one-person blog.

---

**AI Agent Organization series**
- Part 1 — Paperclip intro: concepts, installation, first org design (this article)
- Part 2 — Paperclip in production: lessons from a month of running an AI newsroom (publishing tomorrow)

**Hermes AI series**: [Part 1: Installation](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) · [Part 2: Practical Use](/en/blog/2026-06-29-hermes-agent-practical-use-cases/) · [Part 3: LM Studio Integration](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)

**Sources**
- [Paperclip official site](https://paperclip.ing/) (intro copy, feature list, license)
- [Paperclip GitHub repository](https://github.com/paperclipai/paperclip) (install commands, requirements, supported agents)
- [Paperclip official docs](https://paperclipai-paperclip.mintlify.app/) (quickstart; heartbeat, budget, and governance concepts)
