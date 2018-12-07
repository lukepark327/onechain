[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-brightgreen.svg)](https://nodejs.org/en/)   

# one-chain
> 핵심 기능을 담은 구현체로부터, 블록체인 코어 개발을 보조한다.   
> [제12회 공개소프트웨어 개발자대회 후원기업상 수상작](https://project.oss.kr)   
> Based on the following code: [lhartikk/naivechain](https://github.com/lhartikk/naivechain)   

## Abstract
블록체인 기반 서비스가 크게 성장하면서 블록체인 프로토콜 개발을 위한 오픈소스의 필요성이 대두되었다.
비트코인, 이더리움 등 기(旣)공개된 코드가 있지만 복잡도가 높아 다루기 까다롭고 교육용으로 사용하기에도 어려운 실정이다.   

블록체인의 기본 원칙을 가장 간결한 방법으로 구현한 코어 '원체인(one-chain)'을 이용하면 문제를 해결할 수 있다.
**원체인은 블록체인 프로토콜 핵심 기능 구현체이다.**
기능별로 모듈화함으로써 복잡한 코드를 보다 명료하게 전달하고자 하였다.
또한, 상세한 주석 및 문서를 제공하여 누구나 쉽게 학습하고 재사용 가능하도록 하였다.
전반적으로 수도코드(pseudo-code) 스타일로 구현하여 타 언어 개발자도 이해가 용이하도록 하였다.   

## Details
- [최소 기능 블록체인](https://github.com/JOYUJEONG/onechain/blob/master/1_minimal/README.md)   
- [동작 가능 블록체인](https://github.com/JOYUJEONG/onechain/blob/master/2_drivable/README.md)   

## Use-case

### Blockchain Policy Simulator
- [BBR Hackathon](http://www.breview.kr)
[우수상 수상작](http://decenter.sedaily.com/NewsView/1S639FV540)    
- [Video Demonstration](https://www.youtube.com/watch?v=aFcnPziT4FE)    

### instructional-blockchain
- [교육용 블록체인](https://github.com/twodude/instructional-blockchain)   

## Environments
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
(optional) $env:PEERS="ws://127.0.0.1:6001"
npm start
```

*or*

```
export HTTP_PORT=3002
export P2P_PORT=6002
(optional) export PEERS="ws://127.0.0.1:6001"
npm start
```

### start node #3
```
$env:HTTP_PORT=3003
$env:P2P_PORT=6003
(optional) $env:PEERS="ws://127.0.0.1:6001, ws://127.0.0.1:6002"
npm start
```

*or*

```
export HTTP_PORT=3003
export P2P_PORT=6003
(optional) export PEERS="ws://127.0.0.1:6001, ws://127.0.0.1:6002"
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
