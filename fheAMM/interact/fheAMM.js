const { createInstance } = require("fhevmjs");
const { Wallet, JsonRpcProvider, Contract } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const contractInfo = require("./abi/fheAMM.json");

const provider = new JsonRpcProvider(`https://devnet.zama.ai/`);

let _instance;
const CONTRACT_ADDRESS = process.env.AMM;

const getInstance = async () => {
  if (_instance) return _instance;

  // 1. Get chain id
  const network = await provider.getNetwork();

  const chainId = +network.chainId.toString();

  // Get blockchain public key
  const publicKey = await provider.call({
    to: "0x0000000000000000000000000000000000000044",
  });

  // Create instance
  _instance = createInstance({ chainId, publicKey });
  return _instance;
};

const createPool = async (signerAddr, token0, token1) => {
  const signer = new Wallet(signerAddr, provider);

  // Initialize contract with ethers
  const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
  // Get instance to encrypt amount parameter
  const instance = await getInstance();

  const transaction = await contract["createPool(address,address)"](
    token0,
    token1
  );
  return transaction;
};

const swap = async (signerAddr, amount, tokenIn, pid) => {
    const signer = new Wallet(signerAddr, provider);
  
    // Initialize contract with ethers
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    // Get instance to encrypt amount parameter
    const instance = await getInstance();
    const encryptedAmount = instance.encrypt32(amount);


    const transaction = await contract["swap(bytes,address,uint)"](
        encryptedAmount,
      tokenIn,
        pid
      );
    return transaction;
  };

  
  const addLiquidity = async (signerAddr, pid, amountToken0, amountToken1) => {
    const signer = new Wallet(signerAddr, provider);
  
    // Initialize contract with ethers
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    // Get instance to encrypt amount parameter
    const instance = await getInstance();
    const encryptedAmount0 = instance.encrypt32(amountToken0);
    const encryptedAmount1 = instance.encrypt32(amountToken1);


    const transaction = await contract["addLiquidity(uint,bytes,bytes)"](
      pid,
    encryptedAmount0,
    encryptedAmount1
    );
    return transaction;
  };
  module.exports =  {
    createPool,
    addLiquidity,
    swap
  }
