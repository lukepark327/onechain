const CryptoJS = require("crypto-js");

const BLOCK_GENERATION_INTERVAL=10;
const DIFFICULTY_ADJUSTMENT_INTERVAL=10;

class Block {   //add difficulty,nonce
    constructor(index, hash, previousHash, timestamp, data, difficulty, nonce) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;

    }
    
}

Block.isValidBlockStructure = function(Block){
    return typeof block.index === 'number'
    && typeof block.hash === 'string'
    && typeof block.previousHash === 'string'
    && typeof block.timestamp === 'number'
    && typeof block.data === 'object'
}

Block.calculateHashForBlock=function(index, previousHash, timestamp, data, difficulty, nonce){
    hash = CryptoJS.SHA256(index+previousHash+timestamp+data+difficulty+nonce).toString();
    return hash;
}

Block.isValidBlock = function(previousBlock){  //newBlock ->this
    if(!this.isValidBlockStructure()){  //타입 미스
        console.log('invalid block structure %s', JSON.stringify(this));  //여기 수정 중
        return false;
    }
    if(previousBlock.index+1 !== this.index){  //내용 미스
        console.log('invalid index');
        return false;
    }else if(previousBlock.hash !== this.previousHash){
        console.log('invalid previousHash');
        return false;
    }else if(calculateHashForBlock(this) !== this.hash){
        console.log('invalid hash\n'+'Hash:'+this.hash+'\ncalculated hash:'+calculateHashForBlock(this));
        return false;
    }
}

Block.hashMatchesDifficulty = function(hash, difficulty){
    const hashInBinary= parseInt(hash,16).toString(2);  //hash in hex to binary
    const requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
}

BLock.findBlock=function(index, previousHash, timestamp, data, difficulty){

    let nonce=0;
    while(ture){
        const hash=this.calculateHashForBlock(index, previousHash, timestamp, data,difficulty,nonce)  
        if (this.hashMatchesDifficulty(hash,difficulty)){
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++
    }
}

class Blockchain {
    constructor() {
        /*
        import * as CryptoJS from 'crypto-js';
        console.log('%s', CryptoJS.SHA256(0 + '' + 1535165503 + 'Genesis block').toString());
        */
        const genesisBlock = new Block(0, '1c9c452672569e58c48b50ea4828ea00e4cc2df8c2431f705856b797b1bcb882', '', 1535165503, 'Genesis block',0,0)
        this.chain = [genesisBlock];

    }

}



Blockchain.generateNextBlock = function(data){  
    index = this.chain.length;
    previousHash = this.chain[length-1].hash;
    timestamp = Math.round(new Date().getTime()/1000);
    data = data;  //이거는 transactionLIst 거래내역임 나중에 리스트로 바꿔도 될 듯
    nextBlock = findBlock(index, previousHash, timestamp, data, difficulty);

    this.chain.push(nextBlock);
    return nextBlock;
}

Blockchain.isValidChain = function(){
    const isValidGenesis = function(block) {
        return JSONstringify(block) === JSON.stringify(genesisBlock); 
    }

    if(!isValidGenesis(this.chain[0])){
        return false;
    }
    for(let i=1;i<this.chain.length;i++){
        if(!this.chain[i].isValidBlock(this.chain[i-1])){
            return false;
        }
    }
    //hashmatchesDifficulty

    return true;
}

Blockchain.getdifficulty = function(){
    const latestBlock=this.chain[this.chain.length-1];
    if(latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0&&latestBlock.index !== 0){
        return getAdjustedDifficulty(latestBlock);
    }else{
        return latestBlock.difficulty;
    }
}

Blockchain.getAdjustedDifficulty = function(latestBlock){
    const preAdjustmentBLock=this.chain[this.chain.length-DIFFICULTY_INTERVAL];
    const timeExpected =BLOCK_GENERATION_INTERVAL*DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken=latestBlock.timestamp-preAdjustedBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    }
    else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficulty - 1;
    }
    else {
        return prevAdjustmentBlock.difficulty;
    }
}
