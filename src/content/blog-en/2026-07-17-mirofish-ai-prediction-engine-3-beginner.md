---
title: "Running Your First MiroFish Simulation — A Beginner's Guide [Part 3]"
description: "Let's run your first prediction with MiroFish. A step-by-step beginner's guide: what seed to feed, how to set agent count and rounds, how to read the report, using the god-view and agent chat, and the common mistakes first-timers make."
pubDate: 2026-07-17T00:05:00+09:00
category: ai
tags: ["MiroFish", "AI prediction", "how-to", "multi-agent"]
lang: en
koSlug: 2026-07-17-mirofish-ai-prediction-engine-3-beginner
---

> 📚 **Series — The Complete Guide to MiroFish**
> ① Concept, history, use cases · ② System overview & install · **③ Beginner's guide** · ④ Scaling it up

**The best way to get your first prediction out of MiroFish is to run one small, clear question through one small simulation.** If you finished the install in [Part 2](/en/blog/2026-07-16-mirofish-ai-prediction-engine-2-install/), it's time to open the web UI (`localhost:3000`) and actually run a virtual society. The bottom line first: success at the beginner stage rests not on fancy settings but on **a good seed and a small scale.** Feed a seed that carries a good question, set agents and rounds to a minimum to run end to end, then read the report as a *story* rather than a *number* — those three things are the whole of a first simulation. This guide takes a first-timer by the hand: prepare the seed → set the scale → run → read the report → god-view and agent chat → common mistakes.

![laptop showing a data dashboard](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHw1fHxkYXRhJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwc2NyZWVufGVufDF8MHx8fDE3ODQxNjA3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Lukas Blazek](https://unsplash.com/@goumbik?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/turned-on-black-and-grey-laptop-computer-mcSDtbWXUZU?utm_source=spice-bandit-blog&utm_medium=referral)*

## Step 1 — A Good 'Seed' Is 80% of the Result

MiroFish extracts a knowledge graph from the text you feed as a seed, then builds agents from it. In other words, **the input is the raw material of the world.** A thin seed makes a thin society; a rich, focused seed brings the simulation to life. The seed is the very first thing a beginner should care about.

A good seed has three qualities. First, **it carries context** — not just "Samsung stock outlook," but the related news articles, reports, and background so that the actors and the stakes emerge. Second, **it has a single focus** — mixing many topics scatters the agents; the question should converge, like "how will opinion split after this policy announcement?" Third, **it features people and groups** — MiroFish's power lies in "who reacts and how," so the seed needs stakeholders with differing positions to make the graph rich.

A good first beginner seed looks like this: the full text of one or two controversial news articles, plus a one-line question — "predict how public opinion on this issue will split into factions and shift over the next two weeks." Short, but people, stakes, and a question are all in it.

## Step 2 — Agent Count and Rounds: Start Small, No Exceptions

Once the seed is in, set the simulation's scale. The one rule a beginner must keep here: **start small, always.** As we saw in Part 2, MiroFish's LLM calls explode in proportion to agent count × rounds, and that's your cost. The repository itself says to "start with small simulations of fewer than 40 rounds."

| Setting | Recommended first run | Why |
|---------|----------------------|-----|
| Agent count | A few dozen | Goal is validating the pipeline, minimizing cost |
| Rounds | 10–20 (under 40) | Enough for a "taste" of opinion flow |
| Platforms | Defaults (Twitter-style, Reddit-style) | Don't touch at first |
| Objective | Confirm it "runs to the end" | Completion before accuracy |

*Source: MiroFish repository guidance ([GitHub](https://github.com/666ghj/MiroFish)).*

The goal of the first run isn't an "accurate prediction" but **"the pipeline running from start to finish."** Watching the whole process complete once — a knowledge graph built, agents generated, conversations exchanged on the two platforms, a report produced — that's the success criterion for a first simulation. Scaling up comes after.

## Step 3 — Run It and 'Watch'

Once you start the simulation, the web UI shows agents posting and commenting across the two social platforms (Twitter-style and Reddit-style) and influencing each other, in real time. Here's a pleasure and a key point beginners often miss: **don't just wait for the result — watch the process.**

This visibility of process is exactly where MiroFish parts ways with other prediction tools. A statistical model spits out a single probability a few seconds later and it's done. MiroFish shows you *how* opinion forms, right before your eyes. Which agent lights the first spark, which argument the crowd rallies around, the moment the tide turns — that trajectory itself is the first insight. As rounds progress, each agent's memory updates and positions sometimes shift.

## Step 4 — Read the Report as a 'Story,' Not a 'Number'

When the simulation ends, a dedicated ReportAgent organizes the whole flow into a structured forecast report. Here's the misreading beginners commit most often: pulling only the "one-line conclusion" from the report. MiroFish's report wasn't built to be read that way.

The right way to read it: **First, see the terrain of factions** — grasp how many groups opinion split into and each group's core claim. **Second, find the moments of change** — which round the flow moved sharply, and what triggered that turn. **Third, understand the conclusion as branches** — MiroFish often shows "A under these conditions, B under those" rather than declaring "the answer is A." The report is a *map*, not an *answer key* — it shows which roads you could take.

## Step 5 — Dig In With God-View and Agent Chat

After reading the report, the real fun of MiroFish begins. There are two interaction tools.

One is the **god-view.** You can inject variables mid-simulation — say, insert a new event like "what if the government issued a rebuttal here?" and re-run to see how opinion changes. This is the "counterfactual scenario" experiment. Being able to branch multiple futures from one seed is MiroFish's strength.

The other is the **direct agent chat.** Ask a specific virtual persona "why do you think that?" to check the individual logic beneath the collective result. It's a way to interrogate the "why" that a poll's results page never gives you. For a beginner, just posing a question to one or two representative agents from a faction that caught your eye makes the result far more three-dimensional.

## Five Common Beginner Mistakes

Knowing the frequent first-simulation mistakes in advance saves time and money.

1. **Seed too thin** — feeding a single keyword and expecting a rich result. Feed text with context, people, and stakes.
2. **Going big from the start** — starting at 1,000 agents × 50 rounds and burning cost. Always complete a small run first.
3. **Reading only the one-line conclusion** — ignoring the report's "process and branches" and hunting for an answer. MiroFish's value is in the narrative.
4. **Trusting a single run as the answer** — it's sensitive to initial conditions, so run the same seed several times and look at the tendency.
5. **Ignoring API cost** — running big without checking your LLM key's usage and limits. Always monitor consumption on the dashboard.

Avoid just these five and the first experience is far smoother. In sum — **small question, small scale, watch the process, read as branches, run multiple times.**

## So What — The Goal of a First Simulation Isn't 'the Answer'

The first thing a beginner should get from MiroFish isn't a "correct prediction." It's **"the sense of expanding your thinking by running a virtual society."** Branching multiple futures from one seed, watching factions form and the tide turn, asking individual agents "why" — learning to treat prediction not as a "one-line probability" but as an "explorable map." Understanding, hands-on at the beginner stage, MiroFish's essence from Part 1 — "a scenario lab, not an answer machine" — is the goal of Part 3.

In the next [Part 4], we'll cover **how to scale and apply what you've learned** — API automation, running large simulations, real-world scenarios in markets, policy, and elections, and their limits. You've run your first simulation; now it's time to forge this tool into a real weapon.

## Frequently Asked Questions (MiroFish for Beginners)

**Q1. What do I do first for a MiroFish simulation?**
Open the web UI (`localhost:3000`), feed text with context, people, and stakes as a "seed," and attach one clear question. Set agent count and rounds to a minimum (under 40 rounds) and first confirm the pipeline runs end to end.

**Q2. How many agents and rounds should I use?**
For a beginner's first run, a few dozen agents and 10–20 rounds (under 40) are recommended. MiroFish's LLM cost spikes with scale, so aim for "completion" over accuracy — start small, then grow.

**Q3. How do I read the report?**
Don't read only the one-line conclusion; look at ① how many factions opinion split into, ② where the flow changed, and ③ how the conclusion branches by condition. The MiroFish report is a "map" of possible roads, not an "answer key."

**Q4. What mistakes do beginners commonly make?**
Feeding too thin a seed, running big from the start and burning cost, reading only the conclusion, trusting a single run as the answer, and ignoring API usage. The principles: small question, small scale, watch the process, and repeat.

---

*This article is a general usage explainer based on information published as of July 2026, and is not advice recommending investment decisions on any specific security or product.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What do I do first for a MiroFish simulation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open the web UI (localhost:3000), feed text with context, people, and stakes as a seed, and attach one clear question. Set agent count and rounds to a minimum (under 40 rounds) and first confirm the pipeline runs end to end."
      }
    },
    {
      "@type": "Question",
      "name": "How many agents and rounds should I use in MiroFish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For a beginner's first run, a few dozen agents and 10-20 rounds (under 40) are recommended. MiroFish's LLM cost spikes with scale, so aim for completion over accuracy: start small, then grow."
      }
    },
    {
      "@type": "Question",
      "name": "How do I read the MiroFish report?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Don't read only the one-line conclusion; look at how many factions opinion split into, where the flow changed, and how the conclusion branches by condition. The MiroFish report is a map of possible roads, not an answer key."
      }
    },
    {
      "@type": "Question",
      "name": "What mistakes do MiroFish beginners commonly make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Feeding too thin a seed, running big from the start and burning cost, reading only the conclusion, trusting a single run as the answer, and ignoring API usage. The principles: small question, small scale, watch the process, and repeat."
      }
    }
  ]
}
</script>
