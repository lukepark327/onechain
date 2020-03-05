"use strict";
import { deepCopy } from "./modules"; // utils
import { SHA256 } from "./modules"; // crypto
// import { db } from "./modules"; // database

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
        return this._previousHash.toUpperCase(); // always return upper case letters.
    }

    /**
     * @param {string} newPreviousHash
     */
    set previousHash(newPreviousHash) {
        this._previousHash = newPreviousHash;
    }

    hash() {
        return SHA256([
            this.version,
            this.index,
            this.previousHash,
            this.timestamp,
            this.merkleRoot,
            this.difficulty,
            this.nonce
        ]);
    }

    /**
     * TODO
     */
    // print()
}

class Block {
    constructor(header, data) {
        this.header = deepCopy(header);
        this.data = deepCopy(data);
    }

    hash() {
        return this.header.hash();
    }

    encode() {
        return JSON.stringify(this);
    }

    decode(encodedBlock) {
        decodedBlock = JSON.parse(encodedBlock);
        objectifiedBlock = Object.assign(new Block(), decodedBlock);
        objectifiedBlock.header = Object.assign(new BlockHeader(), objectifiedBlock.header);
        return objectifiedBlock;
    }

    /**
     * TODO
     */
    // save()
    // load()
    // print()
}

class BlockchainIterator {
    constructor(currentBlockHash) {
        this._currentBlockHash = currentBlockHash;
    }

    get currentBlockHash() {
        return this._currentBlockHash.toUpperCase(); // always return upper case letters.
    }

    /**
     * @param {string} newCurrentBlockHash
     */
    set currentBlockHash(newCurrentBlockHash) {
        this._currentBlockHash = newCurrentBlockHash;
    }

    /**
     * TODO
     */
    // async prev() {
    //     const aBlock = await new Block().load(this.currentBlockHash);
    //     if (aBlock === undefined) { return undefined; }

    //     this.currentBlockHash = aBlock.header.previousHash;
    //     return aBlock;
    // }
}

class Blockchain {
    constructor(latestBlock) {
        this.latestBlock = ut.deepCopy(latestBlock);
    }

    update(newLatestBlock) {
        this.latestBlock = ut.deepCopy(newLatestBlock);
    }

    latestBlockHash() {
        return this.latestBlock.hash();
    }

    length() {
        if (this.latestBlock === undefined) { return 0; }
        return this.latestBlock.header.index + 1; // block index starts from '0'.
    }

    /**
     * TODO
     */
    // iterator()
    // asArray()
    // indexWith()
    // encode()
    // decode()
    // load()
    // save()
    // print()
}

export default {
    BlockHeader,
    Block,
    Blockchain
};
