[[:kr:|Korean|한국어]](https://github.com/twodude/onechain/tree/Korean)

---

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-yellow.svg)](https://nodejs.org/en/)   

# one-chain
minimal blockchain ever.   

![onechain](https://github.com/twodude/onechain/blob/master/images/icon.png)

Assist you to develop blockchain core easily.
> [2018 OSS Grand Developers Challenge Award](https://project.oss.kr)   
> Based on the following code: [lhartikk/naivechain](https://github.com/lhartikk/naivechain)   

## Abstract
![structure](https://github.com/twodude/onechain/blob/master/images/structure.png)

As Blockchain-based service grew, so need of open source which assists developing blockchain core was drived.
Although there are some open source projects like Bitcoin and Ethereum, those are difficult to learn to use.

You can gently solve the above problems by using
**```one-chain```, simple implementation of blockchain core.**
The one-chain is modularized by function&mdash;network, core, transaction, wallet, etc.&mdash; to achieve clarity.
Also, detail comments and documents are provided for studying and easy reusing.
Most of the code is written in a pseudo-code style to provide understanding by other language developers.

## Details
- [(Korean) Minimal Blockchain](https://github.com/JOYUJEONG/onechain/blob/master/1_minimal/README.md)   
- [(Korean) Drivable Blockchain](https://github.com/JOYUJEONG/onechain/blob/master/2_drivable/README.md)   

# Use-case

## Blockchain Policy Simulator
- [BBR Hackathon](http://www.breview.kr)
[Excellence Award](http://decenter.sedaily.com/NewsView/1S639FV540)    
- [Video Demonstration](https://www.youtube.com/watch?v=aFcnPziT4FE)    

## edu-chain
- [Instructional Blockchain](https://github.com/twodude/educhain)   

# How to Start

## Environments
- Node.js v8.11.3 (>=4.3.2)
- cURL 7.55.1 *or* Postman v6.4.4

### install packages
```
npm install
```

### start node #1
```
npm start
```

### start node #2
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

```
npm start
```

### start node #3
```$env:HTTP_PORT=3003```
*or*
```export HTTP_PORT=3003```

```$env:P2P_PORT=6003```
*or*
```export P2P_PORT=6003```

*optionally*
```$env:PEERS="ws://127.0.0.1:6001, ws://127.0.0.1:6002"```
*or*
```export PEERS="ws://127.0.0.1:6001, ws://127.0.0.1:6002"```

```
npm start
```

# How to Use
[![video](http://img.youtube.com/vi/NgkADMy8j6Y/0.jpg)](https://www.youtube.com/watch?v=NgkADMy8j6Y)   
> Click on the image above to play the video.

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

### Get Address
```
curl http://127.0.0.1:3001/address
```

### Create Wallet
```
curl -X POST http://127.0.0.1:3001/createWallet
```

### Delete Wallet
```
curl -X POST http://127.0.0.1:3001/deleteWallet
```

### Stop
```
curl -X POST http://127.0.0.1:3001/stop
```

# License
The onechain project is licensed under the [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0), also included in our repository in the [LICENSE](https://github.com/JOYUJEONG/onechain/blob/master/LICENSE) file.
