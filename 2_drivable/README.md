# 동작 가능 블록체인
블록체인에서 노드는 다른 노드와 끊임없이 동기화합니다. 새 블록을 생성할 경우 해당하는 데이터를 네트워크에 브로드캐스트(broadcast) 해야 하며, 새로운 피어와 연결하였을 경우 서로의 블록체인 중에서 하나를 선택하는 합의(consensus)를 진행해야 합니다.
   
또한 노드를 제어하기 위해 사용자와 통신할 방법이 필요합니다. 사용자는 블록체인 장부를 열람할 수 있어야 하며, 데이터를 넘겨줌으로써 새 블록을 생성할 수 있으며, 또한 연결된 피어를 확인하거나 추가할 수 있어야 합니다.
   
원체인에서는 노드 간의 소통, 그리고 사용자와 노드와의 소통을 위해 **P2P 웹소켓 및 HTTP 웹소켓 프로그래밍 구현체**를 제공합니다. 이전 [최소 기능 블록체인](https://github.com/JOYUJEONG/onechain/blob/master/1_minimal_functional/README.md)에 이어 구현됩니다.

## 그림 2.1. 원체인 코어 구조
![그림2.1](https://github.com/JOYUJEONG/onechain/blob/master/2_drivable/images/2-1.png)

원체인에서는 P2P 통신을 위해 웹소켓을 활용합니다. 최소한의 기능만을 제공하기 위하여 자동 피어 탐색 기능은 구현되지 않았습니다. 따라서 다른 피어의 위치(웹소켓 URLs)는 사용자로 하여금 수동으로 입력되어져야 합니다.
   
사용자와의 통신은 HTTP 인터페이스를 통해 이루어집니다. 가장 직관적으로 노드를 조작하는 방법은 **cURL**을 활용하는 것입니다. 다음의 예시는 원체인에서 가능한 명령들을 나열한 것입니다. 혹은 해당 [동영상](https://www.youtube.com/watch?v=NgkADMy8j6Y)처럼 Postman 프로그램을 통해 보다 쉽게 상호작용할 수 있습니다.

## How to Use

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
