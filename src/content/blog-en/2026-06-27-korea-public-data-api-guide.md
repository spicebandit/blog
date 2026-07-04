---
title: "Korea Government Open APIs: A Developer's Guide"
description: "From the Public Data Portal to OpenDART, KMA weather, Bank of Korea ECOS, transit, and law — a guide to free Korean government open APIs, with how to apply, authenticate, and use them."
pubDate: 2026-06-27T09:30:00+09:00
category: ai
tags: ["public data", "open API", "OpenAPI", "data analysis"]
lang: en
koSlug: 2026-06-27-korea-public-data-api-guide
---

When you're building a side project or doing data analysis, you always hit the same wall: "Where do I get usable data?" The first answer that should come to mind here is **government open APIs**. The **public data** APIs operated by the government and public institutions are free, highly trustworthy because the source is clear, and permitted for broad commercial use as well. Weather, stock disclosures, interest rates, bus arrival times, even the text of statutes — much of the data that private paid services sell at a premium is, in fact, released for free through government open APIs. The core message of this post is simple: **"Before you buy data, search the Public Data Portal first."**

The starting point and hub for this is the **Public Data Portal (data.go.kr)**. In this one place, you can search the APIs of tens of thousands of institutions, file usage applications, and manage authentication keys under a single account. Just knowing that most APIs are gathered on this portal — instead of digging through each institution's scattered site one by one — cuts your work time in half.

![graphical user interface](https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8MHx8fDE3ODI0OTE0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Deng Xiang](https://unsplash.com/@dengxiangs?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphical-user-interface--WXQm_NTK0U?utm_source=spice-bandit-blog&utm_medium=referral)*

## Representative Open APIs by Category at a Glance

The table below organizes the government and public APIs most frequently used in practice, sorted by category. Some providers run their own portals, but many can also be applied for through data.go.kr. Detailed specs (parameters, response fields) change frequently, so this assumes you will **verify the latest specification at each provider/portal.**

| Category | API / Provider | Available data | Authentication / Key |
| --- | --- | --- | --- |
| Central hub | **Public Data Portal (data.go.kr)** | Search, apply for, and centrally manage tens of thousands of institutions' APIs | Sign up → apply per API → authentication key (serviceKey) |
| Finance/Corporate | **OpenDART (FSS electronic disclosure)** | Financial statements, periodic/ad-hoc disclosures, ownership and executive info of listed and externally audited firms | Issue an API key on the OpenDART site |
| Macroeconomics | **Bank of Korea ECOS** | Statistical time series: base rate, exchange rates, prices, GDP, etc. | Issue an authentication key on ECOS |
| Financial policy | **FSC-affiliated APIs** | Financial products, corporate/financial statistics, etc. | Apply via data.go.kr |
| Weather | **KMA short-term/local forecast** | Local forecast, ultra-short-term nowcast, mid-term forecast | data.go.kr / KMA API Hub authentication key |
| Environment | **AirKorea (Korea Environment Corp.)** | Particulate matter (PM10/PM2.5), air pollution monitoring-station data | Apply via data.go.kr |
| Transit | **MOLIT TAGO (national public transit info)** | Nationwide bus routes/arrivals/locations, subway, express/intercity buses | Apply via data.go.kr |
| Transit | **Korea Expressway Corp. / real-time subway** | Highway traffic and rest stops, real-time subway arrivals | data.go.kr / local government portals |
| Statistics/Population | **Statistics Korea KOSIS** | National statistical time series: population, employment, prices, etc. | KOSIS sharing-service authentication key |
| Administration | **MOIS-affiliated APIs** | Administrative districts, resident-registration population statistics, public facilities, etc. | Apply via data.go.kr |
| Law/Policy | **National Law Information Center (MOLEG) OPEN API** | Full text of statutes/enforcement decrees/local ordinances, amendment history | Apply for the MOLEG OPEN API (email-ID registration method) |
| Maps/Address | **Road Name Address API (MOIS)** | Address search, coordinate conversion, postal codes | Road Name Address Developer Center approval key |
| Spatial info | **V-World (MOLIT)** | Maps, satellite imagery, 3D, cadastral and land spatial info | Issue an authentication key on V-World |

![monitor screengrab](https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHxvcGVuJTIwZGF0YSUyMHN0YXRpc3RpY3MlMjBkYXNoYm9hcmR8ZW58MXwwfHx8MTc4MzEzNDgzMHww&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Stephen Phillips - Hostreviews.co.uk](https://unsplash.com/@hostreviews?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/monitor-screengrab-shr_Xn8S8QU?utm_source=spice-bandit-blog&utm_medium=referral)*

Even from the table alone, you can sense it: **finance, weather, transit, and law** are the basic ingredients of nearly every domain service. A real estate app, for instance, can produce its core features by combining just three — V-World (maps) + Road Name Address (addresses) + KOSIS (population). The mindset of "combining" data instead of "buying" it is the essence of using public APIs.

## Getting Started: From Usage Application to First Call

The procedure, based on the most common entry path — the **Public Data Portal** — is as follows.

1. **Sign up & log in** — Register on data.go.kr (joint/simple authentication supported).
2. **Search for an API** — e.g. "KMA short-term forecast," "TAGO bus arrival." From the results, pick the *Open API* item.
3. **Apply for usage** — Click the "Apply for Usage" button → enter your purpose of use → submit. General APIs are usually auto-approved (typically tens of minutes to 1–2 hours), while some may take a few days under reviewer assessment.
4. **Check your authentication key** — Go to My Page → Data Usage → Development Account to find your `serviceKey`.
5. **Make a call** — Put the issued key in the query parameters and send a GET request.

A sample call (a pseudo-URL in the form of the KMA local forecast):

```text
GET https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst
  ?serviceKey=YOUR_ISSUED_AUTH_KEY
  &dataType=JSON
  &numOfRows=10
  &pageNo=1
  &base_date=20260627
  &base_time=0500
  &nx=60
  &ny=127
```

```python
# Python pseudocode
import requests

params = {
    "serviceKey": "YOUR_DECODED_AUTH_KEY",  # requests encodes this automatically
    "dataType": "JSON",
    "numOfRows": 10, "pageNo": 1,
    "base_date": "20260627", "base_time": "0500",
    "nx": 60, "ny": 127,
}
r = requests.get(URL, params=params)
print(r.json())
```

**A one-line common pitfall**: the portal shows your authentication key in two forms — *Encoding* and *Decoding*. When the key contains characters like `+`, `/`, or `=`, the library already applies URL encoding once; feed it the already-encoded key on top of that and you get double encoding, producing a `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`. Remember it this way and most issues resolve: use the **Decoding key** on paths that auto-encode (like requests' `params=`), and the **Encoding key** when you embed it directly as a string in the URL.

## What Can You Build: Project Ideas

It's all about how you combine them, but there are things worth building right away. A widget that shows your neighborhood's bus arrivals (TAGO) and particulate matter (AirKorea) on one screen during your commute; a dashboard that uses OpenDART financial data to automatically compile the revenue and operating-profit trends of stocks you follow; a bot that pulls the ECOS base rate and exchange rates to send alerts; a tool that tracks the amendment history of a specific statute via the MOLEG API. The real value of government APIs lies in "automating the work others used to copy-paste by hand." As with the earlier real estate app example, the key is not the flashiness of a single API but **the power of combination built by weaving together multiple sources.**

## Practical Caveats and Operational Tips

That said, there are constraints you must keep in mind in practice.

| Caution item | Details |
| --- | --- |
| Traffic limits | Development accounts usually have call limits, such as 1,000–10,000/day. A production service requires a separate switch to an *operations account* and an expansion application. |
| Approval wait | Most are auto-approved, but some APIs and sensitive data take days to review. Build buffer into your schedule. |
| Data refresh cycle | Even "real-time" has varying refresh intervals (e.g. local forecasts are issued at set time slots). Match your caching/polling cycle to the refresh cycle. |
| Response format/spec changes | XML/JSON, field names, and endpoints can be revised. Put defensive logic and spec-version checks in your code. |
| Terms & attribution | The scope of commercial use and attribution obligations differ by API. Checking the terms before deployment is essential. |

![white concrete building under sky](https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBkYXRhfGVufDF8MHx8fDE3ODI0OTE0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Katie Moum](https://unsplash.com/@katiemoum?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/white-concrete-building-under-sky-o0kbc907i20?utm_source=spice-bandit-blog&utm_medium=referral)*

Having used government open APIs many times myself, the biggest advantage, in my view, is not that they're "free" but "the authority of the source." The very fact that the numbers come directly from the KMA, the Bank of Korea, or the FSS builds trust in your service. Conversely, the biggest drawback is the variance in documentation quality. Some APIs are well organized; others throw an XML schema at you without a single example. So here's the practical tip — **before you wire up a new API, search the portal's "use cases" and the wrappers/examples published on GitHub first.** Chances are high that someone has already stepped on all the landmines.

To sum up: when you need data, your first move should be a search, not a payment. Just type a keyword into data.go.kr. Start there, and most data problems get solved for free — and from a source you can trust.

---

*Detailed application procedures, parameters, and usage limits change frequently, so please check the latest guidance from each provider and the Public Data Portal. This post is for informational purposes and does not encourage the use of any particular service.*
