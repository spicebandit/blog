---
title: "Hermes AI: Complete Install & Setup Guide [Part 1]"
description: "A step-by-step guide to installing Nous Research's autonomous AI agent, Hermes Agent, in your terminal in 5 minutes — plus initial setup and key features. Part 1 of a series leading into Part 2 (practical use)."
pubDate: "2026-06-28T07:35:00+09:00"
category: ai
tags: ["hermes-agent", "nous-research", "ai-agent", "autonomous agent"]
lang: en
koSlug: 2026-06-28-hermes-agent-nous-research-install-guide
---

**Hermes Agent** isn't an AI you open in a ChatGPT window. It runs continuously in your terminal, messengers, and servers; it learns on its own; and it keeps its memory even after a conversation ends — a true **autonomous agent**. This open-source tool, released by Nous Research in February 2026, surpassed 204,000 GitHub stars just four months after launch. In this article I'll walk through, step by step and based on the official documentation, what Hermes Agent is, why it's worth trying now, and how to install and set it up in under five minutes. *(Part 2: [Practical Use & Automation Cases](/blog/2026-06-29-hermes-agent-practical-use-cases/) continues in the next installment.)*

![a computer chip with the letter a on top of it](https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-computer-chip-with-the-letter-a-on-top-of-it-eGGFZ5X2LnA?utm_source=spice-bandit-blog&utm_medium=referral)*

## Hermes vs Claude Code, CrewAI, and Paperclip — How It Differs from the Competition

Before reading on, let's sort out one thing. As of 2026, the "AI agent" category is overflowing with tools that look similar, but in reality they **cover different layers**. Understanding first how Hermes Agent differs from **Claude Code**, **CrewAI**, and **Paperclip** — the tools it's most often compared to — will make everything that follows much clearer.

### One-Line Positioning for Each Tool

- **Hermes Agent** — A single-user autonomous agent that **runs continuously** on servers, terminals, and messengers, growing on its own as conversations accumulate.
- **Claude Code** — Anthropic's terminal/IDE-integrated AI. A session-based agent specialized for development work like **coding, refactoring, and bug fixing**.
- **CrewAI** — A developer-oriented orchestration framework for assembling **role-based multi-agent teams** ("marketer, researcher, writer," etc.) in Python code.
- **Paperclip** — An **agent-management SaaS platform** that assigns tasks to multiple AI agents and manages them like a team. It supervises workflows rather than running code directly.

### Key Feature Comparison Table

| Criteria | Hermes Agent | Claude Code | CrewAI | Paperclip |
|------|-------------|-------------|--------|-----------|
| **Type** | Single autonomous agent | Coding-specialized agent | Multi-agent framework | Agent-management platform |
| **Runtime environment** | Terminal/messenger/server, always on | Terminal/IDE (session-based) | Python script execution | Web board UI |
| **Persistent memory** | ✅ Saved to disk, persists across sessions | ❌ Reset when session ends | ❌ (separate external DB integration) | ✅ Stores issues, comments, context |
| **LLM providers** | 40+ providers, 300+ models | Anthropic only | Many via LangChain | Anthropic Claude-based |
| **Self-learning / skill accumulation** | ✅ Skills auto-saved and reused | ❌ | ❌ | ✅ Per-agent memory |
| **Messenger gateway** | ✅ Telegram, Discord, Slack, etc. 20+ | ❌ | ❌ | ✅ (plugin-based) |
| **Usable without coding** | ✅ CLI / natural language | ✅ Natural language | ❌ Python required | ✅ Board UI |
| **Multi-agent** | ⚡ Parallel sub-agents (experimental) | ❌ Single | ✅ Core feature | ✅ Team structure supported |
| **Open source** | ✅ MIT License | ❌ Commercial (Anthropic subscription) | ✅ MIT License | ❌ Commercial SaaS |
| **Setup difficulty** | ★★★☆☆ Medium | ★★☆☆☆ Low | ★★★★☆ High | ★★☆☆☆ Low |
| **Primary audience** | Developers / automation power users | Developers (coding work) | Python developers | Solo founders / small teams |

### When to Choose Each Tool

**When Hermes Agent fits:**
- When you want to switch models freely without being locked to an LLM vendor (Claude today, GPT-4o tomorrow)
- When you want to access your server's agent remotely via messengers like Telegram or Slack while on the move
- When you need to modify the open-source code directly or self-host on internal infrastructure
- When you want an AI colleague that gets smarter the more you use it

**When Claude Code fits:**
- When development work like coding, refactoring, and PR review is the main goal
- When you want to use Anthropic Claude's latest models at top quality
- When you need a development agent you can start instantly with no extra configuration

**When CrewAI fits:**
- When, as a Python developer, you want fine-grained control over complex multi-agent workflows in code
- When you need a role-divided pipeline like "researcher agent → analysis agent → writing agent"
- When your goal is to build an enterprise-grade AI automation system yourself

**When Paperclip fits:**
- When you want to assign work to multiple AI agents and track progress without coding
- When you want to operate agents as team members, like an issue tracker
- When you need a layer to **manage and supervise** AI agents rather than build them yourself

### Conclusion: Different Layers — Mixing Them Is the Right Answer

The four tools are **complementary** rather than competitive. In practice, you can have Paperclip manage tasks while Hermes Agent handles execution and automation, or build a pipeline with CrewAI and review code quality with Claude Code. That said, if you have to pick just one: if you need **an autonomous agent that runs continuously on a server, free of LLM lock-in, and accessible from anywhere via messengers**, Hermes is the clearest choice as of 2026.

---

## What Is Hermes Agent? — How It Differs from a Coding Assistant

The AI tools we commonly use come in two types. **Chatbots that only work in a web chat window**, like ChatGPT and Claude, and **coding aids that only work inside an IDE**, like GitHub Copilot. With both, the conversation disappears when you close the window, and the next time you connect you have to start over from scratch.

Hermes Agent belongs to neither type. The Nous Research official documentation defines it as a **"self-improving autonomous agent."** Specifically, three things are different.

**First, it runs anywhere.** It operates continuously on a $5 VPS, a GPU server, or serverless infrastructure. Even if you close your laptop, it keeps running on the server. **Second, memory accumulates.** Because persistent memory is stored on disk, it carries yesterday's conversations and what it learned forward into the next session intact. **Third, skills accumulate.** Every time it solves a hard problem, Hermes records the method as a reusable skill document. It's a structure that gets better the more you use it.

In short: a chatbot **handles conversations**, a coding assistant **aids the IDE**. Hermes **runs continuously on a server and grows**. It's less a mere tool and more an AI colleague.

---

## Key Features & Advantages — Why Hermes

### A Messaging Gateway You Can Reach from Anywhere

Hermes connects not just the CLI (terminal) but 20+ messaging platforms — **Telegram, Discord, Slack, WhatsApp, Signal, iMessage**, and more — through a single gateway process (iMessage integration was added in v0.17.0). Set it up once and you can talk to the same agent from Telegram on your smartphone.

### 300+ Models and 40+ Providers, Unified

Hermes isn't locked to any LLM. Per the official documentation, it supports **40+ AI providers.**

- **Nous Portal** (recommended): With a single OAuth login, access **300+ frontier models** including Claude, GPT-4o, Gemini, DeepSeek, Qwen, and Grok. Includes a Tool Gateway for web search, image generation, TTS, and browser automation.
- **OpenRouter**: Routes 200+ models. Auto-optimizes based on cost, throughput, and latency.
- **Anthropic, OpenAI, Google Gemini, DeepSeek**: Direct native API connections.
- **Self-hosting**: Connect local models like Ollama, vLLM, LM Studio, and llama.cpp.

### 60+ Built-in Tools + MCP Server Integration

It ships with **60+ built-in tools** — web search, image generation, TTS, file manipulation, code execution, cron scheduling, parallel sub-agent spawning, and more. And by integrating MCP (Model Context Protocol) servers, you can extend its capabilities without limit.

### A Learning Skill System

When Hermes solves a specific problem for the first time, it saves the method as a **skill document**. When the same situation comes up again, it searches for the saved skill and applies it instantly. Skills are compatible with the [agentskills.io](https://agentskills.io) open standard, so you can share them with other users too.

![two hands touching each other in front of a pink background](https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/two-hands-touching-each-other-in-front-of-a-pink-background-gVQLAbGVB6Q?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## How to Install — Step-by-Step for Linux, macOS, and Windows

> **Latest version**: v0.17.0 (released June 19, 2026, "The Reach Release")  
> **Official repository**: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)  
> **Official docs**: [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

### Linux / macOS (Recommended Method)

Open a terminal and run the command below. The install script automatically installs `uv`, Python 3.11, and the hermes binary. **No sudo privileges required.**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

> ⚠️ **Security note**: The `curl | bash` method runs the script as-is. Before running, I recommend first inspecting the script's contents with `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | less`. (Source: [Hermes official install docs](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart))

After installing, refresh your shell.

```bash
source ~/.bashrc   # bash users
# or
source ~/.zshrc    # zsh users (macOS default)
```

Verify the installation:

```bash
hermes --version
```

### Windows (via WSL2)

On Windows, proceed exactly as in the Linux method above, within a **WSL2 (Windows Subsystem for Linux)** environment.

If you prefer a native PowerShell install, you can use the officially provided PowerShell script.

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

### Hermes Desktop (GUI Alternative)

If you're not comfortable with the terminal, you can download **Hermes Desktop** instead. Native apps for macOS, Windows, and Linux are available on the official site ([hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com)). It's a GUI, but it has the same capabilities as the CLI.

---

## Initial Setup — Get Started in 5 Minutes with Nous Portal

Before the first run after installing, you need to connect an AI provider. Follow the **Quick Setup** path recommended in the official docs.

### Step 1: Run the Setup Wizard

```bash
hermes setup --portal
```

Adding the `--portal` flag sets **Nous Portal** as the default provider. With just a single OAuth login, Nous Portal activates 300+ models and the Tool Gateway (web search, image generation, TTS, browser) all at once. It's the fastest way to get started.

### Step 2: Choose a Model (Changeable Anytime)

```bash
hermes model
```

An interactive menu appears. At first, select the Nous Portal default model; you can change it anytime afterward. Note: the official docs recommend using a model with a **minimum context length of 64,000 tokens** or more. Models smaller than this may not run the memory and skill features properly.

### Step 3: Register Other AI Provider Keys Directly (Optional)

To register API keys for Anthropic, OpenAI, etc. directly instead of Nous Portal, add them to the `~/.hermes/.env` file.

```bash
# Example: direct connection to Anthropic Claude
echo "ANTHROPIC_API_KEY=sk-ant-..." >> ~/.hermes/.env

# Example: direct connection to OpenAI
echo "OPENAI_API_KEY=sk-..." >> ~/.hermes/.env
```

Then select that provider/model with `hermes model`.

### Step 4: Connect a Messaging Gateway (Optional)

To talk to Hermes from a messaging app like Telegram, start the gateway.

```bash
hermes gateway
```

The setup wizard walks you through registering each platform's bot token. Once configured, you can talk directly to the Hermes on your installed server from a Telegram chat window.

### Step 5: Start Your First Conversation

```bash
hermes
```

Now you can have your first conversation with Hermes in the terminal UI (TUI). To resume a previous session:

```bash
hermes --continue
```

### Quick Reference for Common Commands

| Command | Function |
|--------|------|
| `hermes` | Start a new conversation |
| `hermes --continue` | Resume the last session |
| `hermes model` | Change LLM provider/model |
| `hermes tools` | Check/adjust enabled tools |
| `hermes gateway` | Start the messaging gateway |
| `hermes doctor` | Auto-diagnose installation issues |
| `hermes update` | Update to the latest version |

![A white robot is standing in front of a black background](https://images.unsplash.com/photo-1737644467636-6b0053476bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjB0ZXJtaW5hbHxlbnwxfDB8fHwxNzgyNTY2Mjc2fDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Gabriele Malaspina](https://unsplash.com/@gabrielemalaspina?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-white-robot-is-standing-in-front-of-a-black-background-CjWsslYVnPI?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## So What — Who Is It For, and Why Now

Hermes Agent isn't a tool for everyone. But if you're one of the following types, it's worth trying right now.

**Developers & engineers**: Anyone who needs a personal AI assistant running continuously on a server. Especially if you want to auto-switch between multiple AI models by cost and performance, Hermes's multi-provider architecture fits.

**Solo founders & freelancers who want automation**: If you want to delegate research, drafts, and scheduling to an AI via Telegram even while you're out, the messaging gateway is the key feature. You can also automate repetitive tasks with cron scheduling.

**People who want to 'build' AI themselves**: Because it's MIT-licensed open source, you're free to modify the source, attach MCP servers, or self-host on internal infrastructure. That said, basic knowledge of a Python environment is required.

**People for whom it's still too early**: It's terminal-based and has a few setup steps. If you want the instant-use approach of the ChatGPT website, I recommend trying Hermes Desktop first.

The answer to "why Hermes now" is simple. With v0.17.0 "The Reach Release" (June 19, 2026), iMessage integration and agent network connectivity were added, sharply raising its level of polish. Now that delegating repetitive commands to AI is becoming the norm, the era of autonomous agents that work anywhere — local or remote — is beginning.

---

**[See Part 2]** How to actually put Hermes to use — Telegram bot integration, cron automation, writing and sharing skills, connecting MCP servers, and more practical usage and cases continue in [Hermes AI: Complete Guide to Practical Use & Automation Cases [Part 2]](/blog/2026-06-29-hermes-agent-practical-use-cases/).

---

**Sources & References**  
- [Hermes Agent Official Docs](https://hermes-agent.nousresearch.com/docs/) (Nous Research, 2026)  
- [NousResearch/hermes-agent GitHub Repository](https://github.com/NousResearch/hermes-agent) (MIT License)  
- [Hermes Agent Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)  
- [AI Providers Support List](https://hermes-agent.nousresearch.com/docs/integrations/providers)  
- [v0.17.0 Release Notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.17.0) (2026.6.19)
