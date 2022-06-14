const { hexStripZeros } = require("ethers/lib/utils")

const main = async() =>{
    
    //compile the contract and generate the necessary files we need to work with our contract under the artifacts directory
    const flowerContractFactory = await hre.ethers.getContractFactory("sunFlowerPortal");
    //hardhat will create a local ethereum network just for this contract. 
    const flowerContract = await flowerContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    //wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy.
    await flowerContract.deployed();
    //give us the address of the deployed contract
    console.log("contract is deployed to: ", flowerContract.address);

    //get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(flowerContract.address);
    console.log("Contract balace: ", hre.ethers.utils.formatEther(contractBalance));

    let flowerCount;
    flowerCount = await flowerContract.getTotalFlowers();
    console.log(flowerCount.toNumber());

    const sendFlowerTxn = await flowerContract.sendFlower("First Flower");
    await sendFlowerTxn.wait();

    const sendFlowerTxn2 = await flowerContract.sendFlower("Second Flower");
    await sendFlowerTxn2.wait();

    //get contract balance after send Flower
    contractBalance = await hre.ethers.provider.getBalance(flowerContract.address);
    console.log("Contract balance after Txn: ", hre.ethers.utils.formatEther(contractBalance));

    let allFlowers = await flowerContract.getAllFlowers();
    console.log(allFlowers);

};

const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
};

runMain();
