---
title: 'GitHub的正确打开方式'
date: 2018-04-30 13:36:30
categories:
- 编码
- GitHub
tags:
- 教程
---
开始用GitHub到今天，其实不到一个月。越用越能体会到，就一个字：好用。好东西不能藏着掖着，众乐乐才乐。因为时间短，认识肤浅，很多好东西还没发现，且走且分享吧！

<!--more-->

## GitHub
> Git是 [Linus](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%C2%B7%E6%89%98%E7%93%A6%E5%85%B9)（你牛死）老人家的业余作品。2005年，当商业版本管理工具BitKeeper免费版到期时，堂堂Linux开发团队怎能付费呢，于是大神就自己写了一个，直接把版本管理工具带入现代化。
> 
> Git很高端大气，一般人学不会，比如我，现在也只会几个简单命令，一直把Git当SVN用。生逢其时，社区的力量爆发，Ruby社区在酒吧里开始策划，GitHub诞生了，2008年到现在，十年，一统江湖。

## Desktop
> 一般用户，比如我，还是用 [GitHub Desktop](https://desktop.github.com/) 吧。命令行虽然酷炫，但内功不够，怕伤着经脉。

## Pages页
> 参考 [用Minos搭建Hexo全站多语言站点](/zh/hexo-minos-multi-language/)，GitHub提供免费静态空间，可搭建博客或写文档。
现在已经支持自定义域名https，👍
良心企业！

## GitBook
> 这个项目发展很快，和我早先见过的版本，又进化了。
你可以在里面放电子教程，还可以写自己的开发文档。

## 内联模块
> 项目里套项目，比如你的项目用了别人的，那就可以建一个指针
> `git submodule add your_submodule_url`
> 然后你取到本地时
> `git clone your_project_url --recursive`
> 更新
> `git submodule update`

## 私人仓库
> 新年伊始，好消息就来了。
微软旗下的GitHub对个人账户开放了免费私人仓库。

## 粉、追、赞和分身
> 粉：喜欢一个人，跟踪他，注意他的一举一动
> 追：喜欢一个物，订阅它，收听它的任何变化
> 赞：表扬一个物，鼓励它，但是不听它的消息
> 分身：克隆羊一只，可以修改，可以pull request给作者