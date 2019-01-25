---
title: '迁移MySQL数据库'
date: 2019-01-22 13:54:23
categories:
- 维护
- MySQL
tags:
- 教程
---
MySQL是现在最流行的开源数据库系统，基本上个人或小公司都在用，已经是业界标配。在此记录一次数据库服务器的迁移过程，以备查询和共享。

<!--more-->

## 安装
- 在新服务器安装MySQL
`apt install mysql-server-5.7 php7.2-mysql`

- 在新服务器安装phpmyadmin
  - 打开[官网下载页面](https://www.phpmyadmin.net/downloads/)
  - 下载最新版的zip包
  - 解压到/usr/share/phpmyadmin

## 修改
- 修改MySQL配置
`vi /etc/mysql/mysql.conf.d/mysql.cnf`
- 修改phpmyadmin配置
`https://db.yourdomain.com/setup`
修改完成后保存为
`/usr/share/phpmyadmin/config.inc.php`
- 修改root密码
MySQL5.7默认root没有密码
`set password for 'root'@'localhost' = password('123');`
- 用phpmyadmin登录
如果发生错误`Access denied for user 'root'@'localhost'`
需要更改root登录模式
`update mysql.user set plugin = 'mysql_native_password' where user = 'root';`
- 记得每次修改后都要刷新权限
`flush privileges;`

## 备份
- 备份数据库
```
mysqldump -uroot -p mydb | bzip2 > /opt/bak/db_mydb_`date +%y_%m_%d`.bz2
```

## 迁移
- 恢复数据库
```
bzip2 -d db_mydb.bz2
mysql -uroot -p
use mydb
source /opt/bak/db_mydb
```