---
title: "Auto-Querying the DART Disclosure API with Claude Code"
description: "How to connect Korea's DART electronic disclosure Open API to Claude Code to pull listed companies' financials, filings, and executives in one command — plus delivering results via Telegram as text, PPT, or Excel."
pubDate: 2026-06-20T18:00:00+09:00
category: ai
tags: ["ClaudeCode", "DART", "disclosure", "OpenAPI", "Python"]
lang: en
koSlug: 2026-06-20-dart-api-claude-code
---

The most frustrating moment when researching a company is when the executive roster or performance figures differ subtly between Wikipedia and each news article. To check who's right, you ultimately have to go to the **original DART electronic disclosure**. But the DART site is labor-intensive — you have to click into reports one by one and dig through PDFs. So I **connected the DART Open API to Claude Code**, so that a single line like "show me Samsung Electronics' financials" surfaces the source numbers right away. This article lays out that process exactly as it went, from issuing the key to the actual execution screens.

![graphs of performance analytics on a laptop screen](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_source=spice-bandit-blog&utm_medium=referral)*

## Why Bother Connecting via API?

News and wiki summaries have two weaknesses. First, they're **inaccurate**. The list of outside directors may be outdated, or a name gets mistyped in the process of transcription. Second, **the time frames get mixed up**. Last year's appointments and this year's appointments get blended into one sentence, making it confusing who's currently in office.

The DART Open API is official electronic disclosure data operated by the Financial Supervisory Service. It hands you the original text of the annual and quarterly reports that listed companies are required to file, exactly as filed. In other words, **the source is the primary document itself**. Layer Claude Code on top, and when you ask in natural language, Claude calls the API on its own and organizes the numbers for you. There's no need for a person to memorize a corp_code or parse JSON.

## Step 1 — Get an OpenDART API Key (Free, 5 Minutes)

All you need is one key. There's no cost.

1. Go to **opendart.fss.or.kr** → top-right **[Apply/Manage Auth Key] → [Apply for Auth Key]**
2. Enter your email, name, and purpose of use (e.g., "personal investment analysis") and submit
3. A **40-character API key arrives at the email** you signed up with (immediately to within a few minutes)

The usage limit is 20,000 requests per day, which is more than enough for personal use. Once you get the key, don't hardcode it into your code — store it in a `.env` file. This is important — a key is like a password, and if it gets pushed to git, it's exposed as-is.

```bash
# ~/projects/stockbot/.env  (must be excluded from git)
DART_API_KEY=your_40-character_key
```

## Step 2 — Build a Query Script with Claude Code

Just tell Claude Code: "Make me a Python script that takes only a company name and pulls its overview, financials, filings, and executives using the DART API." There are three key design points.

- **Company name → corp_code auto-conversion**: DART identifies companies by an 8-digit code. I had it download the full mapping file (corpCode.xml) once, cache it, and let you search by company name.
- **Read the key only from `.env`**: Don't leave the key in the source.
- **Split by command**: I made overview, financials, filings, and executives into separate subcommands.

The result was an interface like this.

```bash
python3 dart.py company <company name>   # company overview (CEO, industry, founding date)
python3 dart.py finance <company name>   # key financial accounts
python3 dart.py filings <company name>   # recent filings list
python3 dart.py execs   <company name>   # executive roster (birth, role, career)
```

![laptop computer on glass-top table](https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Carlos Muza](https://unsplash.com/@kmuza?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/laptop-computer-on-glass-top-table-hpjSkU2UYSU?utm_source=spice-bandit-blog&utm_medium=referral)*

## Actual Usage Screens

Words alone don't quite land, so here's a real query for SK Telecom, transcribed exactly.

**① Company Overview** — the current CEO and basic information at a glance.

```text
■ SK Telecom Company Overview
  Official name : SK Telecom Co., Ltd. (SK TELECOM CO.,LTD)
  CEO          : Jeong Jae-heon
  Ticker       : 017670
  Founded      : 19840420   Fiscal year-end: December
  Address      : 65 Eulji-ro, Jung-gu, Seoul
```

**② Key Financials** — compares the core accounts from the annual report, current period vs. prior period.

```text
■ SK Telecom Key Financials (FY2024 annual report · consolidated)
  Revenue          Current 17,940,609,000,000   Prior 17,608,511,000,000
  Operating profit Current  1,823,409,000,000   Prior  1,753,204,000,000
  Total assets     Current 30,515,255,000,000   Prior 30,119,227,000,000
  (Unit: KRW)
```

**③ Executive Roster** — beyond names, it includes **date of birth, role, and major career history (including education)**.

```text
■ SK Telecom Executive Roster (per annual report · 8 people)
● Yoo Young-sang  (President) · Born May 1970 · Inside Director
   Role : Representative Director
   Career : Former Head of SK Telecom MNO Business
● Kim Jun-mo  (Outside Director) · Born September 1976
   Career : Current Professor, School of Electrical Engineering, KAIST
```

This is a density you could never get all at once from news articles. With birth years and career histories attached, you can use it right away when qualitatively assessing the composition of a board.

## A Pitfall — Even the Source Has an "As-Of Date"

Here something interesting happened. In ① the company overview above, the CEO is listed as **Jeong Jae-heon**, but in ③ the executive roster (annual report), the representative director is listed as **Yoo Young-sang**. Both are original DART text — so why the difference?

The answer is the **as-of date**. The executive roster in an annual report is usually written as of **the end of the immediately preceding fiscal year**. If the representative director changes at the regular shareholders' meeting in the interim, the more frequently updated company overview reflects the new CEO, while the annual report — pegged to the end of last year — still shows the old one. So it's not "it's the source, therefore it's always the latest"; you have to look at **which point in time the source reflects**, too.

That's why I baked a rule into Claude Code as well. For items like executives and shareholdings, it **cross-verifies** the annual report (past as-of date) against the latest news, and when the time frames differ, it reports both while stating each one's as-of date.

![black and silver laptop computer](https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MTk2MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [path digital](https://unsplash.com/@pathdigital?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-and-silver-laptop-computer-tR0jvlsmCuQ?utm_source=spice-bandit-blog&utm_medium=referral)*

## One Step Further — Direct via Telegram, Receive as PPT or Excel

Once you get this far, a natural ambition follows. **Do you really need to sit at a computer and type commands?** So I connected this tool to Telegram. Send a message to the bot, and Claude Code queries DART, analyzes it, and **replies back via Telegram**. On the move, one line from your phone — "summarize ___'s recent filings" — and you're done.

The key point is that the form of the answer **isn't bound to text only**. Depending on the request, it changes the format of the output and delivers it as a file.

- **Text** — simple queries and summaries come straight to chat
- **Excel (.xlsx)** — "put the last 5 years of revenue and operating profit into a table" → receive numeric data as a spreadsheet and process it as-is
- **PPT (.pptx)** — "turn this analysis into a 10-slide deck" → receive slides with titles, body, and data, ready to use in a meeting

Even for the same question, a single phrase — "as a table," "as a PPT" — changes the format you get back. In effect, everything from data query (DART) to producing reports and presentation materials flows as a single conversation. In an environment like a one-person business, where you have to play many roles alone, the felt productivity gain from this "instruct → process → receive file" automation is significant.

## Wrapping Up

The core of the DART Open API + Claude Code combination is "trustworthy source data, in natural language, instantly." Issuing the key takes 5 minutes, and Claude writes the script for you. Connect it once, and company research, board analysis, and financial comparisons are done in one line without a single click — and wire it to Telegram, and you can receive those results anywhere as a PPT or Excel file.

Just remember that when interpreting the data, you have to read the context alongside it — like the "as-of date pitfall" we saw above, even the source document needs to be read with its context.

> This article is a usage account of a tool built by an individual; it is not a recommendation or advice to invest in any particular security. The ultimate responsibility for verifying all data rests with you.
