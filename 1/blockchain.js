class Block {   //add diificulty,nonce
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;

    }

}
class Blockchain {
    constructor() {
        /*import * as CryptoJS from 'crypto-js';
        console.log('%s', CryptoJS.SHA256(0 + '' + 1535165503 + 'Genesis block').toString());
        */
        const genesisBlock = new Block(0, 'a12eab42aa059b74b1ee08310a88b56e64c3d90cf803445250dc2f209833d6d2', '', 1535165503, 'Genesis block')
        this.chain = [genesisBlock];

    }

    calculateHashForBlock=function(index,previousHash,timestamp,data){
        hash=CryptoJS.SHA256(index+previousHash+timestamp+data).toString();
        return hash;
    }

}

