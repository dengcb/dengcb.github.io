---
title: '迁移Redmine和Gitlab'
date: 2019-01-24 16:42:09
categories:
- 维护
- Rails
tags:
- 教程
---
Redmine和Gitlab是非常优秀的项目和代码管理系统，两者都是基于Ruby on Rails的，所以我这里就一起迁移了，同时记录一些关于Rails的迁移笔记。

<!--more-->

## 安装Rails环境
- 在新服务器安装RVM
```
gpg2 --keyserver hkp://pgp.mit.edu --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
source ~/.bashrc
source ~/.bash_profile
rvm -v
echo "ruby_url=https://cache.ruby-china.org/pub/ruby" > ~/.rvm/user/db
```

- 在新服务器安装ruby
```
rvm list known
rvm install 2.6.0 --disable-binary
rvm use 2.6.0 --default
rvm list
rvm remove 1.8.7
ruby -v
```

- 设置新的gemset
```
rvm use 2.6.0
rvm gemset create rails522
rvm gemset list
rvm use 2.6.0@rails522
gem -v
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
gem sources -l
bundle config mirror.https://rubygems.org https://gems.ruby-china.com
gem install bundler
gem install rails -v 5.2.2
gem install thin -v 1.7.2
bundle -v
rails -v
thin -v
```

## 迁移Redmine
- 补充开发包
```
apt install libmysqlclient-dev
apt install imagemagick libmagickcore-dev libmagickwand-dev
```
  如果在18.04下遇到libjbig0版本过高，可以下载[降级安装包](https://packages.ubuntu.com/bionic/amd64/libjbig0/download)
`dpkg -i libjbig0_2.1-3.1build1_amd64.deb`


- 修改thin配置
```
thin install
vi /etc/thin/redmine.yml
```
  >\-\-\-
chdir: /var/www/artec/mine
environment: production
address: 0.0.0.0
port: 3000
timeout: 30
log: log/thin.log
pid: tmp/pids/thin.pid
max_conns: 1024
max_persistent_conns: 512
require: []
wait: 30
servers: 5
daemonize: true


- 迁移Redmine
  - 下载[最新版](http://www.redmine.org/projects/redmine/wiki/Download)
  - 迁移配置
  ```
  cp config/database.yml ./config
  cp config/configuration.yml ./config
  ```
  - 迁移数据和主题
  ```
  cp -r files ./
  cp -r public/themes/dengcb public/themes
  ```
  - 安装gems，在Gemfile中添加`gem "thin", "~> 1.7.2"`
  ```
  bundle install --without development test
  bundle exec rake generate_secret_token
  bundle exec rake db:migrate RAILS_ENV=production
  bundle exec rake tmp:cache:clear RAILS_ENV=production
  chown -R www-data.www-data *
  /etc/init.d/thin start
  ```

## 迁移Gitlab
- 安装依赖软件
  - 安装nodejs
  ```
  cd ~
  curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
  bash nodesource_setup.sh
  apt install nodejs
  node -v
  ```
  - 安装yarn
  ```
  curl --silent --show-error https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
  apt update
  apt install yarn
  yarn -v
  ```
  - 安装go
  ```
  apt install golang
  go version
  ```
  
  - 安装其他
  ```
  apt install graphicsmagick
  apt install postfix
  ```

- 更新系统
  - 更新Gitlab
  ```
  su git -l
  cd ~/gitlab
  git fetch --all --prune
  git checkout -- db/schema.rb
  git checkout -- locale
  git checkout 11-8-stable
  ```
  - 更新gitlab-shell
  ```
  cd ~/gitlab-shell
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_SHELL_VERSION)
  bin/compile
  ```
  - 更新gitlab-workhorse
  ```
  cd ~/gitlab-workhorse
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_WORKHORSE_VERSION)
  make
  ```
  - 更新Gitaly
  ```
  sed -i.pre-10.1 's/\[\[storages\]\]/[[storage]]/' /home/git/gitaly/config.toml
  cd ~/gitaly
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITALY_SERVER_VERSION)
  make
  ```
  - 更新gitlab-pages
  ```
  cd ~/gitlab-pages
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_PAGES_VERSION)
  make
  ```

- 更新配置
  - 更新gitlab.yml
  ```
  git diff origin/11-7-stable:config/gitlab.yml.example origin/11-8-stable:config/gitlab.yml.example
  ```
  - 启动脚本
  ```
  cp lib/support/init.d/gitlab /etc/init.d/gitlab
  cp lib/support/init.d/gitlab.default.example /etc/default/gitlab
  update-rc.d gitlab defaults 21
  cp lib/support/logrotate/gitlab /etc/logrotate.d/gitlab
  systemctl daemon-reload
  ```

- 开始迁移
  ```
  su git -l
  cd /home/git/gitlab
  bundle install --deployment --without development test postgres aws kerberos
  bundle clean
  bundle exec rake db:migrate RAILS_ENV=production
  bundle exec rake gettext:compile RAILS_ENV=production
  bundle exec rake yarn:install gitlab:assets:clean gitlab:assets:compile RAILS_ENV=production NODE_ENV=production
  bundle exec rake cache:clear RAILS_ENV=production
  ```

- 启动检查
  ```
  service gitlab start
  service nginx restart
  cd /home/git/gitlab
  bundle exec rake gitlab:env:info RAILS_ENV=production
  bundle exec rake gitlab:check RAILS_ENV=production
  ```

- 补充
  - 解决git时gnutls_handshake问题
  ```
  apt install build-essential fakeroot dpkg-dev libcurl4-openssl-dev
  apt build-dep git
  mkdir ~/git-openssl
  cd ~/git-openssl
  apt source git
  dpkg-source -x git_2.17.1-1.dsc
  cd git-2.17.1
  vi debian/control //找到libcurl4-gnutls-dev，替换为libcurl4-openssl-dev
  dpkg-buildpackage -rfakeroot -b //如果fail on test，可以将文件debian/rules中的TEST=test注释掉
  dpkg -i ../git_2.17.1-1ubuntu0.4_amd64.deb
  ```
  - 解决nodejs的`JavaScript heap out of memory`
  ```
  node --max-old-space-size=4096 /home/git/gitlab/config/webpack.config.js
  ```