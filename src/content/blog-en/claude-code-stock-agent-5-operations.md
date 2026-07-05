---
title: "Stock Bot Automation Ops — Telegram Approvals & launchd Scheduling for Hands-Off Trading [Part 5]"
description: "Operations for a Claude Code stock bot: approve trades from your phone with Telegram inline buttons, and run morning/intraday/close automatically with launchd."
pubDate: 2026-06-23T09:00:00+09:00
category: ai
tags: ["ClaudeCode", "AutoTrading", "TelegramBot", "launchd"]
lang: en
koSlug: claude-code-stock-agent-5-operations
---

> 📚 **Series — Building a Stock-Investing Agent with Claude Code**
> [① Goals and Design](/blog/claude-code-stock-agent-1-design/) · [② Connecting the KIS API](/blog/claude-code-stock-agent-2-kis-api/) · [③ The Analyst Brains](/blog/claude-code-stock-agent-3-analysts/) · [④ Trading and Safety](/blog/claude-code-stock-agent-4-trade-safety/) · **⑤ Operations Automation**

## The Installment That Pays Off the Promised Homework

At the end of installment 4, I jotted down three things as "what to do next": receiving proposals and approvals on my phone via Telegram, running automatically every day with launchd, and morning/close daily reports. The bot could already pick stocks, analyze them, and buy and sell — but making it run **every day, even when I'm not at my laptop** was a different matter.

This installment is that "operations" part. The code itself isn't flashy. Instead, the key was layering automation on top *without breaking anything that already worked well*. So every change was purely additive, and I protected existing behavior with tests at every step (28 tests passing in the end).

![black android smartphone turned on screen](https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdHJhZGluZyUyMG5vdGlmaWNhdGlvbiUyMGFwcHJvdmFsfGVufDF8MHx8fDE3ODE4NTU5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Marga Santoso](https://unsplash.com/@margabagus?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-android-smartphone-turned-on-screen-OmPqCwX422Y?utm_source=spice-bandit-blog&utm_medium=referral)*

## Approving with a Single Button Tap on Your Phone

Until now, approval meant typing `y/n` in the terminal. That only works if the laptop is on, which is a far cry from unattended operation.

So I changed it to send a message with **a `✅ Approve` / `❌ Reject` button** to my phone via Telegram whenever a trade proposal comes up. When a notification arrives on my commute, I just read it and tap a button. Tap Approve and the bot immediately places the order, and the message changes to "✅ Order completed (order number …)."

There's a principle I absolutely refused to compromise on here. **Even when you press the button, the order doesn't go out immediately — it passes through the same execution gate I built in installment 4.** Approval merely passes a "a human said OK" flag to the gate; the hard-rule checks like the kill switch, quantity, daily limit, and duplicates still apply as before. Getting more convenient did not mean bypassing the safety mechanisms.

Since it has to be listening for messages at all times, I spun up a small daemon that listens to Telegram via long-polling. This daemon handles not only buttons but also text commands like `balance`, `history`, and `review 005930`. Send "balance" from my phone and I get my holdings and P&L back as a reply.

![a person holding a cell phone in front of a stock chart](https://images.unsplash.com/photo-1645226880663-81561dcab0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzbWFydHBob25lJTIwdHJhZGluZyUyMG5vdGlmaWNhdGlvbiUyMGFwcHJvdmFsfGVufDF8MHx8fDE3ODE4NTU5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Adam Śmigielski](https://unsplash.com/@smigielski?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-person-holding-a-cell-phone-in-front-of-a-stock-chart-K5mPtONmpHM?utm_source=spice-bandit-blog&utm_medium=referral)*

## Bots Keep to Themselves — Why I Separated the Tokens

This is where I fell into an unexpected trap. I already had a Telegram bot token I was using for another purpose, so I figured "I'll just reuse that." But once I tried to wire it up, the problem became clear.

In Telegram, only **one process at a time** can correctly receive a single bot's messages via long-polling. If two processes call `getUpdates` with the same token, they steal updates from each other and both malfunction. Since the existing bot was already polling, having the stock bot use that token too would have broken the existing connection.

The answer was simple. **Spin up a dedicated bot just for the stock bot.** I created a new bot with BotFather and just swapped in the token. The chat ID (my phone) can be the same even with a different bot, so all it took was starting one conversation with the new bot. Keeping to the principle of "one bot = one recipient" let both coexist peacefully. I learned again why clearly dividing resource ownership matters in automation.

## /kill — The Red Button to Pull Your Hands Off

The scariest thing in an unattended system is the situation where "something's off but there's no way to stop it." So I made it so that a single `/kill` from my phone **instantly blocks all order placement**.

`/kill` turns on the kill switch in the config file, and the gate checks this first thing on every order and blocks unconditionally. Because the daemon re-reads the config every loop, no restart is needed. Once things settle, I revert with `/unkill`. It's a small detail, but when turning on the kill switch I made it **edit only that one line, preserving comments**, rather than rewriting the entire config file. The more a safety mechanism is meant for emergencies, the more it must have no side effects.

## Every Day at the Same Time — The launchd Schedule

I left automatic execution to macOS's launchd. I registered four jobs that run only on weekdays.

- **Always on**: the Telegram daemon (receiving approvals and commands)
- **08:30**: pre-market briefing
- **09:30**: trading cycle (push proposals)
- **15:40**: closing report

Here too there was a minor but annoying trap. launchd opens the log file **before** running the job. So if the log folder doesn't exist yet, the job fails silently. I solved it with a single line in the install script that creates the log directory in advance. These were things I caught in code review — the kind of "it looks like it's running but no logs show up" bug, so I'm glad I headed it off in advance.

![analog clock at 12 am](https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxhdXRvbWF0aW9uJTIwY2xvY2slMjBzY2hlZHVsZSUyMGFsYXJtfGVufDF8MHx8fDE3ODE4NTU5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Djim Loic](https://unsplash.com/@loic?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/analog-clock-at-12-am-ft0-Xu4nTvA?utm_source=spice-bandit-blog&utm_medium=referral)*

## Morning Briefing and Closing Report

This is one of the goals I wrote down back in installment 1: the "daily report."

**The 08:30 morning briefing** shows, before the market opens, the valuation P&L of held positions, cash, and the candidates the screener is watching today, all at a glance. It's for getting a feel for the day's market on my commute.

**The 15:40 closing report** sums up the day's fills and realized/valuation P&L. It's for confirming, as I close out the day, what the bot did today and how the account changed.

Both simply organize and send facts; neither makes a fresh judgment like "buy/sell this stock." The report only assists — decisions are the job of the analysts, the gate, and human approval.

## On Market Holidays, It Rests

launchd can trigger on weekdays only, but it doesn't know about public holidays. So I put in a small calendar module that filters out weekends and Korean market holidays, and when the trading/report jobs start, if it's a holiday they simply do nothing and exit.

Here too I made safety the default. Even if the holiday list is somehow wrong, the wrong direction is not "running on a day it should rest" but "not running on a day it should run." In other words, I designed it to fail toward the safe side (doing nothing) rather than the side where a mistake is costly (an errant order).

## The Operations System Is Complete

If installments one through four were "the brain that thinks and buys and sells," this installment is the operations system where that brain **wakes up and works on its own every day, asks me at the important moments, and stops when there's danger**. The flow now runs like this.

> 09:30 auto-run → analyst aggregation → risk sizing → gate check → proposal to phone → I tap a button → order via the gate → closing report

What I confirmed again while building it is exactly the lesson repeated throughout the series. **Deterministic work like repetition, scheduling, and gating to code; interpretation and judgment to humans and the LLM.** And the more convenient automation makes things, the more clearly you have to keep the red button (`/kill`) and the doubled-up safety mechanisms in place.

Automated trading doesn't guarantee profit. What this system really does is only *execute set rules without emotion, within set risk limits, the same way every day*. Validating performance comes after that — the job of time and data.

Thank you for staying with this long series to the end. To anyone trying to build something similar, I hope this record serves as a map that helps you steer clear of the same pitfalls.

---

📚 [← ④ Trading and Safety](/blog/claude-code-stock-agent-4-trade-safety/) · [① Start from Goals and Design](/blog/claude-code-stock-agent-1-design/)

*※ This article is a personal project build log, not a recommendation to buy or sell any specific stock and not investment advice. Automated trading carries the risk of loss, and all investment decisions and responsibility rest with you.*
