---
title: "VS Code + Claude Code Setup Guide: AI Coding in One Window"
description: "Learn how to set up VS Code with Claude Code for AI-assisted development. File explorer, editor, terminal, and AI chat — all in one screen."
pubDate: 2026-06-10T09:00:00+09:00
category: ai
tags: ["VS Code", "Claude Code", "Developer Setup"]
lang: en
koSlug: vscode-claude-code-usage-guide
---

If you had to sum up VS Code in one sentence, it would be this: everything you need to code — in a single window, organized around one project folder. If you've ever juggled 20 browser tabs, a separate text editor, a standalone terminal, and an AI chat window all at once, this guide is for you. And if you're using **Claude Code**, VS Code is the ideal home for it. Your project folder sits at the center, with file browsing, editing, a terminal, and AI conversation all living inside the same program. This guide breaks down the VS Code interface zone by zone, so you can get productive from day one.

![laptop screen displaying colorful code](https://images.unsplash.com/photo-1607799279861-4dd421887fb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwzfHx2aXN1YWwlMjBzdHVkaW8lMjBjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8MHx8fDE3ODEyMjczMDN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/laptop-screen-displaying-colorful-code-8qEB0fTe9Vw?utm_source=spice-bandit-blog&utm_medium=referral)*

## Why Use Claude Code Inside VS Code

Claude Code works fine from a standalone terminal, but running it inside VS Code changes the dynamic significantly — **your project folder becomes the shared workspace**. The key concept is context. When you open a folder in VS Code, Claude Code can read and modify the files inside it, and you can watch every change happen in real time right next to the conversation.

Here is what the workflow looks like before and after:

- **Before**: File Explorer (browse files) + Notepad/editor (edit code) + Terminal app (run commands) + Browser AI chat (ask questions) — four windows, endless alt-tabbing.
- **After**: VS Code, one window = left panel (folder tree) + center top (editor) + center bottom (terminal) + right panel (Claude Code chat).

No more hunting for "where was that file again?" across scattered windows. Everything is visible at once. Keep this mental layout in mind as you read on — it will make each section click immediately.

```
┌──────┬───────────────────────────┬──────────────┐
│ Left │  Center top: File editor  │    Right:    │
│ menu │  (read and edit code)     │ Claude Code  │
│ /    ├───────────────────────────┤  chat panel  │
│ tree │  Center bottom: Terminal  │ (AI dialog)  │
│      │  (run commands)           │              │
└──────┴───────────────────────────┴──────────────┘
```

## Left Panel: Opening a Folder and Navigating Files

The starting point for using VS Code is the **left-side Activity Bar and Sidebar**. A vertical strip of icons runs along the far left edge of the window. Click any icon to expand the corresponding panel to its right. The top icon — the Explorer — is the one you'll use most.

The very first thing to do when you start a project is **open a folder**: go to `File → Open Folder` (or use the keyboard shortcut) and select your project directory. VS Code will display the entire folder tree in the left panel, and that folder becomes the anchor for everything else you do.

Here is what each icon in the Activity Bar does, from top to bottom:

- **Explorer**: Shows the file and folder tree for your open project. Click any file to open it in the editor. This is the screen you'll live in most of the time.
- **Search**: Find and replace any word or code snippet across your entire project in one shot.
- **Source Control**: Review git changes and commit. You can see at a glance which files have been modified.
- **Run and Debug**: Execute code or step through it with a debugger.
- **Extensions**: Install plugins. This is also where you install the Claude Code extension for VS Code.

> Tip: Taking a screenshot of your own VS Code left panel and keeping it handy is a practical reference while you're getting used to the layout.

![black flat screen computer monitor](https://images.unsplash.com/photo-1607706189992-eae578626c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzQ5NjZ8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBzdHVkaW8lMjBjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8MHx8fDE3ODEyMjczMDN8MA&ixlib=rb-4.1.0&q=80&w=1080)
*Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer?utm_source=spice-bandit-blog&utm_medium=referral) on [Unsplash](https://unsplash.com/photos/black-flat-screen-computer-monitor-oXlXu2qukGE?utm_source=spice-bandit-blog&utm_medium=referral)*

## Center Top: The Editor Where You Read and Write Code

The upper center area of VS Code is the **editor pane** — where you actually read and modify code. Click a file in the Explorer on the left, and it opens here. Open multiple files and they stack as browser-style **tabs** across the top of the editor, making it easy to switch between them.

A few basics worth knowing in the editor:

- **Syntax highlighting**: VS Code colors your code automatically based on the language, making it much easier to read at a glance.
- **Auto Save**: Enable `File → Auto Save` and you never have to remember to hit Ctrl+S again.
- **Split editor**: Divide the editor pane left and right to view two files side by side — useful for comparing or referencing one file while editing another.

When Claude Code modifies a file, the changes appear here in the editor with color-coded diff highlighting — additions, deletions, and edits all clearly marked. This is one of the biggest advantages of working inside VS Code: you can see exactly what the AI changed, line by line, without switching windows.

## Center Bottom: The Integrated Terminal

Below the editor sits the **integrated terminal**. Instead of opening a separate terminal application, you can open one directly in VS Code via `Terminal → New Terminal` (or the keyboard shortcut). It automatically starts in your currently open project folder, which means you rarely need to use `cd` to navigate anywhere.

Common things you'll do in the terminal:

- Start your development server or run install commands (e.g., `npm install`, `python main.py`)
- Manage version control with `git add`, `git commit`, `git push`
- Run **`claude`** to launch Claude Code in terminal mode — this is the entry point when you prefer the CLI interface

Because the terminal sits directly below the editor, the loop of edit → run → check results stays unbroken. You make a change in the editor, glance down to the terminal, run the command, and see the output — all without leaving the window.

## Right Panel: Chatting with Claude Code

The right side of the screen is where **Claude Code lives as a chat panel** (once you install the VS Code extension). Here you type natural-language requests like "fix the bug in this function," "explain the structure of this folder," or "publish this post," and Claude Code reads and edits the files in your open project directly.

The real power of this layout is what you might call **"supervise as you delegate"**:

- Type a request on the right → watch the changes appear in the center editor → run or deploy from the terminal below
- Every step happens on one screen, so you can review what the AI is doing as it does it, rather than handing off blindly and checking results later

In this sense, VS Code acts as a workbench that gives Claude Code everything it needs — the project folder, the file context, and the tooling — all in one place, while keeping you in the loop at every step.

## Putting It All Together: One-Window Workflow

The core insight of VS Code is simple: **four zones, one screen**. Left panel (explore files) → center top (edit code) → center bottom (run commands) → right panel (talk to Claude Code). Once this layout becomes second nature, the habit of alt-tabbing between scattered windows fades away. Your project folder becomes the single source of truth, and browsing, editing, executing, and AI collaboration flow into each other seamlessly.

If you're currently using Claude Code only from a standalone terminal, the easiest next step is to open your project folder in VS Code today. That one change — giving Claude Code a shared visual workspace — is what turns an already-capable AI assistant into a genuinely integrated development partner. Tab chaos ends here.
