---
title: "Two Ways to Wire Claude Code into Paperclip — The MCP Connection [Part 3]"
description: "Paperclip opened up MCP connections in October 2026. The existing Process Adapter runs Claude Code as an employee; the new Assistant Connection has Claude Code join your team as a logged-in user — the opposite direction. Here is what separates the two, and what each one requires."
pubDate: 2026-10-17T07:18:23+09:00
category: ax
tags: ["Paperclip", "Claude Code", "MCP", "AI agent company"]
lang: en
koSlug: 2026-10-15-paperclip-claude-code-mcp-connection
---

Since [Part 1](/en/blog/2026-07-05-paperclip-ai-agent-company-guide/) and [Part 2](/en/blog/2026-07-09-paperclip-ai-agent-company-how-to/) went out in July, Paperclip has shipped **twelve releases** (patches included — nine if you count only feature releases). The most structural of them is the **"Assistant Connection (MCP)"** in the October 12, 2026 release. In one line: **Claude Code can now log into Paperclip as a user and act like a member of the team.**

This is where people get confused. Paperclip could **already** connect to Claude Code. But that connection runs **the other way around**. Telling those two directions apart is the whole point of this article.

> ⚠️ **Up front:** this is **not a write-up of an installation I ran myself.** It is assembled from Paperclip's official documentation and GitHub release notes, and every screen, config key, and step below is quoted from primary sources. Where something may differ from the live product, I say so in the text.

**The three questions that need answering first**

| Question | Answer |
|---|---|
| **What's new?** | An **"Assistant Connection (MCP)"** card under Connections. Claude Code, Codex, OpenCode, and generic MCP clients can connect via **browser OAuth or device-code consent** and act **as the logged-in user** |
| **How is that different from before?** | The direction is reversed. The old path (Process Adapter) has **Paperclip spawn Claude Code as a child process**; the new one has **Claude Code connect to Paperclip** |
| **Can I use it today?** | It is still **experimental**. You have to enable `Settings → Experimental → "Assistant connections (MCP)"`, and it requires an **HTTPS `PAPERCLIP_PUBLIC_URL`** |

![A team in a meeting room](https://images.pexels.com/photos/7869111/pexels-photo-7869111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Pavel Danilyuk](https://www.pexels.com/@pavel-danilyuk) on [Pexels](https://www.pexels.com/photo/colleagues-in-meeting-at-office-7869111/)*

## Two Directions — Who Is Hiring Whom

Answer first: **with the Process Adapter, Paperclip is the boss; with the MCP connection, Claude Code is a colleague.**

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 330" style="width:100%;height:auto" role="img" aria-label="A diagram comparing the two directions for connecting Paperclip and Claude Code. On top, the Process Adapter has Paperclip spawn Claude Code as a child process and assign it work like an employee. On the bottom, the Assistant Connection has Claude Code connect into Paperclip over MCP as a logged-in user, reading, creating, and delegating tasks.">
<text x="0" y="18" font-size="15" font-weight="700" fill="#23201D">Same two tools, opposite directions — which way the arrow points is the whole story</text>
<!-- existing path -->
<text x="0" y="48" font-size="12.5" font-weight="700" fill="#4E7FA8">Existing — Process Adapter (adapterType: claude_local)</text>
<rect x="0" y="58" width="190" height="62" fill="#4E7FA8" rx="4" />
<text x="16" y="84" font-size="13" font-weight="700" fill="#FAF6EE">Paperclip</text>
<text x="16" y="104" font-size="11" fill="#E5DECF">The boss — assigns work</text>
<line x1="190" y1="89" x2="320" y2="89" stroke="#4E7FA8" stroke-width="2.5" />
<path d="M320 89 L310 84 L310 94 Z" fill="#4E7FA8" />
<text x="200" y="80" font-size="11" fill="#8A8378">spawned as a child process</text>
<text x="200" y="106" font-size="11" fill="#8A8378">(same machine)</text>
<rect x="320" y="58" width="190" height="62" fill="#A8BDD2" rx="4" />
<text x="336" y="84" font-size="13" font-weight="700" fill="#23201D">Claude Code</text>
<text x="336" y="104" font-size="11" fill="#23201D">The employee — receives work</text>
<text x="528" y="80" font-size="11" fill="#8A8378">work comes down from above</text>
<text x="528" y="106" font-size="11" fill="#8A8378">driven by the heartbeat</text>
<!-- divider -->
<line x1="0" y1="146" x2="760" y2="146" stroke="#E5DECF" stroke-width="1" />
<!-- new path -->
<text x="0" y="178" font-size="12.5" font-weight="700" fill="#1B4F8A">New (2026-10-12) — Assistant Connection (MCP)</text>
<rect x="0" y="188" width="190" height="62" fill="#A8BDD2" rx="4" />
<text x="16" y="214" font-size="13" font-weight="700" fill="#23201D">Paperclip</text>
<text x="16" y="234" font-size="11" fill="#23201D">The workplace — connected to</text>
<line x1="320" y1="219" x2="190" y2="219" stroke="#1B4F8A" stroke-width="2.5" />
<path d="M190 219 L200 214 L200 224 Z" fill="#1B4F8A" />
<text x="200" y="210" font-size="11" fill="#8A8378">connects via OAuth / device code</text>
<text x="200" y="236" font-size="11" fill="#8A8378">(as a logged-in user)</text>
<rect x="320" y="188" width="190" height="62" fill="#1B4F8A" rx="4" />
<text x="336" y="214" font-size="13" font-weight="700" fill="#FAF6EE">Claude Code</text>
<text x="336" y="234" font-size="11" fill="#E5DECF">The colleague — creates and delegates</text>
<text x="528" y="210" font-size="11" fill="#8A8378">the Claude Code you already use</text>
<text x="528" y="236" font-size="11" fill="#8A8378">reaches into the company's work</text>
<text x="0" y="288" font-size="12" fill="#8A8378">※ The two are not mutually exclusive. You can run agents as employees and connect your own Claude Code at the same time.</text>
<text x="0" y="310" font-size="12" fill="#8A8378">※ The MCP side still sits behind an Experimental flag.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">The same two names appear in both rows, but the roles swap. In the old path Claude Code is the employee taking orders; in the new one it is the side creating and delegating tasks. Sources: Paperclip official documentation and the v2026.1012.0 release notes (checked 2026-10-15).</figcaption>
</figure>

Why does the distinction matter? **The "company of AI employees" from Part 2 is the top row** — you define agents, run them on a heartbeat, and keep them in check with budgets. What is new is the **bottom row**: a path for the Claude Code you use every day to reach directly into that company's work system.

## The Existing Path — Running Claude Code as an "Employee" via the Process Adapter

Answer first: set **`adapterType: "claude_local"`** and Paperclip spawns your local `claude` CLI as a child process. The official docs describe it as running "Anthropic's Claude CLI, including session support and skill integration."

The config keys look like this.

| Config key | What it does |
|---|---|
| `adapterType` | `claude_local` — the adapter for Claude Code |
| `command` | The command to run (`claude`) |
| `cwd` | Working directory. **Participates in the session-resume condition** |
| `instructionsFilePath` | Whatever is in this file is **prepended to every prompt** |
| `model` / `effort` | Model and thinking effort |
| `maxTurnsPerRun` | Maximum turns allowed in a single run |
| `promptTemplate` | Supports `{{agent.name}}`, `{{agent.id}}`, `{{context.*}}` substitution |
| `env` | Environment variables (API keys, etc.) |
| `timeoutSec` / `graceSec` | Run time limit, and the grace period after SIGTERM |
| `dangerouslySkipPermissions` | **Skips permission prompts.** The documented example is `false`. It is tempting to flip for autonomous runs, but it means the agent executes files and commands without human approval — consider it only inside an isolated environment |

**Four constraints worth knowing** (per the official docs)

1. **The timeout defaults to 900 seconds.** Past that it sends SIGTERM, then SIGKILL after the grace period. Long jobs need this raised
2. **Exceeding `maxTurnsPerRun` resets the session**
3. **Session resume is conditional** — it continues only when the agent has a stored `sessionId` **and `cwd` matches the saved working directory.** Change the work folder and the context does not carry over
4. **It assumes a single machine.** The docs say the Process Adapter is "suitable for development" and point to the **HTTP adapter** for distributed execution

One thing to watch here: **the official docs trail the releases.** The docs list Claude Opus 4.6, Sonnet 4.5 (recommended), and Haiku 4.5, while the October 12 release notes say **Claude Code agents can select Claude Sonnet 5.5 at Low through Max effort.**

That does not mean "just copy the release notes into your config," though. **The release notes give display names only — they do not publish the model ID strings you put in the config.** So the safer move is to read the `model` value **off the model menu in the product UI.** Two more things to keep in mind:

- **The allowed `effort` values differ.** The Process Adapter config in the docs gives `low`, `medium`, and `high` as examples. Whether the "Max effort" from the release notes maps straight onto a Process Adapter config value **I could not confirm**
- **There is a sandbox image rebuild condition.** From the release notes: "**Custom sandbox images built with a Claude Code version older than 2.1.284 must be rebuilt before Sonnet 5.5 works on the CLI path.**" The same release bumped the harness pin to Claude Code 2.1.286

## The New Path — Joining the Team via Assistant Connection (MCP)

Answer first: Claude Code connects through the **"Assistant Connection (MCP)" card under Connections.** Here is the release note verbatim:

> A new "Assistant Connection (MCP)" card in Connections lets Claude Code, Codex, OpenCode, and generic MCP clients connect to Paperclip through browser OAuth or device-code consent and **act as the logged-in user**.

**What a connected Claude Code can do**

| What it can do | What that means |
|---|---|
| **Read and search** tasks | Look up what work is moving through the company |
| **Create and delegate** work | Create a task and hand it to another agent |
| Leave **human comments** | Comments as a person, not as an agent |
| **Read documents and artifacts** | Access the output agents produced |
| Track results via **signed event webhooks** | Follow whether the work finished |

Controls ship alongside it — **write-scope restriction** (pin it to read-only) and **single-company pinning** (limit access to one company) are both options. Since the structure lends out your logged-in user's privileges wholesale, those two are the ones to turn on before you start.

**How to enable it (per the official release notes)**

1. Enable `Settings → Experimental → "Assistant connections (MCP)"` — still **experimental** (config key `enablePublicMcp`). The release notes state that this switch "exposes a public MCP endpoint and requires `PAPERCLIP_PUBLIC_URL` to be an HTTPS origin"
2. Set an **HTTPS `PAPERCLIP_PUBLIC_URL`** — OAuth redirects mean an HTTP localhost will not do
3. Connect your client from the **Assistant Connection (MCP)** card under Connections (browser OAuth or device code)
4. Local stdio clients use the **`paperclip mcp` CLI bridge** together with device login

Step 2 is the real gate. If you are running locally the way Part 2 described — `npx` to start it, localhost to reach it — you have to **arrange a public HTTPS URL first.**

**One thing is easy to mix up here.** The August 24 release added Tailscale-based HTTPS exposure (`PAPERCLIP_MANAGED_RUNTIME_HTTPS`), but **that is a different layer.** The release notes are explicit about the target: it exposes the "managed **worktree runtime**" over `tailscale_https`, and the problem it solves is "not being able to view **an agent's branch preview** from your phone or another computer." In other words it is for previewing agent output, and it has nothing to do with the `PAPERCLIP_PUBLIC_URL` that MCP requires (the HTTPS origin of Paperclip itself).

**Putting it behind a TLS-terminating platform** (Railway, Render, Fly, and so on), which the same release mentions, looks like the more direct route to a public HTTPS origin. That part, though, **I could not verify** — this is not the result of standing one up.

![Automation machinery in a factory](https://images.unsplash.com/photo-1647427060118-4911c9821b82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGF1dG9tYXRpb24lMjBtYWNoaW5lcnl8ZW58MXwwfHx8MTc5MjA1MDQyN3ww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Simon Kadula](https://unsplash.com/@simonkadula?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-factory-filled-with-lots-of-orange-machines-8gr6bObQLOI?utm_source=spice-bandit-blog&utm_medium=referral)*

## So Which One Do You Pick

Answer first: **Process Adapter if you want work to run itself; MCP if you want to drive the company yourself.**

| Goal | Pick | Why |
|---|---|---|
| **Work that runs overnight** without a human | **Process Adapter** | You need an "employee" that fires on a heartbeat. The MCP connection appears to operate while your client is connected (the sources do not state this explicitly) |
| **Querying and directing company work** from the Claude Code you use | **Assistant Connection (MCP)** | Searching, creating, and delegating tasks happens right in your session |
| **Distributed execution** across remote or multiple machines | **HTTP adapter** | The official docs state the Process Adapter is single-machine and development-oriented |
| **Pulling output into your own pipeline** | **MCP + event webhooks** | Reading documents and artifacts and tracking signed webhooks live on the same path |
| **Minimum privileges, experiments only** | **MCP (read-only + single-company pin)** | Those two options narrow the scope |

They are not mutually exclusive. **Leaving your employee agents running and attaching your own Claude Code on top as a colleague** is, in practice, the most natural picture.

## What Changed Since Part 2 — For Readers Who Followed Along

Answer first: **the default UI changed.** The screens described in Part 2 no longer match what you will see.

| Change | When | What a Part 2 reader should know |
|---|---|---|
| **Chat-style tasks became the default** | 8/24 | **The issue-style screen from Part 2 (page header + comment thread + Properties sidebar) has been demoted to an option.** The `enableClassicTaskInterface` setting brings it back, but chat-only features do not work there |
| **Decisions — a propose/decide workflow** | 8/17 | Decision-making became a first-class feature. Worth revisiting your approval flow |
| **Import/Export replaced Cloud Sync** | 8/17 | The way you move company data changed |
| **Release channels split** | 8/17 | canary → nightly → beta → stable. Pin a channel if you want stability |
| **AI credentials moved into Connections** | 9/16 | Key management is no longer where Part 2's environment-variable approach put it |
| **GitHub access went from "shared token" to "identity"** | 9/16 | It is no longer a single token passed around |
| **Dedicated agent email** (AgentMail) | 9/16 | Agents get their own mail addresses |
| **Agents review PRs** (scheduled bot) | 10/1 | You can put an agent on code review permanently |
| **Skill sync with GitHub** | 10/5 | Your skill library syncs from a repository |
| **Two-way Slack** | 10/5 | Not just notifications — traffic flows both ways |

Of these, **the first row is what trips up readers following Part 2** the most. The article's logic still holds, but the default screen moved, so the description and what is in front of you no longer line up.

## Prerequisites and Pitfalls

Things to check before you actually wire this up.

1. **It is experimental.** You have to enable it under `Settings → Experimental`, and experimental specs change. Safer to try it in a separate company before dropping it into real operations
2. **A public HTTPS URL is mandatory.** On a local localhost setup, this is the step that takes the longest
3. **The privileges are those of the logged-in user.** The connected assistant acts as "you," so turn on **read-only restriction and single-company pinning first**, then widen the scope
4. **The official docs trail the releases.** As of the date checked (2026-10-15), the hosted docs index has **no MCP-specific page**, and the model list is out of date. **The GitHub release notes are more current**
5. **Screens that are not in the docs can move.** The steps here follow the release-note descriptions, so the actual card placement and wording may vary by version

## So What — The Reversal of Roles Is the Point

Paperclip's original picture was **"I manage a company staffed by AI employees."** That was Parts 1 and 2. What the MCP connection adds is not one more feature but **an inversion of the relationship.** Now **the coding agent I use has direct access to that company's work system.**

Why does that matter in practice? Until now, the weak spot of the "AI agent company" was that **it sat apart from my day-to-day work.** The company ran on its own, I worked separately in my terminal, and the thing joining them was a human hand. The MCP connection **erases that hand** — my Claude Code reads the company's tasks, creates them, delegates them, and pulls back the output.

So the order I would recommend is this:

1. Connect with **read-only plus a single-company pin** first, and let your Claude Code only **query** the company's state
2. Once querying proves useful, open up writes and widen to **creating and delegating tasks**
3. Keep overnight work with the **Process Adapter employees**, and use MCP as **the console you command from**

**Mixing the two directions is the destination; trying to replace one with the other is reading the design wrong.** One is autonomous execution, the other is the console you drive.

---

**Related reading**
- [Building a Company Staffed by AI Employees — A Paperclip Primer [Part 1]](/en/blog/2026-07-05-paperclip-ai-agent-company-guide/)
- [Paperclip Hands-On — From Setup to Running an AI-Staffed Company [Part 2]](/en/blog/2026-07-09-paperclip-ai-agent-company-how-to/)

**Sources**
- [Paperclip v2026.1012.0 release notes](https://github.com/paperclipai/paperclip/releases/tag/v2026.1012.0) — Assistant Connection (MCP): connection methods, privileges, prerequisites, model support
- [Paperclip release list](https://github.com/paperclipai/paperclip/releases) — change history since July (chat-style default, Decisions, Connections rework, and more)
- [Process Adapter documentation](https://mintlify.wiki/paperclipai/paperclip/agents/process-adapter.md) — `claude_local` config keys and constraints (timeout, turn limit, session resume, single machine)
- [Agent Integration documentation](https://mintlify.wiki/paperclipai/paperclip/agents/overview.md) — the adapter system
- [Paperclip documentation index](https://mintlify.com/paperclipai/paperclip/llms.txt) — the basis for saying there was no MCP-specific page at the time of checking
- [Paperclip GitHub repository](https://github.com/paperclipai/paperclip)

*※ This article is based on official documentation and release notes as of October 15, 2026, not on a hands-on installation. Because the feature is experimental, screens and specs may change — re-check the release notes before you apply any of this.*
