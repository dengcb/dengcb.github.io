---
title: '迁移Redis内存数据库'
date: 2019-01-23 15:36:31
categories:
- 维护
- Redis
tags:
- 教程
---
Redis是现在最流行的内存数据库系统，你要想让自己的应用跑得飞起，就要用它。相对其他服务，Redis算很好配置的了，简单记录，以备查用。

<!--more-->

## 安装
- 在新服务器安装Redis
`apt install redis-server php-redis`

- 在新服务器安装phpRedisAdmin
  - 打开[GitHub下载页面](https://github.com/ErikDubbelboer/phpRedisAdmin)
  - 克隆最新版到/usr/share/phpredisadmin

## 配置
- 修改Redis配置
`vi /etc/redis/redis.conf`

- 修改Nginx配置
  - 安装apache2的utils，并生成htpasswd
  ```
  apt install apache2-utils
  htpasswd -c /etc/phpreadmin/htpasswd admin
  ```
  - 在phpRedisAdmin的web配置中加密
  ```
  location / {
    auth_basic "Dengcb Redis Admin";
    auth_basic_user_file /etc/phpreadmin/htpasswd;
    try_files $uri $uri/ /index.php?$args;
  }
  ```

- 修改php配置
```
[Session]
session.save_handler = redis
session.save_path = "unix:///var/run/redis/redis-server.sock?persistent=1&weight=1"
```