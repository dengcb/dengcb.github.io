---
title: 'Hexo multi-language with Minos'
date: 2018-04-19 14:37:37
categories:
- web
- hexo
tags:
- tutorial
---
I want to build a hexo blog with full site multi-language, search a lot and try, but no one perfect. Today it's done, finally I can white down a tutorial for your reference.

<!--more-->

## What I seek
- Full Site Multi-language

{% blockquote dengcb https://dengcb.github.io Welcome to my GitHub %}
Choose English as the default language, and translate full site into your native language, all items one to one correspondence.
{% endblockquote %}
- Why use Minos

{% blockquote %}
Hexo hasn't multi-language kernel, though you can install official i18n plugin, but only get some translated shell, all the content in different languages still mix together. Minos is a simple and powerful theme, and support the multi-language thoroughly with lastest release.
{% endblockquote %}

## How I try
#### Passing Pit
1. **Official i18n Plugin**
Set `i18n_dir: :lang` in \_config.yml, you can generate an i18n slug, just that. All multilingual posts still mix. Note: the setting also needs in Minos.

2. **hexo-generator-i18n**
This plugin can get multilingual pages, but not posts or tags, because hexo kernel doesn't support.

3. **hexo-multilingual and its generator**
This is a real plugin that changes the kernel, you should uninstall all official generators first. But the author is too busy to fix some issues. And this plugin always start 'en' in default slug.

4. **Other Tricks**
Such as build two sites and different route; or rewrite the core code. I think it's not what I want, drop it.

#### Meeting Minos
View a lot of themes, choose Minos at last, not the popular next theme. Because I want the classical website to be less colorful, less drawing, just words or ascii codes. So Minos wins. I hope more hexor can choose Minos like me.

When using Minos at first, it doesn't support multi-language yet. Its 1.0 version has been released more than 2 years. Author just want to update to 2.0, and plan to support i18n fully. I test this days and feedback some issues, the latest release finally achieve the full site multi-language support today (post、page、archive、category、tag、search、switcher etc.). Now I can tell you how I build site with Minos.

## Convention best
- **What we need**
Is variety needs, or simple to use. If former, the full site multi-language still needs time, Minos is not the silver bullet. If later, congratulations, you can do it today with least configurations. Such as, you set config to: `permalink: :category/:title/`, then slug as: `/nothing/zh-cn/hello-world/`, that's the conflict between convention and configuration.
  
  
- **Let's agree**
1. Use default config, try not to whim
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

2. Install minimal plugins, less is better
```yaml
{
  "name": "dengcb.github.io",
  "version": "1.0.0",
  "private": true,
  "hexo": {
    "version": "3.7.1"
  },
  "dependencies": {
    "hexo": "^3.7.1",
    "hexo-deployer-git": "^0.3.1",
    "hexo-generator-archive": "^0.1.5",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-index": "^0.2.1",
    "hexo-generator-tag": "^0.2.0",
    "hexo-renderer-ejs": "^0.3.0",
    "hexo-renderer-marked": "^0.3.0",
    "hexo-renderer-sass": "^0.3.2",
    "hexo-server": "^0.2.0"
  }
}
```

3. Install Minos from root

  `git clone https://github.com/ppoffice/hexo-theme-minos.git themes/minos`

  at themes/minos, new 3 config files

  `_config.yml` `_config.en.yml` `_config.zh-cn.yml`

  in \_config.zh-cn.yml, set site name and menu
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

4. Create posts, and follow the structure
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
  Copy post to `source/_post/<lang>/`

  Copy page to`source/<lang>/`

  That's the **Convention best**, create the structure, then generate full site multi-language, done.
  
  
5. Generate, Test, Deploy, enjoy it!
  
  ```
hexo clean
hexo g
hexo s -s
hexo d
```

## Thanks
> Special Minos author [ppoffice](https://ppoffice.github.io "Ruipeng Zhang") who designed and coded Minos such excellent theme. After I feedback, he continues to code and modify, realize all ideals I have set for hexo theme.
> 
> Next, I will post a blog how send the site to IPFS system.