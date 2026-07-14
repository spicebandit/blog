---
title: "What Is MiroFish? AI That Predicts the Future by Simulating a Virtual Society [Part 1]"
description: "MiroFish, the open-source AI prediction engine one undergraduate built in 10 days and that passed 68k GitHub stars. Instead of statistics, it simulates a 'digital society' of thousands of virtual agents to forecast the future. Here's its concept, history, and use cases."
pubDate: 2026-07-15T08:00:00+09:00
category: ai
tags: ["MiroFish", "AI prediction", "multi-agent", "agent-based simulation"]
lang: en
koSlug: 2026-07-15-mirofish-ai-prediction-engine-1-concept
draft: true
---

> 📚 **Series — The Complete Guide to MiroFish**
> **① Concept, history, use cases** · ② System overview & install · ③ Beginner's guide · ④ Scaling it up

**What if, to predict the future, you built an entire virtual society and simply watched what happened?** That's exactly the idea behind **MiroFish**, the open-source AI engine that appeared in March 2026. Feed it "seed" material — news, policy drafts, market signals — and it builds a parallel digital world populated by hundreds to thousands of virtual personas (agents), lets them post, debate, and influence one another, and reads the future out of that collective behavior. The startling part is how it was made: a single undergraduate at Beijing University of Posts and Telecommunications built it in **just 10 days** using AI coding tools. After launch it blew past 68,000 GitHub stars to top the trending list, and drew roughly $4 million in funding within 24 hours ([MiroFish GitHub](https://github.com/666ghj/MiroFish)). This first article covers what MiroFish is, where it came from, and how it's used. In short — MiroFish is the emblem of a shift from "AI that answers questions" to "AI that simulates a society to solve problems."

![MiroFish logo](/mirofish/mirofish-logo.jpeg)
*Image: MiroFish official repository · [GitHub](https://github.com/666ghj/MiroFish) (AGPL-3.0)*

## What MiroFish Is — Predicting With a Miniature Society

MiroFish's official one-liner is "A Simple and Universal Swarm Intelligence Engine, Predicting Anything." The heart of it is the *method*. Traditional forecasting pours past numbers into a statistical model and gets a probability. MiroFish does the opposite — **it builds a small society and watches what unfolds inside it.**

Concretely: give it text about an event or topic (news, a policy draft, an opinion report) as a "seed," and MiroFish extracts the people, institutions, events, and relationships into a knowledge graph, then spawns hundreds to thousands of virtual personas from it. Each agent has its own disposition, background, decision logic, and **long-term memory**. They post, comment, and argue on Twitter-like and Reddit-like platforms, shifting one another's views. From a "god's-eye view," the user can inject variables or question individual agents directly. So what MiroFish delivers isn't a single number — it's **the very process by which opinion splits, coalesces, and spreads.**

## How It Predicts — a Five-Stage Pipeline

MiroFish's pipeline runs through roughly five stages.

1. **Knowledge graph construction** — GraphRAG extracts people, institutions, events, and relationships from your seed material into a dynamic knowledge graph. This graph is the skeleton of the virtual world.
2. **Agent persona generation** — From the graph it stamps out hundreds to thousands of agents with distinct personalities and stances.
3. **Dual-platform parallel simulation** — Agents interact across two social platforms (Twitter-like and Reddit-like). Each agent's memory is continuously updated (via a memory layer such as Zep Cloud).
4. **Report generation** — A dedicated ReportAgent turns the simulation's dynamics into a structured forecast report.
5. **Interactive exploration** — From a god's-eye view, the user queries individual agents and re-runs "what if?" (counterfactual) scenarios.

![MiroFish running — virtual agents interacting across two platforms in a simulation](/mirofish/mirofish-screenshot.png)
*Image: MiroFish running screen · [GitHub](https://github.com/666ghj/MiroFish)*

## How It Differs From Traditional Forecasting

MiroFish's character sharpens when placed next to conventional methods.

| Dimension | Traditional (statistics/time series) | MiroFish (agent simulation) |
|-----------|--------------------------------------|-----------------------------|
| Method | Regress past numbers in a model | Build a virtual society and observe |
| Input | Structured numeric data | Text, news, policy documents |
| Output | A single probability | Dynamics of opinion/relationships over time |
| Transparency | Black box | Traceable down to individual agents |

*Sources: MiroFish repository and analysis ([blocmates](https://www.blocmates.com/articles/what-is-mirofish-the-agent-engine-that-can-predict-anything-and-everything)).*

The biggest difference is **transparency and narrative**. Instead of "candidate A has a 62% chance of winning," MiroFish shows *why* through the agents' conversations — which groups coalesce, which message spreads where. As one write-up put it: "Instead of feeding numbers into a statistical model and getting a probability, MiroFish builds a miniature society and watches what happens."

## It's Actually a Half-Century-Old Idea — the Lineage of 'Artificial Societies'

MiroFish's "build a virtual society and observe it" premise looks new, but it's the latest chapter of a research tradition more than fifty years old. The roots trace to 1971. Economist Thomas Schelling — who would win the 2005 Nobel in economics — showed in "Dynamic Models of Segregation" that placing two kinds of pieces on a grid and giving them only a weak rule ("I'm content if even some of my neighbors are like me") was enough to split a city completely by race. Small individual preferences aggregate into vast collective patterns (emergence) — the prototype of what MiroFish does was already here.

The idea grew into "complexity and emergence" research centered on the Santa Fe Institute, founded in 1984, and reached a landmark in 1996 with Sugarscape, from Joshua Epstein and Robert Axtell's *Growing Artificial Societies*. Turn loose virtual humans with different vision, metabolism, and lifespans on a landscape of resources (sugar), and social phenomena — wealth inequality, tribe formation, trade, war — emerged on their own from a handful of rules. The field they opened is "agent-based modeling." What decisively sets MiroFish apart from this old lineage is one thing: the old agents were "dots" moving by numbers and simple rules, whereas MiroFish's agents are LLMs that write and argue. After Stanford's 2023 "Generative Agents" work showed 25 LLM residents of a virtual town, "Smallville," spontaneously organizing a Valentine's party, the movement to seat language models as citizens of artificial societies took off. MiroFish is the most popular product of that movement — a half-century-old idea with LLM agents layered on top.

*Sources: T. Schelling, "Dynamic Models of Segregation," Journal of Mathematical Sociology 1 (1971); J. Epstein & R. Axtell, *Growing Artificial Societies* (MIT Press, 1996); J. S. Park et al., "Generative Agents," UIST 2023.*

## Where It Came From — 10 Days and $4 Million

MiroFish's birth is itself an event. An undergraduate at Beijing University of Posts and Telecommunications, **Guo Hangjiang**, built it in **just 10 days** using nothing but AI coding assistants. On release in March 2026 it hit #1 on GitHub's global trending list, and its stars swelled from an early ~30,000 to over 68,000 (as of July 2026) ([MiroFish GitHub](https://github.com/666ghj/MiroFish)). Shortly after, Shanda Group founder Chen Tianqiao invested about $4 million (30 million yuan) within 24 hours of seeing the demo.

There's a technical lineage, too. MiroFish is built on **OASIS**, CAMEL-AI's open-source social simulator, and pairs with a predecessor tool, **BettaFish**, that produces opinion reports. It's licensed AGPL-3.0, with an official homepage at mirofish.ai. Interest spread so fast that an unofficial Korean-localized fork (MiroFish-Ko) appeared within days of release. In short, MiroFish didn't come from nowhere — it's what happens when one person rapidly assembles existing agent-simulation research into a *usable product*. And that "rapidly" is the crux of the story.

## Where It's Been Used — From Public Opinion to a Novel's Ending

If this sounds abstract, look at real cases.

- **Campus opinion simulation (Wuhan University)**: Feeding a "Wuhan University opinion report" produced by the predecessor BettaFish as a seed, it simulated how sentiment would move over the coming weeks following a campus controversy. The result wasn't a single point of "where opinion lands," but a **time-sequenced trajectory of which factions form, shift, and influence one another** — which is why some said "you no longer need people for opinion polling."
- **Predicting the lost ending of *Dream of the Red Chamber***: It ingested all 80 surviving chapters (hundreds of thousands of characters) of the classic novel that Qing-dynasty author Cao Xueqin left unfinished, its ending lost. MiroFish spawned agents each carrying a character's personality, relationships, and memory, ran the remaining arc, and produced **multiple branching endings** rather than a single answer — not one language model continuing the prose, but the "social dynamics of a simulated cast" driving the story. This *Dream of the Red Chamber* demo drew particular buzz on Chinese social media.
- **Widening applications**: trading-signal generation, market-sentiment analysis, policy-impact analysis, election forecasting, product-launch reactions, competitor-response simulation, sanctions-effect prediction, and more.

From an investing and management angle, "market sentiment" and "policy impact" are the intriguing ones. Being able to pre-run market reactions — once seen only as numbers — as "conversations among virtual participants" adds a tool to scenario planning. (That said, this is only a simulation, and the limitations below must always be read alongside it before using it as a basis for actual investment decisions.)

## Limits and Caveats — 'Plausible' Isn't 'Correct'

MiroFish is captivating, but there are clear points to view coldly.

- **Validation problem**: the richer and more polished the output, the harder it becomes to judge whether it's *right*. Real-world predictive accuracy is currently unproven. A plausible narrative is not the same as a correct forecast.
- **Realism of agent behavior**: LLM-based agents don't fully mimic real human behavior. Small differences in initial conditions can dramatically change outcomes, so treating a single simulation as a conclusion is risky.
- **Cost and environment**: running 800–1,200 agents over 30–50 rounds incurs substantial LLM API cost. It's currently optimized for macOS with Windows support in progress, and full offline operation isn't officially supported (the community built a separate offline fork using Ollama and Neo4j).

In other words, MiroFish is best seen not as an "answer machine" but as a "laboratory for exploring possibilities" — a tool for widening your thinking by running scenarios in front of you, rather than handing you the right answer.

## So What — a New Paradigm of Prediction, and the Meaning of '10 Days'

MiroFish's message has two layers. First, **the method of prediction is changing** — from statistical forecasting that "inputs numbers and returns a probability" to simulation forecasting that "builds a society and observes," expanding AI from a tool that gets answers right to one that runs problems forward. Second, and perhaps more important, is **that a single undergraduate built this tool in 10 days.** Systems that once needed a research team are now assembled by an individual wielding AI coding tools. As the cost barrier of development collapses, the bottleneck has moved from "is it technically possible?" to "do you have the idea of what to build?" The "artificial society" experiments Schelling ran by hand on a grid in 1971, and Epstein and Axtell ran on institute computers with Sugarscape in 1996, are now an open-source tool an undergraduate assembles on a laptop in 10 days — what MiroFish really proves isn't predictive accuracy, but how low the threshold to this half-century-old idea has fallen.

The next part [2] walks through the **system overview, required environment, and installation** to actually run MiroFish. Now that the concept is clear, it's time to build a virtual society with your own hands.

## Frequently Asked Questions (MiroFish)

**Q1. What is MiroFish?**
It's an open-source AI engine that takes text (news, policy, etc.) as a "seed," builds a digital society of hundreds to thousands of virtual agents, and forecasts the future by simulating their collective behavior. It predicts via "social simulation" rather than a statistical model.

**Q2. How does it differ from traditional forecasting?**
Traditional methods feed numbers into a statistical model to get a single probability. MiroFish inputs text to build a virtual society and shows changes in opinion and relationships over time, traceable down to individual agents. It gives you process and narrative instead of a probability.

**Q3. Who built it and why is it a big deal?**
An undergraduate at Beijing University of Posts and Telecommunications, Guo Hangjiang, built it in about 10 days using AI coding tools. After its March 2026 release it passed 68,000 GitHub stars to top the trending list and drew about $4 million in funding. That an individual built a research-team-scale system in such a short time made it a sensation.

**Q4. Are its predictions accurate?**
Real-world predictive accuracy is currently unproven. A plausible narrative isn't a correct forecast; it's sensitive to initial conditions and API costs are high. It's better seen as a "scenario-exploration lab" than an "answer machine."

---

*This article is a general explainer based on information public as of July 2026 and is not advice recommending any specific security or product investment decision.*

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is MiroFish?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It's an open-source AI engine that takes text (news, policy, etc.) as a seed, builds a digital society of hundreds to thousands of virtual agents, and forecasts the future by simulating their collective behavior. It predicts via social simulation rather than a statistical model."
      }
    },
    {
      "@type": "Question",
      "name": "How does MiroFish differ from traditional forecasting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional methods feed numbers into a statistical model to get a single probability. MiroFish inputs text to build a virtual society and shows changes in opinion and relationships over time, traceable down to individual agents. It gives process and narrative instead of a probability."
      }
    },
    {
      "@type": "Question",
      "name": "Who built MiroFish and why is it a big deal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An undergraduate at Beijing University of Posts and Telecommunications, Guo Hangjiang, built it in about 10 days using AI coding tools. After its March 2026 release it passed 68,000 GitHub stars to top the trending list and drew about $4 million in funding. That an individual built a research-team-scale system so quickly made it a sensation."
      }
    },
    {
      "@type": "Question",
      "name": "Are MiroFish's predictions accurate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Real-world predictive accuracy is currently unproven. A plausible narrative isn't a correct forecast; it's sensitive to initial conditions and API costs are high. It's better seen as a scenario-exploration lab than an answer machine."
      }
    }
  ]
}
</script>
