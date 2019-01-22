---
title: 'Migrate MySQL server'
date: 2019-01-22 13:54:23
categories:
- maintain
- mysql
tags:
- tutorial
---
MySQL is the most popular open source database system, used by everyone, and is already standard. Record the migration of one database here for search and share.

<!--more-->

## Install
- install MySQL in new server
`apt install mysql-server-5.7 php7.2-mysql`

- install phpmyadmin in new server
  - open [official download](https://www.phpmyadmin.net/downloads/)
  - download latest zip package
  - unzip to /usr/share/phpmyadmin

## Modify
- modify MySQL config
`vi /etc/mysql/mysql.conf.d/mysql.cnf`
- modify phpmyadmin config
`https://db.yourdomain.com/setup`
save as
`/usr/share/phpmyadmin/config.inc.php`
- modify root password
MySQL 5.7 root has no password initially
`set password for 'root'@'localhost' = password('123');`
- login with phpmyadmin
if failed with `Access denied for user 'root'@'localhost'`
change root login method
`update mysql.user set plugin = 'mysql_native_password' where user = 'root';`
- flush every time changed
`flush privileges;`

## Backup
- backup database
```
mysqldump -uroot -p mydb | bzip2 > /opt/bak/db_mydb_`date +%y_%m_%d`.bz2
```

## Migrate
- restore database
```
bzip2 -d db_mydb.bz2
mysql -uroot -p
use mydb
source /opt/bak/db_mydb
```