"use strict";
const merkle = require("merkle");
const random = require("random");

const db = require("./database").db;
const ut = require("./utils");

class BlockHeader {
    constructor(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce) {
        this.version = version;
        this.index = index;
        this._previousHash = previousHash;
        this.timestamp = timestamp;
        this.merkleRoot = merkleRoot;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    get previousHash() {
        return this._previousHash.toUpperCase();
    }

    /**
     * @param {string} newPreviousHash
     */
    set previousHash(newPreviousHash) {
        this._previousHash = newPreviousHash;
    }
}

class Block {
    constructor(header, data) {
        this.header = ut.deepCopy(header);
        this.data = ut.deepCopy(data);
    }

    hash() {
        return ut.SHA256([
            this.header.version,
            this.header.index,
            this.header.previousHash,
            this.header.timestamp,
            this.header.merkleRoot,
            this.header.difficulty,
            this.header.nonce
        ]);
    }

    equals(aBlock) {
        return JSON.stringify(this) !== JSON.stringify(aBlock);
    }

    async save() {
        const blockHash = this.hash();
        const encodedBlock = JSON.stringify(this);
        try {
            await db.put("B" + blockHash, encodedBlock);
        }
        catch (err) {
            // console.log(err);
        }
    }

    async load(blockHash) {
        try {
            const encodedBlock = await db.get("B" + blockHash);
            const objectifiedBlock = JSON.parse(encodedBlock);
            const decodedBlock = Object.assign(new Block(), objectifiedBlock);
            decodedBlock.header = Object.assign(new BlockHeader(), decodedBlock.header);
            return decodedBlock;
        }
        catch (err) {
            // console.log(err);
            return undefined;
        }
    }

    print() {
        console.log(this);
        // Hash, et al.
    }
}

class BlockchainIterator {
    constructor(currentBlockHash) {
        this._currentBlockHash = currentBlockHash;
    }

    get currentBlockHash() {
        return this._currentBlockHash.toUpperCase();
    }

    /**
     * @param {string} newCurrentBlockHash
     */
    set currentBlockHash(newCurrentBlockHash) {
        this._currentBlockHash = newCurrentBlockHash;
    }

    async prev() {
        const block = await new Block().load(this.currentBlockHash);
        if (block === undefined) { return undefined; }

        this.currentBlockHash = block.header.previousHash;
        return block;
    }

    /**
     * TODO
     */
    async find() {
        return undefined;
    }
}

class Blockchain {
    constructor(latestBlockHash) {
        this._latestBlockHash = latestBlockHash;
    }

    get latestBlockHash() {
        return this._latestBlockHash.toUpperCase();
    }

    /**
     * @param {string} newLatestBlockHash
     */
    set latestBlockHash(newLatestBlockHash) {
        this._latestBlockHash = newLatestBlockHash;
    }

    async compare(aBlockchain) {
        /**
         * TODO: the haviest chain rule.
         * The current implementation is the longest chain rule.
         */
        const length = await this.length();
        const targetLength = await aBlockchain.length();

        if (length > targetLength) { return 1; }
        else if (length < targetLength) { return -1; }
        else { return 0; }
    }

    async save() {
        const encodedBlockchain = JSON.stringify(this);
        try {
            await db.put("Chain", encodedBlockchain);
        }
        catch (err) {
            // console.log(err);
        }
    }

    async load() {
        try {
            const encodedBlockchain = await db.get("Chain");
            const objectifiedBlockchain = JSON.parse(encodedBlockchain);
            const decodedBlockchain = Object.assign(new Blockchain(), objectifiedBlockchain);
            return decodedBlockchain;
        }
        catch (err) {
            // console.log(err);
            return; // undefined
        }
    }

    update(newLatestBlockHash) {
        this.latestBlockHash = newLatestBlockHash;
    }

    iterator() {
        return new BlockchainIterator(this.latestBlockHash);
    }

    async latestBlock() {
        const latestBlock = await new Block().load(this.latestBlockHash);
        return latestBlock;
    }

    async length() {
        const latestBlock = await this.latestBlock();
        if (latestBlock === undefined) { return 0; }

        const latestBlockIndex = latestBlock.header.index;
        return latestBlockIndex + 1; // block index starts from '0'
    }

    async asArray() {
        var blocks = [];
        var bci = this.iterator();
        for (var b = await bci.prev(); b !== undefined; b = await bci.prev()) {
            blocks.push(b);
        }

        blocks.reverse();
        return blocks;
    }

    async indexed(idx) {
        const length = await this.length();
        var offset;

        if (idx < 0) { offset = idx * (-1); }
        else { offset = length - idx; }
        if (offset <= 0 || offset > length) {
            throw RangeError("Invalid index: Blockchain length is " + length);
        }

        var block;
        var bci = this.iterator();
        for (var b = await bci.prev(), i = 0; b !== undefined, i < offset; b = await bci.prev(), i++) {
            block = b;
        }

        return block;
    }

    print() {
        console.log(this);
        // print as array
    }
}

async function initBlockchain() {
    const blockchain = await new Blockchain().load();
    if (blockchain === undefined) {
        const genesisBlock = getGenesisBlock();
        try { await genesisBlock.save(); } catch (err) { throw err; }

        const newBlockchain = new Blockchain(genesisBlock.hash());
        try { await newBlockchain.save(); } catch (err) { throw err; }
    }
}

async function getBlockchain() {
    var blockchain = await new Blockchain().load(); // const
    return blockchain;
}

async function getLatestBlock() {
    const blockchain = await getBlockchain();
    return await blockchain.latestBlock();
}

function getGenesisBlock() {
    const version = "1.0.0";
    const index = 0;
    const previousHash = '0'.repeat(64);
    const timestamp = 1231006505; // 01/03/2009 @ 6:15pm (UTC)
    const difficulty = 0;
    const nonce = 0;
    const data = ["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"];

    const merkleTree = merkle("sha256").sync(data);
    const merkleRoot = merkleTree.root() || '0'.repeat(64);

    const header = new BlockHeader(version, index, previousHash, timestamp, merkleRoot, difficulty, nonce);
    return new Block(header, data);
}

async function generateNextBlock(blockchain, blockData) {
    const previousBlock = await blockchain.latestBlock();

    const nextIndex = previousBlock.header.index + 1;
    const previousHash = previousBlock.hash();
    const currentVersion = ut.getCurrentVersion();
    const nextTimestamp = ut.getCurrentTimestamp();
    const difficulty = await getDifficulty(blockchain);

    const merkleTree = merkle("sha256").sync(blockData);
    const merkleRoot = merkleTree.root() || '0'.repeat(64);

    const newBlockHeader = findBlock(currentVersion, nextIndex, previousHash, nextTimestamp, merkleRoot, difficulty);
    return new Block(newBlockHeader, blockData);
}

/**
 * TODO: Implement a stop mechanism.
 * The current implementation doesn't stop until finding matching block.
 * 
 * TOOO: Multi-threading
 */
function findBlock(currentVersion, nextIndex, previoushash, nextTimestamp, merkleRoot, difficulty) {
    var nonce = 0;
    while (true) {
        var hash = ut.SHA256([currentVersion, nextIndex, previoushash, nextTimestamp, merkleRoot, difficulty, nonce]);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new BlockHeader(currentVersion, nextIndex, previoushash, nextTimestamp, merkleRoot, difficulty, nonce);
        }
        nonce++;
    }
}

async function addBlock(blockchain, newBlock) {
    if (isValidNewBlock(newBlock, await blockchain.latestBlock())) {
        try { await newBlock.save(); } catch (err) { throw err; }
        await blockchain.update(newBlock.hash());
        try { await blockchain.save(); } catch (err) { throw err; }
        return true;
    }
    return false;
}

// addBlock + mineBlock ?
async function mineBlock(blockchain, blockData) {
    const newBlock = await generateNextBlock(blockchain, blockData);

    if (await addBlock(blockchain, newBlock)) {
        const nw = require("./network");

        nw.broadcast(await nw.responseLatestMsg());
        return newBlock;
    }
    else {
        return null;
    }
}

function hashMatchesDifficulty(hash, difficulty) {
    const hashBinary = ut.hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty);
    return hashBinary.startsWith(requiredPrefix);
}

const BLOCK_GENERATION_INTERVAL = 10; // in seconds
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10; // in blocks

async function getDifficulty(blockchain) {
    const latestBlock = await blockchain.latestBlock();
    if (latestBlock.header.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.header.index !== 0) {
        return await getAdjustedDifficulty(blockchain, latestBlock);
    }
    return latestBlock.header.difficulty;
}

async function getAdjustedDifficulty(blockchain, block) {
    const offset = block.header.index - DIFFICULTY_ADJUSTMENT_INTERVAL;
    const prevAdjustmentBlock = await blockchain.indexed(offset);
    const timeTaken = block.header.timestamp - prevAdjustmentBlock.header.timestamp;
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
    return typeof (block.header.version) === 'string'
        && typeof (block.header.index) === 'number'
        && typeof (block.header.previousHash) === 'string'
        && typeof (block.header.timestamp) === 'number'
        && typeof (block.header.merkleRoot) === 'string'
        && typeof (block.header.difficulty) === 'number'
        && typeof (block.header.nonce) === 'number'
        && typeof (block.data) === 'object';
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
    else if (
        (newBlock.data.length !== 0 && (merkle("sha256").sync(newBlock.data).root() !== newBlock.header.merkleRoot))
        || (newBlock.data.length === 0 && ('0'.repeat(64) !== newBlock.header.merkleRoot))
    ) {
        console.log("Invalid merkleRoot");
        return false;
    }
    else if (!isValidTimestamp(newBlock, previousBlock)) {
        console.log("Invalid timestamp");
        return false;
    }
    else if (!hashMatchesDifficulty(newBlock.hash(), newBlock.header.difficulty)) {
        console.log("Invalid hash: " + newBlock.hash());
        return false;
    }
    return true;
}

async function isValidChain(blockchain) {
    const firstBlock = await blockchain.indexed(0);
    if (firstBlock.equals(getGenesisBlock())) {
        return false;
    }

    var tempBlocks = [blockchain[0]];
    for (var i = 1; i < blockchain.length; i++) {
        if (isValidNewBlock(blockchain[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchain[i]);
        }
        else { return false; }
    }

    var bci = blockchain.iterator();
    var tempBlock = ut.deepCopy(bci.prev());
    for (var b = await bci.prev(); b !== undefined; b = await bci.prev()) {
        if (isValidNewBlock(tempBlock, b)) {
            tempBlock = ut.deepCopy(b);
        }
        else { return false; }
    }

    return true;
}

async function replaceChain(blockchain, newBlockchain) {
    if (!await isValidChain(newBlockchain)
        || (await newBlockchain.compare(blockchain) < 0)
        || ((await newBlockchain.compare(blockchain) === 0) && !random.boolean())) {
        console.log("Received blockchain invalid");
    }
    else {
        const nw = require("./network");

        console.log("Received blockchain is valid. Replacing current blockchain with received blockchain");
        blockchain.update(newBlockchain.latestBlockHash);
        nw.broadcast(await nw.responseLatestMsg());
    }
}

module.exports = {
    initBlockchain,
    getBlockchain,
    getLatestBlock,
    addBlock,
    mineBlock,
    replaceChain
};
