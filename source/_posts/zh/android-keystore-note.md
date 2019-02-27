---
title: 'Android Keystore笔记'
date: 2019-02-06 14:03:36
categories:
- 编码
- Android
tags:
- 教程
---
Android开发，肯定要编译、调试和发布，这其中就离不开用keystore来对apk进行数字签名，其中调试阶段有debug证书，发布阶段有release证书，分享相关笔记。

<!--more-->

## 了解keystore
> 数字证书包含公钥/私钥对的公钥，以及可以标识密钥所有者的一些其他元数据（例如名称和位置）。而证书所有者持有对应的私钥。
> 
> 当用数字证书对apk进行签名时，会将公钥证书附加到apk文件里，从而变成“指纹”，关联唯一的私钥，成为apk所有者的唯一标识，用以鉴别始作俑者和抄袭者李鬼。而所有者手里的私钥就是应用签名秘钥，从始至终，不能改变，要好好保存。
> 
> keystore是一个包含至少一个私钥的二进制文件，就是证书所有者的保险柜。

## 新建keystore
> Android Studio在新安装和调试时，会创建`$HOME/.android/debug.keystore`这个调试密钥库和调试证书，并设置密钥库和密钥密码。
> 
> 但应用商店不接受调试密钥发布的apk，为了验证你开发者的身份，必须创建一个自己的keystore：
> `keytool -genkey -v -keystore dengcb.keystore -keyalg RSA -keysize 2048 -validity 11029 -alias dengcb` 

## 查看keystore
> 想要查看某个keystore里的信息：
> `keytool -list -v -keystore dengcb.keystore`

## 修改keystore
> 导出某个密钥：
> `keytool -export -alias dengcb -keystore dengcb.keystore -file ~/dengcb.crt`
> 
> 导入某个密钥：
> `keytool -import -alias dengcb -keystore dengcb.keystore -file ~/dengcb.crt`
> 
> 删除某个密钥：
> `keytool -delete -alias dengcb -keystore dengcb.keystore`
> 
> 查看某个密钥：
> `keytool -printcert -file ~/dengcb.crt`

## 替换测试keystore
> ***为什么要替换默认debug keystore？***
> `因为无聊呗！`开玩笑的。因为很多第三方库都在服务端进行了签名验证，如果你用了debug证书联机调试，就会无法通过验证报错。为了不报错，你就得每次用发布证书打包安装测试，很麻烦不是吗？把debug证书改成和你打包证书一样的密钥不就解决问题了？但是要注意测试密钥的使用安全，不要外泄哦！
> 
> 默认debug.keystore的信息如下：
Keystore name: “debug.keystore”
Keystore password: “android”
Key alias: “androiddebugkey”
Key password: “android”
CN: “CN=Android Debug,O=Android,C=US”
> 
> - 重命名dengcb.keystore为`debug.keystore`
- 修改密钥库密码：`keytool -storepasswd -keystore debug.keystore -new android`
- 修改密钥别名和密码：`keytool -changealias -keystore debug.keystore -alias dengcb -destalias androiddebugkey -destkeypass android`
> 
> 复制替换`~/.android/debug.keystore`