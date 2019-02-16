"use strict";
const fs = require("fs");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");

const http_port = process.env.HTTP_PORT || 3001;
const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || http_port.toString());
const privateKeyFile = privateKeyLocation + "/private_key";

function getPrivateFromWallet() {
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

function getPublicFromWallet() {
    const privateKey = getPrivateFromWallet();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
}

function initWallet() {
    if (fs.existsSync(privateKeyFile)) {
        console.log("Load wallet with private key from: %s", privateKeyFile);
        return;
    }

    if (!fs.existsSync("wallet/")) { fs.mkdirSync("wallet/"); }
    if (!fs.existsSync(privateKeyLocation)) { fs.mkdirSync(privateKeyLocation); }

    const newPrivateKey = generatePrivateKey();
    fs.writeFileSync(privateKeyFile, newPrivateKey);
    console.log("Create new wallet with private key to: %s", privateKeyFile);
}

function generatePrivateKey() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}

module.exports = {
    initWallet,
    getPublicFromWallet
};
