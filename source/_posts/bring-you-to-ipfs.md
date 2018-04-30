---
title: 'Bring You to IPFS'
date: 2018-04-19 23:35:11
categories:
- web
- ipfs
tags:
- tutorial
---
Last post, I use Hexo with Minos to build a full site multi-language blog, it's exciting! So in this post, I will tell you how to bring the new blog to IPFS.

<!--more-->

## What is IPFS
{% blockquote dengcb https://dengcb.github.io Welcome to my GitHub %}
IPFS is called for short of ***InterPlanetary FileSystem***, maybe you can visit your data from another galaxy. Due to the limit speed of light, we need quantum entanglement communication to play well.
{% endblockquote %}

IPFS uses data hash address instead of website domain, but in the next, you will find if you want to visit your data in IPFS within a traditional website, you still need domain. And to get hash data, you have to visit a IPFS node server. So, want to decentralize, you maybe need a centralized server first.

Meanwhile, distributed data storage will cause waste. Some updated files, previous versions are no longer valid, but are pinned and permanently retained inside IPFS and cannot be deleted. Even the owner has forgotten the previous data hash, the dead files become ghosts in the IPFS system.

## Install IPFS
- Download latest release
  - Open [Official Site](https://ipfs.io/docs/install/), click `Download IPFS for your platform`
  - Choose the binary for your platform, download and unzip
  
  
- Install IPFS package
  - Such as MacOS, enter `go-ipfs`, and execute `./install.sh`
  - If permission denied, add `sudo`, then copy the ipfs file into path
  - Execute `ipfs help` to test installed
  
  
- Initialize the node
  - Execute `ipfs init`, init the folder `.ipfs` and create config files
  - Keep the `peer identity`, or find it in `~/.ipfs/config`
  - Modify config file, set the storage space `vi ~/.ipfs/config`

        "Datastore": {
          "StorageMax": "6GB"
        }
  
  
- Start the daemon
  - Execute `ipfs daemon > ipfs.log &`, start daemon as background process
  - Execute `ps ax|grep ipfs`, check the daemon alive

## Publish to IPFS
- Build hexo site
  - Please read my last post [Hexo multi-language with Minos](/hexo-minos-multi-language/)
  - Copy the public folder to IPFS node server
  
  
- Add to IPFS
  - Execute `ipfs add -r public` to add public folder to IPFS
  - Keep the public hash
  - Persistent storage `ipfs pin add -r QmXW1287aSKirPBVotV4L5SqhkMGdXqe5RrBNXRMR1JYkS`
  > added ***QmXW1287aSKirPBVotV4L5SqhkMGdXqe5RrBNXRMR1JYkS*** public

    Visit https://ipfs.io/ipfs/QmXW1287aSKirPBVotV4L5SqhkMGdXqe5RrBNXRMR1JYkS directly
  
  
- Name publish
  - Execute below, bind node name with public folder hash
  > ipfs name publish ***QmXW1287aSKirPBVotV4L5SqhkMGdXqe5RrBNXRMR1JYkS***

  - Bind success, the name is the peer when node init
  > Published to ***Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH***: /ipfs/QmXW1287aSKirPBVotV4L5SqhkMGdXqe5RrBNXRMR1JYkS

    Visit https://ipfs.io/ipns/Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH namely

  - `Note: name is fixed, hash is changed, so bind name just like stable IP address`

## Config domain
- Register domain
  Just go Godaddy or other domainer
  
  
- Change DNS Server
  Now, please use [CloudFlare](https://www.cloudflare.com), for some reason:
  - Free DNS
  - Free https, dynamic and security

  Please set DNS Server as
  > dahlia.ns.cloudflare.com
  > sid.ns.cloudflare.com
  
  
- Add DNS record
  - DNS, add A record, set as ipfs.io IP(try `dig +short ipfs.io`)

  - DNS, add TXT record, use ipfs node name
  > dnslink=/ipns/Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH

  - Crypto, set SSL as `full`
  - Page Rules, add one rule

    {% blockquote %}
    ht<span>tp://</span>exa<span>mple.c</span>om/*
    Always Use HTTPS
    {% endblockquote %}
  
  
- Wait for DNS effect

## Setup Gateway
> If you want to build your own gateway, go on (not necessary)

- Install Nginx
  - `apt install nginx-full`
- Config Nginx
  - `vi /etc/nginx/sites-available/example_com`
``` nginx
upstream ipfs-server {
    server 127.0.0.1:8080;
}

map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://ipfs-server/;
    }
}
```
  - execute `nsite -e` `service nginx reload`

## User Experience
This site's [cloning](https://dengcb.net) uses the IPFS, you can try.

The actual feeling, is different from we thought before. The first open takes a long time, always 504 timeout, but once connection is success, open will be very quick. Why? The IPFS official admits this is caused by the IPNS service bugs. We published name in the past, so we don't need modify DNS while change files.

However, ipns service is very time-consuming and takes more than 1 minute often. Meanwhile, ipfs is almost seconds. [IPFS Officle website](https://ipfs.io) content is fixed, so hash address doesn't change, using ipfs and open fast.

If, IPFS cannot enhance the speed of ipns service, first open needs ONE minute always, who can wait?