---
title: "A Company Run by AI Employees: 10 Days on Paperclip [Part 2]"
description: "Ten days running a company staffed by AI employees on Paperclip: 313M tokens gone in three days, a triple-notification bug, and hard lessons on heartbeats and budgets."
pubDate: "2026-07-07T08:00:00+09:00"
category: ai
tags: ["ai employees", "ai agent company", "paperclip", "multi-agent"]
lang: en
koSlug: 2026-07-05-paperclip-ai-newsroom-operations
---

A company running entirely on AI employees — I set up an AI agent newsroom on Paperclip and ran my blog with it for ten days. Conclusion first: **it works. But if you don't manage it, tokens will eat the company alive.** The high point was that the pipeline actually ran — an editor-in-chief agent assigning stories to reporter agents while I did nothing but approve publication. The low point was watching **313 million tokens evaporate in three days** — and discovering that the culprit who burned more than half of them was a CEO agent that never wrote a single line of copy. [Part 1](/en/blog/2026-07-05-paperclip-ai-agent-company-guide/) covered what Paperclip is and how to set it up; this part is about what actually happened on top of it. If you're considering multi-agent systems, consider my tuition already paid on your behalf.

## The Org Chart — A Seven-Agent Company Modeled on a Real Newsroom

To run blog content operations, I built a company modeled on an actual newspaper's org chart. Here's the lineup.

| Title | Responsibility | How it wakes up |
|------|------|--------------|
| CEO | Company-wide reporting, org management | Heartbeat every 5 minutes (where the trouble began) |
| Editor-in-Chief | Story planning, review, directing reporters | Only when needed (wake-on-demand) |
| AI beat reporter | Researching and writing AI stories | Only when needed |
| Economy beat reporter | Researching and writing economy stories | Only when needed |
| CTO | Blog code and deployment | Only when needed |

I also had a CMO and a UX designer agent (seven in total), but the five above were the core of the content pipeline. All agents ran on Claude-family models, with their working directory pointed at the blog repository. Each agent's instruction file is effectively its job description — things like "You are the editor-in-chief. Here are the quality standards for articles, here's how you delegate to reporters, and you must get board (human) approval before publishing."

The workflow ran on issues (tickets). I'd file an issue saying "write a story on this topic" → the editor-in-chief would reassign it to a reporter with reporting instructions in a comment → the reporter would write a draft → the editor would review it and request board approval → I'd approve, and it published. **This pipeline genuinely worked.** It even handled live breaking-news coverage — an article that auto-updated with sports match results.

![Stack of newspapers](https://images.pexels.com/photos/18287623/pexels-photo-18287623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Lisa from Pexels](https://www.pexels.com/@fotios-photos) on [Pexels](https://www.pexels.com/photo/close-up-of-newspapers-on-wooden-table-18287623/)*

## Incident 1 — 313 Million Tokens in Three Days: The Culprit Is a CEO Who Writes Nothing

Early in the run, my other AI workloads got noticeably sluggish and my subscription quota seemed to be draining strangely fast. Paperclip has built-in cost accounting by agent and by model (visible in both the CLI and the dashboard), so I ran the numbers right away. The fact that this was the first time I'd seriously looked at that feature is itself lesson number one — the cost dashboard isn't a screen you check after an accident; it's a screen you should be checking daily in week one.

The result: **over three days, the company as a whole had consumed 313 million tokens — roughly 100 million per day on average.** The breakdown was even more startling. It wasn't the reporters writing the articles or the editor reviewing them. **The CEO agent alone had burned 177 million tokens — 57% of the total.**

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px 12px 8px;">
<svg viewBox="0 0 640 240" width="100%" height="auto" role="img" aria-label="Bar chart of token consumption by agent over three days. The CEO agent used 177 million tokens, 57 percent of the total; all other agents combined used 136 million.">
  <text x="12" y="22" fill="#23201D" font-size="15" font-weight="bold">Token consumption over 3 days (measured, 313M total)</text>
  <text x="12" y="70" fill="#23201D" font-size="13">1 CEO</text>
  <rect x="120" y="54" width="380" height="26" fill="#C8102E"/>
  <text x="508" y="72" fill="#23201D" font-size="13" font-weight="bold">177M (57%)</text>
  <text x="12" y="130" fill="#23201D" font-size="13">All other agents</text>
  <rect x="120" y="114" width="292" height="26" fill="#E5DECF"/>
  <text x="420" y="132" fill="#8A8378" font-size="13">136M (43%)</text>
  <text x="12" y="180" fill="#8A8378" font-size="12">The CEO never wrote a line of copy — most of the spend was "waking up and getting oriented"</text>
  <text x="12" y="222" fill="#8A8378" font-size="11">* Measured via the built-in cost accounting on the author's instance, June 2026.</text>
</svg>
<figcaption style="color:#8A8378;font-size:0.85em;margin-top:6px;">The agent that does the least work spends the most tokens — the paradox of multi-agent costs.</figcaption>
</figure>

The cause was unambiguous. The CEO was the only agent with a **heartbeat set to a 5-minute interval**. That's 288 clock-ins per day — and every time it wakes up, it re-reads the entire company's state (issues, reports, goals) into context. On top of that, because it was "management," I'd assigned it the heaviest frontier model. A **triple product of "most expensive model × most frequent clock-ins × largest context"** had been quietly grinding away.

The fix was almost embarrassingly simple. I turned off the CEO's heartbeat and switched it to wake-on-demand (regular reports were split off to a separate routine). That single settings change made tens of millions of tokens a day disappear. Lesson: **a heartbeat interval isn't a feature setting — it's a budget decision.** This is exactly why Part 1 stressed "use heartbeats sparingly."

Keeping Paperclip's three wake mechanisms straight will help you avoid the same mistake.

| Mechanism | Behavior | Token profile | Best suited for |
|------|------|----------|----------------|
| Heartbeat | Wakes at a fixed interval to check on things | Continuous billing, inversely proportional to the interval | The rare few that truly need real-time monitoring |
| Routine | Runs a defined task on a cron schedule or webhook | Pay only per execution | Morning reports, periodic checks |
| Wake-on-demand | Wakes only when assigned an issue or called | Pay only for actual work | Reporters, developers — most agents |

My mistake was porting a human-company intuition — "the CEO should always be on call" — straight into an AI company. In an AI company, standing by around the clock isn't loyalty; it's waste. And on top of all this, setting a **per-agent monthly budget** gives you a second layer of protection — per the official site, you get a warning at 80% of budget, and the agent automatically stops at 100%. I only took this feature seriously after the incident. The order should have been reversed.

## Incident 2 — The Company Where Every Notification Arrives Three Times

The second incident wasn't about cost but about noise. Every time an article draft was finished, my Telegram pinged **three times**. Tracing it back revealed a bureaucratic comedy that would be right at home in any human organization.

1. The editor-in-chief, when delegating to a reporter, had included "notify the boss when you're done" in the instructions
2. The editor was also configured to send a completion notification itself
3. A server API permission error caused the task to retry, amplifying the notifications further

The content was fine. The article published exactly once — only the notifications tripled. The fix was organizational design: a **"single-sender principle."** Only one designated agent sends external reports (Telegram); notification instructions are never passed along when delegating; and on retry, if you've already reported, don't report again (idempotency). Once these rules were written into each agent's instruction file, the noise vanished.

The lesson this incident left behind is an interesting one. **Bugs in an agent organization aren't code bugs — they're org bugs.** And the fix wasn't a debugger; it was editing job descriptions. The real skill in running multi-agent systems turns out to be closer to organizational design than to prompt engineering.

## Incident 3 — So I've Paused It: The P&L of Over-Organization

Let me write the honest ending. After roughly ten days, I put this AI newsroom **on pause**. Not because the pipeline didn't run — it did. Because the output didn't justify the cost of running it.

The cold math goes like this. For a one-person blog publishing a few posts a day, the tokens spent on company simulation — clocking in, reporting, meetings, retries — dwarfed the tokens spent on actual writing. Meanwhile, the same blog runs fine on a linear structure — "a script picks the topic, one agent writes the draft, a human reviews and publishes" — with a single execution per day. **Organizations have fixed costs, and an organization only pays off when there's enough workload to justify those fixed costs.** The exact same P&L that governs human companies applies to AI companies.

Does that mean Paperclip is useless? No. This isn't a tool problem — it's a **scale problem**. Based on my experience, the fork in the road looks like this.

| Situation | Recommended structure |
|------|----------|
| 1–2 agents, well-defined repetitive work | Script + single agent (no organization needed) |
| 3+ agents with interdependent work | Consider an org layer like Paperclip |
| Many parallel projects, delegation and review needed | Org layer + budgets and governance at full throttle |

And either way — **set budgets. Always.** Paperclip's per-agent monthly budget ("stop when the limit is hit") is the structural prevention for the 313-million-token incident I lived through. I discovered it after the fact; you can set it on day one.

## So What — Before You Give AI an Organization, Study Organizations

If I compress ten days of operations into one line, it's this: **multi-agent success is decided by organizational design, not AI capability.** Heartbeats are payroll, instruction files are job descriptions, duplicate notifications are the cost of bureaucracy, and over-organization is fixed-cost overrun — every one of these is a problem management theory has been working on for a century.

In fact, each of this post's three incidents maps to a classic. Incident 3's P&L is precisely the question Ronald Coase posed in "The Nature of the Firm" (1937) — a firm has a reason to exist only when coordinating internally is cheaper than going to the market (outsourcing). My AI newsroom failed that test, so I went back to the market transaction of "a script plus one agent." Incident 1's do-nothing CEO is the token-denominated version of Parkinson's Law (1955) — administrative work expands on its own, independent of the actual amount of work to be done. And Incident 2's triple notifications are exactly what Frederick Brooks warned about in "The Mythical Man-Month" (1975): as you add people, communication paths grow combinatorially until coordination costs devour output. That these diagnoses, written half a century to a century ago, apply to AI organizations almost without modification is the strongest evidence that the essence of this problem is organizational, not technical. The tools are already here (open source, free, no less). What's usually not ready is our sense of organizational design.

If you're starting out, I recommend this order. ① Learn to run one agent well ([the Hermes series](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/)) → ② Cut the cost structure of repetitive work with local models ([the LM Studio integration](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)) → ③ When your agents exceed three and start depending on each other, come back to [Paperclip Part 1](/en/blog/2026-07-05-paperclip-ai-agent-company-guide/) and incorporate. Skip a step, and my three days' worth of 313 million tokens become yours.

---

**AI Agent Organization series**
- [Part 1 — Paperclip primer: concepts, setup, and your first org design](/en/blog/2026-07-05-paperclip-ai-agent-company-guide/)
- Part 2 — Running an AI newsroom on Paperclip (this post)

**Hermes AI series**: [Part 1: Installation](/en/blog/2026-06-28-hermes-agent-nous-research-install-guide/) · [Part 2: Practical use cases](/en/blog/2026-06-29-hermes-agent-practical-use-cases/) · [Part 3: LM Studio integration](/en/blog/2026-07-05-hermes-agent-lm-studio-local-llm/)

**Sources**
- [Paperclip official site](https://paperclip.ing/) (budget and governance feature copy)
- [Paperclip official docs](https://paperclipai-paperclip.mintlify.app/) (heartbeat, routine, and budget concepts)
- Cost accounting measurements from the author's own instance (June 2026; source of the figures in this post)
