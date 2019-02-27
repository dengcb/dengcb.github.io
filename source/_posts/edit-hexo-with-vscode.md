---
title: 'Edit Hexo with VSCode'
date: 2019-02-15 14:13:54
categories:
- web
- hexo
tags:
- tutorial
---
What's your favorite editor for hexo? Powerful edit function? Amazing preview effect? Saving your code anytime? This post show you how to write your hexo with Visual Studio Code.

<!--more-->

## What's VSCode
> VSCode is `Visual Studio Code`, belong to Microsoft. The preferred lightweight development tool for many coders, it's hot.
> 
> First, I was finding an editor for html. I think the markdown file is easy, neither compiling nor debugging. So, I tried UltraEdit and HexoEditor. The experience is terrible, I can't satisfy completely.
> 
> Installed the `Markdown Preview Enhanced` extension, customize the css and quote styles to make your Hexo preview as consistent as release. That's very attractive.

## Install MPE extension
> search `Markdown Preview Enhanced` in VSCode, and install MPE
>
> Preview: `cmd+k v` 

## Import Hexo theme style
> Open css:`cmd-shift-p`, run`Markdown Preview Enhanced: Customize Css`
>
> or edit`~/.mume/style.less`
>
> such as Minos theme:

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
> edit`~/.mume/parser.js`
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