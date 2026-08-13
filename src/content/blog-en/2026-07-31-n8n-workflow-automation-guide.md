---
title: "What Is n8n? Concept, How-To, and vs. Zapier & Make"
description: "A hands-on guide to n8n, the open-source workflow automation tool — its concept and how to use it — compared with Zapier and Make on price, features, and AI agents, plus which one to pick for your situation."
pubDate: 2026-07-31T17:20:03+09:00
category: ax
tags: ["n8n", "Workflow Automation", "No-Code", "AI Automation"]
lang: en
koSlug: 2026-07-31-n8n-workflow-automation-guide
---

You want to automate repetitive work, but Zapier is expensive and writing code feels like too much — this is exactly where **n8n** has become the tool everyone's talking about. In short, n8n is an **open-source workflow automation tool you can self-host**. It bills by "number of executions," so the more complex your automation, the far cheaper it is than Zapier — and in 2026 it's widely regarded as having the deepest AI-agent capabilities. The catch: it's the hardest to learn and has fewer prebuilt integrations.

This piece lays out what n8n is and how to use it, then **compares it with the two rival tools, Zapier and Make, on price, features, and AI capabilities**, and finishes with a recommendation for which to pick in which situation. If you're stuck less on "what to automate" than on "what to automate it with," this should help you decide.

![cogs and gears](https://images.unsplash.com/photo-1593062037896-764e9f52029e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhdXRvbWF0aW9uJTIwZ2VhcnMlMjB0ZWNobm9sb2d5JTIwc29mdHdhcmV8ZW58MXwwfHx8MTc4NTQ2MzE0OXww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Tim Mossholder](https://unsplash.com/@timmossholder?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/cogs-and-gears-GmvH5v9l3K4?utm_source=spice-bandit-blog&utm_medium=referral)*

## What Is n8n — Automation Wired Together With Nodes

Workflow automation went mainstream when **IFTTT** (If This Then That) in 2010 and **Zapier** in 2011 popularized the idea of "connecting app to app without code." But both were closed services running on someone else's cloud. In 2019, German developer Jan Oberhauser released n8n, adding a different option: **"open-source automation you can run on your own server"** — no-code convenience with a developer's control.

n8n is a **workflow automation platform** that connects apps and services to handle repetitive tasks automatically. At its core is a "node"-based editor. You drop boxes (nodes) representing "triggers" (start conditions) and "actions" (things to do) onto a canvas and connect them with lines to form an automation flow (a workflow). For example — *when a new email arrives → save the attachment to Google Drive → send a Slack notification.*

Up to here, it's similar to Zapier and Make. Three things make n8n special:

- **Open-source and self-hostable**: alone among the big three, its source is public and you can install it on your own server. Data never leaves for an external cloud, which suits regulated fields like healthcare and finance, or any security-conscious team.
- **Per-execution billing**: one full run of a workflow, start to finish, counts as "one execution." Whether it's 20 steps or 2, one run is one run (more on this below).
- **Deep AI-agent features**: n8n 2.0, released in January 2026, integrates LangChain natively and adds around 70 AI nodes. It supports Tool Nodes, persistent memory across executions, vector-DB integration for RAG, and human-in-the-loop patterns ([DoiT](https://doit.software/blog/n8n-vs-make-vs-zapier), [Cipher Projects](https://www.cipherprojects.com/blog/posts/n8n-vs-zapier-vs-make-automation-comparison/)).

In short, n8n sits at the meeting point of "no-code convenience" and "developer freedom."

## How to Use n8n — Three Ways to Start

There are three main ways to run n8n. Pick based on your goal and technical level.

| Method | Description | Cost | Best for |
|--------|-------------|------|----------|
| n8n Cloud | Official hosting; use it with no setup | Paid (€24/mo+) | Those who'd rather not manage a server |
| Self-hosted (VPS/Docker) | Install on your own server | Just server cost ($3–7/mo) | Teams/individuals with dev skills |
| Local install | Install on your PC to test | Free | Learning/experimentation |

*Source: n8n official pricing/deployment docs and media aggregates (2026).*

The most popular setup is **self-hosting**. Since the software itself is free, a single VPS (virtual server) for a few dollars a month lets you run it with no execution limits. The typical workflow looks like this:

1. Install n8n via Docker on a VPS or PC.
2. Open the editor in your browser and create a "new workflow."
3. Place a trigger node (e.g., webhook, schedule, a specific app event).
4. Chain action nodes (e.g., write to Google Sheets, send email, HTTP request, AI node).
5. Confirm with a "test run," and if all's well, activate it.

![A person creates a flowchart diagram with red pen on a whiteboard](https://images.pexels.com/photos/1181311/pexels-photo-1181311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Christina Morillo](https://www.pexels.com/@divinetechygirl) on [Pexels](https://www.pexels.com/photo/white-dry-erase-board-with-red-diagram-1181311/)*

The key nodes are the "HTTP Request" node and the "Code" node. Even for a service with no prebuilt integration, if it has an API you can call it directly via the HTTP node, and you can drop JavaScript or Python into the Code node to write whatever logic you want. This extensibility is n8n's real weapon.

## n8n vs. Zapier vs. Make — A Three-Way Comparison

Even for the same automation, the three tools aim at different things. The table below compresses the core differences.

| Item | n8n | Zapier | Make |
|------|-----|--------|------|
| Character | Open-source, developer-oriented | Most apps, dead simple | Visual, value-for-money |
| Integrations | Relatively few | 8,000+ (most) | 3,000+ |
| Billing | Per execution (workflow) | Per task (action) | Per operation |
| Starting price | €24/mo+ (self-host effectively free) | $19.99/mo+ (annual billing) | $12/mo+ (annual, credit-based) |
| Self-hosting | ✅ Yes (only one) | ❌ | ❌ |
| AI agents | Deepest (LangChain, 70+ AI nodes) | Agents product | Maia, agents (beta) |
| Learning curve | High | Low (easiest) | Medium |

*Source: aggregated 2026 comparisons from DoiT, Cipher Projects, Intuz, etc.*

The most important difference is **billing model**. Zapier counts each individual action in a workflow as a task. A 10-step automation run 1,000 times a month burns 10,000 tasks. n8n, by contrast, counts "one run of a workflow" as one execution — whether it's 10 steps or 2. So **for a multi-step workflow run 10,000 times a month, n8n can cut costs by up to 80–90% versus Zapier** ([Cipher Projects](https://www.cipherprojects.com/blog/posts/n8n-vs-zapier-automation-tool-comparison/)). The more complex and high-volume the automation, the wider this gap.

<figure style="background:#F6F7F9;border:1px solid #E4E7EC;border-radius:8px;padding:16px;margin:20px 0">
<svg viewBox="0 0 420 180" width="100%" height="auto" role="img" aria-label="For a multi-step workflow run 10,000 times a month, Zapier's per-task billing is costly while n8n's per-execution billing is 80-90 percent cheaper">
  <text x="20" y="18" fill="#23201D" font-size="12" font-weight="bold">Cost for multi-step × 10K runs/mo (lower = better)</text>
  <line x1="20" y1="150" x2="400" y2="150" stroke="#8A8378" stroke-width="1"/>
  <rect x="70" y="40" width="80" height="110" fill="#8A8378"/>
  <text x="76" y="34" fill="#23201D" font-size="12" font-weight="bold">Zapier (per task)</text>
  <text x="90" y="166" fill="#8A8378" font-size="11">baseline 100%</text>
  <rect x="270" y="128" width="80" height="22" fill="#C8102E"/>
  <text x="268" y="122" fill="#C8102E" font-size="12" font-weight="bold">n8n (per exec) ~10-20%</text>
  <text x="278" y="166" fill="#8A8378" font-size="11">80-90%↓</text>
</svg>
<figcaption style="color:#8A8378;font-size:13px;margin-top:8px">The more complex and high-volume the automation, the cheaper per-execution billing (n8n) is than per-task billing (Zapier). Source: media comparisons (2026).</figcaption>
</figure>

Conversely, Zapier's strength is **its overwhelming app count and ease**. You can connect 8,000-plus apps with a few clicks and build your first automation in five minutes with zero dev knowledge. Make sits in between — originally launched in 2016 in Prague as Integromat and rebranded to Make in 2022, it lets you build moderately complex flows visually while staying cheap, occupying the "value-for-money middle ground."

## Building AI Agents With n8n — A Practical Example

The reason n8n draws special attention in 2026 is that **you can weave AI agents naturally into workflows**. Thanks to n8n 2.0's LangChain integration, you can build flows that go beyond simple "connection" to "the AI judging and picking its own tools." Here's a concrete example.

**Example — an auto-triage/response agent for customer inquiries**

1. **Trigger**: an inquiry email arrives (IMAP/webhook node).
2. **AI node**: an LLM reads the inquiry and classifies it as "refund / tech support / general."
3. **Branch (Switch node)**: the path splits based on the classification.
4. **Tool use**: for tech support, it searches a vector DB (RAG) for the relevant manual and drafts a reply; for a refund, it calls the payment system's API to check status.
5. **Human-in-the-loop**: the draft goes to Slack, and once a staffer "approves," it's sent automatically.

The heart of this flow is steps 3–4. The AI decides "what to do" on its own and picks the tools it needs (search, API). Zapier and Make can bolt on AI too, but for building an agent that **combines multiple tools and maintains memory across executions**, n8n's freedom is considered ahead. And if you self-host it, the customer data flowing through this process never leaves your servers — you only pay for the LLM API calls.

This is exactly why teams seriously weighing "AI automation" look at n8n first: it lets you weave repetitive-task connection (automation) and intelligent judgment (AI agents) on one canvas.

## The Limits of n8n — It's Not All Rosy

Of course, n8n isn't a silver bullet. There are three real walls. First, **the learning curve is steep.** It takes time to get comfortable with nodes, expressions, and JSON data flow — a different barrier from Zapier's few clicks. Second, **self-hosting carries operational burden.** You handle server install, updates, backups, and security yourself. It's "free," but you pay in maintenance labor. Third, **there are relatively few prebuilt integrations.** Compared with Zapier's 8,000 and Make's 3,000, it has fewer one-click apps, so for anything missing you wire it up yourself via the HTTP node — freedom and burden at once.

In short, n8n gives you "technical control" in exchange for giving up some "convenience." Whether you can shoulder that trade-off is the fork in the road.

## So Which Should You Use — Situational Recommendations

There's no single answer; it depends on your situation. Three questions sort it out.

**① I have almost no dev knowledge → Zapier**
If you want to simply connect widely used SaaS (Gmail, Slack, Notion, Google Sheets, etc.), Zapier is the answer. It's the easiest, and there's almost nothing it can't integrate. Just note that as your automations grow more numerous and complex, the bill climbs fast.

**② I want to build visually but keep costs down → Make**
If you want to draw moderately complex flows (branching, loops) by eye but pay less than Zapier, Make is the balance point. It's popular for small- to mid-scale marketing and operations automation.

**③ I have dev knowledge and need volume, complexity, and security → n8n**
If you're a technical team, run high volumes, must keep data in-house, or want to attach AI agents deeply, evaluate n8n (especially self-hosted) first. It takes time to learn, but in return you get **cost savings, data sovereignty, and unlimited extensibility.**

In one line: **if ease is the top priority, Zapier; if value-for-money balance, Make; if freedom, volume, and AI are the point, n8n.** Especially in today's rush to attach AI agents to work, n8n's appeal — native LangChain support and self-hosting that lets you control even API costs — is growing fast.

## So What — the Essence of Choosing an Automation Tool

Zoom out, and work automation has been stacking a new layer each generation. From **Excel macros** (an individual recording repetitive tasks) to **RPA** (mimicking the screen to do enterprise work), then to **no-code automation** (connecting app to app by logic, like IFTTT and Zapier) — and now it's crossing into a fourth layer, **AI agents** (judging for themselves and picking tools). n8n draws attention because, at this final transition, it was the first to naturally lay an "AI-judging layer" on top of the "no-code connecting canvas."

n8n's rise isn't merely the arrival of a "cheap Zapier." Behind it are two big currents. First, **the age of AI agents**: demand is exploding for workflows where "the AI uses tools and works on its own," beyond just connecting repetitive tasks, and n8n responded most openly. Second, **data sovereignty**: as more companies balk at handing sensitive data to an external cloud, the value of "running it on my own server" self-hosting has been re-appraised.

In the end, choosing an automation tool isn't about "which is best" but "which fits my situation." For a non-developer's quick connections there's Zapier, for value-for-money balance there's Make, and for technical users who want freedom, cost, and AI all at once there's n8n. What matters isn't the tool but the question: **what will you automate to win back your time?** The tool is merely the means to act on that answer.

---

### Sources
- "n8n vs Make vs Zapier: Side-by-Side Comparison [2026]," DoiT, [doit.software](https://doit.software/blog/n8n-vs-make-vs-zapier)
- "n8n vs Zapier vs Make 2026: Pricing, Features & Which to Choose," Cipher Projects, [cipherprojects.com](https://www.cipherprojects.com/blog/posts/n8n-vs-zapier-vs-make-automation-comparison/)
- "Make vs n8n vs Zapier — Detailed Guide [2026]," Intuz, [intuz.com](https://www.intuz.com/blog/make-vs-n8n-vs-zapier-detailed-comparison/)
