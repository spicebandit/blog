---
title: "Run a Company Staffed by AI Employees — Paperclip Guide [Part 1]"
description: "Can you actually run a company staffed by AI employees? With open-source Paperclip you give AI agents titles, reporting lines, and budgets — from a one-line npx install to your first org chart."
pubDate: "2026-07-06T08:00:00+09:00"
updatedDate: "2026-07-06T18:30:00+09:00"
category: ai
tags: ["ai employees", "ai agent company", "paperclip", "multi-agent"]
lang: en
koSlug: 2026-07-05-paperclip-ai-agent-company-guide
---

A company that runs on AI employees — it sounds like science fiction, but you can actually build one today with open-source tools. Using one AI agent well and running several of them **as an organization** are two entirely different problems. The open-source tool **Paperclip** tackles the second one head-on — it treats your agents as "AI employees," gives them job titles and reporting lines, puts them on monthly budgets, and blocks them from changing strategy without sign-off. It is, quite literally, a platform for building **a company staffed by AI employees.** Installation is a single line, `npx paperclipai onboard --yes`, and since it's MIT-licensed open source, there's no account and no cost. If the [Hermes series](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) was about hiring a single agent, this two-part series is about founding a company with them. Part 1 (this article) covers the concepts, the installation, and — new in this update — **how day-to-day operations actually run, which agents and LLMs you can plug in, a full feature rundown, and the honest pros and cons.** [Part 2](/en/blog/2026-07-05-paperclip-ai-newsroom-operations/) covers the (expensive) lessons from actually running an AI newspaper on it for ten days.

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

## How the Day Actually Runs — From Goal to Approval

Once the org is set up, what does an actual day look like? Operations in Paperclip revolve around a **loop centered on issues (work tickets)** — the exact same way people file Jira or Asana tickets at a real company.

1. **Set a Goal.** You give the company a top-level goal like "double blog traffic this quarter." What sets Paperclip apart is that **every issue carries the goal's ancestry (goal ancestry) with it.** When an agent picks up a task, it doesn't just see the "title" — it also sees the context of *why*: which company goal this work descends from. This is the decisive difference from simply throwing a prompt at an individual agent.
2. **Create and assign issues.** You (or the editor-in-chief agent) create an issue like "write an article on topic X" and assign it to the responsible agent.
3. **The agent picks it up and executes.** This is where "waking" comes in, and there are two mechanisms.
   - **Heartbeat**: the agent wakes on a fixed cadence, checks its queue, and clears any backlog (regular clock-in).
   - **Wake-on-demand**: the agent wakes the moment an issue is assigned or it's called via `@mention`. Cross-team requests are automatically delegated to whichever agent is the best fit.
4. **Delegation and collaboration.** The editor hands off to a reporter, the reporter hands off again to a research agent — the issue flows through the org this way. Every comment and decision is logged on that issue.
5. **Governance.** Important decisions like publishing or hiring halt in a pending-approval state with the board (you). Nothing moves forward until I approve it on the dashboard.
6. **Cost tracking.** Throughout, the dashboard tallies token consumption per agent and per model in real time. "Who is spending how much" is always visible.

In other words, the operator only has to do three things: **create issues, hit the approval button, and watch the costs.** The agents handle the rest of the execution from their own seats.

![Team collaboration workflow](https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWFuYWdlbWVudCUyMHdvcmtmbG93JTIwb2ZmaWNlJTIwY29sbGFib3JhdGlvbnxlbnwxfDB8fHwxNzgzMjk1OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Annie Spratt](https://unsplash.com/@anniespratt?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/group-of-people-using-laptop-computer-QckxruozjRg?utm_source=spice-bandit-blog&utm_medium=referral)*

## Which Agents and LLMs Can You Plug In?

Paperclip's real power is that it's **agnostic about the agent executor (runner)**. In the official docs' own words: "Your agents could be OpenClaw bots, Python scripts, Node scripts, Claude Code sessions, Codex instances — we don't care." It's unopinionated about the kind of runner — if it can be invoked through an adapter, it's hired.

The runners you can attach fall into four broad categories:

- **Local CLI/session adapters**: Claude Code, Codex, Gemini, OpenCode, Pi, Cursor, and the like — register a coding/task AI CLI directly as an employee
- **Command execution**: processes like a shell command or a Python script (rule-based automation employees)
- **Webhook/API calls**: send requests to an agent hosted elsewhere
- **External adapter plugins**: wire up a self-hosted runtime directly

**What about the model (LLM)?** Paperclip is **model-agnostic** by design — it isn't tied to any particular model. Which model you use is decided in each runner's (adapter's) config — a Claude Code session pulls in a Claude-family model, a Gemini CLI pulls in Gemini, Codex pulls in an OpenAI-family model, and so on. That means **you can mix different models across agents within a single company.** You can build a "model portfolio" — a top-tier model for seats that require expensive judgment, a cheaper model for repetitive seats (the hands-on lessons of this optimization are the heart of [Part 2](/en/blog/2026-07-05-paperclip-ai-newsroom-operations/)). In the docs' phrasing, each employee is defined by an "Adapter type + config — how this agent runs and what defines its identity/behavior." In other words, **the adapter configuration *is* that employee's identity and behavioral definition.**

## The Full Feature Rundown — Budget, Governance, Routines, Audit Log

Here are the features we skimmed in the concept table earlier, re-framed around "what do they actually do for you."

| Feature | What it actually does | Why it matters |
|------|----------|------------|
| **Budget** | A monthly token budget per agent. Warning at 80%, **automatic stop at 100% (hard stop)**, plus a built-in circuit breaker that detects abnormal spending. The board can raise the limit | A "prepaid debit card" model — structurally blocks runaway costs |
| **Governance** | An approval gate for important decisions like hiring or strategy changes. Execution policies (review/approval steps), and pausing, resuming, or firing an agent | Control always stays with the human |
| **Routines** | Repetitive tasks run automatically via cron, webhook, or API triggers | Unattended regular reporting and regular checks |
| **Audit Log** | A complete record of every action and decision | Trace "how did we get here?" after the fact |
| **Multi-company** | Run multiple fully isolated companies from a single install | Separate organizations per project |

The one to watch especially is the **budget "hard stop."** The scariest scenario when first running autonomous agents is "it loops all night and racks up a bill bomb" — and Paperclip blocks this with a triple safeguard: 80% warning → 100% automatic stop → an abnormal-spend circuit breaker. It's the feature where the design philosophy of catching autonomy and safety at the same time is most visible.

## Pros and Cons — When to Use It, When It's Overkill

Before you decide to adopt it, look at the honest ledger.

| Pros | Cons |
|------|------|
| Open source (MIT), free, runs locally, no account needed | With few agents, the "company simulation" overhead is excessive |
| Budget hard stops and circuit breakers block runaway costs | Running the org itself eats tokens (heartbeats, reporting, retries) |
| Human approval on every decision plus a complete audit trail = you keep control | Good results ultimately hinge on good "instructions" (job description) design |
| Model- and runner-agnostic = mix different AIs per agent | A learning curve in the initial org, permission, and budget design |
| Goal ancestry and issue tracking mean the "why" is always visible | For one or two simple tasks, a single script is more efficient |

To sum up: the moment **three or more agents are collaborating and you need human control, auditability, and cost management** is where Paperclip earns its keep. Conversely, for a linear task like "auto-write one article," founding a whole company is overkill — and the real case study of that trade-off (the experience of a 5-to-7-person AI company being too much for a one-person blog) is exactly the story of [Part 2](/en/blog/2026-07-05-paperclip-ai-newsroom-operations/).

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
