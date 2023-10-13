const { createInstance } = require("fhevmjs");
const { Wallet, JsonRpcProvider, Contract } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const contractInfo = require("./abi/EncryptedERC20.json");

const provider = new JsonRpcProvider(`https://devnet.zama.ai/`);

let _instance;

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

const mint = async (tokenAddr, signerAddr, amount) => {
  const signer = new Wallet(signerAddr, provider);

  // Initialize contract with ethers
  const contract = new Contract(tokenAddr, contractInfo, signer);
  // Get instance to encrypt amount parameter
  const instance = await getInstance();
  const encryptedAmount = instance.encrypt32(amount);

  const transaction = await contract["mint(bytes)"](encryptedAmount);
  return transaction;

}

const approve = async (signerAddr, contractAddr, amount, tokenAddr) => {
  const signer = new Wallet(signerAddr, provider);

  // Initialize contract with ethers
  const contract = new Contract(tokenAddr, contractInfo, signer);
  // Get instance to encrypt amount parameter
  const instance = await getInstance();
  const encryptedAmount = instance.encrypt32(amount);

  const transaction = await contract["approve(address,bytes)"](contractAddr, encryptedAmount);
  return transaction;
};

const getBalance = async (signerAddr, tokenAddr) => {
  const signer = new Wallet(signerAddr, provider);

  // Initialize contract with ethers
  const contract = new Contract(tokenAddr, contractInfo, signer);

  // Get instance to encrypt amount parameter
  const instance = await getInstance();

  // Generate token to decrypt
  const generatedToken = instance.generateToken({
    verifyingContract: tokenAddr,
  });

  // Sign the public key
  const signature = await signer.signTypedData(
    generatedToken.token.domain,
    { Reencrypt: generatedToken.token.types.Reencrypt }, // Need to remove EIP712Domain from types
    generatedToken.token.message,
  );
  instance.setTokenSignature(tokenAddr, signature);

  // Call the method
  const encryptedBalance = await contract.balanceOf(generatedToken.publicKey, signature);

  // Decrypt the balance
  const balance = instance.decrypt(tokenAddr, encryptedBalance);
  return balance;
};

module.exports = {
  getBalance,
  approve,
  mint
};
