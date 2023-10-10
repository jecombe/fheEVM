const main = async () => {
  const deployedContract = await ethers.deployContract("FheAMM");

  await deployedContract.waitForDeployment();

  console.log("FheAMM Contract Address:", await deployedContract.getAddress());
};
main();
