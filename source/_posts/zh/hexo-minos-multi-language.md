---
title: '用Minos搭建Hexo全站多语言站点'
date: 2018-04-19 14:37:37
categories:
- 网站
- Hexo
tags:
- 教程
---
为了搭建一个Hexo博客，开始了寻找全站多语言之路。看了很多文章，做了很多实验，都没有完美的方案。今天终于搞定了，把教程发上来，供后来者参考。

<!--more-->

## 选择的理由
- 什么是全站多语言

{% blockquote 长斌 https://dengcb.github.io 欢迎访问我的GitHub主页 %}
选择English作为默认语言，同时整站对应自己的母语再来一套的装逼行为，折腾自己不纳税系列，英特纳雄耐尔一定实现，全球大团结万岁。
{% endblockquote %}

- 为什么选择Minos

{% blockquote %}
因为Hexo不是一个多语言内核，虽然官方有i18n插件，但只能给外壳加点翻译，内容还是多语言混杂在一起，更别提一对一的多语言版本了。而Minos很酷啊，关键是最新版提供了多语言的支持。
{% endblockquote %}

## 坎坷的过程
#### 趟过的坑
1. **官方i18n插件**
根配置_config.yml里设置 `i18n_dir: :lang`，然后可以生成合规的slug，但此时post内容还是多语言混搭的，注意：这个设置Minos也需要。

2. **hexo-generator-i18n**
这个插件还是不错的，可以把page页双语化，但是对post双语化无能为力，还是因为hexo内核不支持。

3. **hexo-multilingual及其generator系列**
这是真正改动内核的插件，你得把默认的generator卸掉，但是作者太忙，很多小问题没法处理。另外这个系列插件，默认slug里总有en，很不爽啊。

4. **其他奇巧淫技**
比如用Hexo建两个独立站点，然后捏合在一起；或者大量改动源代码之类；没去试，不是好办法。

#### 遇到Minos
看了很多主题，最后选择了Minos，而不是最多人用的next。因为我对于古典web，希望少一些色彩，少一些图片，用文字说话，Minos胜出。希望有更多的人和我一样，选择Minos。

第一次用Minos时，还不支持多语言。1.0版本已经发布2年多了，正好作者要更新2.0版，有要支持i18n的计划。我前后测试了几天并反馈意见，终于，今天的版本完美实现了全站多语言的功能（post、page、archive、category、tag、search、switcher）。下面我就把搭建心得总结一下。

## 约定大于配置
- **我们需要什么**
是各种个性化的需求，还是简单易用。如果是前者，那么全站多语言任重而道远，很多插件还不支持，你也不能指望Minos来帮你解决所有冲突和缺陷。如果是后者，那恭喜你，用最少的配置就能实现全站多语言了。比如，改动根配置：`permalink: :category/:title/`，就会造成slug变成`/nothing/zh-cn/hello-world/`，这就是个性化需求和约定冲突的情况。
  
  
- **我们来约定**
1. 使用默认根配置，尽量别突发奇想
```yaml
language:
  - en
  - zh-cn
permalink: :title/
i18n_dir: :lang
new_post_name: :title.md
category_map:
  无他: nothing
tag_map:
  随笔: anything
```

2. 安装最少的插件包，注：sass插件需要全局翻墙，或者用cnpm安装
```yaml
{
  "name": "dengcb.github.io",
  "version": "1.0.0",
  "private": true,
  "hexo": {
    "version": "3.8.0"
  },
  "dependencies": {
    "hexo": "^3.8.0",
    "hexo-deployer-git": "^0.3.1",
    "hexo-generator-archive": "^0.1.5",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.1",
    "hexo-generator-tag": "^0.2.0",
    "hexo-pagination": "^0.1.0",
    "hexo-renderer-ejs": "^0.3.1",
    "hexo-renderer-marked": "^0.3.2",
    "hexo-renderer-sass": "^0.3.2",
    "hexo-renderer-stylus": "^0.3.3",
    "hexo-server": "^0.3.3"
  }
}
```

3. 在项目根目录下，安装Minos

  `git clone https://github.com/ppoffice/hexo-theme-minos.git themes/minos`

  在themes/minos目录下，创建配置文件

  `_config.yml` `_config.en.yml` `_config.zh-cn.yml`

  修改_config.zh-cn.yml，定义站点名称和菜单
```yaml
# Site
title: 长斌

# Menu
menu:
  归档: /zh-cn/archives
  分类: /zh-cn/categories
  标签: /zh-cn/tags
  关于: /zh-cn/about
```

4. 创建页面，并约定，source目录结构如下
```
_post/
  hello-world.md
  zh-cn/
    hello_world.md
about/
  index.md
zh-cn/
  about/
    index.md
CNAME
favicon.png
```
  每个post，对应在`source/_post/<lang>/`目录拷贝一份

  每个page，对应在`source/<lang>/`目录拷贝一份

  这就是所谓的**约定大于配置**，只要按这个目录结构创建页面，就自动完成了全站多语言，无需配置。
  
  
5. 渲染、测试、发布，愉快地玩耍吧
  
  ```
hexo clean
hexo g
hexo s -s
hexo d
```

## 鸣谢
> 特别感谢Minos作者 [ppoffice](https://ppoffice.github.io "Ruipeng Zhang") 设计实现这么好的主题，在我不停提意见的期间，持续修改，最后，完全完美实现了我对hexo主题的所有理想。
> 
> 接下来，我会写一写，如何把刚刚热乎出炉的网站发布到IPFS星际网络里去。