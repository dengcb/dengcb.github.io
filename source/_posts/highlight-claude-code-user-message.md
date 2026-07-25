---
title: 'Highlight Claude Code User Message'
date: 2026-07-25 21:33:11
categories:
- AI
- iTerm
tags:
- tutorial
---
I use a transparent iTerm2 profile. In Claude Code, the default gray highlight for user messages blends into the background, which makes old messages hard to spot.

<!--more-->

## Attempts
> I asked Claude Code about it, and it suggested using the Trigger feature in iTerm2.
**Profiles → Default → Advanced → Triggers**
Use the regex ***^❯*** for matching, and choose ***Highlight Text*** as the Action.
But, it could only match one line, which did not solve the problem.

## Solution
    Open Claude Code
**/theme**
- Move the cursor to `New custom theme...` and create a custom theme
- Enter a custom theme name, for example `my-dark`

**Edit the config**
- The config file is `~/.claude/themes/my-dark.json`
- Open it yourself, or let your AI help edit the file
- Add an `overrides` field: `"userMessageBackground": "rgb(20, 50, 35)"`

{% colorquote success %}
Done. Now go enjoy chatting with Claude Code a bit more happily.
{% endcolorquote %}
