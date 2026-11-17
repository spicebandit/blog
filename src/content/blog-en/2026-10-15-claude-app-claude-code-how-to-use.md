---
title: "How to Use Claude Code Without a Terminal (Desktop App)"
description: "A step-by-step guide to using Claude Code from the Claude desktop app — no terminal, no CLI, no Node.js. Covers the Code tab, picking a folder, your first prompt, reviewing changes, and which permission mode to start in."
pubDate: 2026-10-15T16:44:34+09:00
category: ax
tags: ["Claude Code", "Claude desktop app", "AI coding", "how-to"]
lang: en
koSlug: 2026-10-15-claude-app-claude-code-how-to-use
---

This one is for anyone who wants to try Claude Code but doesn't know their way around a terminal. Here's the short version: **you don't need one.** Claude Code already ships inside the Claude desktop app, and **you don't have to install the CLI or Node.js separately.** Install the app, click the **Code** tab, and you're in. The five steps below are all there is to it.

**First, the three things people get stuck on:**

| Question | Answer |
|---|---|
| **Do I need to install a terminal or the CLI?** | **No.** Claude Code is bundled with the desktop app, so there's no Node.js and no CLI to install |
| **Can I use it for free?** | **No.** You need a **paid Pro, Max, Team, or Enterprise subscription**. If clicking the Code tab shows an upgrade prompt, you don't have one yet |
| **There are three tabs — which one?** | The **Code** tab. Chat has no file access, and Cowork is a background agent that works on its own |

![Laptop and coffee](https://images.unsplash.com/photo-1482745637430-91c0bbcea3e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBzY3JlZW4lMjBjb2RlJTIwZWRpdG9yJTIwZGVza3xlbnwxfDB8fHwxNzkyMDQ5NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Artem Sapegin](https://unsplash.com/@sapegin?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/macbook-pro-beside-brown-mug-DErxVSSQNdM?utm_source=spice-bandit-blog&utm_medium=referral)*

## Before you start — you need exactly two things

Short answer: **a paid subscription and a folder to work in.**

| What you need | How to check |
|---|---|
| **Paid subscription** | Pro, Max, Team, or Enterprise. If the Code tab shows an upgrade prompt, you don't have one yet |
| **The desktop app** | macOS (one universal build for Intel and Apple Silicon), Windows (separate x64 and ARM64 installers), Linux (apt or .deb for Ubuntu and Debian, **beta**) |
| ~~Node.js or the CLI~~ | **Not needed.** The app includes Claude Code |
| **A project folder** | One project folder on your own machine. If this is your first time, **pick a small project you know well** — it's the fastest path |

That last row matters more than it looks. The official docs make the same recommendation: start with a small project you know well. If you start in a folder whose code you don't understand, you have no way to judge what Claude changed — which means you can't review the result.

## Step 1 — Install the app and sign in

Short answer: **download the installer for your OS, run it, open the app, and sign in with your Anthropic account.**

1. Grab the installer for your operating system from the download links in the official docs (macOS has a single build for both Intel and Apple Silicon; on Windows, **x64 and ARM64 are different files**)
2. Install it, then launch it — Applications on macOS, the Start menu on Windows, your app launcher on Linux
3. **Sign in with your Anthropic account**

Linux (Ubuntu and Debian) is still **beta** and installs via apt. If you're on a Windows ARM64 machine — a Snapdragon-class laptop, say — grabbing the x64 installer will cause problems, so check which one you have first.

## Step 2 — Open the Code tab (and what the three tabs do)

Short answer: the **Code tab, at the top center of the app.** This is where people get lost, because the app has three tabs, all of them "Claude," and they do different things.

| Tab | What it does | Does it touch my files? |
|---|---|---|
| **Chat** | Regular conversation, much like claude.ai | **No — no file access** |
| **Cowork** | A background agent that **works on its own** while you do something else | Yes (autonomously) |
| **Code** | **Interactive coding.** Direct access to your local files; depending on the permission mode, it either asks before changing them or lets you review afterward | **Yes (this article's subject)** |

When someone says "I asked Claude to fix my code and nothing happened to my files," they almost always **asked in the Chat tab**. Chat can't see files by design.

**Three things that can happen when you click Code**

- **An upgrade prompt** → you don't have a paid subscription. Subscribe and try again
- **A prompt to sign in online** → finish signing in, then **restart the app**
- **A 403 error** → that's an auth problem; see the authentication troubleshooting section of the official docs

## Step 3 — Choose where to run and which folder to use

Short answer: if this is your first time, pick **Local** and use **Select folder** to point at your project directory.

The Code tab can run in four places. Realistically, beginners only need the first row.

| Option | Where it runs | When to use it |
|---|---|---|
| **Local** | **Your machine, your files, directly** | **Start here.** Simplest, and the easiest to verify with your own eyes |
| **Cloud** | In the cloud — **keeps going after you close the app** | Long tasks you want to kick off and check on later |
| **SSH** | A remote machine: your own server, a cloud VM, a dev container | When the work lives somewhere else. On first connect, it installs Claude Code on the remote machine for you |
| **WSL** (Windows) | Inside a WSL 2 distribution — Claude Code, tools, and git all run on the Linux side with native paths | Developing in a Linux environment from Windows |

Then **pick a model from the dropdown next to the send button.** You can change it later from the same dropdown, so leaving it on the default for your first run is fine.

## Step 4 — Give it your first instruction

Short answer: **write it the way you'd say it out loud.** These are the three first tasks the official docs suggest:

- `Find a TODO comment and fix it`
- `Add tests for the main function`
- `Create a CLAUDE.md with instructions for this codebase`

The third one is especially useful early on. **CLAUDE.md** is a markdown file you keep at the project root, and Claude Code **reads it at the start of every session**. Put your coding conventions, architecture decisions, and preferred libraries in it and you stop re-explaining them. The fastest way to get one is to ask Claude to write it.

A conversation you start this way is called a **session**. Each session tracks its own context and its own set of changes.

![Woman in white long sleeves using a laptop](https://images.pexels.com/photos/9159651/pexels-photo-9159651.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Mikhail Nilov](https://www.pexels.com/@mikhail-nilov) on [Pexels](https://www.pexels.com/photo/woman-in-white-long-sleeves-using-a-laptop-9159651/)*

## Step 5 — Review and accept the changes (the step that matters most)

Short answer: **what happens next depends entirely on the permission mode shown next to the send button.** Skip this step and you end up asking either "why did my files already change?" or "why did nothing change?"

- **Auto or Accept edits** — Claude **edits the files first**, and an indicator like `+12 -1` appears for you to click and inspect as a diff. Note that Accept edits only auto-approves **file edits and basic filesystem commands like `mkdir`, `touch`, and `mv`** — it still asks before running other terminal commands
- **Manual** — Claude **proposes each change and waits for your approval.** **Nothing is written until you accept.** If you decline, Claude asks how you'd like to proceed

In Manual mode you see three things:

1. A diff showing **exactly what will change** in each file
2. **Accept and Reject buttons** per change
3. Real-time updates as Claude works

### Permission modes — trading control for autonomy

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 760 290" style="width:100%;height:auto" role="img" aria-label="The main permission modes in the Claude Code desktop app, arranged by how much control you keep. Plan reads and explores without editing source. Manual asks before every edit and command. Accept edits auto-approves file edits and basic filesystem commands but still asks about other terminal commands. Auto runs without routine prompts, with a classifier checking shell and network actions against your request first.">
<text x="0" y="18" font-size="17" font-weight="700" fill="#23201D">Permission modes — your control on the left, Claude's autonomy on the right</text>
<text x="0" y="38" font-size="14" fill="#8A8378">Official guidance: start complex work in Plan, then run it in Accept edits or Manual once approved</text>
<line x1="40" y1="186" x2="720" y2="186" stroke="#E5DECF" stroke-width="1" />
<text x="40" y="208" font-size="13.5" fill="#8A8378">You stay in control</text>
<text x="720" y="208" font-size="13.5" fill="#8A8378" text-anchor="end">Claude acts freely</text>
<rect x="40" y="56" width="160" height="118" fill="#1B4F8A" rx="4" />
<text x="56" y="80" font-size="15" font-weight="700" fill="#FAF6EE">Plan</text>
<text x="56" y="102" font-size="14" fill="#FAF6EE">Reads and explores,</text>
<text x="56" y="120" font-size="14" fill="#FAF6EE">never edits source</text>
<text x="56" y="146" font-size="13.5" fill="#A8BDD2">For seeing the approach</text>
<text x="56" y="163" font-size="13.5" fill="#A8BDD2">before a big change</text>
<rect x="212" y="56" width="160" height="118" fill="#4E7FA8" rx="4" />
<text x="228" y="80" font-size="15" font-weight="700" fill="#FAF6EE">Manual</text>
<text x="228" y="102" font-size="14" fill="#FAF6EE">Asks before every edit</text>
<text x="228" y="120" font-size="14" fill="#FAF6EE">and every command</text>
<text x="228" y="146" font-size="13.5" fill="#FAF6EE" font-weight="700">★ Where beginners start</text>
<text x="228" y="163" font-size="13.5" fill="#E5DECF">Nothing changes until you say so</text>
<rect x="384" y="56" width="160" height="118" fill="#A8BDD2" rx="4" />
<text x="400" y="80" font-size="15" font-weight="700" fill="#23201D">Accept edits</text>
<text x="400" y="102" font-size="14" fill="#23201D">Auto-accepts file edits</text>
<text x="400" y="120" font-size="14" fill="#23201D">and mkdir, touch, mv</text>
<text x="400" y="146" font-size="13.5" fill="#23201D">Still asks about other</text>
<text x="400" y="163" font-size="13.5" fill="#23201D">terminal commands</text>
<rect x="556" y="56" width="164" height="118" fill="#23201D" rx="4" />
<text x="572" y="80" font-size="15" font-weight="700" fill="#FAF6EE">Auto</text>
<text x="572" y="102" font-size="14" fill="#FAF6EE">No routine prompts</text>
<text x="572" y="120" font-size="14" fill="#FAF6EE">Before shell and network</text>
<text x="572" y="146" font-size="13.5" fill="#A8BDD2">actions, a classifier checks</text>
<text x="572" y="163" font-size="13.5" fill="#A8BDD2">them against your request</text>
<text x="0" y="246" font-size="14" fill="#8A8378">※ Auto has model requirements (Opus 4.6+, Sonnet 4.6+, Haiku 5.5, Fable) and admins can switch it off.</text>
<text x="0" y="268" font-size="14" fill="#8A8378">※ There is also Bypass permissions, which the docs restrict to sandboxed containers and VMs.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">Mode behavior and the "start complex work in Plan" guidance come from the Claude Code docs (checked 2026-10-15). The "start in Manual if it's small and new to you" line below is the author's own view.</figcaption>
</figure>

**The official recommendation is this: for complex work, get an approach from Plan first, approve it, then execute in Accept edits or Manual.** So the right split is by scope — **Plan for anything large, Manual for something small you haven't done before.**

My reason for pointing beginners at Manual is a different one, and it's just my opinion. **What you need first isn't a result; it's the experience of watching what Claude actually does.** Read a few diffs and you start to feel where it reaches. That's the point to move to Accept edits and pick up speed. Start in Auto instead and you accumulate changes you never looked at.

**You may not even see Auto.** It carries model requirements (Opus 4.6 or newer, Sonnet 4.6 or newer, Haiku 5.5, the Fable models), and on a company account an administrator can turn it off via the `disableAutoMode` managed setting, in which case it won't appear in the mode picker at all. There's also a fifth mode beyond these four — **Bypass permissions**, which skips permission prompts entirely (the equivalent of the CLI's `--dangerously-skip-permissions`). The docs are blunt about it: **use it only in a sandboxed container or VM.** It isn't a beginner's option, so I'm leaving it out here.

## Four things worth knowing on day one

Short answer: **how to stop it, how to hand it a file, how to look back at what changed, and how to delegate the review.**

**① You can interrupt.** You don't have to wait for a task to finish or start over.
- The **stop button** interrupts immediately (shortcut: **Esc**)
- Or **type a correction and press Enter** — this redirects without halting the running action

**② More context, better results.**
- Type **`@filename`** in the prompt box to pull a specific file into the conversation
- Use the attach button for **images and PDFs**, or just **drag and drop** files in

**③ Review changes before you commit.** When Claude edits files, a `+12 -1` indicator appears. Click it to open the diff view and go file by file. You can **click a specific line to leave a comment, then submit all your comments at once with `Cmd+Enter` on macOS or `Ctrl+Enter` on Windows.** Claude reads them and revises.

**④ You can hand the review to Claude too.** Type **`/code-review`** in the prompt box and Claude reviews its own changes.

When a task starts repeating, type **`/` or use + → Slash commands** to browse built-in commands, custom skills, and plugin skills.

## Once you're comfortable — what the desktop app adds

This is the practical case for using the desktop app over the terminal CLI.

| Feature | What you get |
|---|---|
| **Workspace layout** | Drag the chat, diff, terminal, file, and browser panes into any arrangement. Terminal is **Ctrl+`** |
| **App preview** | Start your dev server and the app opens in a browser pane, where **Claude watches the running app** — testing endpoints, reading logs, fixing what it sees |
| **Parallel sessions** | Multiple tasks at once from the sidebar, each optionally isolated in its own **Git worktree** |
| **Side chats** | Ask a question without derailing the main thread |
| **Hand off to the cloud** | Send long work to the cloud so it continues after you close the app. Sessions already in progress can move too |
| **PR tracking** | After opening a PR, monitor CI results, auto-fix failures, or merge once checks pass |
| **Scheduled tasks** | Run recurring work on a schedule — a code review every morning, a weekly dependency audit |
| **Plugins** | Add skills, agents, and MCP servers from **+ → Plugins** |

The one beginners feel fastest is **app preview**. "I changed the code and the screen looks wrong" turning into Claude looking at the screen and fixing it is awkward to set up in a terminal.

## So what — the terminal barrier is gone, and that's the whole story

Claude Code began as a terminal tool. That left a lot of people stuck at "I'd like to try AI coding, but the CLI stops me." What the desktop app changed isn't the capability — it's the **entry point**. The same engine runs, with the same `CLAUDE.md`, the same settings, the same MCP servers. **Node.js and the CLI just dropped out of the install step.**

So here's the order I'd suggest if you're starting out.

1. **Desktop app + Local + Manual mode** on a small project. Read the diffs yourself until you can tell at a glance what Claude touches
2. Write a `CLAUDE.md` with your project's rules — the cost of re-explaining them disappears
3. Once you see the pattern, move to **Accept edits** for speed, and wrap repeat work in slash commands
4. Install the CLI when you actually need a terminal. It's the same engine, so your `CLAUDE.md`, settings, and MCP servers come along — and so do sessions. **A terminal session can be picked up on the desktop with `/desktop`** (macOS and x64 Windows), and **work you started on web or mobile can be pulled into the terminal with `claude --teleport`**. Both require a claude.ai subscription. Going the other way, a **desktop session** moves via **Open in** in the session menu, to Cloud or an installed editor — though sessions running over SSH or WSL can't be moved to the cloud this way

**Don't do it in the other order.** People who try to get their tooling perfect before starting usually never start. Install the app, open a folder you know, and type "find a TODO comment and fix it."

---

**Related reading**
- [Claude Code Pricing 2026: Is the Pro Plan Enough?](/en/blog/2026-07-12-claude-code-pricing-pro-max-comparison/)
- [VS Code + Claude Code Setup Guide](/en/blog/vscode-claude-code-setup-guide/)
- [Claude Code Alternatives in 2026](/en/blog/claude-code-alternatives-comparison-2026/)

**Sources**
- [Claude Code — Get started with the desktop app (official docs)](https://code.claude.com/docs/en/desktop-quickstart) — install, the Code tab, environment selection, permission modes, first session
- [Claude Code overview (official docs)](https://code.claude.com/docs/en/overview) — supported surfaces (terminal, IDE, desktop, web) and the fact that the app bundles Claude Code
- [Claude Code desktop app reference (official docs)](https://code.claude.com/docs/en/desktop) — permission modes, diff review, parallel sessions, workspace layout
- [CLAUDE.md and memory (official docs)](https://code.claude.com/docs/en/memory) — the project instruction file read at the start of every session

*※ Screens and menu names change as the app updates. This article was written against the official docs as of October 15, 2026.*
