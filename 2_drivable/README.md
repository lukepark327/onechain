# 동작 가능 블록체인
블록체인에서 노드는 다른 노드와 끊임없이 동기화합니다. 새 블록을 생성할 경우 해당하는 데이터를 네트워크에 브로드캐스트 해야 하며, 새로운 피어와 연결하였을 경우 서로의 블록체인 중에서 하나를 선택하는 합의(consensus)를 진행해야 합니다.
   
또한 노드를 제어하기 위해 사용자와 통신할 방법이 필요합니다. 사용자는 블록체인 장부를 열람할 수 있어야 하며, 데이터를 넘겨줌으로써 새 블록을 생성할 수 있으며, 또한 연결된 피어를 확인하거나 추가할 수 있어야 합니다.
   
원체인에서는 노드 간의 소통, 그리고 사용자와 노드와의 소통을 위해 P2P 구현체 및 HTTP 웹소켓 프로그래밍 구현체를 제공합니다.

## 그림 2.1 원체인 코어 구조
![그림2.1](https://github.com/JOYUJEONG/onechain/blob/master/2_drivable/images/2-1.png)

그림 설명

## How to Start
동영상 추가 예정   

### install packages
```
npm install
```
### start (node 1)
```
npm start
```
### start node 2
```
$env:HTTP_PORT=3002
$env:P2P_PORT=6002
(optional) $env:PEERS = "ws://127.0.0.1:6001"
npm start
```
### start node 3
```
$env:HTTP_PORT=3003
$env:P2P_PORT=6003
(optional) $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"
npm start
```
