---
title: 'Migrate Redis server'
date: 2019-01-23 15:36:31
categories:
- maintain
- redis
tags:
- tutorial
---
Redis is the most popular memory database system, enhance your site just like fly in sky by using it. Redis is easy to config, and record something to someone need it.

<!--more-->

## Install
- install Redis in new server
`apt install redis-server php-redis`

- install phpRedisAdmin in new server
  - open [GitHub site](https://github.com/ErikDubbelboer/phpRedisAdmin)
  - clone latest to /usr/share/phpredisadmin

## Config
- modify Redis config
`vi /etc/redis/redis.conf`

- modify Nginx config
  - install apache2 utils, generate htpasswd
  ```
  apt install apache2-utils
  htpasswd -c /etc/phpreadmin/htpasswd admin
  ```
  - encrypt phpRedisAdmin website login
  ```
  location / {
    auth_basic "Dengcb Redis Admin";
    auth_basic_user_file /etc/phpreadmin/htpasswd;
    try_files $uri $uri/ /index.php?$args;
  }
  ```

- modify php config
```
[Session]
session.save_handler = redis
session.save_path = "unix:///var/run/redis/redis-server.sock?persistent=1&weight=1"
```