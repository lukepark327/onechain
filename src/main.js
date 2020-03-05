"use strict";
import { getCurrentVersion } from "./modules"; // utils
import { initBlockchain, getBlockchain, mineBlock } from "./modules"; // blockchain
import { getSockets, connectToPeers, initP2PServer } from "./modules"; // network
import { getPublicFromWallet, initWallet } from "./modules"; // wallet

import cors from "cors";
import express from "express";
import { json } from "body-parser";

const http_port = process.env.HTTP_PORT || 3001;
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

function initHttpServer() {
    const app = express();
    app.use(cors());
    app.use(json());

    app.get("/blocks", function (req, res) {
        res.send(getBlockchain());
    });
    app.get('/block/:number', function (req, res) {
        try {
            const targetBlock = getBlockchain().indexWith(req.params.number);
            res.send(targetBlock);
        }
        catch (err) {
            res.status(400).send('Bad Request');
            console.log(err);
        }
    });
    app.post("/mineBlock", function (req, res) {
        const data = req.body.data || [];
        const newBlock = mineBlock(data);
        if (newBlock === null) {
            res.status(400).send('Bad Request');
        }
        else {
            res.send(newBlock);
        }
    });
    app.get("/version", function (req, res) {
        res.send(getCurrentVersion());
    });
    app.get("/blockVersion/:number", function (req, res) {
        try {
            const targetBlock = getBlockchain().indexWith(req.params.number);
            res.send(targetBlock.header.version);
        }
        catch (err) {
            res.status(400).send('Bad Request');
            console.log(err);
        }
    });
    app.get("/peers", function (req, res) {
        res.send(getSockets().map(function (s) {
            return s._socket.remoteAddress + ':' + s._socket.remotePort;
        }));
    });
    app.post("/addPeers", function (req, res) {
        const peers = req.body.peers || [];
        connectToPeers(peers);
        res.send();
    });
    app.get("/address", function (req, res) {
        const address = getPublicFromWallet().toString();
        res.send({ "address": address });
    });
    app.post("/stop", function (req, res) {
        res.send({ "msg": "Stopping server" });
        process.exit();
    });

    app.listen(http_port, function () { console.log("Listening http port on: " + http_port) });
}

// main
(async function () {
    await initBlockchain();
    connectToPeers(initialPeers);
    initHttpServer();
    initP2PServer();
    initWallet();
})();
