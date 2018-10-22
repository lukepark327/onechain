# onechain   
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-brightgreen.svg)](https://nodejs.org/en/)   

> 핵심 기능을 담은 구현체로부터, 블록체인 코어 개발을 보조한다.

## Abstract
블록체인 기반 서비스가 크게 성장하면서 블록체인 프로토콜 개발을 위한 오픈소스의 필요성이 대두되었다. 비트코인, 이더리움 등 기(旣)공개된 코드가 있지만 복잡도가 높아 다루기 까다롭고 교육용으로 사용하기에도 어려운 실정이다.    
   
블록체인의 기본 원칙을 가장 간결한 방법으로 구현한 코어 '원체인(one-chain)'을 이용하면 문제를 해결할 수 있다. **원체인은 블록체인 프로토콜 핵심 기능 구현체이다.** 기능별로 모듈화함으로써 복잡한 코드를 보다 명료하게 전달하고자 하였다. 또한 상세한 주석 및 문서를 제공하여 누구나 쉽게 학습하고 재사용 가능하도록 하였다. 이를 오픈소스로 공유함으로써 블록체인 프로토콜 개발의 기초를 제공하고 국내외 블록체인 사업의 활성화를 이끌고자 한다.
   
원체인은 편리성과 이식성에서 뛰어난 JavaScript에 기반하여 작성되었으므로 쉽게 다룰 수 있고, 개발 시간을 단축할 수 있다. 전반적으로 수도코드(pseudo-code) 스타일로 구현하여 타 언어 개발자도 이해가 용이하도록 하였다.

## Overview
![그림2.1](https://github.com/JOYUJEONG/onechain/blob/master/images/2-1.png)

원체인의 코어는 크게 세 부분으로 구분된다. Blockchain 관련 기능으로는 새 블록 추가, 블록 및 블록체인의 유효성 검사, 합의 알고리즘, 열람 기능이 제공된다. Communication 관련 기능으로는 노드 간의 소통을 위한 P2P 웹소켓 인터페이스, 사용자와 노드와의 소통을 위한 HTTP 인터페이스가 제공된다. 마지막으로 Monitoring을 위한 logging 기능이 제공된다.

## Details
- [최소 기능 블록체인](https://github.com/JOYUJEONG/onechain/blob/master/1_minimal_functional/README.md)   
- [동작 가능 블록체인](https://github.com/JOYUJEONG/onechain/blob/master/2_drivable/README.md)

## Environments
- Windows 10 Pro 64-bit operating system
- Node.js v8.11.3 (>=4.3.2)
- cURL 7.55.1 *or* Postman v6.4.4

## How to Start

### install packages
```
npm install
```
### start node #1
```
npm start
```
### start node #2
```
$env:HTTP_PORT=3002
$env:P2P_PORT=6002
(optional) $env:PEERS = "ws://127.0.0.1:6001"
npm start
```
### start node #3
```
$env:HTTP_PORT=3003
$env:P2P_PORT=6003
(optional) $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"
npm start
```

## How to Use
[![video](http://img.youtube.com/vi/NgkADMy8j6Y/0.jpg)](https://www.youtube.com/watch?v=NgkADMy8j6Y)   
> 위 이미지를 클릭하면 동영상이 재생됩니다.

### Get blockchain
```
curl http://127.0.0.1:3001/blocks
```

### Add new block
```
curl -X POST http://127.0.0.1:3001/mineBlock
curl -H "Content-type:application/json" --data "{\"data\" : \"Anything you want\"}" http://127.0.0.1:3001/mineBlock
```

### Get connected peers
```
curl http://127.0.0.1:3001/peers
```

### Add peer
```
curl -H "Content-type:application/json" --data "{\"peer\" : \"ws://127.0.0.1:6002\"}" http://127.0.0.1:3001/addPeer
```

### Stop
```
curl -X POST http://127.0.0.1:3001/stop
```

## License
The onechain project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0), also included in our repository in the [LICENSE](https://github.com/JOYUJEONG/onechain/blob/master/LICENSE) file.   
Based on the following code: [lhartikk/naivechain](https://github.com/lhartikk/naivechain)   
