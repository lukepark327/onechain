블록체인의 기본 컨셉은 ‘지속적으로 성장하는 분산화 데이터베이스’이다. 본 정의를 만족하는 최소 기능 블록체인을 구현하여 오픈소스화 하는 것으로 블록체인 개발을 보조하고자 한다. 블록 생성과 제네시스 블록을 정의하는 부분, 블록 및 블록체인을 검증하는 부분을 구현하여 제공한다.      

또한 노드(피어)간의 소통, 그리고 사용자와 노드와의 소통을 위해 P2P 구현체 및 HTTP 웹소켓 프로그래밍 구현체를 제공한다.

# How to Start
## install packages
<code>npm install</code>
## start
<code>npm start</code>
## set node 2
<code>$env:HTTP_PORT=3002    <p>
$env:P2P_PORT=6002    <p>
(optional) $env:PEERS = "ws://127.0.0.1:6001"</code>
## set node 3
<code>$env:HTTP_PORT=3003    <p>
$env:P2P_PORT=6003    <p>
(optional) $env:PEERS = "ws://127.0.0.1:6001, ws://127.0.0.1:6002"</code>
