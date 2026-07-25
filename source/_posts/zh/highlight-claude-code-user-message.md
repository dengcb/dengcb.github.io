---
title: '配置Claude Code用户信息高亮'
date: 2026-07-25 21:33:11
categories:
- 人工智能
- iTerm
tags:
- 教程
---
我经常给iTerm2的Profile窗口配一点透明度。结果用Claude Code时，用户信息默认高亮是灰色，一透明就和窗口背景颜色融合了，导致高亮失效。想寻找自己的历史信息，狗眼都看瞎了。

<!--more-->

## 其他尝试
> 问了下Claude Code，他建议我用iTerm2的Trigger功能来解决这个问题
**Profiles → Default → Advanced → Triggers**
使用正则 ***^❯*** 来匹配，Action选 ***Highlight Text***
结果，只能匹配一行而已，不满足需求

## 解决方案
    进入Claude Code
**/theme**
- 移动光标到`New custom theme...`，新增一个自定义主题
- 输入自定义主题名称，比如`my-dark`

**修改配置**
- 配置文件是`~/.claude/themes/my-dark.json`
- 自己打开或让你家的AI编辑配置文件
- 添加一个`overrides`，`"userMessageBackground": "rgb(20, 50, 35)"`

{% colorquote success %}
打完收工，试试愉快地和Claude Code一起玩耍吧！
{% endcolorquote %}