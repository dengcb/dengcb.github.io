---
title: '用Let''s Encrypt生成泛域名证书'
date: 2019-03-05 16:00:13
categories:
- 网站
- 证书
tags:
- 教程
---
现在已经是全民HTTPS的年代，不论哪朵云都可以免费申请到ssl证书，但是泛域名（*.domain.com）证书还没有免费。本篇就教你用Let's Encrypt来生成你的第一个免费泛域名证书。

<!--more-->

## 了解Let's Encrypt
> Let's Encrypt是一个由`互联网安全研究小组`（ISRG）发起的公益组织，得到了一大票世界闻名的基金会支持，比如Mozilla、Linux、思科等。
> 
> 此组织诞生的目的就是推广全网络的https化，通过自动证书管理环境（ACME）降低获取和部署证书的难度，实现网站简单、自动、免费地加持ssl证书，你说香不香？
> 
> 为了实现简单和安全双响，该证书有效期只有3个月，所以客户端必须拥有自动续期的能力，否则每隔3个月，成千上万的网站续期会成为推广该证书的最大的障碍。

## 选择客户端
> 我数了下，目前就有30多个客户端。其中，官方自己有一个客户端：certbot，我研究了一下文档，很专业很强大。其他的客户端各式各样，适合各种语言和平台。但是，我并不想太强调功能的强大，我希望先上手立刻用上，简单就好。
>
> 所以我选择了大多数网友推荐的：`acme.sh`
> 基于bash脚本，可以自动更新，夫复何求！

## 使用acme.sh
> 安装acme.sh：`curl https://get.acme.sh | sh`
> 重新登录

> 为了以后自动更新，需要生成DNS API token，以腾讯云为例，[登录入口](https://www.dnspod.cn/console/user/security)
> 记录获取的ID和Token，然后输入：
> `export DP_Id="id"`
> `export DP_Key="token"`
> 输入一次，acme.sh会记住，以后不用再输

> 颁发证书：`acme.sh --issue -d dengcb.com -d *.dengcb.com --dns dns_dp`
> 如果使用alias模式，后面加上：`--challenge-alias alias.com`（可选）
> 安装证书：

```
acme.sh  --installcert -d dengcb.com -d *.dengcb.com \
         --key-file /etc/nginx/ssl/dengcb.key \
         --fullchain-file /etc/nginx/ssl/fullchain.cer \
         --reloadcmd "service nginx force-reload"
```

> 更新证书：最新版acme.sh已经支持自动更新，无需另外设置

> 自动更新acme.sh：`acme.sh --upgrade --auto-upgrade`

> 出错调试：`acme.sh --issue ..... --debug`（可选）