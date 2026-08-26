---
title: "Every Claude Error Message, and How to Fix It"
description: "\"This response didn't load,\" 5-hour limits, 429 vs 529 — find the exact message on your screen and get the fix. Built entirely from Anthropic's official docs, current as of August 2026."
pubDate: 2026-08-26T10:31:47+09:00
category: ai
tags: ["Claude", "Troubleshooting", "Claude Code", "AI"]
lang: en
koSlug: 2026-08-26-claude-error-messages-fix-guide
---

When Claude gives you red text instead of an answer, you want the fix — not an essay. This page is a **lookup table**: find the exact wording on your screen, get the answer in the first line of that section.

**The three most common ones, answered up front.**

| What you see | The fix, in one line |
|---|---|
| "This response didn't load" | **Check the status page first.** The wording tells you nothing about the cause — it could be an outage |
| "Due to unexpected capacity constraints..." | **Wait a few minutes and resend.** This is not an outage; it's load management |
| API 429 vs 529 | 429 is **your account's** limit. 529 is **everyone's** servers. Opposite responses |

Start with one distinction, because it trips up almost everyone: **those first two look similar and call for opposite actions.** The next two sections separate them.

![Close-up of PHP code on a monitor, highlighting development and programming concepts.](https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [Pixabay](https://www.pexels.com/@pixabay) on [Pexels](https://www.pexels.com/photo/monitor-displaying-error-text-270557/)*

## "This response didn't load" — check the status page before you wait

**Answer first: don't just retry. Open [status.claude.com](https://status.claude.com) first.**

You get a grey placeholder where the answer should have been. It usually appears after a reply has already started rendering.

This string isn't catalogued in Anthropic's official error documentation. And critically, **it tells you nothing about the cause** — you can't tell a transient hiccup from a live incident by looking at it. Anthropic's own incident notices describe symptoms in exactly these terms, e.g. users "may experience errors … completing chats with Claude" ([sample incident](https://status.anthropic.com/incidents/t39s5hjpbs9v)). So unlike the capacity message below, **rule out an outage first.**

In order:

1. **Check [status.claude.com](https://status.claude.com).** If there's an active incident, waiting is the only move.
2. **No incident? Resend.** It may be a transient network or streaming failure.
3. **Still repeating? Try the same prompt in a fresh conversation.** That tells you whether the problem lives in one conversation's state.

## "Due to unexpected capacity constraints..." — this one is not an outage

**Answer first: wait two or three minutes and send the same prompt again.** No need to start a new chat or log out.

> "Due to unexpected capacity constraints, Claude is unable to respond to your message. Please try again soon."

Anthropic's support documentation is unambiguous about what this is. The system is working; demand across all users is simply spiking, and the platform is shedding load. The wording is explicit:

> "These are not outages—the system functions normally while managing demand."

Here's where this **diverges sharply from the previous section**. The docs state that capacity constraints **do not appear on the status page**:

> "Capacity constraints won't appear on the status page because they represent normal load management rather than technical problems."

So checking the status page for this message gets you nothing. Flip that around and it becomes useful: **if there *is* a notice on the status page, what you're hitting is not a capacity constraint — it's a separate incident.**

If it keeps repeating, **switch models.** Capacity is tracked per model, so Opus can be saturated while Sonnet is wide open. The docs' only prescription here is "retry in a few minutes"; model switching is what they recommend for 529s specifically.

## The "5-hour limit" family — waiting is the only fix

**Answer first: wait until the reset time shown.** The one exception is an Opus-specific limit, where switching models keeps you working.

Three different messages relate to plan usage. They read similarly but mean different things.

| Message | What it means | What to do |
|---|---|---|
| "Approaching 5-hour limit." | **Nearing** the five-hour session cap | Reprioritise. Push heavy requests later |
| "5-hour limit reached - resets [time]." | Cap **hit**. Blocked until that time | Wait for the stated reset |
| "5-hour limit resets [time] - continuing with usage credits." | Cap hit, but **usage credits are carrying you** | Just watch your credit balance |

A common misconception: session and weekly limits are **quota attached to your account**, so refreshing, logging out and back in, or switching browsers changes nothing.

**Switching models usually doesn't help either.** The official docs put it plainly:

> "Session and weekly limits are shared across all models, so switching models won't restore access."

One exception. If you hit `You've hit your Opus limit` — an Opus-specific cap — then `/model` to Sonnet or another model lets you keep going.

To raise the ceiling you upgrade the plan or buy usage credits. On Pro and Max, `/usage-credits` purchases additional usage.

## "Your message will exceed the length limit" — split the conversation

**Answer first: start a new conversation, or attach less.**

> "Your message will exceed the length limit for this chat. Try attaching fewer or smaller files or starting a new conversation."

This isn't a server problem. **Your input exceeded the model's context window.** Every turn resends the whole conversation, so headroom shrinks as the chat grows.

Pick one:

- **Split long documents.** Feed them chapter by chapter instead of all at once.
- **Summarise and carry over.** Move the conclusions into a fresh chat — context preserved, length reset.
- **Start over.** The most reliable option.

In Claude Code it's one command. `/compact` compresses the history, `/clear` starts fresh, and `/context` shows how full you are.

## Login failures — kill the VPN and the extensions first

If login throws a vague error, the cause is almost always one of three:

1. **VPN** — turn it off and retry
2. **Browser extensions** — ad blockers and script blockers especially
3. **Cache and cookies** — stale credentials colliding

If none of that works, check [status.claude.com](https://status.claude.com) for a login-related incident.

![turned on gray laptop computer](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxsYXB0b3AlMjBkZWJ1Z2dpbmclMjBjb2RlJTIwbmlnaHR8ZW58MXwwfHx8MTc4NzcwNjc1Nnww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luca Bravo](https://unsplash.com/@lucabravo?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-gray-laptop-computer-XJXWbfSo2f0?utm_source=spice-bandit-blog&utm_medium=referral)*

## API error codes — the number tells you whose problem it is

**Answer first: 4xx is yours to fix, 5xx is yours to wait out.** 429 splits two ways, covered below.

| Code | Name | What it means | Response |
|---|---|---|---|
| 400 | `invalid_request_error` | Malformed request. Also returned when you hit a **spend limit you set yourself** (Claude Code workspace limits return 429 instead) | Check the request body and console limits |
| 401 | `authentication_error` | API key malformed, revoked, or expired | Reissue the key, or `/login` |
| 402 | `billing_error` | Billing or payment problem | Check payment details in the console |
| 403 | `permission_error` | Key lacks permission for that resource | Check org and workspace settings |
| 404 | `not_found_error` | Bad endpoint path or resource ID | Verify URL and ID |
| 409 | `conflict_error` | Conflicts with the resource's current state | Resolve and retry |
| 413 | `request_too_large` | Request exceeds the size cap | See the table below |
| 429 | `rate_limit_error` | **Your org** hit a rate limit, or the **tier's monthly spend cap** | Wait out `retry-after` if present. **If absent, it's the spend cap and waiting won't help** |
| 500 | `api_error` | Internal Anthropic failure | Retry with exponential backoff |
| 504 | `timeout_error` | Request timed out during processing | Consider the streaming API |
| 529 | `overloaded_error` | Temporarily overloaded **for everyone** | Retry in a few minutes |

*Source: [Claude API errors](https://platform.claude.com/docs/en/api/errors)*

### Confusing 429 with 529 sends you down the wrong path

They look alike on screen and have opposite causes.

- **429 is you.** Your organisation exceeded its per-minute limit or hit a spend cap. Slow down, or negotiate a higher limit.
- **529 is not you.** Anthropic's servers are saturated across all users. Reducing your own traffic changes nothing. Wait, or switch models.

One trap worth knowing: **a 429 caused by the tier's monthly spend cap carries no `retry-after` header.** It will keep failing until access resumes, so retry logic alone will quietly pile up failures. Use the presence of that header to tell the two kinds of 429 apart.

Also: ramping usage sharply can trip acceleration limits and produce 429s. Increase traffic gradually.

### Request size limits

If you got a 413, check against this.

| Endpoint | Max request size |
|---|---|
| Messages API | 32 MB |
| Token Counting API | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

## Claude Code errors you'll actually hit

**Answer first: most of these end with `/login`, `/compact`, or `/clear`.**

The terminal surfaces a different vocabulary of errors.

| Message | Cause | Fix |
|---|---|---|
| `Not logged in · Please run /login` | No valid credential | Run `/login`. On API-key auth, verify `ANTHROPIC_API_KEY` |
| `Prompt is too long` | Conversation exceeds context | `/compact` → `/clear` → `/context` to see what's eating it → `/mcp disable <name>` to drop unused MCP tools → trim a bloated `CLAUDE.md` |
| `You've hit your session limit · resets 3:45pm` | Subscription quota | Wait for the reset. `/usage` to check |
| `Request timed out` | No response inside the 10-minute default | Break the work up. On slow networks, raise `API_TIMEOUT_MS` |
| `Unable to connect to API` | Network, proxy, or TLS | Check firewall and `ANTHROPIC_BASE_URL` |
| `Invalid API key · Fix external API key` | Key invalid, revoked, or a stale key leaking from `.env` | `env \| grep ANTHROPIC` (PowerShell: `Get-ChildItem Env:ANTHROPIC*`) |
| `The response above may be incomplete` | Connection dropped mid-response | **Reply `continue` and it picks up from the last completed block** |
| `SSL certificate verification failed` | Corporate proxy or cert issue | Point `NODE_EXTRA_CA_CERTS` at your CA bundle |
| `Error during compaction: Conversation too long` | Too long even to compact | **Press Esc twice**, move back several turns, rerun `/compact`. Else `/clear` |
| `Request too large (max 30 MB)` | Attachment over the CLI cap (separate from the API's 32 MB) | Press Esc twice and shrink the attachment |

*Source: [Claude Code error reference](https://code.claude.com/docs/en/errors)*

### When a response cuts off, don't ask again

`The response above may be incomplete` appears in four situations. The exact strings:

- `Server error mid-response` — a 5xx while streaming
- `Connection lost mid-response` — the connection dropped
- `Your computer went to sleep mid-response` — **your machine slept**
- `The response stopped arriving` — the stream stalled and the idle watchdog cut it (byte-level watchdog: 180 seconds on the direct Anthropic API, 300 elsewhere)

Plenty of people re-ask from scratch here, which wastes tokens. Completed blocks are still on screen, and **replying `continue` resumes from the last one.**

### Diagnostic commands and environment variables

When something keeps recurring, check state first. These are **slash commands you type inside a Claude Code session** — typing `claude /status` in your shell just passes that string as the opening prompt.

| Type this | What it shows |
|---|---|
| `/status` | Which credential is active (plus proxy and CA loading state) |
| `/usage` | Plan limits and reset times |
| `/context` | A breakdown of what's consuming context |
| `/model` | Available models; switch here |
| `/doctor` | General configuration diagnosis |

Version checks belong in the shell:

```bash
claude --version
claude --debug     # verbose logs, written to ~/.claude/debug/<session-id>.txt
```

To tune retry behaviour:

| Variable | Default | Purpose |
|---|---|---|
| `CLAUDE_CODE_MAX_RETRIES` | 10 | Automatic retry attempts (max 15) |
| `CLAUDE_CODE_RETRY_WATCHDOG` | unset | Set to `1` for unlimited retries on 429/529 in CI |
| `API_TIMEOUT_MS` | 600000 | Request timeout in milliseconds |
| `NODE_EXTRA_CA_CERTS` | — | Path to a CA certificate bundle |

## For developers — handling errors in code

Three habits cover most of it.

**Use the official SDK.** It retries connection errors, rate limits, and 5xx with exponential backoff — **twice by default** — and honours `retry-after` when present. There's rarely a reason to hand-roll retry logic.

**Catch types, not strings.** The SDKs raise typed exceptions: a 404 is `anthropic.NotFoundError` in Python, `Anthropic::Errors::NotFoundError` in Ruby. Matching on message text breaks the moment wording changes.

**Log the `request_id`.** Every response carries a `request-id` header, and the same value appears in the error body. Support resolves issues far faster with it.

```json
{
  "type": "error",
  "error": {
    "type": "not_found_error",
    "message": "The requested resource could not be found."
  },
  "request_id": "req_011CSHoEeqs5C35K2UUqR7Fy"
}
```

For long work, prefer streaming or batches. Some networks drop idle connections, so a non-streaming request with a large `max_tokens` can fail without ever returning. If you expect to exceed ten minutes, look at the [streaming Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming) or the Message Batches API.

## Common questions

**Why does the same error read differently in the web app, the desktop app, and the terminal?**
Because the surfaces phrase things differently. Web and app give you a human sentence (`Due to unexpected capacity constraints...`); the API and Claude Code give you a number (529). **Those two are the same overload.** But some displays, like `This response didn't load`, don't name a cause at all — that could be capacity or an outage, which is why the status page comes first there. **Group by cause, not by wording.**

**Can I get around a limit with a second account?**
The terms explicitly prohibit **sharing accounts, API keys, or credentials**, and the usage policy prohibits **evading a ban with a different account**. Multi-accounting purely to dodge a usage cap doesn't land squarely on either clause, but it's a grey area. Usage credits or a plan upgrade is the safe route.

**Does switching models reset my limit?**
It depends which limit. **Session and weekly limits are shared across all models**, so switching doesn't help. An Opus-specific cap is different — `/model` gets you working again. And **529 capacity is tracked per model**, so switching genuinely works there.

**Is it safe to just auto-retry everything?**
Mostly, with one exception. As noted, a **tier monthly spend cap 429 has no `retry-after`** and keeps failing. Infinite retries just fill your logs. Be careful with `CLAUDE_CODE_RETRY_WATCHDOG=1` in CI.

**I keep seeing "your computer went to sleep."**
Long responses die when your laptop sleeps mid-stream. For long jobs, disable sleep temporarily. If it already happened, `continue` picks it back up.

## The order to work through

When you can't find your exact message, work down this list. The earlier steps are cheaper to check.

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0">
<svg viewBox="0 0 600 330" style="width:100%;height:auto" role="img" aria-label="Claude error triage order. Check status page, then your limits, then request size, then your environment, then contact support">
  <text x="20" y="24" font-size="15" font-weight="700" fill="#23201D">Triage order — work down from the top</text>
  <text x="20" y="44" font-size="11" fill="#8A8378">The higher the step, the more common it is and the cheaper to check</text>
  <rect x="30" y="60" width="540" height="42" rx="6" fill="#1B4F8A"/>
  <text x="46" y="79" font-size="13" font-weight="700" fill="#FAF6EE">1. Is it an outage?</text>
  <text x="46" y="95" font-size="11" fill="#FAF6EE">status.claude.com shows an incident → wait. Nothing else to do</text>
  <rect x="30" y="114" width="540" height="42" rx="6" fill="#4E7FA8"/>
  <text x="46" y="133" font-size="13" font-weight="700" fill="#FAF6EE">2. Is it your limit?</text>
  <text x="46" y="149" font-size="11" fill="#FAF6EE">5-hour cap · spend cap · 429 → wait, upgrade, or buy credits</text>
  <rect x="30" y="168" width="540" height="42" rx="6" fill="#4E7FA8"/>
  <text x="46" y="187" font-size="13" font-weight="700" fill="#FAF6EE">3. Is your request too heavy?</text>
  <text x="46" y="203" font-size="11" fill="#FAF6EE">Context overflow · 413 · timeout → split it up or /compact</text>
  <rect x="30" y="222" width="540" height="42" rx="6" fill="#A8BDD2"/>
  <text x="46" y="241" font-size="13" font-weight="700" fill="#23201D">4. Is it your environment?</text>
  <text x="46" y="257" font-size="11" fill="#23201D">Login · TLS · proxy → check VPN, extensions, certificates</text>
  <rect x="30" y="276" width="540" height="38" rx="6" fill="#FAF6EE" stroke="#23201D" stroke-width="1.5"/>
  <text x="46" y="300" font-size="12" font-weight="700" fill="#23201D">5. Still stuck → grab the request_id and contact support</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:8px">Steps 1 and 2 take seconds. Everything below takes real work.</figcaption>
</figure>

One misconception to close on. **Red text doesn't mean Claude is down.** Capacity constraints aren't outages, a 5-hour limit is the system working as designed, and a 529 usually clears in minutes. Real outages show up on the status page — checking there first saves more time than anything else on this page.

## Sources

- [Troubleshoot Claude error messages](https://support.claude.com/en/articles/12466728-troubleshoot-claude-error-messages) — Anthropic Help Center; usage, length, login, and capacity errors
- [Claude API errors](https://platform.claude.com/docs/en/api/errors) — HTTP codes, size limits, SDK exceptions, request IDs
- [Claude Code error reference](https://code.claude.com/docs/en/errors) — CLI errors, diagnostics, environment variables
- [Claude status page](https://status.claude.com) — live incident notices
- Related: [How to check Claude's status in under a minute](/en/blog/2026-06-18-how-to-check-claude-ai-server-status/)
