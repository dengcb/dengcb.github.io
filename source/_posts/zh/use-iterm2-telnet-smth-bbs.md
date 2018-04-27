---
title: 'Mac下使用iTerm2连接水木BBS'
date: 2018-04-26 20:08:11
categories:
- 网站
- iTerm
tags:
- 教程
---
用macOS的时候，总感觉上BBS很费劲，有人说，用welly啊，我还真没用过。但是平时总是用iTerm2来连服务器，今天就尝试下用它来连连水木的BBS看。

<!--more-->

## 准备工作
> 升级到10.13.1后，系统找不到telnet了，没关系，可以用
**brew install telnet**
来安装，会安装到***/usr/local/bin***目录下


## 配置说明
    打开iTerm2的Preferences->Profiles
**在General栏**
- 点击`+`，新增一个Profile，继承了Default的设置
- 修改Name，比如`SMTH`这样
- 可以增加一个快捷键，比如`^⌘S`
- 修改Command，输入`/usr/local/bin/telnet newsmth.net`

**在Text栏**
- 勾上`Treat ambiguous-width characters as double-width`
- 打开`Change Font`设置适合的大小，字体不用改
- `Character Spacing`里，`Horizontal`设为90%，`Vertical`设为80%

**在Terminal栏**
- Character Encoding选`Chinese(GBK)`

**在Session栏**
- 可以勾上`When idle, send ASCII code`

{% colorquote success %}
好了，试试愉快的和水母一起玩耍吧！
{% endcolorquote %}