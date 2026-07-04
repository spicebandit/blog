---
title: "Free Public APIs for Developers: A Curated List"
description: "From Kakao/Naver maps and search to weather, exchange rates, AI (Claude/OpenAI), and GitHub — a developer's guide to free and free-tier private APIs you can use right away."
pubDate: 2026-06-27T10:00:00+09:00
category: ai
tags: ["free API", "public API", "developer tools", "API guide"]
lang: en
koSlug: 2026-06-27-free-developer-apis-guide
---

Running a single side project takes more data than you might expect. You drop a shop on a map, translate a foreign language, pull today's weather, calculate exchange rates, and bolt on a chatbot. You can't build all of this yourself, so you pull in **free APIs**. Fortunately, plenty of providers — from domestic companies like Kakao and Naver to global services like OpenAI and DeepL — open up **public APIs** to individual developers for free or on a free tier.

This post has a single core message: **for a personal project, you can start almost every key feature "within the free tier."** That said, you need to split the word "free" into three buckets. The first is **completely free** (cases like the Frankfurter exchange-rate API or OpenStreetMap that don't even require signup); the second is **the free tier** (sign up and get a set monthly quota for free, with charges only on the overage); and the third is **the rate-limited type** (only N calls per minute or per day are allowed, and you're blocked once you exceed it). Even among "free" services, some require a credit card and others don't, and some prohibit commercial use altogether. Start without knowing this distinction and you'll get hit with a surprise bill or a sudden block right after launch. The table and checkpoints below are meant to help you sidestep those traps.

![black laptop computer turned on on table](https://images.unsplash.com/photo-1587620962725-abab7fe55159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxkZXZlbG9wZXIlMjBsYXB0b3AlMjBjb2RlJTIwYXBpfGVufDF8MHx8fDE3ODMxMzQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [James Harrison](https://unsplash.com/@jstrippa?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-laptop-computer-turned-on-on-table-vpOeXr5wmR4?utm_source=spice-bandit-blog&utm_medium=referral)*

## Free Public APIs by Category at a Glance

The table below organizes private public APIs that are highly useful for personal projects, sorted by category. **Free tiers change frequently at the provider's discretion, so always verify directly on each provider's latest pricing/terms page.** The numbers in the table are approximate values confirmed as of June 2026.

| Category | API | Free tier (as of June 2026, subject to change) | Authentication |
| --- | --- | --- | --- |
| Maps/Places | Kakao Maps, Local, Search | Roughly 200,000/day for individuals, 300,000/day for businesses (check quota page) | REST API Key (header `Authorization: KakaoAK`) |
| Maps/Places | Naver Maps, Search | Varies by API, e.g. 25,000 searches/day; maps are usage-based | Client ID/Secret (header) |
| Maps/Places | OpenStreetMap (Nominatim, etc.) | Completely free (fair use; 1 request/sec recommended) | Not required (specifying a User-Agent recommended) |
| Translation/Language | Naver Papago | Free usage, then metered billing (check console) | Client ID/Secret (header) |
| Translation/Language | DeepL API Free | 500,000 characters/month, no daily cap, no rollover | API Key (header `Authorization: DeepL-Auth-Key`) |
| Weather | OpenWeatherMap | Classic: 60 calls/min, 1M calls/month; One Call: 1,000 calls/day (card required) | API Key (query parameter) |
| Weather | KMA (Public Data Portal) | Public, free (daily traffic cap, application approval) | Service key |
| Exchange/Finance | exchangerate.host | Free plan available (monthly call cap, check policy) | API Key (signup) |
| Exchange/Finance | Frankfurter | Completely free, no signup (ECB-based) | Not required |
| Exchange/Finance | Alpha Vantage | Free tier (around 25 calls/day, varies) | API Key (query) |
| AI/LLM | Claude (Anthropic) | $5 test credit on new consoles, then prepaid metered | API Key (header `x-api-key`) |
| AI/LLM | OpenAI | Primarily metered (promotional credits vary by period) | API Key (header `Authorization: Bearer`) |
| AI/LLM | Google Gemini | AI Studio free tier (no card; per-minute/per-day caps by model) | API Key (query/header) |
| Dev/Other | GitHub API | 5,000 requests/hour when authenticated (60 unauthenticated) | Personal Access Token |
| Dev/Other | ipapi (IP lookup) | Free daily/monthly cap (some access without a key) | API Key or keyless |
| Dev/Other | NewsAPI | Developer free: 100 requests/day, 24-hour delay, non-commercial | API Key |
| Dev/Other | Unsplash | Demo: 50 requests/hour; 5,000 after approval | Access Key (header) |
| Search Trends | Naver DataLab | Free (search trends/shopping insights, daily cap) | Client ID/Secret (header) |

There's a pattern worth noting in the table. For domestic services (Kakao, Naver), **registering an app and putting a Client ID/Secret in the header** is the standard, while many global services **pass a single API Key via query or header**. And the truly "no signup required," completely free options are limited to a handful — basically just Frankfurter and OpenStreetMap.

## Getting Started: Register → Issue a Key → First Call

The starting procedure is almost identical for nearly every API. Once you learn the flow, you can get a first response from any service in 30 minutes.

1. **Register an app (application) in the developer console.** For Kakao, use [Kakao Developers](https://developers.kakao.com); for Naver, the Naver Developers Center; for global services, each provider's own console. Create a new app.
2. **Issue your credentials.** Domestic services usually give you a `REST API Key` or a `Client ID`/`Client Secret` pair, while global services give you a single `API Key` string.
3. **Register a domain/referrer (required for web).** Kakao and Naver map JS work only on registered domains.
4. **Test your first call.** Send a request with the key in the header or query.

For example, a call that does a keyword search for "스타벅스" (Starbucks) via the Kakao Local API looks like this.

```bash
# Pass the REST API Key in the Authorization header with the KakaoAK prefix
curl -G "https://dapi.kakao.com/v2/local/search/keyword.json" \
  -H "Authorization: KakaoAK ${KAKAO_REST_API_KEY}" \
  --data-urlencode "query=스타벅스" \
  --data-urlencode "size=5"
```

The key is to **pull the key out into an environment variable, like `${KAKAO_REST_API_KEY}`, and parse only the fields you need from the response.** For global services, only the header name changes — `Authorization: Bearer ...` (OpenAI) or `x-api-key: ...` (Claude) — but the structure is the same.

> **Security warning:** Never hardcode an API key in your source code or commit it to a git repository. Keep it in an environment-variable file like `.env`, register that file in `.gitignore`, and call any secret key that must not be exposed to the browser **only from the server (or a serverless function)**, not the frontend. Immediately revoke and reissue any key you accidentally push.

![A MacBook with lines of code on its screen on a busy desk](https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGxhcHRvcHxlbnwxfDB8fHwxNzgyNDkxNTAyfDA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Christopher Gower](https://unsplash.com/@cgower?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/a-macbook-with-lines-of-code-on-its-screen-on-a-busy-desk-m_HRfLhgABo?utm_source=spice-bandit-blog&utm_medium=referral)*

## Practical Tips for Choosing Within Each Category

Even within the same category, the choice shifts depending on the nature of your project. Personally, here are the criteria I prioritize.

- **Maps/Places**: For domestic address and business-name search, Kakao Local has good data quality and a generous free tier. If global coverage or licensing freedom matters more, use OpenStreetMap — but with Nominatim you must honor the fair-use policy (1 request/sec).
- **Translation**: On quality alone, DeepL Free (500,000 characters/month) is strong. If you need a Korean-specific tone, compare it side by side with Papago.
- **Weather**: For global coordinate-based data, go with OpenWeatherMap; for domestic local forecasts and weather alerts, the KMA public data is the right answer. Note that OpenWeatherMap's One Call requires card registration even though it's free.
- **Exchange rates**: For simple conversion, the signup-free Frankfurter is the most convenient. If you also need stock or time-series data, add Alpha Vantage's free tier (its daily call limit is very low) as a supplement.
- **AI/LLM**: To test indefinitely for free without a card, Google Gemini AI Studio has the lowest barrier to entry. Claude and OpenAI are structured so you start with a small credit and then move to prepaid metered billing.

## Checkpoints You Must Verify When Choosing a Free API

Don't decide based on the table's numbers alone. Checking the following four things before deployment can prevent most accidents.

1. **The unit of the free limit.** "500,000 characters/month" and "1,000 calls/day" are entirely different constraints. If your service sees traffic spike at certain times, you'll hit a per-minute limit first (e.g. OpenWeatherMap's 60 calls/min).
2. **Whether commercial use is allowed.** When conditions like non-commercial, local-only, or a 24-hour delay are attached — as with NewsAPI's free plan — using it as-is in a revenue-generating service violates the terms.
3. **Terms and data storage policy.** Check whether you may cache or redistribute the response data, and whether attribution is required (for Unsplash and OSM, attribution is effectively mandatory).
4. **Whether a credit card is required.** Distinguish between the truly free (Gemini AI Studio, Frankfurter) and the card-required, overage-billed type (OpenWeatherMap One Call, Claude/OpenAI). For the billed type, **be sure to set a spend limit in the console.**

My conclusion is clear: **at the prototype stage, validate quickly with truly free APIs you can start without a card, and once traffic grows, reread the limits and terms before deciding to switch to a paid plan.** Free tiers can change at any time, so use the table above only as a starting point and always check each provider's latest official documentation before you actually implement. This post is for informational purposes and does not encourage or guarantee the use of any particular service.
