
# fheEVM from ZAMA

testing function about fhEVM created by zama.



## Projects
- fheAMM: decentralized exchange (DEX) with encryption FHE.
## Demo:

    cd fheEVM

- `interact`: to interact with smart contract using Nodejs.
- `solidity`: hardhat smart contrat.
You must fill the `.env` file with the `.env.example` in folder `interact` and `solidity` directories.

### Step1
 If you deploy EncryptedERC20 you need to add information about token (name, symbol, decimal) in constructor in `deployERC20.js`
You must deploy two tokens using the encryptedERC20 smart contract with this command: 
- `cd solidity`
- `npm i`
- `npx hardhat compile` 
- `npx hardhat run --network zama deploy/deployERC20.js`

After that you need to call mint function present in file `ERC20.js` or call function `createSupply` directly from `index.js`

### Step2

Once the tokens are deployed, it is now necessary to deploy the AMM contract:
- `cd solidity`
- `npx hardhat run --network zama deploy/deploy.js`

### Step3
go to folder `interact`:
- `npm i`
- `node index.js`
You can call the `start` function in the `index.js`; it will approve the tokens, create a pool with the two tokens, then add liquidity, and finally swap.
## Tech Stack

**Client:** Nodejs

**Blockchain:** fheEVM (Zama), Solidity, Hardhat
## Authors

- [@jecombe](https://github.com/jecombe)

