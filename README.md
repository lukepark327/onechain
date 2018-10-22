# onechain   
> 핵심 기능을 담은 구현체로부터, 블록체인 코어 개발을 보조한다.   
> Special Thanks to lhartikk/naivecoin   

## Abstract
블록체인 기반 서비스가 크게 성장하면서 블록체인 프로토콜 개발을 위한 오픈소스의 필요성이 대두되었다. 비트코인, 이더리움 등 기(旣)공개된 코드가 있지만 복잡도가 높아 다루기 까다롭고 교육용으로 사용하기에도 어려운 실정이다.    
   
블록체인의 기본 원칙을 가장 간결한 방법으로 구현한 코어 '원체인(one chain)'을 이용하면 문제를 해결할 수 있다. **원체인은 블록체인 프로토콜 핵심 기능 구현체이다.** 기능별로 모듈화함으로써 복잡한 코드를 보다 명료하게 전달하고자 하였다. 또한 상세한 주석 및 문서를 제공하여 누구나 쉽게 학습하고 재사용 가능하도록 하였다. 이를 오픈소스로 공유함으로써 블록체인 프로토콜 개발의 기초를 제공하고 국내외 블록체인 사업의 활성화를 이끌고자 한다.
   
원체인은 편리성과 이식성에서 뛰어난 **JavaScript**에 기반하여 작성되었으므로 쉽게 다룰 수 있고, 개발 시간을 단축할 수 있다. 전반적으로 수도코드(pseudo-code) 스타일로 구현하여 타 언어 개발자도 이해가 용이하도록 하였다.

## Overview
이미지 및 개요 추가 예정

## Details
폴더별 README.md 링크 추가 예정   
폴더 이름 바꾸기

## Environments
- Node.js v8.11.3
- Postman Version 6.4.4

## How to Start
동영상 추가 예정   

### install packages
```
npm install
```
### start
```
npm start
```
### set node 2
```
$env:HTTP_PORT=3002
$env:P2P_PORT=6002
(optional) $env:PEERS = "ws://127.0.0.1:6001"
```
### set node 3
```
$env:HTTP_PORT=3003
$env:P2P_PORT=6003
(optional) $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"
```
