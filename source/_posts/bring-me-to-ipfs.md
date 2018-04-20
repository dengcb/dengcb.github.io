---
title: 'Bring Me to IPFS'
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

IPFS uses data hash address instead of website domain, but in the next, you will find if you want to visit your data in IPFS within a traditional website, you still need domain. And to get data hash, you have to visit a IPFS node server. So, want to decentralize, you maybe need a centralized server first.

Meanwhile, distributed data storage will cause waste. Some updated files, previous versions are no longer valid, but are permanently retained inside IPFS and cannot be deleted. Even the owner has forgotten the previous data hash, the dead files become ghosts in the IPFS system.

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
  > added ***QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM*** public

    Visit https://ipfs.io/ipfs/QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM directly
  
  
- Name publish
  - Execute below, bind node name with public folder hash
  > ipfs name publish ***QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM***

  - Bind success, the name is the peer when node init
  > Published to ***Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH***: /ipfs/QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM

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

## User Experience
This site's [cloning](https://dengcb.net) uses the IPFS, you can try.

The actual feeling, or progress bar and die, or open quickly, half to half. Why? I think first you get doamin IP adress from DNS, and DNS cached, so traditional web can hold the traffic. Then you get public hash from IPFS NS server, but the server cannot hold your visit. So get data back quickly or die.

If, IPFS cannot enhance the performance of server, now it's unstable already, how can think about future?