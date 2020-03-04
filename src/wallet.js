"use strict";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { ec as _ec } from "elliptic";
const ec = new _ec("secp256k1");

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

function generatePrivateKey() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}

function initWallet() {
    if (existsSync(privateKeyFile)) {
        console.log("Load wallet with private key from: " + privateKeyFile);
        return;
    }

    if (!existsSync("wallet/")) { mkdirSync("wallet/"); }
    if (!existsSync(privateKeyLocation)) { mkdirSync(privateKeyLocation); }

    const newPrivateKey = generatePrivateKey();
    writeFileSync(privateKeyFile, newPrivateKey);
    console.log("Create new wallet with private key to: " + privateKeyFile);
}

function getPrivateFromWallet() {
    const buffer = readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

function getPublicFromWallet() {
    const privateKey = getPrivateFromWallet();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
}

export default {
    initWallet,
    getPublicFromWallet
};
