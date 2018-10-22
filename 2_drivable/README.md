# 동작 가능 블록체인
노드(피어)간의 소통, 그리고 사용자와 노드와의 소통을 위해 P2P 구현체 및 HTTP 웹소켓 프로그래밍 구현체를 제공합니다.

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
