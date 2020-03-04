"use strict";
const random = require("random");

// const db = require("./database").db;
const BlockHeader = require("./types").BlockHeader;
const Block = require("./types").Block;
const ut = require("./utils");

// TODO
function initBlockchain() {
    return getGenesisBlock();
}

/**
 * TODO: Use database to store the data permanently.
 * A current implemetation stores blockchain in local volatile memory.
 */
var blockchain = [getGenesisBlock()];

function getBlockchain() { return ut.deepCopy(blockchain); }
function getLatestBlock() { return ut.deepCopy(blockchain[blockchain.length - 1]); }

function generateRawBlock(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce, data) {
    const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce);
    return new Block(header, data);
}

function generateBlock(version, index, previousHash, timestamp, difficulty, nonce, data) {
    const merkleRoot = ut.calculateMerkleRoot(data);
    return generateRawBlock(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce, data);
}

function getGenesisBlock() {
    const version = "1.0.0";
    const index = 0;
    const previousHash = '0'.repeat(64);
    const timestamp = 1231006505; // 01/03/2009 @ 6:15pm (UTC)
    const difficulty = 0;
    const nonce = 0;
    const data = ["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"];

    return generateBlock(version, index, previousHash, timestamp, difficulty, nonce, data);
}

function generateNextBlock(blockData) {
    const previousBlock = getLatestBlock();

    const currentVersion = ut.getCurrentVersion();
    const nextIndex = previousBlock.header.index + 1;
    const previousHash = previousBlock.hash();
    const nextTimestamp = ut.getCurrentTimestamp();
    const merkleRoot = ut.calculateMerkleRoot(blockData);
    const difficulty = getDifficulty(getBlockchain());
    const validNonce = findNonce(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty);

    return generateRawBlock(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty, validNonce, blockData);
}

function addBlock(newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

function mineBlock(blockData) {
    const newBlock = generateNextBlock(blockData);

    if (addBlock(newBlock)) {
        const nw = require("./network");

        nw.broadcast(nw.responseLatestMsg());
        return newBlock;
    }
    else {
        return null; // TODO: undefined
    }
}

/**
 * TODO: Implement a stop mechanism.
 * A current implementation doesn't stop until finding matching block.
 */
function findNonce(version, index, previoushash, timestamp, merkleRoot, difficulty) {
    var nonce = 0;
    while (true) {
        var hash = ut.SHA256([version, index, previoushash, timestamp, merkleRoot, difficulty, nonce]);
        if (hashMatchesDifficulty(hash, difficulty)) { return nonce; }
        nonce++;
    }
}

function hashMatchesDifficulty(hash, difficulty) {
    const hashBinary = ut.hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty);
    return hashBinary.startsWith(requiredPrefix);
}

const BLOCK_GENERATION_INTERVAL = 10; // in seconds
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10; // in blocks

function getDifficulty(aBlockchain) {
    const latestBlock = aBlockchain[aBlockchain.length - 1];
    if (latestBlock.header.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.header.index !== 0) {
        return getAdjustedDifficulty(aBlockchain);
    }
    return latestBlock.header.difficulty;
}

function getAdjustedDifficulty(aBlockchain) {
    const latestBlock = aBlockchain[aBlockchain.length - 1];
    const prevAdjustmentBlock = aBlockchain[aBlockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeTaken = latestBlock.header.timestamp - prevAdjustmentBlock.header.timestamp;
    const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.header.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.header.difficulty - 1;
    }
    else {
        return prevAdjustmentBlock.header.difficulty;
    }
}

function isValidBlockStructure(block) {
    return typeof(block.header.version) === 'string'
        && typeof(block.header.index) === 'number'
        && typeof(block.header.previousHash) === 'string'
        && typeof(block.header.timestamp) === 'number'
        && typeof(block.header.merkleRoot) === 'string'
        && typeof(block.header.difficulty) === 'number'
        && typeof(block.header.nonce) === 'number'
        && typeof(block.data) === 'object';
}

function isValidTimestamp(newBlock, previousBlock) {
    return (previousBlock.header.timestamp - 60 < newBlock.header.timestamp)
        && newBlock.header.timestamp - 60 < ut.getCurrentTimestamp();
}

function isValidNewBlock(newBlock, previousBlock) {
    if (!isValidBlockStructure(newBlock)) {
        console.log("Invalid block structure: " + JSON.stringify(newBlock));
        return false;
    }
    else if (previousBlock.header.index + 1 !== newBlock.header.index) {
        console.log("Invalid index");
        return false;
    }
    else if (previousBlock.hash() !== newBlock.header.previousHash) {
        console.log("Invalid previousHash");
        return false;
    }
    else if (ut.calculateMerkleRoot(newBlock.data) !== newBlock.header.merkleRoot) {
        console.log("Invalid merkleRoot");
        return false;
    }
    else if (!isValidTimestamp(newBlock, previousBlock)) {
        console.log('Invalid timestamp');
        return false;
    }
    else if (!hashMatchesDifficulty(newBlock.hash(), newBlock.header.difficulty)) {
        console.log("Invalid hash: " + newBlock.hash());
        return false;
    }
    return true;
}

function isValidChain(blockchainToValidate) {
    if (!ut.isEqual(blockchainToValidate[0], getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        }
        else { return false; }
    }
    return true;
}

function replaceChain(newBlocks) {
    if (
        isValidChain(newBlocks)
        && (newBlocks.length > blockchain.length || (newBlocks.length === blockchain.length) && random.boolean())
    ) {
        const nw = require("./network");

        console.log("Received blockchain is valid. Replacing current blockchain with received blockchain");
        blockchain = newBlocks;
        nw.broadcast(nw.responseLatestMsg());
    }
    else { console.log("Received blockchain invalid"); }
}

module.exports = {
    getBlockchain,
    getLatestBlock,
    addBlock,
    mineBlock,
    replaceChain
};
