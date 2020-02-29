"use strict";
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const bc = require("./blockchain");
const nw = require("./network");
const wl = require("./wallet");
const ut = require("./utils");

const http_port = process.env.HTTP_PORT || 3001;
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

function initHttpServer() {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.get("/blocks", async function (req, res) {
        res.send(await bc.getBlockchain().asArray());
    });
    app.get('/block/:number', async function (req, res) {
        const targetBlock = await bc.getBlockchain().asArray().find(function (block) {
            return block.header.index == req.params.number;
        });
        res.send(targetBlock);
    });
    app.post("/mineBlock", async function (req, res) {
        const data = req.body.data || [];
        const newBlock = await bc.mineBlock(data);
        if (newBlock === null) {
            res.status(400).send('Bad Request');
        }
        else {
            res.send(newBlock);
        }
    });
    app.get("/version", function (req, res) {
        res.send(ut.getCurrentVersion());
    });
    app.get("/blockVersion/:number", async function (req, res) {
        const targetBlock = await bc.getBlockchain().asArray().find(function (block) {
            return block.header.index == req.params.number;
        });
        res.send(targetBlock.header.version);
    });
    app.get("/peers", function (req, res) {
        res.send(nw.getSockets().map(function (s) {
            return s._socket.remoteAddress + ':' + s._socket.remotePort;
        }));
    });
    app.post("/addPeers", async function (req, res) {
        const peers = req.body.peers || [];
        await nw.connectToPeers(peers);
        res.send();
    });
    app.get("/address", function (req, res) {
        const address = wl.getPublicFromWallet().toString();
        res.send({ "address": address });
    });
    app.post("/stop", function (req, res) {
        res.send({ "msg": "Stopping server" });
        process.exit();
    });

    app.listen(http_port, function () { console.log("Listening http port on: " + http_port) });
}

// main
// async
bc.initBlockchain();
nw.connectToPeers(initialPeers);
nw.initP2PServer();

initHttpServer();
wl.initWallet();
