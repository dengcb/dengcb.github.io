---
title: 'Use iTerm2 to telnet SMTH bbs'
date: 2018-04-26 20:08:11
categories:
- web
- iterm
tags:
- tutorial
---
When you try BBS in macOS, it sucks! Someone uses welly, but I always use iTerm2 to ssh servers. Today I'll show you how to telnet SMTH BBS with iTerm2.

<!--more-->

## Prepare
> Upgrade to 10.13.1, telnet disapeared, try execute
**brew install telnet**
Install telnet to ***/usr/local/bin***


## Config
    Open Preferences->Profiles
**in General**
- Click `+`, add a new Profile, clone Default's config
- Change Name, such as `SMTH`
- Add a Shortcut key, such as `^⌘S`
- Add Command, as `/usr/local/bin/telnet newsmth.net`

**in Text**
- Check `Treat ambiguous-width characters as double-width`
- Click `Change Font` to set right size, don't change font
- `Character Spacing`, set `Horizontal` as 90%, `Vertical` as 80%

**in Terminal**
- Character Encoding choose `Chinese(GBK)`

**in Session**
- Check `When idle, send ASCII code`

{% colorquote success %}
Done, happy your SMTH life!
{% endcolorquote %}