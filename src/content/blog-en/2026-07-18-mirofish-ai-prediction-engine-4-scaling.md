---
title: "Scaling MiroFish — From API Automation to Real-World Use [Part 4]"
description: "Turn MiroFish from a hobby into a tool. The finale covers API automation, running large simulations, real-world scenarios in markets, policy, and elections, counterfactual experiments, and the limits and ethics you must weigh alongside them."
pubDate: 2026-07-20T00:05:00+09:00
category: ai
tags: ["MiroFish", "AI prediction", "automation", "multi-agent"]
lang: en
koSlug: 2026-07-18-mirofish-ai-prediction-engine-4-scaling
---

> 📚 **Series — The Complete Guide to MiroFish**
> ① Concept, history, use cases · ② System overview & install · ③ Beginner's guide · **④ Scaling it up**

**The key to turning MiroFish from a hobby into a 'tool' is three things — automate the repetition with the API, branch multiple futures from one seed, and treat the results never as answers but as hypotheses.** If you ran your first simulation in [Part 3](/en/blog/2026-07-17-mirofish-ai-prediction-engine-3-beginner/), this finale is where you forge the tool into a real-world weapon. The bottom line first: MiroFish's true value isn't "one accurate prediction" but **"an experimentation infrastructure that runs countless scenarios cheaply."** This guide moves through API automation → large-scale operation → real scenarios in markets, policy, and elections → counterfactual experiments → limits and ethics, laying out how far you can push MiroFish and where you should stop.

![abstract network of orange lines and dots](https://images.pexels.com/photos/10325707/pexels-photo-10325707.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)
*Photo by [U.Lucas Dubé-Cantin](https://www.pexels.com/@lucasdc) on [Pexels](https://www.pexels.com/photo/abstract-orange-lights-10325707/)*

## 1. API Automation — From Web UI to Pipeline

At the beginner stage you ran things one at a time in the web UI (`localhost:3000`). But doing the same work by hand every time makes it a toy, not a tool. The first step to scaling is triggering simulations programmatically through the **backend REST API (`localhost:5001`)** introduced in Part 2.

Using the API opens three things. First, **batch execution** — queue many seeds and run them sequentially overnight to get a bundle of results in the morning. Second, **pipeline integration** — a news-scraping script that detects a new article can auto-trigger a simulation and send the report to Slack or email. Third, **automated post-processing** — parse key metrics from the report into a dashboard, or add code that compares results across many simulations. In short, you turn MiroFish from "an app I open" into "a component of a pipeline that runs on its own."

## 2. Large-Scale Operation — Balancing Docker and Cost

Scaling up grows two things at once: the depth of insight and the cost. If you got the feel with small runs (a few dozen agents, 10–20 rounds) in Part 3, in practice you'll want to grow to hundreds or thousands of agents and 30–50 rounds for a finer opinion terrain. That calls for two infrastructure decisions.

First, **deploy with Docker.** The `docker compose` method from Part 2 guarantees reproducibility, making it ideal for putting MiroFish on a team server or cloud instance to share among people or run large batches reliably. Second, **control cost at the design stage.** MiroFish's cost is agent count × rounds × LLM price, so growing blindly makes the API bill explode.

| Scale | Agents | Rounds | Purpose | Cost sense |
|-------|--------|--------|---------|-----------|
| Small (beginner) | Dozens | 10–20 | Pipeline validation | Low |
| Medium | Hundreds | 20–40 | Exploring real scenarios | Moderate |
| Large | Hundreds–1,200+ | 30–50 | Fine opinion terrain | High (spikes) |

*Source: MiroFish repository guidance and Part 1 explainer ([GitHub](https://github.com/666ghj/MiroFish)).*

Three practical cost-cutting tips: ① use a cheap model (e.g., qwen-plus) by default and reserve high-end models for important experiments; ② rather than piling on rounds, run only to "where the flow converges"; ③ attach a local LLM via the community's Ollama-based offline fork to eliminate API charges entirely (with performance and stability as the trade-off).

## 3. Real Scenario ① — Market Sentiment and Policy Impact

The showcase domains where MiroFish comes up in practice are problems where "people's reactions drive the outcome." As noted in Part 1, candidate areas include trading-signal generation, market-sentiment analysis, policy-impact analysis, election forecasting, new-product reception, and competitor-response simulation.

Take **market sentiment.** Feed an earnings release or macro event as the seed and pre-run how virtual investor, analyst, and media agents react and form narratives. It's a rehearsal of "market reaction" — usually seen only as numbers — in the form of conversation. **Policy impact** is similar. With a new regulatory draft as the seed, simulate how opinion splits by stakeholder (industry, civic groups, consumers) and where resistance emerges, to check the blind spots of policy design in advance.

But one thing to nail down here — **this is a simulation, not a prophecy.** In an investment context especially, using MiroFish results as grounds for trading is dangerous (this article recommends no investment decision on any security or product). MiroFish only hands you a list of hypotheses — "this reaction might occur" — and whether those hypotheses hit is a separate matter.

## 4. Real Scenario ② — Opinion, Elections, and Creative Work

The second domain is opinion and narrative. The real cases from Part 1 point the way: using the "Wuhan University opinion report" produced by the predecessor tool BettaFish as a seed to simulate the weeks-long trajectory of opinion after a campus controversy, and feeding the entire 80 chapters of the classic *Dream of the Red Chamber* — whose ending Cao Xueqin never finished — so that character-agents generated multiple branching endings.

The directions these two cases suggest are clear. **Opinion forecasting** extends to elections, campaigns, and crisis management (a company's controversy-response scenarios); **narrative simulation** extends to creative work, game design, and content-reception testing. Because MiroFish handles not "numbers" but "the story a collective generates," its application span is wider than statistical prediction. Pre-running a new product's reception with a virtual consumer group, or rehearsing a competitor's response by scenario, works on the same principle.

## 5. Counterfactual Experiments — MiroFish's Real Strength

At the scaling stage, the most powerful use isn't a single prediction but the **counterfactual experiment** — systematizing the "god-view" from Part 3 at scale. Take one seed and run it repeatedly, changing only a condition: "if the government intervened / didn't," "if the competitor cut prices / held," "if this news broke on a weekend / a weekday." Line up the results of each branch and you get not one future but **a map of possible futures.**

This is where MiroFish fundamentally differs from a statistical model. A regression model gives you one point — "62% probability." MiroFish lets you experiment with the branches of causation — "change this variable this way and the outcome splits like so." For work that requires systematically running "what ifs" — scenario planning, wargaming, policy pre-checks — an infrastructure for cheap, repeated experimentation is valuable in itself. Of course, the real-world validity of those experiments always remains something to verify.

## 6. Limits and Ethics — Responsibility Grows as You Scale

The more you grow the tool, the heavier its limits and responsibilities grow too. The three limits noted in Part 1 sharpen under large-scale operation.

- **The validation problem**: as scale grows and reports get more elaborate, "plausible" is easily mistaken for "correct." The bigger the result, the more skeptically you should read it. A plausible narrative is persuasive, not accurate.
- **Sensitivity to initial conditions**: even with more agents, small differences in initial conditions still swing the outcome. So the principle "run several times and look at the tendency" holds at the scaling stage too.
- **Ethics and misuse**: a tool that simulates opinion and elections can be abused to design opinion manipulation or targeted propaganda. As you scale in practice, the responsibility for "how the prediction is used" grows as much as "what is predicted." Privacy and reputation issues around modeling real people or groups must also be weighed.

In other words, scaling MiroFish must go hand in hand not with "running more" but with "using it more carefully." The more powerful the tool, the more it matters to exercise the restraint of not slapping the label "answer" on its results.

## So What — Prediction Infrastructure Is Now in Individual Hands

The conclusion the four-part MiroFish story arrives at is singular. **We've entered an age where one individual can run 'artificial society simulation' — developed over half a century — as automated experimentation infrastructure on a laptop.** Part 1's "undergraduate in 10 days," Part 2's "five commands," Part 3's "small first simulation," and Part 4's "API automation and counterfactual experiments" — this arc points to the democratization of the act of prediction. Scenario planning, once the province of research institutes and big consultancies, can now be repeated cheaply by individuals and small teams.

But the final message is restraint. What MiroFish gives you isn't answers but "cheap experiments." Only when you avoid mistaking those experiments for answers and treat the tool as a way to expand your thinking by running many hypotheses — only then does MiroFish become a weapon, not a toy. The barrier to prediction has fallen, but the responsibility to use that prediction wisely has grown heavier. That is the real question this open-source "virtual society" leaves us.

## Frequently Asked Questions (Scaling MiroFish)

**Q1. Can I automate MiroFish?**
Yes. You can trigger simulations programmatically via the backend REST API (`localhost:5001`). You can run many seeds in batch, or build a workflow that auto-triggers on news detection and sends results to Slack or email.

**Q2. Where is it used in practice?**
Market-sentiment analysis, policy-impact checks, opinion and election forecasting, new-product reception testing, competitor-response simulation, and creative work (generating narrative branches) are cited. But this is "hypothesis exploration" and must not be taken as grounds for actual investment or decisions.

**Q3. Does running at large scale cost a lot?**
Cost spikes with agent count × rounds × LLM price. Use a cheap model by default, cap rounds at where the flow converges, and if needed attach a local LLM via the community's Ollama-based offline fork to eliminate charges.

**Q4. How far should I trust MiroFish results?**
The larger the scale, the easier it is to mistake "plausible" for "correct," so read even more skeptically. Because it's sensitive to initial conditions, run several times to see the tendency, and treat results as hypotheses to be verified — not as answers.

---

*This article is a general explainer based on information published as of July 2026, and is not advice recommending investment decisions on any specific security or product. MiroFish's predictions are unverified simulation outputs and must not be used as the sole basis for any decision.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I automate MiroFish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can trigger simulations programmatically via the backend REST API (localhost:5001). You can run many seeds in batch, or build a workflow that auto-triggers on news detection and sends results to Slack or email."
      }
    },
    {
      "@type": "Question",
      "name": "Where is MiroFish used in practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Market-sentiment analysis, policy-impact checks, opinion and election forecasting, new-product reception testing, competitor-response simulation, and creative work are cited. But this is hypothesis exploration and must not be taken as grounds for actual investment or decisions."
      }
    },
    {
      "@type": "Question",
      "name": "Does running MiroFish at large scale cost a lot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cost spikes with agent count times rounds times LLM price. Use a cheap model by default, cap rounds at where the flow converges, and if needed attach a local LLM via the community's Ollama-based offline fork to eliminate charges."
      }
    },
    {
      "@type": "Question",
      "name": "How far should I trust MiroFish results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The larger the scale, the easier it is to mistake plausible for correct, so read even more skeptically. Because it is sensitive to initial conditions, run several times to see the tendency, and treat results as hypotheses to be verified, not as answers."
      }
    }
  ]
}
</script>
