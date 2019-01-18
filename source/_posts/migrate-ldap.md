---
title: 'Migrate LDAP server'
date: 2019-01-15 17:29:43
categories:
- maintain
- ldap
tags:
- tutorial
---
LDAP is a tree query system, mainly used for member management. Query more than modification, so always stable. Leave this post here to help your migration.

<!--more-->

## Install
- install OPENLDAP in new server
`apt install slapd ldap-utils php-ldap phpldapadmin`

- search Suffix in old server
`slapcat -b cn=config | grep "^dn: olcDatabase=\|^olcSuffix"`

## Backup
- backup config
`slapcat -b cn=config -l config.ldif`

- backup database
`slapcat -b dc=dengcb,dc=com -l dengcb.ldif`

## Migrate
- restore config
```
cd /etc/ldap
cp -a slapd.d slapd.d.bak
rm -rf slapd.d/*
slapadd -F slapd.d -b cn=config -l config.ldif
chown -R openldap.openldap slapd.d
```

- restore database
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

## Modify
- if get error in php7, [download the modified](https://github.com/leenooks/phpLDAPadmin/files/688183/pla-php7.zip)
replace `/usr/share/phpldapadmin`

- modify the config
`vi /usr/share/phpldapadmin/config/config.php`