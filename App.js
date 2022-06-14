import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/sunFlowerPortal.json";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allFlowers, setAllFlowers] = useState([]);
  const contractAddress = "0x0x0x0x0x0x0xx0x0x0x0x0x";
  const contractABI = abi.abi;
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        
      }
      getAllFlowers();
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    } catch (error) {
      console.log(error)
    }
  }

  const sendFlower = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const sunFlowerPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await sunFlowerPortalContract.getTotalFlowers();
        console.log("Retrieved total flower count...", count.toNumber());

        /*
        * Execute the actual sendFlower from your smart contract
        */
        const flowerTxn = await sunFlowerPortalContract.sendFlower(document.getElementById("music-link").value, { gasLimit: 300000 });
        console.log("Mining...", flowerTxn.hash);

        await flowerTxn.wait();
        console.log("Mined -- ", flowerTxn.hash);

        count = await sunFlowerPortalContract.getTotalFlowers();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
        
}

    const getAllFlowers = async () => {
    try {
      
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sunFlowerPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllFlowers method from your Smart Contract
         */
        const flowers = await sunFlowerPortalContract.getAllFlowers();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let flowersCleaned = [];
        flowers.forEach(flower => {
          console.log(flower);
          flowersCleaned.push({
            address: flower.sender,
            timestamp: new Date(flower.timestamp * 1000),
            message: flower.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllFlowers(flowersCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let flowerPortalContract;
    const onNewFlower = (from, timestamp, message) => {
      console.log("new flower", from, timestamp, message);
      setAllFlowers(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        }
      ]);
    };

    if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    flowerPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    flowerPortalContract.on("NewFlower", onNewFlower);
  }

  return () => {
    if (flowerPortalContract) {
      flowerPortalContract.off("NewFlower", onNewFlower);
    }
  };
  }, []);

  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there, Sunshine!
        </div>

        <div className="bio">
        My name is Heli and I love to code. I am learning blockchain development. Send 🌻 to motivate me :) <br/> It would be awesome if you can send your favourite song URL from Spotify. I would love to listen it while coding.
        </div>
        <input
            type="text"
            id="music-link"
            placeholder="paste the song URL from Spotify"
         />
        <button className="waveButton" onClick={sendFlower}>
          Send 🌻 to Heli
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
<div className="bio">You can win some Ethereum if you will send me a flower!!</div>
      {allFlowers.map((flower, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {flower.address}</div>
              <div>Time: {flower.timestamp.toString()}</div>
              <div>Message: {flower.message}</div>
            </div>)
        })}
        
      </div>
    </div>
  );
}
export default App

