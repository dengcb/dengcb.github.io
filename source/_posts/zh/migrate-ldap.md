---
title: '迁移LDAP服务'
date: 2019-01-15 17:29:43
categories:
- 维护
- LDAP
tags:
- 教程
---
LDAP是一个树状信息查询系统，主要用于部门人员的统一管理。通常查询次数远大于修改次数，系统稳定了很少去动它。所以迁移一次都要搔头挠腮，记录此文以备用。

<!--more-->

## 安装
- 在新服务器安装OPENLDAP
`apt install slapd ldap-utils php-ldap phpldapadmin`

- 在旧服务器查询Suffix
`slapcat -b cn=config | grep "^dn: olcDatabase=\|^olcSuffix"`

## 备份
- 备份config
`slapcat -b cn=config -l config.ldif`

- 备份database
`slapcat -b dc=dengcb,dc=com -l dengcb.ldif`

## 迁移
- 恢复config
```
cd /etc/ldap
cp -a slapd.d slapd.d.bak
rm -rf slapd.d/*
slapadd -F slapd.d -b cn=config -l config.ldif
chown -R openldap.openldap slapd.d
```

- 恢复database
```
slapcat -b cn=config | grep "^dn: olcDatabase=\|^olcSuffix\|^olcDbDirectory"
cd /var/lib
cp -a ldap ldap.bak
rm -f ldap/*
cd /etc/ldap
slapadd -F slapd.d -b dc=dengcb,dc=com -l dengcb.ldif
chown openldap.openldap /var/lib/ldap/*
/etc/init.d/slapd restart
```

## 修改
- 如果遇到和php7兼容问题，请[下载修改过的包](https://github.com/breisig/phpLDAPadmin)
替换掉`/usr/share/phpldapadmin`即可
- 修改配置文件
`vi /usr/share/phpldapadmin/config/config.php`