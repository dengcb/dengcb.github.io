---
title: 'Migrate Redmine and Gitlab'
date: 2019-01-24 16:42:09
categories:
- maintain
- rails
tags:
- tutorial
---
Redmine and Gitlab are great project and code management systems, both based on Ruby on Rails, so I migrate them together and record Rails migration notes here.

<!--more-->

## Install Rails
- install RVM in new server
```
gpg2 --keyserver hkp://pgp.mit.edu --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
source ~/.bashrc
source ~/.bash_profile
rvm -v
```

- install Ruby in new server
```
rvm list known
rvm install 2.6.0 --disable-binary
rvm use 2.6.0 --default
rvm list
rvm remove 1.8.7
ruby -v
```

- create new Gemset
```
rvm use 2.6.0
rvm gemset create rails522
rvm gemset list
rvm use 2.6.0@rails522
gem -v
gem install bundler
gem install rails -v 5.2.2
gem install thin -v 1.7.2
bundle -v
rails -v
thin -v
```

## Migrate Redmine
- install dev package needed
```
apt install libmysqlclient-dev
apt install imagemagick libmagickcore-dev libmagickwand-dev
```
  if libjbig0 error in 18.04, download [right version](https://packages.ubuntu.com/bionic/amd64/libjbig0/download)
`dpkg -i libjbig0_2.1-3.1build1_amd64.deb`


- modify thin config
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


- migrate Redmine
  - download [latest](http://www.redmine.org/projects/redmine/wiki/Download)
  - migrate config
  ```
  cp config/database.yml ./config
  cp config/configuration.yml ./config
  ```
  - migrate files and theme
  ```
  cp -r files ./
  cp -r public/themes/dengcb public/themes
  ```
  - install gems, Gemfile add `gem "thin", "~> 1.7.2"`
  ```
  bundle install --without development test
  bundle exec rake generate_secret_token
  bundle exec rake db:migrate RAILS_ENV=production
  bundle exec rake tmp:cache:clear RAILS_ENV=production
  chown -R www-data.www-data *
  /etc/init.d/thin start
  ```

## Migrate Gitlab
- install dependency package
  - install nodejs
  ```
  cd ~
  curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
  bash nodesource_setup.sh
  apt install nodejs
  node -v
  ```
  - install yarn
  ```
  curl --silent --show-error https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
  apt update
  apt install yarn
  yarn -v
  ```
  - install go
  ```
  apt install golang
  go version
  ```
  
  - install others
  ```
  apt install graphicsmagick
  apt install postfix
  ```

- Upgrade System
  - upgrade Gitlab
  ```
  su git -l
  cd ~/gitlab
  git fetch --all --prune
  git checkout -- db/schema.rb
  git checkout -- locale
  git checkout 11-8-stable
  ```
  - upgrade gitlab-shell
  ```
  cd ~/gitlab-shell
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_SHELL_VERSION)
  bin/compile
  ```
  - upgrade gitlab-workhorse
  ```
  cd ~/gitlab-workhorse
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_WORKHORSE_VERSION)
  make
  ```
  - upgrade Gitaly
  ```
  sed -i.pre-10.1 's/\[\[storages\]\]/[[storage]]/' /home/git/gitaly/config.toml
  cd ~/gitaly
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITALY_SERVER_VERSION)
  make
  ```
  - upgrade gitlab-pages
  ```
  cd ~/gitlab-pages
  git fetch --all --tags --prune
  git checkout v$(</home/git/gitlab/GITLAB_PAGES_VERSION)
  make
  ```

- Update config
  - update gitlab.yml
  ```
  git diff origin/11-7-stable:config/gitlab.yml.example origin/11-8-stable:config/gitlab.yml.example
  ```
  - update script
  ```
  cp lib/support/init.d/gitlab /etc/init.d/gitlab
  cp lib/support/init.d/gitlab.default.example /etc/default/gitlab
  update-rc.d gitlab defaults 21
  cp lib/support/logrotate/gitlab /etc/logrotate.d/gitlab
  systemctl daemon-reload
  ```

- start migration
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

- start checking
  ```
  service gitlab start
  service nginx restart
  cd /home/git/gitlab
  bundle exec rake gitlab:env:info RAILS_ENV=production
  bundle exec rake gitlab:check RAILS_ENV=production
  ```

- additional
  - fix `gnutls_handshake error` with git
  ```
  apt install build-essential fakeroot dpkg-dev libcurl4-openssl-dev
  apt build-dep git
  mkdir ~/git-openssl
  cd ~/git-openssl
  apt source git
  dpkg-source -x git_2.17.1-1.dsc
  cd git-2.17.1
  vi debian/control //replace libcurl4-gnutls-dev with libcurl4-openssl-dev
  dpkg-buildpackage -rfakeroot -b //if fail on test, comment TEST=test in debian/rules
  dpkg -i ../git_2.17.1-1ubuntu0.4_amd64.deb
  ```
  - fix `JavaScript heap out of memory` with nodejs
  ```
  node --max-old-space-size=4096 /home/git/gitlab/config/webpack.config.js
  ```