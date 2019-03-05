---
title: 'Wildcard Certificates With Let''s Encrypt'
date: 2019-03-05 16:00:13
categories:
- web
- ssl
tags:
- tutorial
---
Now it is a HTTPS age, you can apply free ssl certificates with any cloud platform, but wildcard (*.domain.com) certificate is not free. So how to generate your first free wildcard certificate with Let's Encrypt?

<!--more-->

## What's Let's Encrypt
> Let's Encrypt is a public benefit organization by the`Internet Security Research Group`(ISRG), and sponsored by many famous foundations, such as Mozilla, Linux, Cisco, etc.
> 
> The purpose of Let's Encrypt is to promote`HTTPS`to whole internet, reduce the difficulty of obtaining and deploying certificates through the`Automated Certificate Management Environment`(ACME), and realize the simple, automatic and free ssl certificate of the website.
> 
> For simple and safe, the certificate is only valid for 3 months, so the client must have the ability to automatically renew, otherwise every 3 months, millions of website manual renewals will become a nightmare.

## Why use acme.sh
> There are more than 30 clients, include the official client: certbot, I read the document, it's very powerful and professional, the others are available for many languages and platforms. However, I don't need the power or the function, I just hope it quick and simple.
>
> So I choose the most recommended client:`acme.sh`
> Using bash, and auto update!

## How use acme.sh
> install acme.sh:`curl https://get.acme.sh | sh`
> login again

> to auto update, get DNS API token,  for example: [Tencent Cloud](https://www.dnspod.cn/console/user/security)
> record ID and Token, then run in shell:
> `export DP_Id="id"`
> `export DP_Key="token"`
> run once, remembered by acme.sh

> issue cert:`acme.sh --issue -d dengcb.com -d *.dengcb.com --dns dns_dp`
> if alias mode, add:`--challenge-alias alias.com`(optional)
> install cert:

```
acme.sh  --installcert -d dengcb.com -d *.dengcb.com \
         --key-file /etc/nginx/ssl/dengcb.key \
         --fullchain-file /etc/nginx/ssl/fullchain.cer \
         --reloadcmd "service nginx force-reload"
```

> update cert: latest acme.sh supported auto update already

> auto update acme.sh:`acme.sh --upgrade --auto-upgrade`

> error debug:`acme.sh --issue ..... --debug`(optional)