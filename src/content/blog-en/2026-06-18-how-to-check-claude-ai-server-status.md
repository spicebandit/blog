---
title: "Check Claude Server Status — Is It Down? A 1-Minute Check"
description: "Is Claude not working right now? How to tell in 1 minute whether it's your problem or a server outage. From the official status page to live alerts, RSS, API, and Downdetector — all in one place."
pubDate: 2026-06-18T16:20:00+09:00
updatedDate: 2026-06-29T18:10:00+09:00
category: ai
tags: ["Claude server status", "Claude", "outage check", "status page"]
lang: en
koSlug: 2026-06-18-how-to-check-claude-ai-server-status
---

<div id="cc-status" class="cc-status" data-loading>
  <div class="cc-row">
    <span class="cc-dot cc-load"></span>
    <div class="cc-main">
      <div class="cc-title">🚦 Claude Live Status</div>
      <div class="cc-desc" id="cc-desc">Checking status…</div>
    </div>
    <a class="cc-link" href="https://status.claude.com" target="_blank" rel="noopener">Official page ↗</a>
  </div>
  <div class="cc-grid" id="cc-grid"></div>
  <div class="cc-meta" id="cc-meta">Source: status.claude.com · auto-refreshes every 60s</div>
</div>

<script>
(function(){
  var EL=document.getElementById('cc-status'); if(!EL) return;
  var MAP={none:['#4A6741','All systems operational'],minor:['#C89B3C','Minor issues'],major:['#B85C1E','Some outages'],critical:['#C8102E','Critical outage'],maintenance:['#23201D','Under maintenance']};
  var CMAP={operational:['#4A6741','Operational'],degraded_performance:['#C89B3C','Degraded'],partial_outage:['#B85C1E','Partial outage'],major_outage:['#C8102E','Major outage'],under_maintenance:['#23201D','Maintenance']};
  function fmt(){return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});}
  function render(data){
    var ind=(data.status&&data.status.indicator)||'none';
    var m=MAP[ind]||MAP.none;
    var dot=EL.querySelector('.cc-dot'); dot.className='cc-dot'; dot.style.background=m[0];
    document.getElementById('cc-desc').textContent=m[1];
    var order=['Claude Code','claude.ai','Claude API (api.anthropic.com)','Claude Console (platform.claude.com)','Claude Cowork','Claude for Government'];
    var byName={}; (data.components||[]).forEach(function(c){byName[c.name]=c;});
    var g=document.getElementById('cc-grid'); g.innerHTML='';
    order.forEach(function(n){var c=byName[n]; if(!c) return; var cm=CMAP[c.status]||['#8A8378','—'];
      var el=document.createElement('div'); el.className='cc-cell'+(n==='Claude Code'?' cc-hi':'');
      el.innerHTML='<span class="cc-d" style="background:'+cm[0]+'"></span>'+n.replace(/ \(.*\)/,'')+' <b>'+cm[1]+'</b>';
      g.appendChild(el);});
    document.getElementById('cc-meta').textContent='Source: status.claude.com · as of '+fmt()+' · auto-refreshes every 60s';
    EL.removeAttribute('data-loading');
  }
  function load(){fetch('https://status.claude.com/api/v2/summary.json',{cache:'no-store'}).then(function(r){return r.json();}).then(render).catch(function(){
    document.getElementById('cc-desc').textContent='Could not load status — please check the official page';
    EL.querySelector('.cc-dot').style.background='#8A8378'; EL.querySelector('.cc-dot').className='cc-dot';
  });}
  load(); setInterval(load,60000);
})();
</script>

<style>
.cc-status{border:1px solid #E5DECF;border-radius:14px;padding:14px 16px;margin:0 0 1.5rem;background:#FAF6EE;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.cc-status .cc-row{display:flex;align-items:center;gap:12px}
.cc-status .cc-dot{width:18px;height:18px;border-radius:50%;flex:none;background:#E5DECF;box-shadow:0 0 0 4px rgba(0,0,0,.04)}
.cc-status .cc-dot.cc-load{animation:ccpulse 1s infinite}
@keyframes ccpulse{0%,100%{opacity:.35}50%{opacity:1}}
.cc-status .cc-main{flex:1;min-width:0}
.cc-status .cc-title{font-weight:800;font-size:.92rem}
.cc-status .cc-desc{font-size:1.05rem;font-weight:700}
.cc-status .cc-link{font-size:.8rem;white-space:nowrap;text-decoration:none;color:#C8102E}
.cc-status .cc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:10px}
.cc-status .cc-cell{font-size:.83rem;display:flex;align-items:center;gap:6px;background:#FAF6EE;border:1px solid #E5DECF;border-radius:8px;padding:5px 8px}
.cc-status .cc-cell.cc-hi{border-color:#C8102E;background:#F1EADD}
.cc-status .cc-cell .cc-d{width:9px;height:9px;border-radius:50%;flex:none}
.cc-status .cc-cell b{margin-left:auto;font-weight:700}
.cc-status .cc-meta{font-size:.72rem;color:#8A8378;margin-top:8px}
@media(max-width:480px){.cc-status .cc-grid{grid-template-columns:1fr}}
</style>

**To check Claude's server status right now → the official status page [status.claude.com](https://status.claude.com) is all you need.** Below, we also cover the other methods (outage alerts, RSS, API, Downdetector). The traffic light above pulls from the official status API in real time.

When you're deep in work with Claude and the screen suddenly freezes or you can't connect, one thought comes first: **"Is it my internet, or is the Claude server down?"** Figuring this out within a minute saves you the wasted effort of needlessly rebooting your router or clearing your cache. This article walks through how to check **Claude's server status** (whether there's an outage) in real time, in order from the easiest method to the developer-grade ones.

![graphs of performance analytics on a laptop screen](https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjBzdGF0dXMlMjBtb25pdG9yaW5nJTIwZGFzaGJvYXJkJTIwdXB0aW1lfGVufDF8MHx8fDE3ODE3NjY4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Luke Chesser](https://unsplash.com/@lukechesser?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00?utm_source=spice-bandit-blog&utm_medium=referral)*

## The Most Reliable Place: The Official Status Page

The first place to look is Anthropic's **official status page**.

- URL: **[status.claude.com](https://status.claude.com)** (the old address `status.anthropic.com` also redirects to the same page)

The reason this matters is that Claude isn't a single service — it's **broken out and displayed as several components**. In other words, you can tell at a glance even in a situation where "the claude.ai web is down but the API is fine." The six components currently published are:

- **claude.ai** — the web/app chat we all use
- **Claude API (api.anthropic.com)** — the developer API
- **Claude Code** — the coding tool for the terminal/IDE
- **Claude Console (platform.claude.com)** — console, billing, key management
- **Claude Cowork** — collaboration features
- **Claude for Government** — for government use

Next to each component, the status is shown by color. Read the meanings like this:

<div class="status-legend">
  <div class="st"><span class="dot op"></span><b>Operational</b><br>Normal</div>
  <div class="st"><span class="dot deg"></span><b>Degraded</b><br>Slow / some delays</div>
  <div class="st"><span class="dot part"></span><b>Partial Outage</b><br>Partial outage</div>
  <div class="st"><span class="dot major"></span><b>Major Outage</b><br>Full outage</div>
  <div class="st"><span class="dot maint"></span><b>Maintenance</b><br>Under maintenance</div>
</div>

If **"All Systems Operational"** is showing at the top of the page, it means things are fine on Claude's side — a signal that the problem is in your own environment.

## If You Don't Want to Check Every Time: Subscribe to Alerts

You can set it up so that you **get notified first when an outage occurs**, without even having to pull up the status page. Click the **Subscribe** button in the top-right of status.claude.com, and you can receive incident alerts through these channels:

- Email
- SMS (text)
- Slack
- Microsoft Teams

If you're a solopreneur or developer who relies heavily on Claude for work, I recommend **setting up a Slack or email subscription once**. You'll be automatically notified of when an outage starts and when it's resolved, so you'll stop wasting time wondering "why isn't this working?"

## Tracking History and RSS

When you're thinking "this happened last week too, and now again?", check the **incident history**.

- Past outage history: [status.claude.com/history](https://status.claude.com/history)
- RSS/Atom feed: `https://status.claude.com/history.rss` — register it in an RSS reader and new incidents come in automatically.

There's been a recent trend of more frequent brief delays and partial outages, so skimming the history page once will give you a sense of "whether today's is a one-off problem or something that's been recurring for days."

![turned on monitoring screen](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwyfHxzZXJ2ZXIlMjBzdGF0dXMlMjBtb25pdG9yaW5nJTIwZGFzaGJvYXJkJTIwdXB0aW1lfGVufDF8MHx8fDE3ODE3NjY4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Stephen Dawson](https://unsplash.com/@dawson2406?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-monitoring-screen-qwtCeJ5cLYs?utm_source=spice-bandit-blog&utm_medium=referral)*

## For Developers: Checking Status in Code

The status page is built on Atlassian Statuspage, so you can **query the status directly via a JSON API**. It's easy to wire into a monitoring script or dashboard.

```bash
# One-line summary of the overall status
curl -s https://status.claude.com/api/v2/status.json

# Example response
# {"status":{"indicator":"none","description":"All Systems Operational"}}
```

The meanings of the `indicator` values are as follows:

- `none` → Normal
- `minor` → Minor issue
- `major` → Significant outage
- `critical` → Critical full outage

If you need per-component details or ongoing incidents, use `/api/v2/summary.json` and `/api/v2/incidents/unresolved.json`. If you want to automate further, you can register a **webhook** to receive incident create/update/resolve events directly on your server.

## Backup Options: Downdetector and X

In the "first few minutes" before the official page has reflected an outage, **user-reported, lived experience** is sometimes faster.

- **Downdetector**: Search "Claude" and you can confirm perceived outages via the spike-in-reports graph.
- **X (Twitter) [@AnthropicAI](https://x.com/AnthropicAI)**: During large-scale outages, the official account or user tweets are sometimes the fastest signal.

That said, these are nothing more than "perception" indicators. Make it a habit to **confirm the final verdict with the official status page**.

## When It Still Won't Work: A 30-Second Self-Diagnosis

If the status page says "Operational" but it's only failing for you, the problem is most likely on your end. Just run through these quickly.

1. **Connect from a different device/network** (try mobile LTE) → if it works, it's your Wi-Fi/corporate network
2. **Use an incognito window or clear the cache** → fixes login/session tangles
3. **Turn off VPN and extensions** → ad blockers or VPNs often block it
4. **Pinpoint which of claude.ai / Claude Code / API is failing** → cross-check against the status page components

These four steps will almost always sort out "Claude outage vs. my environment problem."

## Wrapping Up

To sum up, **the No. 1 source is always the official status page ([status.claude.com](https://status.claude.com))**. Set up an **alert subscription** once, and going forward you'll be notified automatically instead of fumbling around wondering "why isn't this working?" If you're a developer, wire it into your monitoring via the JSON API, and when the official page is slow to reflect an outage, cross-check with Downdetector. The more you rely on Claude as a work tool, the more this one checking routine cuts your downtime by the minute.

<style>
.status-legend{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.2rem 0}
.status-legend .st{flex:1;min-width:96px;border:1px solid #E5DECF;border-radius:10px;padding:.6rem .5rem;background:#FAF6EE;font-size:.8rem;line-height:1.45;text-align:center}
.status-legend .dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-bottom:.35rem}
.dot.op{background:#4A6741}.dot.deg{background:#C89B3C}.dot.part{background:#B85C1E}.dot.major{background:#C8102E}.dot.maint{background:#23201D}
@media(max-width:640px){.status-legend .st{min-width:44%}}
</style>
