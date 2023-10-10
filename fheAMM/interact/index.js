const { getBalance, approve } = require("./ERC20");
const { createPool, addLiquidity, swap } = require("./fheAMM");
const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

const dotenv = require("dotenv");

const signer = process.env.SECRET;
const token0 = process.env.TOKEN0;
const token1 = process.env.TOKEN1;
const amm = process.env.AMM;

const approves = async (amount) => {
  try {
    await approve(signer, amm, amount, token0);
    await approve(signer, amm, amount, token1);
  } catch (error) {
    return error;
  }
};
const start = async () => {
  try {
    const balanceToken0 = await getBalance(signer, token0);
    const balanceToken1 = await getBalance(signer, token1);
    await sleep(1000);
    console.log("token0 => ", balanceToken0);
    console.log("token1 => ", balanceToken1);

  //   await approves(200);
  //   console.log('APPROVES OK');
  // //  await sleep(1000);

  //   const pool = await createPool(signer, token0, token1);
  //   console.log(pool, 'POOL OK');
  //   await sleep(5000);

  //    const liquidity = await addLiquidity(signer, 0, 10, 10);
  //    console.log(liquidity, 'LIQUIDITY OK');
  //  await sleep(5000);
    //  const repSwap  = await swap(signer, 10, token1, 0);
    //  console.log(repSwap, 'SWAP OK');
  } catch (error) {
    console.log(error);
  }
};

start();
