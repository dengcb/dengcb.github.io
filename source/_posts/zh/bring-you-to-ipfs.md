---
title: '带你去星际'
date: 2018-04-19 23:35:11
categories:
- 网站
- IPFS
tags:
- 教程
---
这年头，不搞点云计算分布式大数据区块链，就没法和人正常交流了。在上一篇，实现了Hexo的全站双语，兴奋之余，不妨再进一步，让你飞，带你去星际。

<!--more-->

## 准备工作
{% colorquote warning %}
这一章，在英文页面里是不存在的
{% endcolorquote %}

任何去中心化的东东，都是要反对要消灭的，所以对个人而言，首先需要具备`科学上网`的能力。如果连这个基础都不具备，下面的内容就不需要再看了，星际系统网站已被墙，你是访问不了的。

~~注：本站不提供科学上网教程，也是为了你不用科学上网就能访问本站，见谅！~~

## 何为星际
{% blockquote 长斌 https://dengcb.github.io 欢迎访问我的GitHub主页 %}
星际文件系统（InterPlanetary FileSystem），简称星际。突然间，一口霸气涌上心头，这已经把未来第一次接触后的宇宙合作考虑进去了。的确，咱地球有这么多好片，怎能光顾着自己享受呢？就是不知量子纠缠通信什么时候普及，否则两颗星球之间共享个片，浩叹会耗费多少光年。
{% endblockquote %}

星际使用内容寻址代替域名寻址，但是后面章节可以看见，要用传统方式访问星际系统里的网站文件，还是离不开域名配置。而去获取内容哈希得到的地址，也要访问星际节点服务器。某种意义上，去中心化文件存储的起点，还是离不开中心化的服务器。

而分布式的数据存储，必然造成浪费。有些持续升级的文件，之前存储的内容不再有效，使用pin后却永久保留在星际内部，无法剔除。甚至连文件的主人都没有保留之前的内容地址，死文件成了游荡在星际系统里的孤魂野鬼。

## 安装星际
- 下载最新安装包
  - 打开 [官方网站](https://ipfs.io/docs/install/)，点击 `Download IPFS for your platform`
  - 选择对应自己操作系统的压缩包，下载，解压缩
  
  
- 安装星际系统
  - 以MacOS为例，进入 `go-ipfs` 目录，输入 `./install.sh`
  - 权限不够请在前面加 `sudo`，其实就是把可执行文件拷贝至运行路径里
  - 输入命令 `ipfs help` 测试安装是否成功
  
  
- 创建星际节点
  - 输入命令 `ipfs init`，初始化会在用户目录下生成 `.ipfs` 目录和配置文件
  - 把生成的 `peer identity` 拷贝留用，或者在 `~/.ipfs/config` 里可见
  - 修改配置，选择合适自己的存储空间容量 `vi ~/.ipfs/config`

        "Datastore": {
          "StorageMax": "6GB"
        }
  
  
- 开启守护进程
  - 输入命令 `ipfs daemon > ipfs.log &`，以后台进程方式启动守护进程
  - 输入命令 `ps ax|grep ipfs`，检查守护进程是否启动成功
  - `注：想要和星际网络连接，需要全局科学上网，甚至最好在墙外操作`

## 发布网站
- 准备Hexo文件
  - 请参考我上一篇文章 [用Minos搭建Hexo全站多语言站点](/zh/hexo-minos-multi-language/)
  - 将生成的public目录拷贝至刚才生成星际节点的服务器
  
  
- 发布至星际
  - 输入命令 `ipfs add -r public` 将public目录发布至星际
  - 将public目录生成的哈希拷贝留用
  - 持久保存 `ipfs pin add -r QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM`
  > added ***QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM*** public

    可以通过https://ipfs.io/ipfs/QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM 直接访问
  
  
- 绑定代名
  - 输入命令，将public目录哈希值绑定当前节点代名
  > ipfs name publish ***QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM***

  - 绑定成功，该代名就是在上一章init时生成的peer值
  > Published to ***Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH***: /ipfs/QmYGDrqriAZmhKjqZcRxBLzD8gXb5q3ghMFXKLs42FaqbM

    可以通过https://ipfs.io/ipns/Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH 代名访问

  - `注：代名是不变的，文件哈希一直在变，所以绑定代名，才能在传统域名里解析，代名就是星际系统里的固定IP`

## 配置域名
- 获取域名
  可以前往 Godaddy或各大域名商处注册
  
  
- 修改DNS Server
  这里，推荐使用 [CloudFlare](https://www.cloudflare.com) 作为域名解析商，原因是：
  - 免费解析
  - 免费支持https，加密传输更快（天朝你懂的）

  将DNS Server改成下列即可
  > dahlia.ns.cloudflare.com
  > sid.ns.cloudflare.com
  
  
- 修改解析
  - DNS菜单，添加A记录，指向某个ipfs.io服务器（可以用dig命令查询）

  - DNS菜单，添加TXT记录，使用刚刚的代名
  > dnslink=/ipns/Qmdn4vrHjbmsQvHPXAiJvWFHQRqGd5fP33HJqd9AE4EjMH

  - Crypto菜单，SSL选择为full
  - Page Rules菜单，添加一条规则

    {% blockquote %}
    ht<span>tp://</span>exa<span>mple.c</span>om/*
    Always Use HTTPS
    {% endblockquote %}
  
  
- 静静等待

## 搭建网关
> 希望提供自己gateway服务的，再参考下面步骤（非必须）

- 安装Nginx
  - `apt install nginx-full`
- 配置Nginx
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
  - 运行 `nsite -e` `service nginx reload`

## 使用体验
本站的 [克隆站](https://dengcb.net) 使用了星际系统，你可以访问体验。

实际使用效果，和想象中有点差别。第一次连接会花很长时间，经常出现Timeout，但连接成功一次后就飞快了。这是为什么呢？IPFS官方承认，这是他们IPNS服务不完善造成的。前面，我们把ipfs用代名转成ipns，是为了文件升级时，不用再次修改DNS。

然而，ipns寻址需要非常耗时，一般都超过1分钟。这和ipfs寻址几乎秒开，形成鲜明对比。[IPFS官方网站](https://ipfs.io) 因为内容固定，首页地址基本不变，用的是ipfs寻址，所以打开飞快。

所以，如果星际系统不能改善IPNS寻址性能，第一次打开网页都要超过一分钟，谁能等待呢？