---
title: "5 Claude Code Examples in the Official Claude App (Excel, PDFs, Folders)"
description: "Five Claude Code examples run from the official Claude desktop app — no terminal. Merging CSVs, sorting a downloads folder, pulling fields out of PDFs, collecting public data, and building a one-page report, with the exact prompts and the places they broke."
pubDate: 2026-11-18T05:23:56+09:00
updatedDate: 2026-11-18T09:52:18+09:00
category: ax
tags: ["Claude Code", "Claude desktop app", "automation", "AI at work"]
lang: en
koSlug: 2026-11-18-claude-code-examples-excel-pdf-folder
---

This is for anyone who opened the **Code tab** in the Claude app and then stared at an empty prompt box. Here's the short answer: the first thing to hand Claude isn't code — it's **the repetitive file work**. Merging a stack of spreadsheets, sorting a downloads folder, pulling three fields out of fifty PDFs. You can verify all of it with your own eyes without reading a line of code, which makes it the safest place to start.

The five below are ones **I actually ran, with the outputs and the failures included.** The prompts are copy-paste ready, and each example ends with where it broke on me. Two traps bite the moment you touch non-English files — text encoding and PDF text extraction — and I'll show you both with real output.

| Example | The one-line ask | Most common failure |
|---|---|---|
| **① Merge CSVs/Excel** | "Combine the monthly files in this folder and give me a month × region table" | **Encoding of CSVs saved by Excel** — a whole column goes silently blank, or the read dies outright |
| **② Sort a folder** | "Sort my downloads into year-month/extension folders. **Print the plan first**" | Files get moved before you see the plan, and you **can't undo it** |
| **③ Pull fields from PDFs** | "From these 12 PDFs, extract vendor, date, and total into a table" | **PDFs where only the non-Latin text garbles** — the numbers look fine, which is worse |
| **④ Collect public data** | "Fetch the rate from this public API and append it to a CSV by date" | Redirects, robots.txt, and terms of use left unchecked |
| **⑤ One-page web report** | "Read this CSV and render a table and bar chart as a single HTML file" | Never opening the result in a browser |

![Hands typing on a laptop displaying a data spreadsheet](https://images.unsplash.com/photo-1783115259399-3a5a3e0e4592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzcHJlYWRzaGVldCUyMG9mZmljZSUyMGRlc2slMjB3b3JrfGVufDF8MHx8fDE3OTQ5NDYwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Gorilla ROI Data Connector](https://unsplash.com/@gorillaroi?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/hands-typing-on-a-laptop-displaying-a-data-spreadsheet-9fZuqBYlV1w?utm_source=spice-bandit-blog&utm_medium=referral)*

## Before you start — setup lives in the other article

Short answer: **installing the app, the Code tab, picking a folder, and permission modes were all covered last time.** If you're new, read [How to Use Claude Code Without a Terminal](/en/blog/2026-10-15-claude-app-claude-code-how-to-use/) first. This article only handles the next question: **what do I actually ask it to do?**

Three lines of recap. ① Install the Claude desktop app and **Claude Code is already in it** — no Node.js, no CLI. ② **Code tab** at the top → choose **Local** → point it at a folder. ③ Pick a **permission mode** in the row under the send button. A paid subscription (Pro, Max, Ultra, Team, or Enterprise) is required.

Every example below **creates or changes real files**, so settle the permission mode first. Per the official docs:

| Mode | File edits | Terminal commands | Use it here for |
|---|---|---|---|
| **Plan** | **None** (reads and explores, then proposes a plan) | Exploration — but where auto mode is available, a classifier decides instead of prompting you | Getting the approach before a large change |
| **Manual** | Asks every time | Asks every time | **Start here.** Per the docs, it auto-approves reads only |
| **Accept edits** | Auto-accepted (plus the filesystem commands `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed`) | Still asks for anything else | The second time you run the same job |
| **Auto** | Automatic | A classifier checks shell and network actions against your request first | Once you're comfortable |

Remember one thing from that table: **the filesystem commands Accept edits auto-approves aren't just `mv` — they include `rm` (delete) and `sed` (bulk find-and-replace).** The scope is paths inside your working directory and any additional directories you've allowed. Run example ② in Accept edits and files start moving without a prompt, which is why ② belongs in **Manual**. That said, recognized critical-path removals like `rm -rf /` or `rm -rf ~` are **never auto-approved in any mode** — the docs are explicit that no allow rule or hook can approve one either.

(The docs list two more beyond these four: **Bypass permissions** and **Don't ask**. The former is for sandboxed containers and VMs only, so leave it out of everything in this article.)

## How to write the prompt — the docs only ask for three things

Short answer: **①be specific ②give it a way to check itself ③demand evidence.** That's the core of Claude Code's official best-practices page.

**① Be specific.** The docs' own before-and-after:

| Instead of | Try |
|---|---|
| *"fix the login bug"* | *"users report login fails after the session times out. look at token refresh in `src/auth/`, **write a failing test that reproduces it**, then fix it"* |
| *"add a calendar widget"* | *"follow the pattern in `HotDogWidget.php` and build a calendar widget that lets you pick a month and page between years. **no new libraries**"* |

Translated to office work: not "clean up this spreadsheet" but **"merge the monthly CSVs in `sales/`, columns in the order date, region, product, qty, amount, amount as a number, save as `merged.csv`."**

**② Give it a check.** The docs put it this way: give Claude something that **comes back pass or fail**, and it can close the loop itself. For a developer that's a test suite. For office work, **one number you can cross-check** is enough: "confirm the amount total of the three source files equals the total in the merged file, and if it doesn't, find the cause and fix it." That single line does the job a test suite does.

**③ Demand evidence.** The docs are blunt: *"'All tests pass' on its own tells you very little."* So ask for **the command it ran and the output**. In office terms: "print the row count before, the row count after, and both totals."

One footnote. The docs state that phrases like `think step by step` or `be thorough` are **ordinary prompt text rather than keywords** — such wording can still nudge Claude a little, but the actual control over how hard it thinks is a separate **effort level** setting. They do single out **`be ambitious`** as still useful: Claude tends to read a request conservatively and build the smallest thing that satisfies it, so if you want the fuller version, you have to say so.

> **Where these prompts were run** — I ran these in Claude Code on macOS against sample files I created. The app's Code tab and the terminal CLI share the **same engine**, so behavior and results match ("Claude Code runs the same underlying engine everywhere," per the docs); what differs is the review UI around it. The sample is three months of sales CSVs totaling eight rows, so swap the filenames and column names for your own.

## Example ① — Merge monthly CSV/Excel files and aggregate

**①The situation.** Sales files split by month pile up in a folder, and every quarterly report means copy-pasting them together. It's the single most common office task, and done by hand you won't notice a missing row.

**②The prompt.**

```text
sales/ contains several monthly sales CSVs. Do the following.

1. Merge them all into merged.csv. Columns in the order date, region, product, qty, amount.
2. The files may use different encodings (including CSVs saved by Excel). Handle them without garbling.
3. Build a month × region amount table and print it.
4. Verify: confirm the amount total of the source files equals the total in merged.csv,
   and print source row count / merged row count / both totals. If they differ, find the cause and fix it.
```

**③What Claude does.** It reads the folder, checks each file's header row, then writes and runs a small script. Step 4 is the important one — if the totals don't match, Claude finds the cause (encoding, mismatched headers) **on its own** and runs again. Here's the output from my sample:

```text
rows: 8  amount sum: 3,400,000

month    | Gwangju  | Daegu    | Busan    | Seoul      | total
2026-09  | 0        | 0        | 120,000  | 1,050,000  | 1,170,000
2026-10  | 0        | 300,000  | 150,000  | 880,000    | 1,330,000
2026-11  | 660,000  | 0        | 0        | 240,000    | 900,000
```

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 680 270" style="width:100%;height:auto" role="img" aria-label="Actual output from example 1: a bar chart of monthly sales totals. September 2026 is 1.17 million, October is 1.33 million, November is 0.9 million. October is the largest and November the smallest. Sample data merged from three CSV files totaling eight rows.">
<text x="0" y="18" font-size="17" font-weight="700" fill="#23201D">Example ① output — monthly totals (sample data)</text>
<text x="0" y="38" font-size="13" fill="#8A8378">Result of merging 3 CSVs and 8 rows. Taller bar = larger month. Unit: KRW 10,000</text>
<line x1="70" y1="200" x2="660" y2="200" stroke="#E5DECF" stroke-width="1.5" />
<line x1="70" y1="60" x2="660" y2="60" stroke="#E5DECF" stroke-width="1" stroke-dasharray="3 3" />
<text x="62" y="64" font-size="12" fill="#8A8378" text-anchor="end">140</text>
<text x="62" y="204" font-size="12" fill="#8A8378" text-anchor="end">0</text>
<rect x="110" y="83" width="100" height="117" fill="#4E7FA8" rx="3" />
<text x="160" y="76" font-size="14" font-weight="700" fill="#23201D" text-anchor="middle">117</text>
<text x="160" y="222" font-size="13.5" fill="#23201D" text-anchor="middle">2026-09</text>
<rect x="290" y="67" width="100" height="133" fill="#1B4F8A" rx="3" />
<text x="340" y="58" font-size="14" font-weight="700" fill="#1B4F8A" text-anchor="middle">133</text>
<text x="340" y="222" font-size="13.5" fill="#23201D" text-anchor="middle">2026-10</text>
<rect x="470" y="110" width="100" height="90" fill="#A8BDD2" rx="3" />
<text x="520" y="103" font-size="14" font-weight="700" fill="#23201D" text-anchor="middle">90</text>
<text x="520" y="222" font-size="13.5" fill="#23201D" text-anchor="middle">2026-11</text>
<text x="0" y="252" font-size="12.5" fill="#8A8378">※ Total of KRW 3.4M matches the sum of the three source files — the step-4 check passed.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">Real output from sample data the author created. The amounts themselves mean nothing; what matters is that one prompt covered merge, aggregate, and verify in a single pass.</figcaption>
</figure>

**④What to check before accepting.** In the diff view, look at **the new files (`merged.csv` and the script)**. Three things only: ⓐ does the **row count** equal the sum of the sources, ⓑ does the **total** match, ⓒ **are there rows with a blank date?** If any of the three is off, don't accept — say so. Click the **+** beside the line number in the diff to open a comment box, type it, and press `Enter` to add the comment. Once you've marked up every line, submit them all at once with `Cmd+Enter` on macOS or `Ctrl+Enter` on Windows; Claude reads them and revises.

**⑤Where it broke — encoding, trap number one.** Two failures I reproduced.

First, **a UTF-8 CSV saved by Excel carries an invisible marker called a BOM** at the very start. The first column then reads as `﻿date` instead of `date`. The symptom is nasty: **no error is raised.** Only the rows from that file lose their date values, silently, and since the totals still match, your verification passes. In my run, the third file's header came back like this:

```text
sales/2026-09.csv ['date', 'region', 'product', 'qty', 'amount']
sales/2026-10.csv ['date', 'region', 'product', 'qty', 'amount']
sales/2026-11.csv ['﻿date', 'region', 'product', 'qty', 'amount']   ← first column name differs
```

Second, saving as "CSV (comma delimited)" from Excel on Windows often writes a **legacy local codepage rather than UTF-8** — cp949 for Korean, a Windows-only extension of EUC-KR. That one fails loudly:

```text
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xbc in position 43: invalid start byte
```

**Why is this still happening in 2026?** Neither symptom is a bug. They're three generations of standards sitting in one folder. The 1987 Korean standard (KS C 5601:1987) assigned codes to only **2,350 of the 11,172 Hangul syllables** — the common ones — which meant rarer syllables simply couldn't be typed, and the resulting fight over which encoding scheme should win was heated enough that Korea's National Institute of Korean Language ran both sides' arguments side by side in a 1990 journal issue. Microsoft, from the Korean edition of Windows 95 onward, bolted **8,822 more characters** on top to cover all 11,172 — that's cp949, and it's still the default save encoding in Excel on Windows. The BOM is the legacy of the opposite problem: a CSV file has nowhere to record its own encoding, so when Excel saves as UTF-8 it stamps three bytes at the front meaning "this is UTF-8" — even though the Unicode standard itself says a BOM is **"neither required nor recommended"** for UTF-8. Every office CSV you open is a collision between 1987, 1995, and now.

**The fix is one line in the prompt.** Keep step 2 above ("the files may use different encodings — handle them without garbling") and Claude adds BOM handling and codepage detection. If you left it out, say this: **"rows from the November file have empty dates. Re-check the encoding and the headers."** And better still, **tell it to work on a copy of the originals** from the start.

## Example ② — Sort a downloads folder by year-month and extension

**①The situation.** Hundreds of files in your downloads folder, and you can't find last month's contract. **This is the one example with a different character — it moves files, which is hard to undo.** So the safety rails go into the prompt itself.

**②The prompt.**

```text
I want to tidy up ~/Downloads. Sort files into year-month folders by modified date,
then into subfolders by extension. But follow this order:

1. First print only the "source → destination" plan as a table, then stop. Don't touch any file.
2. Flag any case where a file of that name already exists at the destination (overwrite risk).
3. Only move files after I reply "go".
4. After moving, leave a record I can reverse (a list of what moved from where to where).
```

**③What Claude does.** Because of step 1, the first turn **moves nothing** and prints only the plan. From my sample folder:

```text
source                         -> destination
dl/IMG_4821.jpg              -> dl/2026-10/jpg/IMG_4821.jpg
dl/IMG_4822.jpg              -> dl/2026-11/jpg/IMG_4822.jpg
dl/contract_final.pdf        -> dl/2026-09/pdf/contract_final.pdf
dl/report.xlsx               -> dl/2026-11/xlsx/report.xlsx
dl/installer.dmg             -> dl/2026-11/dmg/installer.dmg

5 files total. Nothing was moved (plan only).
```

**④What to check before accepting.** Here the thing to review isn't a diff — it's **the table itself**. ⓐ **Is anything headed somewhere absurd** (an app installer filed under documents)? ⓑ **Are any rows flagged for overwrite?** ⓒ **Does the count match what you expected?** Then **re-check your permission mode.** Accept edits auto-approves `mv`, so the moment Claude skips step 1, your files have already moved. **Start this one in Manual.** Manual auto-approves reads only, per the docs, so a move is genuinely blocked. Plan is good for getting the approach first, but in sessions where auto mode is available, the default (`useAutoModeDuringPlan`) hands shell commands to the classifier instead of prompting you — so it doesn't guarantee anything about a Bash command like `mv`.

The docs draw exactly this distinction. "Print the plan and stop" in a prompt is a **non-deterministic instruction** — Claude reads it and decides; it usually follows, but there's no guarantee. **Deny rules, hooks, and managed settings** are **deterministic** — Claude Code (the harness) applies them every time, regardless of what the model decided. Permission modes are a threshold the harness enforces, so they belong on that side too. Which means: **irreversible work should be blocked by the mode, not by the prompt.**

And this distinction isn't something AI invented. Putting "show me before you do it" in front of an irreversible action is a habit software has been building for half a century. Undo is generally credited to FRESS, built at Brown University starting in 1968, and `make` — the Unix build tool written at Bell Labs in 1976 — already documented its `-n` flag in the 1979 V7 manual as "trace and print, but do not execute the commands." That's what `rsync --dry-run` and `terraform plan` do today, and it's what step 1 of example ② does. With one decisive difference: `make -n` is **a feature of the program**, so it cannot be disobeyed, while "print the plan only" is **a request handed to something that reads and decides.** The reason the half-century-old habit was safe is that it wasn't a request. Which is why the mode has to do the blocking.

![Hands organizing files in a box, symbolizing investigation and research.](https://images.pexels.com/photos/8371705/pexels-photo-8371705.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [cottonbro studio](https://www.pexels.com/@cottonbro) on [Pexels](https://www.pexels.com/photo/cardboard-box-full-of-file-folders-8371705/)*

**⑤Where it breaks.** Three places. ⓐ **Modified date isn't the date you received the file** — copying or editing resets it, so "the file I downloaded last year" can land in this year's folder. If the date basis matters, say "by modified date" explicitly or ask for creation date instead. ⓑ **Extension-less and hidden files** go wherever Claude feels like unless you decide for them. ⓒ **Running this inside a sync folder (iCloud, Drive, Dropbox) fights the sync client.** Practice somewhere that isn't synced, like your downloads folder.

## Example ③ — Pull specific fields out of a stack of PDFs

**①The situation.** Dozens of quotes or invoices as PDFs, and you need vendor, date, and total in a spreadsheet. By hand that's 30 seconds each — 25 minutes for 50 files.

**②The prompt.**

```text
From the PDFs in quotes/, extract vendor, quote date, and total into quotes.csv.

1. First try a single PDF and show me the raw extracted text as-is.
   I want to see with my own eyes whether the text comes out garbled.
2. If it's garbled, abandon text extraction and switch to an OCR path (and explain why).
3. After the full run, give me a separate list of rows where the amount is blank or zero.
4. Don't delete any file that failed to extract — put it on a failure list.
```

**③What Claude does.** Step 1 is the whole prompt, really. PDFs look alike but come in three kinds inside, and **if you don't test one first, you extract fifty wrong.**

**This is an example where you need the "where it breaks" part first — here's what happened to me.** I pulled text straight out of a Korean-language quote PDF and got this:

```text
extracted text: 'Ѽ੸ࢲ  \nস୓ݺ :оա׮੹ӝ  \nѼ੸ੌ: 2026-11-10  ...'
```

The original reads `Quote / Vendor: Ganada Electric / Quote date: 2026-11-10` in Korean. **Only the Korean garbles; digits and Latin characters survive.** You can see why that's dangerous — the amount and the date look correct, so it's easy to glance at the one weird field and assume it's a font issue. And this wasn't a scan: the PDF **definitely had a text layer.** It happens when glyphs are stored under font-specific codes and the mapping table (ToUnicode) is missing.

That's the design, not an accident. PDF traces back to a 1991 internal Adobe project ("Camelot") led by co-founder John Warnock, and the goal was **reproducing the printed appearance identically anywhere you open it.** The table that maps character codes back to Unicode — ToUnicode — was a later addition in PDF 1.2 (1996), and even then an **optional** one. In a format where preserving appearance is a guarantee and recovering the characters is a courtesy, a file that looks fine but extracts badly isn't a malfunction. It's the design showing through.

Switching to OCR recovers it. Here's the actual result after rasterizing the same file and running OCR:

```text
Quote

Vendpr: Ganada Electric      ← "Vendor" misread
Quote date: 2026-11-10
Total: 4,730,000 KRW         ← amount correct
```

**It recovers, but typos come with it.** One of four lines was wrong. The amount happened to be right this time; it could just as easily have been a digit in the total. So if you go the OCR route, **cross-check the amounts against the originals.**

<figure style="background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:16px;margin:24px 0;">
<svg viewBox="0 0 680 300" style="width:100%;height:auto" role="img" aria-label="Three routes for extracting fields from PDFs. Direct text extraction is fast but non-Latin text may garble while digits and Latin characters survive. OCR is slower but recovers the text with typos, so amounts need cross-checking. Asking for the original file is most accurate but depends on the other party.">
<text x="0" y="18" font-size="17" font-weight="700" fill="#23201D">Getting fields out of a PDF — three routes, more accurate as you go down</text>
<text x="0" y="38" font-size="13" fill="#8A8378">Test one file to find out which route applies, then run the whole batch</text>
<rect x="0" y="52" width="680" height="72" fill="#A8BDD2" rx="5" />
<text x="16" y="76" font-size="15" font-weight="700" fill="#23201D">1. Direct text extraction</text>
<text x="16" y="98" font-size="13.5" fill="#23201D">Fastest. But some PDFs garble non-Latin text while digits and Latin stay clean,</text>
<text x="16" y="116" font-size="13.5" fill="#23201D">so the broken field is easy to wave off. Always eyeball one file's raw output.</text>
<rect x="0" y="132" width="680" height="72" fill="#4E7FA8" rx="5" />
<text x="16" y="156" font-size="15" font-weight="700" fill="#FAF6EE">2. Rasterize and OCR</text>
<text x="16" y="178" font-size="13.5" fill="#FAF6EE">Recovers the text. Slower, and typos creep in (measured: 1 of 4 lines misread).</text>
<text x="16" y="196" font-size="13.5" fill="#FAF6EE">Scanned PDFs leave no other option. Cross-check the amounts once.</text>
<rect x="0" y="212" width="680" height="72" fill="#1B4F8A" rx="5" />
<text x="16" y="236" font-size="15" font-weight="700" fill="#FAF6EE">3. Ask for the source file or spreadsheet</text>
<text x="16" y="258" font-size="13.5" fill="#FAF6EE">Most accurate and fastest — but it leaves your hands and depends on someone</text>
<text x="16" y="276" font-size="13.5" fill="#FAF6EE">else. Worth asking first if the volume is high and the task recurs.</text>
</svg>
<figcaption style="font-size:13px;color:#8A8378;margin-top:10px;">Routes 1 and 2 were verified by the author against a real Korean-language quote PDF (2026-11-18). Which route works depends on the program that produced the PDF, so testing one file before the batch is the whole point.</figcaption>
</figure>

**④What to check before accepting.** ⓐ **Read the raw text from the single-file test.** Ten seconds here saves re-running 50 files. ⓑ The **"blank or zero amount" list** from step 3 — check whether those are genuinely zero or failed extractions. ⓒ **Confirm the original PDFs are still there.** That's what step 4 is for.

**⑤Where it breaks, part two — the package-install prompt.** The garbled text above was the first failure; this is the second. PDF and `.xlsx` handling often needs extra libraries (my environment had neither `openpyxl` nor `pandas`), so Claude will try to install them. **In Manual mode you'll get an approval dialog — don't accept a command you don't recognize.** Ask what it's installing and why first.

## Example ④ — Collect public data and append it by date

**①The situation.** A public indicator that changes daily — an exchange rate, a benchmark rate, an oil price — that you retype into a report every morning.

**②The prompt.**

```text
Write a script that fetches the USD/KRW rate from the public API below and appends
one row per day to rates.csv with columns date,krw.
https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW

1. First call the URL once and show me the raw JSON response as-is.
2. If today's date is already present, skip instead of adding a duplicate.
3. If the call fails, leave the existing CSV untouched and print the reason.
4. Check the site's terms of use and robots.txt for limits on automated requests and tell me.
```

**③What Claude does.** Step 1 shows the real response. Mine:

```json
{"amount":1.0,"base":"USD","date":"2026-11-17","rates":{"KRW":1336.21}}
```

For step 4 it reads `robots.txt` and reports back (this API returned `User-agent: * / Allow: /`). **Keep step 4.** Public data or not, every site sets its own terms for automated access, and scraping behind a login or against the terms is a different question entirely. And **if there's an API, use the API** — screen scraping breaks silently the next time the site is redesigned.

**④What to check before accepting.** ⓐ **Check the date in the response.** **It being older than today can be normal** — this API serves European Central Bank reference rates, published in the afternoon European time, so a morning call from Asia returns the previous business day. The call above ran on the morning of Wednesday, November 18 and came back with `date` as Tuesday, November 17 (the same applies over weekends and holidays). If the date matters to your report, build that lag into it. ⓑ **Does a failure really leave the existing file alone** (step 3)? ⓒ **Is a key hardcoded?** If the service needs an API key, tell Claude to read it from an environment variable instead of writing it into the file — otherwise the key travels with the file the first time you send it to someone. ⓓ **Have it check the response headers too.** At the time of writing, that v1 URL returned a `Deprecation` header (2026-05-18) along with a pointer to a successor version (`/v2/rates`). It works today, but for a script you'll run daily, add one more line: **"check whether the response headers carry Deprecation or Sunset and tell me."**

**⑤Where it breaks.** ⓐ **Redirects.** My first call to a slightly different host returned `301 Moved Permanently` with an HTML body. Tell Claude "that returned HTML, not JSON" and it fixes the script to follow redirects. ⓑ **Call frequency.** Fetch per-minute data that changes daily and you'll get blocked. If once a day is enough, say so. ⓒ **Running it automatically takes separate setup.** The app's **Scheduled tasks** can run it every morning, but that's configured separately. A local session itself stops when you close the app.

## Example ⑤ — Finish with something you can see: a one-page report

**①The situation.** The examples above end in CSVs, which makes it hard to feel whether they worked. End with **something on screen.**

**②The prompt.**

```text
Read merged.csv and build a single HTML page showing a monthly total table and a bar chart.

1. One file, no external libraries or CDNs. It should open on double-click.
2. Thousands separators on numbers, and put the currency unit in the table.
3. After building it, open it in a browser yourself, confirm the table total matches
   the CSV total, and report back.
4. be ambitious: handle the empty-data state and how it looks when printed.
```

**③What Claude does.** It writes one HTML file, and in the app it opens it in the **Browser pane (`Cmd+Shift+B`)** and fixes what it sees. This is where the docs' **app preview** pays off most — having Claude look at its own output and revise is awkward to arrange in a terminal.

**④What to check before accepting.** ⓐ **Open it in a browser yourself.** HTML can be valid and still look broken. ⓑ **Cross-check the table total against the CSV total** (step 3). ⓒ **Did it pull in an external CDN?** If a chart library snuck in despite step 1, the graph disappears on a machine without internet.

**⑤Where it breaks.** ⓐ **Numbers sorted as strings** ("1,000,000" ordering below "900,000"). Check the sort before this goes in a report. ⓑ **Fonts.** Leave the font unspecified and it renders differently per machine. ⓒ **Drop `be ambitious` from step 4** and you get the bare minimum — table and chart, nothing else. Exactly as the docs describe: Claude reads requests conservatively.

## What the app can't do — the line against the terminal CLI

Short answer: **the app covers nearly everything, but scripting and the Agent SDK are CLI-only.** The docs put it as: the CLI is the most complete surface for terminal-native work, and scripting plus the Agent SDK live only there. Pretending otherwise just gets readers stuck, so here it is precisely.

| What you want | Desktop app | Note |
|---|---|---|
| All five examples above | **Yes** | Local session, Local environment |
| Reviewing changes as a diff with line comments | **Yes** (the app's strength) | Nicer than the CLI |
| Keeping work running after you close the app | Local sessions **stop** | Send it to a **cloud session** and it continues |
| Manual mode in a cloud session | **No** | Only Accept edits, Plan, and Auto |
| Editing files directly in cloud, SSH, or WSL | **View-only** | Ask Claude to make the edit |
| Installing plugins | **No** in cloud and WSL sessions | Local works |
| App preview (Browser pane) | In SSH, **Claude can't use it** | To view it yourself, forward the port. A single HTML file can be previewed by clicking its path in the chat |
| Letting Claude drive your screen (computer use) | Pro, Max, Ultra only, and **off by default** | Not on Team or Enterprise. A **research preview** on macOS and Windows (macOS 14+) |
| Calling Claude from a shell script, the Agent SDK | **No — CLI only** | Matters when you're building an automation pipeline |

Settings, project memory (`CLAUDE.md`), and MCP servers are shared across the local surfaces. Start in the app and install the CLI later and **your configuration follows you into the same project.**

## So what — the question isn't "is it code," it's "can I undo it"

Look at the five again and they share one property: **you can check every result against a number or a screen.** Does the total match, is the file count right, does it open in a browser. The docs' line about giving Claude "something that comes back pass or fail" reads like developer advice, but it's **more important for non-developers**. The less code you can read, the more that one cross-checkable number is your only safety rail.

So the criterion for choosing your first job isn't whether it involves code. It's **whether you can undo it.** In order:

1. **Things that create something new.** A merged file (①), a report page (⑤) — nothing original is touched, so a wrong answer costs you a delete.
2. **Things that only read.** Extracting from PDFs (③), fetching data (④) don't modify the sources.
3. **Things that move originals, last.** Folder sorting (②): block it with the mode, get the plan first, practice on a copy.
4. **Attach one verification line every time.** "Confirm the totals match and show me the command and its output." The gap between a prompt with that line and one without is bigger than the gap between models.

If you're stuck at the empty prompt box, think of **one file chore you did by hand twice this week.** That's your first prompt.

---

**Related reading**
- [How to Use Claude Code Without a Terminal (Desktop App)](/en/blog/2026-10-15-claude-app-claude-code-how-to-use/)
- [Which Claude Model Should You Use?](/en/blog/2026-11-11-claude-model-which-to-use-pricing/)
- [Every Claude Error Message, and How to Fix It](/en/blog/2026-08-26-claude-error-messages-fix-guide/)
- [VS Code + Claude Code Setup Guide](/en/blog/vscode-claude-code-setup-guide/)

**Sources**
- [Claude Code — Get started with the desktop app (official docs)](https://code.claude.com/docs/en/desktop-quickstart) — subscription requirement, the Code tab, Local environment, change-review flow
- [Claude Code desktop app reference (official docs)](https://code.claude.com/docs/en/desktop) — permission-mode behavior, diff line comments and submit shortcuts, cloud/SSH/WSL limits, app preview, computer-use requirements
- [Claude Code best practices (official docs)](https://code.claude.com/docs/en/best-practices) — the specific-prompt comparison, "something that comes back pass or fail," asking for evidence, deterministic vs non-deterministic instructions, `be ambitious`
- [Claude Code platforms (official docs)](https://code.claude.com/docs/en/platforms) — same engine on every surface, scripting and the Agent SDK being CLI-only, settings/memory/MCP shared across surfaces
- [Claude Code permission modes reference (official docs)](https://code.claude.com/docs/en/permission-modes) — the full list of filesystem commands Accept edits auto-approves (including `rm` and `sed`) and its scope, Manual's reads-only rule, the `useAutoModeDuringPlan` default, and the rule that critical-path removals are never auto-approved in any mode

**Sources for the historical claims**
- ["The standard Hangul code should be the composition type" and "Background and remedies for the completed-form Hangul code" (*Sae Gugeo Saenghwal*, 1990, National Institute of Korean Language)](https://www.korean.go.kr/nkview/nklife/1990_2/21_8.html) — primary record of both sides of the encoding debate
- [Unicode FAQ — UTF-8, UTF-16, UTF-32 & BOM](https://www.unicode.org/faq/utf_bom.html) — a BOM is "neither required nor recommended" for UTF-8
- [Adobe PDF Reference 1.7](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.7old.pdf) — the font dictionary's `ToUnicode` entry as an **optional** addition in PDF 1.2 (§5.9, ToUnicode CMaps)
- [UNIX V7 `make(1)` manual (1979)](https://www.unix.com/man-page/v7/1/make/) — the `-n` flag: "trace and print, but do not execute the commands"

*※ Screens and menu names change as the app updates. The docs were checked on November 18, 2026, and the outputs were produced the same day on macOS.*
