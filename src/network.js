"use strict";
import { Blockchain } from "./modules"; // types
import { getLatestBlock, addBlock, replaceChain, getBlockchain } from "./modules"; // blockchain

import WebSocket, { Server } from "ws";

const p2p_port = process.env.P2P_PORT || 6001;

const MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

function queryAllMsg() {
    return ({
        "type": MessageType.QUERY_ALL,
        "data": null
    });
}

function queryChainLengthMsg() {
    return ({
        "type": MessageType.QUERY_LATEST,
        "data": null
    });
}

function responseChainMsg() {
    return ({
        "type": MessageType.RESPONSE_BLOCKCHAIN,
        "data": getBlockchain().encode()
    });
}

function responseLatestMsg() {
    return ({
        "type": MessageType.RESPONSE_BLOCKCHAIN,
        "data": new Blockchain([getLatestBlock()]).encode()
    });
}

var sockets = [];

function write(ws, message) { ws.send(JSON.stringify(message)); }

function broadcast(message) {
    sockets.forEach(function (socket) {
        write(socket, message);
    });
}

function getSockets() { return sockets; }

function initP2PServer() {
    const server = new Server({ port: p2p_port });
    server.on("connection", function (ws) { initConnection(ws); });
    console.log("Listening websocket p2p port on: " + p2p_port);
}

function initConnection(ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
}

function initMessageHandler(ws) {
    ws.on("message", function (data) {
        const message = JSON.parse(data);
        // console.log("Received message" + JSON.stringify(message));

        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message);
                break;
        }
    });
}

function initErrorHandler(ws) {
    ws.on("close", function () { closeConnection(ws); });
    ws.on("error", function () { closeConnection(ws); });
}

function closeConnection(ws) {
    console.log("Connection failed to peer: " + ws.url);
    sockets.splice(sockets.indexOf(ws), 1);
}

function connectToPeers(newPeers) {
    newPeers.forEach(
        function (peer) {
            const ws = new WebSocket(peer);
            ws.on("open", function () { initConnection(ws); });
            ws.on("error", function () { console.log("Connection failed"); });
        }
    );
}

function handleBlockchainResponse(message) {
    const receivedBlockchain = new Blockchain().decode(message.data);
    const latestBlockReceived = receivedBlockchain.latestBlock();
    const latestBlockHeld = getLatestBlock();

    if (latestBlockReceived.header.index > latestBlockHeld.header.index) {
        console.log(
            "Blockchain possibly behind."
            + " We got: " + latestBlockHeld.header.index + ", "
            + " Peer got: " + latestBlockReceived.header.index
        );
        if (latestBlockHeld.hash() === latestBlockReceived.header.previousHash) {
            // A received block refers the latest block of my ledger.
            console.log("We can append the received block to our chain");
            if (addBlock(latestBlockReceived)) {
                broadcast(responseLatestMsg());
            }
        }
        else if (receivedBlockchain.length === 1) {
            // Need to reorganize.
            console.log("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        }
        else {
            // Replace chain.
            console.log("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlockchain);
        }
    }
    else { console.log("Received blockchain is not longer than current blockchain. Do nothing"); }
}

export default {
    responseLatestMsg,
    broadcast,
    connectToPeers,
    getSockets,
    initP2PServer
};
