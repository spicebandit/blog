---
title: "Hermes AI: Practical Use & Automation Guide [Part 2]"
description: "A case-driven walkthrough of practical Hermes Agent usage: Telegram bot integration, cron automation, MCP server connections, and skill sharing."
pubDate: "2026-06-29T17:35:00+09:00"
category: ai
tags: ["hermes-agent", "nous-research", "ai-automation", "telegram-bot"]
lang: en
koSlug: 2026-06-29-hermes-agent-practical-use-cases
---

You've installed it. Now how do you use it? Practical use of **Hermes Agent** comes down to three things. First, getting comfortable with the terminal UI and slash commands. Second, deliberately building up the memory and skill systems. Third, connecting Telegram bots, cron automation, and MCP servers to hand repetitive work over to the agent. In this article, I'll lay out — based on the official docs and step by step — everything from Hermes's basic usage flow to three real-world automation cases. For installation and initial setup, check [Part 1](/blog/2026-06-28-hermes-agent-nous-research-install-guide/) first.

![two hands touching each other in front of a pink background](https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxhdXRvbWF0aW9uJTIwdGVsZWdyYW0lMjBib3R8ZW58MXwwfHx8MTc4MjcyMTQzMnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Igor Omilaev](https://unsplash.com/@omilaev?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/two-hands-touching-each-other-in-front-of-a-pink-background-gVQLAbGVB6Q?utm_source=spice-bandit-blog&utm_medium=referral)*

## Hermes Basic Usage Flow: From the Terminal UI to Slash Commands

### Starting Your First Conversation and Managing Sessions

After installing, type `hermes` in the terminal and the **TUI (terminal user interface)** opens. It looks like a chat window, but it's fundamentally different from ordinary chat. Because Hermes saves conversation content to disk, when you close the window and reconnect with `hermes --continue`, the previous session continues right where you left off.

```bash
hermes              # Start a new conversation
hermes --continue   # Resume the last session
```

If you want to manage multiple sessions or separate them by topic, you can name sessions (see the official docs: Sessions section).

### Key CLI Commands at a Glance

| Command | Role |
|--------|------|
| `hermes` | Start a new conversation |
| `hermes --continue` | Resume the previous session |
| `hermes model` | Change LLM provider/model |
| `hermes tools` | Check/adjust enabled tools |
| `hermes gateway` | Start the messaging gateway (Telegram, Discord, etc.) |
| `hermes mcp` | Manage MCP server list/connections |
| `hermes doctor` | Auto-diagnose installation issues |
| `hermes update` | Update to the latest version |

### How to Give Instructions and Streaming Output

The way you instruct Hermes is the same as ordinary AI chat — just type in natural language. The difference is in the **streaming tool output**. When it uses tools like web search, file manipulation, or code execution, the output of each step streams in real time in the TUI. "What it's doing right now" is transparently visible.

When assigning long tasks, the more specific the better. Rather than "summarize today's AI news," you're more likely to get the result you want by specifying the input, action, and output format — like "Use Google search to find 3 AI-related news items from today (2026-06-30) and organize each into a table with a one-line key point and a source URL."

---

## Memory & Skill Systems: An Agent That Grows as You Use It

This is where the feature that most sets Hermes apart from other AI tools lives: **persistent memory** and a **self-learning skill system**.

### Persistent Memory: An AI That Remembers Yesterday

Hermes saves conversation content, user preferences, and project context to disk in the `~/.hermes/` directory (see the official docs: Memory Architecture). Even when you start a new session, the information it learned from previous conversations persists.

For example, if you say in your first conversation, "I want to be answered only in Korean. Always write reports in the order summary → analysis → action items," it remembers that rule in later sessions too. You don't have to explain it repeatedly.

When memory exceeds the context length limit, it's automatically summarized and compressed so that only the essential information is retained. This is why Hermes recommends a model with **a context length of 64,000 tokens or more**.

### Skill Accumulation: Solve It Once, Do It Faster Next Time

When Hermes solves a new problem for the first time, it automatically saves the method as a **reusable skill document** (see the official docs: Skills System). When the same situation arises again, it searches for the saved skill and applies it instantly.

```
e.g., First request to "extract data from the Notion API" →
      Hermes saves the solution process as a skill →
      Next time the same request is handled 3x faster with the saved skill
```

Skills are compatible with the **[agentskills.io](https://agentskills.io)** open standard. You can share skills you've written with the community, or pull in skills others have shared. For example, if you install a "morning news summary" skill from the community, you can use it right away with no extra configuration.

![blue plastic robot toy](https://images.unsplash.com/photo-1527430253228-e93688616381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhdXRvbWF0aW9uJTIwdGVsZWdyYW0lMjBib3R8ZW58MXwwfHx8MTc4MjcyMTQzMnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Emilipothèse](https://unsplash.com/@emilipothese?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/blue-plastic-robot-toy-R4WCbazrD1g?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## Practical Guide: Telegram Bot Integration, Cron Automation, and MCP Server Connections

### Telegram Bot Integration: Reach Your Agent Even While Out

Using Hermes's messaging gateway feature, you can reach the agent running on your server via Telegram. Send a Telegram message from your smartphone, and the Hermes on your server responds.

**Setup steps:**

1. Create a new bot with Telegram's BotFather → issue an API token
2. Start the gateway on the server:

```bash
hermes gateway
```

3. Select Telegram in the gateway setup wizard → enter the issued token
4. After confirming the connection, send a message to the bot you created in the Telegram app

Once set up, when you give natural-language instructions from Telegram like "organize today's to-dos" or "write last week's report," the Hermes on your server carries out the task. As of v0.17.0, you can connect **20+ platforms** the same way, including Telegram, Discord, Slack, WhatsApp, Signal, and iMessage (source: [Hermes Gateway official docs](https://hermes-agent.nousresearch.com/docs/integrations/gateway)).

### Cron Automation: Delegate Repetitive Tasks to the Agent

Hermes provides **built-in cron scheduling** (as of v0.17.0, see the official docs: Scheduled Tasks section). You can configure it to run tasks automatically at specific times.

```bash
hermes tools   # Check the schedule tool in the tool list
```

When you register a schedule in natural language within the TUI, like "every day at 8 a.m., summarize 3 AI news items for today and send them to Telegram," Hermes registers it as a cron job. For cron to run, the server must not be shut down and Hermes must run continuously (using `hermes --continue` or `nohup`/`screen`/`tmux`).

> **Operations tip**: If you're using a VPS, registering it as a `systemd` service lets Hermes auto-recover even after a server restart.

### MCP Server Connection: Unlimited Feature Expansion

MCP (Model Context Protocol) is a standard protocol for AI agents to connect to external services and APIs. By connecting MCP servers, Hermes can add capabilities beyond its 60 built-in tools.

```bash
hermes mcp     # Check the list of currently connected MCP servers
```

Add the MCP server address to the config file (`~/.hermes/config.yaml`, or see the MCP configuration section of the official docs), and Hermes automatically recognizes that server's tools.

**Examples of connectable MCP servers:**
- Collaboration tools like Notion, Google Drive, GitHub, and Linear
- Custom database query servers
- Internal API wrapper servers

---

## Three Real-World Automation Cases

### Case 1: Daily Morning News Briefing + Telegram Delivery

**Situation**: A solo founder wants to receive a curated digest of AI, tech, and economy news every morning.

**Setup flow:**
1. Complete Telegram bot integration (see the guide above)
2. Give Hermes a schedule instruction:
   > "Every day at 7:30 a.m., use Google search to find the 2 latest news items each in AI, tech, and economy, and build a table including the title, a one-line summary, and the source URL, then send it to Telegram."
3. Hermes registers a cron job → runs automatically thereafter

**Result**: Every morning, a news briefing arrives via Telegram on your smartphone. Automation complete with a single setup, no separate app needed.

### Case 2: Auto-Generating Recurring Document Drafts

**Situation**: You want a weekly work report draft written automatically every Friday.

**Setup flow:**
1. Instruct Hermes to learn the report format:
   > "From now on, always use this format for my weekly work reports: [paste format]. Save this as a skill."
2. Register a schedule:
   > "Every Friday at 4 p.m., ask me for the list of tasks completed this week, then write a weekly report draft in the format above and save it to the ~/Documents/reports/ folder."

**Result**: Every Friday afternoon, Hermes automatically generates a report draft. The owner only has to review and edit.

### Case 3: Code Repository Monitoring + Issue Summary

**Situation**: You want a daily morning summary of new issues in a GitHub repository.

**Setup flow:**
1. Connect the GitHub MCP server (see the official MCP server list)
2. Give a schedule instruction:
   > "Every day at 9 a.m., fetch the list of issues created yesterday in the [repo name] GitHub repository, and organize the title, summary, and estimated priority into a table, then send it to Telegram."

**Result**: A morning briefing on GitHub issue status, automatically. No need to open a separate dashboard.

![a group of white robots sitting on top of laptops](https://images.unsplash.com/photo-1684369175809-f9642140a1bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxhdXRvbWF0aW9uJTIwdGVsZWdyYW0lMjBib3R8ZW58MXwwfHx8MTc4MjcyMTQzMnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Mohamed Nohassi](https://unsplash.com/@coopery?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-group-of-white-robots-sitting-on-top-of-laptops-2iUrK025cec?utm_source=spice-bandit-blog&utm_medium=referral)*

---

## Operations Tips and Caveats: Cost, Security, Limits

### Cost Management

The Hermes tool itself is free (MIT License), but LLM API usage costs are separate. If you use Nous Portal, the portal pricing plan applies; if you connect your own API keys, each provider's pricing applies.

**Ways to reduce cost:**
- Design it to run only when cron needs it, rather than running continuously
- For simple repetitive tasks, use a cost-efficient small model (switch models with `hermes model`)
- Use the memory summarization feature to avoid excessive context-token usage

### Security and Key Management

API keys are stored in the `~/.hermes/.env` file. Never upload or share this file to a git repository. I recommend adding the `~/.hermes/` path to `.gitignore`.

When setting up the Telegram bot, you must **restrict bot access to your own account only**. If the bot token leaks, an outsider can reach the agent. Check the official docs' Gateway Security section for how to set up a whitelist.

### Limits and Realistic Expectations

Hermes is powerful, but not omnipotent. To set realistic expectations:

- **Context length**: No matter how good the memory summarization is, there's a limit to perfectly retaining the entire history of a very complex project.
- **Tool errors**: Web search results can be inaccurate, or API calls can fail. For important automation results, I recommend a human review the output once.
- **Model dependency**: Hermes's output quality depends heavily on the connected LLM model. As the official docs recommend, use a proven frontier model with 64,000 tokens or more.

### So What: Which Tasks Benefit Most from It

Where Hermes shines is **repetitive, well-structured information-processing work**. It suits "tasks that repeat the same flow every day," like news collection and summarization, report drafts, and code repository monitoring. On the other hand, creative judgment, complex stakeholder coordination, and communication where subtle nuance matters still need to be human-led.

Conclusion: To truly get the most out of Hermes, the fastest way is to spend the first one to two weeks consciously noting down "which tasks can I hand off to the agent." Start with tasks that repeat often, have clear inputs and outputs, and carry a low burden of reviewing the result — then gradually broaden the scope of automation. That's the best practice.

---

**[Back to Part 1]** For installation and initial setup, see [Hermes AI: Complete Install & Setup Guide [Part 1]](/blog/2026-06-28-hermes-agent-nous-research-install-guide/).

---

**Sources & References**
- [Hermes Agent Official Docs](https://hermes-agent.nousresearch.com/docs/) (Nous Research, 2026)
- [NousResearch/hermes-agent GitHub Repository](https://github.com/NousResearch/hermes-agent) (MIT License)
- [Hermes Gateway Official Docs](https://hermes-agent.nousresearch.com/docs/integrations/gateway)
- [Hermes Skills System](https://hermes-agent.nousresearch.com/docs/core-concepts/skills)
- [agentskills.io — Community Skill-Sharing Platform](https://agentskills.io)
- [v0.17.0 Release Notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.17.0) (2026.6.19)
