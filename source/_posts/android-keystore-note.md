---
title: 'Android Keystore Note'
date: 2019-02-06 14:03:36
categories:
- coding
- android
tags:
- tutorial
---
Android developers use keystore to complie, debug and release APK files. You have debug key in debugging phase, and release key in release phase. Here is some notes for keystore.

<!--more-->

## about keystore
> A digital certificate contains the public key of a public/private key pair, as well as some other metadata identifying the owner (for example, name and location) who holds the corresponding private key.
> 
> When signing your app, the signing tool attaches the certificate to your app, as fingerprint which associates the APK to your corresponding private key. This helps Android ensure the original author of the app. This key is called the signing key, `CAN NOT` be changed, so be careful to save it.
> 
> Keystore is a binary file that serves as a repository of certificates and private keys.

## create keystore
> Android Studio will create a new in `$HOME/.android/debug.keystore` when first packaging apk.
> 
> But app store doesn't accept the apk signed by a debug keystore. Create a new for publishing:
> `keytool -genkey -v -keystore dengcb.keystore -keyalg RSA -keysize 2048 -validity 11029 -alias dengcb` 

## detail keystore
> view detail in keystore:
> `keytool -list -v -keystore dengcb.keystore`

## modify keystore
> export certificate:
> `keytool -export -alias dengcb -keystore dengcb.keystore -file ~/dengcb.crt`
> 
> import certificate:
> `keytool -import -alias dengcb -keystore dengcb.keystore -file ~/dengcb.crt`
> 
> delete certificate:
> `keytool -delete -alias dengcb -keystore dengcb.keystore`
> 
> print certificate:
> `keytool -printcert -file ~/dengcb.crt`

## replace debug keystore
> ***Why do this？***
> `Boring!`Just kidding! Some third-party libraries verify the signed certificate of app in server side. If you use debug certificate to test app, will receive signed error, unless you sign with release certificate every time. Are you kidding me? So modifying your release certificate just like a debug certificate is a good idea. But, please keep this modified DEBUG certificate safe, don't leak it!
> 
> default debug.keystore detail:
Keystore name: “debug.keystore”
Keystore password: “android”
Key alias: “androiddebugkey”
Key password: “android”
CN: “CN=Android Debug,O=Android,C=US”
> 
> - rename dengcb.keystore to`debug.keystore`
- modify keystore password:`keytool -storepasswd -keystore debug.keystore -new android`
- modify key alias and password:`keytool -changealias -keystore debug.keystore -alias dengcb -destalias androiddebugkey -destkeypass android`
> 
> replace`~/.android/debug.keystore`