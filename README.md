[[:us: | English | 영어]](https://github.com/lukepark327/onechain)
[[:kr: | Korean | 한국어]](https://github.com/lukepark327/onechain/tree/korean)

---

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![version](https://img.shields.io/badge/version-v3.0.0-orange.svg)](https://github.com/lukepark327/onechain/blob/master/package.json)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-yellow.svg)](https://nodejs.org/en/)   

# onechain

<!--
![onechain](https://github.com/lukepark327/onechain/blob/master/images/icon.png)
-->

Assist in developing blockchain core efficiently.
> [2018 OSS Grand Developers Challenge Award](https://www.oss.kr)   
> [2019 OSS Grand Developers Challenge Award](https://www.oss.kr)   

Inspired by [lhartikk/naivechain](https://github.com/lhartikk/naivechain).   

## Live Demo

[![Run on Ainize](https://ainize.ai/static/images/run_on_ainize_button.svg)](https://ainize.web.app/redirect?git_repo=github.com/lukepark327/onechain)

Run onechain on **Ainize**! You can access the *live* onechain with the [endpoint](https://onechain.lukepark327.endpoint.ainize.ai) provided by Ainize, a serverless platform for open-source projects.
For example, you can see all blocks in blockchain with a `/blocks` GET request (i.e. [HERE](https://onechain.lukepark327.endpoint.ainize.ai/blocks)) .

## onechain-explorer

[![explorer](https://github.com/lukepark327/onechain/blob/master/images/comparison.png)](https://github.com/lukepark327/onechain-explorer)

> Click on the above image to go to the `onechain-explorer` repo.

A **`onechain explorer`** is the front-end used to visualize the state of the blockchain. This blockchain explorer allows users to see the latest blocks and details about a particular block. onechain already has multiple functions with HTTP (RESTful API) endpoints. So the web page calls those endpoints and visualizes the results.

The full UI code is located in [lukepark327/onechain-explorer](https://github.com/lukepark327/onechain-explorer) repo. Vue.js and Vuetify are used.

# Abstract
![structure](https://github.com/lukepark327/onechain/blob/master/images/structure.png)

As Blockchain-based services grew, so open-source that assists in developing blockchain core was needed. There are open-source projects like Bitcoin and Ethereum, but those are too hard to learn and to use.

We solve the above problems with a
**```onechain```, simple implementation of blockchain core.**
The onechain adopts modular design: Dividing layers into blockchain, network, APIs, and wallet for clarity. Also, detailed comments and documents are provided to facilitate learning and reusing. Both front-end and back-end of onechain is written in Javascript (Node.js and Vue.js) but written in simple (without async, et al.) so that other language developers can understand them.

# Use-cases

### 📖 컴퓨터과학으로 배우는 블록체인 원리와 구현
  - [Chapter-1](https://github.com/lukepark327/onechain/tree/chapter-1)
  - [Chapter-2](https://github.com/lukepark327/onechain/tree/chapter-2)
  - [Chapter-3](https://github.com/lukepark327/onechain/tree/chapter-3)
  - [Chapter-4](https://github.com/lukepark327/onechain/tree/chapter-4)

<p align="center">
  <a href="http://www.yes24.com/Product/Goods/75235536">
    <img width="480" src="https://github.com/lukepark327/onechain/blob/master/images/book.jpeg">
  </a>
</p>

> Click on the above image to go to the bookstore.

### Governance Simulator on Blockchain : Based on Smart City Cases
- [Paper](http://www.dbpia.co.kr/Journal/ArticleDetail/NODE07614082)

### Blockchain Policy Simulator
- [BBR Hackathon](http://www.breview.kr) [Excellence Award](http://decenter.sedaily.com/NewsView/1S639FV540)
- [Video Demonstration](https://www.youtube.com/watch?v=aFcnPziT4FE)
- [Code](https://github.com/lukepark327/blockchain-simulator)
  
### edu-chain
- [Code](https://github.com/lukepark327/educhain)   

### Plasma DAG
- [Code](https://github.com/plasma-dag/plasma-client)

<!--
* Noonsatae
  - [Avalanche Implementation](https://github.com/noonsatae)
-->

# Docker Quick Start

```bash
docker run -it -p 3001:3001 -p 6001:6001 lukepark327/onechain
```

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

* Set `HTTP_PORT` for HTTP communication

  ```$env:HTTP_PORT=3002```
  *or*
  ```export HTTP_PORT=3002```

* Set `P2P_PORT` for P2P communication among peers

  ```$env:P2P_PORT=6002```
  *or*
  ```export P2P_PORT=6002```

* (*option*) Set pre-connected `PEERS` before running

  ```$env:PEERS="ws://127.0.0.1:6001[, ws://127.0.0.1:6003, ...]"```
  *or*
  ```export PEERS="ws://127.0.0.1:6001[, ws://127.0.0.1:6003, ...]"```

* (*option*) Set `PRIVATE_KEY` where private_key is located

  ```$env:PRIVATE_KEY="second"```
  *or*
  ```export PRIVATE_KEY="second"```

  Now private_key is located in `./wallet/second/` instead of default location `./wallet/default/`.

```bash
npm start
```

# How to Use

<p align="center">
  <a href="https://youtu.be/uBeUTRtgGxI">
    <img width="480" src="https://img.youtube.com/vi/uBeUTRtgGxI/0.jpg">
  </a>
</p>

> Click on the above image to play the video.

### Get blockchain
```bash
curl http://127.0.0.1:3001/blocks
```

Use 'pretty-print JSON' for better readability:
```bash
curl http://127.0.0.1:3001/blocks | python -m json.tool
```
Python >= 2.6 is required.

### Get a particular block
```bash
curl http://127.0.0.1:3001/block/:number
```

For example, let us get a block whose number (index) is 3:

```bash
curl http://127.0.0.1:3001/block/3
```

### Add new block
```bash
curl -X POST http://127.0.0.1:3001/mineBlock
curl -H "Content-type:application/json" --data "{\"data\" : [\"Anything you want\", \"Anything you need\"]}" http://127.0.0.1:3001/mineBlock
```

### Get current version
```bash
curl http://127.0.0.1:3001/version
```

### Get the version of particular block
```bash
curl http://127.0.0.1:3001/blockVersion/:number
```

For example, let's get a version of a block whose number (index) is 3:

```bash
curl http://127.0.0.1:3001/blockVersion/3
```

### Get connected peer(s)
```bash
curl http://127.0.0.1:3001/peers
```

### Add peer(s)
```bash
curl -H "Content-type:application/json" --data "{\"peers\" : [\"ws://127.0.0.1:6002\", \"ws://127.0.0.1:6003\"]}" http://127.0.0.1:3001/addPeers
```

### Get Address
```bash
curl http://127.0.0.1:3001/address
```

### Stop
```bash
curl -X POST http://127.0.0.1:3001/stop
```

# License
The onechain project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0), also included in our repository in the [LICENSE](https://github.com/lukepark327/onechain/blob/master/LICENSE) file.
