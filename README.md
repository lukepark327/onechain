[[:us: | English | 영어]](https://github.com/twodude/onechain)
[[:kr: | Korean | 한국어]](https://github.com/twodude/onechain/tree/korean)

---

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![version](https://img.shields.io/badge/version-v2.2.0-orange.svg)](https://github.com/twodude/onechain/blob/master/package.json)
[![node](https://img.shields.io/badge/node-%3E%3D4.3.2-yellow.svg)](https://nodejs.org/en/)   

# one-chain
가장 간결한 블록체인.

<!--
![onechain](https://github.com/twodude/onechain/blob/master/images/icon.png)
-->

손쉬운 블록체인 코어 개발을 보조한다.
> [2018 제12회 공개SW 개발자대회](https://project.oss.kr)   
> 다음 코드를 참조함: [lhartikk/naivechain](https://github.com/lhartikk/naivechain)   

## 요약
![structure](https://github.com/twodude/onechain/blob/master/images/structure.png)

블록체인 기반 서비스가 성장하면서 블록체인 코어 개발을 위한 오픈소스의 필요성이 대두되었다. 이미 비트코인이나 이더리움과 같은 여러 오픈소스들이 있지만, 복잡도가 높아 다루기 까다롭고 교육용으로 사용하기에도 어려운 실정이다.

블록체인의 기본 원칙을 가장 간결한 방법으로 구현한 `원체인(one-chain)`을 이용하면 위와 같은 문제를 해결할 수 있다. **원체인은 블록체인 코어의 단순한 구현체이다.** 원체인은 모듈형 디자인을 채택했다: 블록체인, 네트워크, API, 그리고 지갑 레이어로 구분함으로써 복잡한 코드를 보다 명료하게 전달한다. 이 코드 및 문서에 기초하여 누구나 재사용 가능하도록 하였다.

원체인의 프론트엔드와 백엔드는 모두 자바스크립트(Node.js와 Vue.js)로 작성되었으나 수도-코드(pseudo-code) 스타일로 작성되어 개발자가 언어에 구애받지 않도록 하였다.

## 사용 사례

* 📖 컴퓨터과학으로 배우는 블록체인 원리와 구현
  - [Chapter-1](https://github.com/twodude/onechain/tree/chapter-1)
  - [Chapter-2](https://github.com/twodude/onechain/tree/chapter-2)
  - [Chapter-3](https://github.com/twodude/onechain/tree/chapter-3)
  - [Chapter-4](https://github.com/twodude/onechain/tree/chapter-4)

[![book-cover](https://github.com/twodude/onechain/blob/master/images/book-cover.png)](http://www.yes24.com/Product/Goods/75235536)

> 책 구매 페이지로 이동하고자 한다면 위 이미지를 클릭하시오.

* 블록체인 기반 거버넌스 시뮬레이터 : 스마트시티 사례를 바탕으로
  - [논문](http://www.dbpia.co.kr/Journal/ArticleDetail/NODE07614082)

* 블록체인 정책 시뮬레이터
  - [BBR 해커톤 우수상](http://www.breview.kr) [Excellence Award](http://decenter.sedaily.com/NewsView/1S639FV540)
  - [데모 영상](https://www.youtube.com/watch?v=aFcnPziT4FE)
  - [코드](https://github.com/twodude/blockchain-simulator)

* edu-chain
  - [코드](https://github.com/twodude/educhain)   

* Plasma DAG
  - [코드](https://github.com/plasma-dag/plasma-client)

<!--
* Noonsatae
  - [Avalanche Implementation](https://github.com/noonsatae)
-->

# 시작하기

## 환경
- Node.js v8.11.3
- cURL 7.55.1 *또는* Postman v6.4.4

## Dependencies 설치
```bash
npm install
```
## 노드 구동하기

### 노드 #1 시작하기
```bash
npm start
```

### 노드 #2 시작하기

* HTTP 통신을 위해 HTTP_PORT 설정하기

  ```$env:HTTP_PORT=3002```
  *또는*
  ```export HTTP_PORT=3002```

* 피어 간 P2P 통신을 위해 P2P_PORT 설정하기

  ```$env:P2P_PORT=6002```
  *또는*
  ```export P2P_PORT=6002```

* (*선택*) 구동 전 미리 연결된 PEERS 설정하기

  ```$env:PEERS="ws://127.0.0.1:6001[, ws://127.0.0.1:6003, ...]"```
  *또는*
  ```export PEERS="ws://127.0.0.1:6001[, ws://127.0.0.1:6003, ...]"```

* (*선택*) private_key가 저장될 위치인 PRIVATE_KEY 설정하기

  ```$env:PRIVATE_KEY="second"```
  *또는*
  ```export PRIVATE_KEY="second"```

  이제 private_key는 기본값인 `./wallet/default/` 대신 `./wallet/second/`에 저장된다.

```bash
npm start
```

# 사용하기
[![video](https://user-images.githubusercontent.com/24687378/55283674-5d346400-53a3-11e9-9e85-baaca23cac78.jpg)](https://youtu.be/ZRbr3VIUHuA)   
> 동영상 페이지로 이동하고자 한다면 위 이미지를 클릭하시오.

### 블록체인 요청
```bash
curl http://127.0.0.1:3001/blocks
```

가독성을 위해 pretty-print JSON을 사용할 수 있다:
```bash
curl http://127.0.0.1:3001/blocks | python -m json.tool
```
Python >= 2.6이 요구된다.

### 특정 블록 요청
```bash
curl http://127.0.0.1:3001/block/:number
```

예를 들어, 블록 번호(인덱스)가 3인 블록을 요청해보자:

```bash
curl http://127.0.0.1:3001/block/3
```

### 새 블록 추가
```bash
curl -X POST http://127.0.0.1:3001/mineBlock
curl -H "Content-type:application/json" --data "{\"data\" : [\"Anything you want\", \"Anything you need\"]}" http://127.0.0.1:3001/mineBlock
```

### 연결된 피어(peer) 요청
```bash
curl http://127.0.0.1:3001/peers
```

### 피어 추가
```bash
curl -H "Content-type:application/json" --data "{\"peers\" : [\"ws://127.0.0.1:6002\", \"ws://127.0.0.1:6003\"]}" http://127.0.0.1:3001/addPeers
```

### 주소 요청
```bash
curl http://127.0.0.1:3001/address
```

### 지갑 생성
```bash
curl -X POST http://127.0.0.1:3001/createWallet
```

### 지갑 삭제
```bash
curl -X POST http://127.0.0.1:3001/deleteWallet
```

### 중지
```bash
curl -X POST http://127.0.0.1:3001/stop
```

# one-chain 탐색기
![explorer](https://github.com/twodude/onechain/blob/master/images/explorer.png)

**`one-chain 탐색기`는 블록체인 상태를 시각화하는 블록체인 탐색기이다.** 블록체인 탐색기를 통해 최신 블록을 확인하거나 특정 블록의 상세를 확인할 수 있다.

알다시피 원체인은 이미 여러 기능의 HTTP 엔드포인트를 제공한다. 웹 페이지는 단순히 이를 호출해 결과를 시각화한다.

전체 UI 코드는 `./explorer/`에서 확인할 수 있다. 구현에 Vue.js 및 Vuetify가 사용되었다.

# 시작하기
```bash
cd explorer
npm install
```

## 구동하기

**요구사항:** `HTTP_PORT`가 `3001`인 노드가 구동 중이어야 한다.

```bash
npm run serve
```

이제 앱은 기본적으로 http://localhost:8080/ 에서 구동된다. '크롬(Chrome) 브라우저'의 사용이 권장된다.

# 사용하기

* 특정 블록은 번호로 검색할 수 있다. 검색 바(bar)에 입력하거나 `BLOCK #N` 버튼을 클릭하시오.

* 만일 블록체인을 실시간으로 추적하고자 한다면, 페이지 상단의 'Realtime Updates' 스위치를 활성화한다. 이는 풀노드(full-node)에게 블록체인을 요청하는 `/blocks` GET 요청을 매 2초마다 전송한다.

# 라이선스
one-chain 프로젝트는 [Apache License, Version 2.0](https://opensource.org/licenses/Apache-2.0) 라이선스를 따르며, 레포지토리의 [LICENSE](https://github.com/twodude/onechain/blob/master/LICENSE) 파일에서도 확인할 수 있다.

