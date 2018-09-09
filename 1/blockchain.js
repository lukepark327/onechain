const CryptoJS = require("crypto-js");

class Block {   //add diificulty,nonce
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
    

    isValidBlockStructure = function(){}

    calculateHashForBlock = function(){}

    isValidBlock = function(){}

}

Block.isValidBlockStructure = function(Block){
    return typeof block.index === 'number'
    && typeof block.hash === 'string'
    && typeof block.previousHash === 'string'
    && typeof block.timestamp === 'number'
    && typeof block.data === 'object'
}

Block.calculateHashForBlock=function(index,previousHash,timestamp,data){
    hash = CryptoJS.SHA256(index+previousHash+timestamp+data).toString();
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


class Blockchain {
    constructor() {
        /*
        import * as CryptoJS from 'crypto-js';
        console.log('%s', CryptoJS.SHA256(0 + '' + 1535165503 + 'Genesis block').toString());
        */
        const genesisBlock = new Block(0, 'a12eab42aa059b74b1ee08310a88b56e64c3d90cf803445250dc2f209833d6d2', '', 1535165503, 'Genesis block')
        this.chain = [genesisBlock];

    }

    generateNextBlock = function(){}

    isValidChain = function(){}

}



Blockchain.generateNextBlock = function(data){  
    index = this.chain.length;
    previousHash = this.chain[length-1].hash;
    timestamp = Math.round(new Date().getTime()/1000);
    data = data;  //이거는 transactionLIst 거래내역임 나중에 리스트로 바꿔도 될 듯
    hash = calculateHashForBlock(index, previousHash, timestamp, data);
    nextBlock = new Block(index, hash, previousHash, timestamp, data);

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

    return true;
}
