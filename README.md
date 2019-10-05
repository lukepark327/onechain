<!--
[[:us:|English|영어]](https://github.com/twodude/onechain)
[[:kr:|Korean|한국어]](https://github.com/twodude/onechain/tree/korean)
---
-->

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![version](https://img.shields.io/badge/version-v2.1.0-orange.svg)](https://github.com/twodude/onechain/blob/master/package.json)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-yellow.svg)](https://nodejs.org/en/)   

# one-chain
minimal blockchain ever.   

<!--
![onechain](https://github.com/twodude/onechain/blob/master/images/icon.png)
-->

Assist you to develop blockchain core easily.
> [2018 OSS Grand Developers Challenge Award](https://project.oss.kr)   
> Based on the following code: [lhartikk/naivechain](https://github.com/lhartikk/naivechain)   

## Abstract
![structure](https://github.com/twodude/onechain/blob/master/images/structure.png)

As Blockchain-based service grew, so need of open source which assists developing blockchain core was drived.
Although there are some open source projects like Bitcoin and Ethereum, those are too difficult to learn and to use.

You can solve the above problems by using
**```one-chain```, simple implementation of blockchain core.**
The one-chain is modularized by function: network, core, transaction, wallet, etc. to achieve clarity.
Also, detail comments and documents are provided for studying and easy reusing.
Most of the code is written in a pseudo-code style to provide understanding by other language developers.

## Use-cases

* 📖 컴퓨터과학으로 배우는 블록체인 원리와 구현
  - [Chapter-1](https://github.com/twodude/onechain/tree/chapter-1)
  - [Chapter-2](https://github.com/twodude/onechain/tree/chapter-2)
  - [Chapter-3](https://github.com/twodude/onechain/tree/chapter-3)
  - [Chapter-4](https://github.com/twodude/onechain/tree/chapter-4)

[![book-cover](https://github.com/twodude/onechain/blob/master/images/book-cover.png)](http://www.yes24.com/Product/Goods/75235536)

> Click on the image above to go to the shopping mall where you can buy it.

* Governance Simulator on Blockchain : Based on Smart City Cases
  - [DBpia](http://www.dbpia.co.kr/Journal/ArticleDetail/NODE07614082)

* Blockchain Policy Simulator
  - [BBR Hackathon](http://www.breview.kr) [Excellence Award](http://decenter.sedaily.com/NewsView/1S639FV540)
  - [Blockchain Simulator](https://github.com/twodude/blockchain-simulator)
  - [Video Demonstration](https://www.youtube.com/watch?v=aFcnPziT4FE)
  
* edu-chain
  - [Instructional Blockchain](https://github.com/twodude/educhain)   

* Plasma DAG
  - [Ethereum Plasma Chain](https://github.com/plasma-dag/plasma-client)

<!--
* Noonsatae
  - [Avalanche Implementation](https://github.com/noonsatae)
-->

# How to Start

## Environments
- Node.js v8.11.3
- cURL 7.55.1 *or* Postman v6.4.4

## Install dependencies
```bash
npm install
```
## Run Nodes

### Start node #1
```bash
npm start
```

### Start node #2
```$env:HTTP_PORT=3002```
*or*
```export HTTP_PORT=3002```

```$env:P2P_PORT=6002```
*or*
```export P2P_PORT=6002```

*optionally*
```$env:PEERS="ws://127.0.0.1:6001"```
*or*
```export PEERS="ws://127.0.0.1:6001"```

```bash
npm start
```

# How to Use
[![video](https://user-images.githubusercontent.com/24687378/55283674-5d346400-53a3-11e9-9e85-baaca23cac78.jpg)](https://youtu.be/ZRbr3VIUHuA)   
> Click on the image above to play the video.

### Get blockchain
```bash
curl http://127.0.0.1:3001/blocks
```

You can pretty-print JSON with:
```bash
curl http://127.0.0.1:3001/blocks | python -m json.tool
```
Python >= 2.6 required.

### Get a specific block

Get a block whose number (index) is 3:

```bash
curl http://localhost:3001/block/3
```

### Add new block
```bash
curl -X POST http://127.0.0.1:3001/mineBlock
curl -H "Content-type:application/json" --data "{\"data\" : [\"Anything you want\", \"Anything you need\"]}" http://127.0.0.1:3001/mineBlock
```

### Get connected peers
```bash
curl http://127.0.0.1:3001/peers
```

### Add peer
```bash
curl -H "Content-type:application/json" --data "{\"peers\" : [\"ws://127.0.0.1:6002\", \"ws://127.0.0.1:6003\"]}" http://127.0.0.1:3001/addPeers
```

### Get Address
```bash
curl http://127.0.0.1:3001/address
```

### Create Wallet
```bash
curl -X POST http://127.0.0.1:3001/createWallet
```

### Delete Wallet
```bash
curl -X POST http://127.0.0.1:3001/deleteWallet
```

### Stop
```bash
curl -X POST http://127.0.0.1:3001/stop
```

# one-chain explorer
![explorer](https://github.com/twodude/onechain/blob/master/images/explorer.png)

**`one-chain explorer`** is the front-end for the blockchain explorer which is used to visualize the state of the blockchain. Via blockchain explorer, you can see the latest blocks and details about specific block.

`one-chain` already has multiple functions with HTTP (RESTful API) endpoints, so a web page just calls those endpoints and visualizes the results. The whole UI codes are located in `./explorer`. `Vue.js` and `Vuetify` are used to implement.

# How to Start
```bash
cd explorer
npm install
```

## Run
```bash
npm run serve
```

**Note that** there is at least one running node whose `HTTP_PORT` is `3001`.

# License
The one-chain project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0), also included in our repository in the [LICENSE](https://github.com/twodude/onechain/blob/master/LICENSE) file.
