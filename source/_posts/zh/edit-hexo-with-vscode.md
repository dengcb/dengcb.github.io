---
title: '用VSCode来写Hexo'
date: 2019-02-15 14:13:54
categories:
- 网站
- Hexo
tags:
- 教程
---
你用什么工具来写自己的Hexo？使用过程中是不是发现了很多痛点，比如编辑功能太弱，预览差强人意，崩溃没有保存，等等。这篇教程教你用Visual Studio Code来写Hexo。

<!--more-->

## 了解VSCode
> VSCode即Visual Studio Code，隶属微软旗下开发工具。是很多人的首选轻量级开发工具，当红炸子鸡，简直红得不要不要。
> 
> 一开始，我想着找一个类似html的编辑器就行。以为markdown格式的文件有啥了不起，既不编译，也不纠错。于是，尝试了UltraEdit，又发现了一款HexoEditor，结果体验很不好，至少不能让我完全满意。
> 
> VSCode在安装了Markdown Preview Enhanced扩展后，可以自定义css和quote样式，让你的Hexo预览效果尽量和正式发布效果一致，这个就很吸引人了。

## 安装MPE扩展
> 在VSCode扩展页面搜索`Markdown Preview Enhanced`，点击安装（可能需要科学上网）
>
> 打开预览页面：`cmd+k v` 

## 导入Hexo主题样式
> 打开样式表：`cmd-shift-p`，运行`Markdown Preview Enhanced: Customize Css`
>
> 或者直接编辑`~/.mume/style.less`
>
> 下面以Minos主题为例：

``` css
.markdown-preview.markdown-preview {
  h2 {
    font-size: 20px;
  }
  h3 {
    font-size: 18px;
  }
  p {
    font-size: 14px;
  }
  table {
    font-size: 14px;
  }
  code {
    color: #ff3860;
    background-color: #f5f5f5;
  }
  a {
    color: black;
    text-decoration:underline
  }
  pre {
    overflow: auto;
    margin: 20px 0px;
    padding: 1px,1px;
    font-size: 14px;
    background: #f3f3f3;
    line-height: 1.6;
  }
  blockquote {
    background-color: #f5f5f5;
    border-left: 4px solid #dbdbdb;
    padding: 16px 24px;
  }
  blockquote.colorquote.info {
    border-color: #209cee;
    background-color: #def0fd;
  }
  blockquote.colorquote.success {
    border-color: #23d160;
    background-color: #cbf6da;
  }
  blockquote.colorquote.warning {
    border-color: #ffdd57;
    background-color: #fff6d1;
  }
  blockquote.colorquote.danger {
    border-color: #ff3860;
    background-color: #ffb3c2;
  }
  h1, h2, h3, h4, h5, h6, blockquote, p {
    font-family: "Ovo", "Georgia", "STZhongsong", "Microsoft YaHei", serif;
  }
  code, pre {
    font-family: "Source Code Pro", monospace, "Microsoft YaHei";
  }
}
```
> 编辑`~/.mume/parser.js`
>

``` js
module.exports = {
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      //quote Parser
      var quotePatt = /{%\s*colorquote .+?\s*%}\n.+?\n{%\s*endcolorquote\s*%}/g;
      var quoteResult;
      var quoteContent;
      while((quoteResult = quotePatt.exec(markdown)) != null){
        quoteContent = quoteResult[0];
        typePatt=/info|success|warning|danger/g;
        typeResult = typePatt.exec(quoteContent);
        typeContent = typeResult[0];
        reg = new RegExp("{%\\s*colorquote " + typeContent + "\\s*%}","g");
        quoteContent = quoteContent.replace(reg,"");
        quoteContent = quoteContent.replace(/{%\s*endcolorquote\s*%}/,"");
        markdown = markdown.replace(quoteResult, 
          "<blockquote class='colorquote "+typeContent+"'>"+quoteContent+"</blockquote>");
      }
      return resolve(markdown)
    })
  },
  onDidParseMarkdown: function(html) {
    return new Promise((resolve, reject)=> {
      return resolve(html)
    })
  }
}
```