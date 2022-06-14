// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract sunFlowerPortal{
    //this variable is called a "state variable" and it's cool because it's stored permanently in contract storage.
    uint256 totalFlowers;
    uint256 private seed;
    event NewFlower(address indexed from, uint256 timestamp, string message);
    struct Flower {
        address sender; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }
    Flower[] flowers;
    //storing the address with the last time user sent flower
    mapping(address => uint256) public lastSentFlowerAt;

    constructor() payable{
        console.log("hello there! I am a flower.");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function sendFlower(string memory _message) public{
        require(
            lastSentFlowerAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait for 15 minutes!"
        );
        //update the timestamp for the user
        lastSentFlowerAt[msg.sender] = block.timestamp;
        totalFlowers += 1;
        //msg.sender is a wallet address of the person who called the function. 
        console.log("%s waved w/ message %s", msg.sender, _message);
        flowers.push(Flower(msg.sender, _message, block.timestamp));
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random generated seed: %d", seed);
        if(seed <= 50){
            console.log("%s wins!", msg.sender);
            //send prize to people who send flower
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success,)=(msg.sender).call{value:prizeAmount}("");
            require (success, "Failed to withdraw money from contract");
        }
        emit NewFlower(msg.sender, block.timestamp, _message);

    }

    function getAllFlowers() public view returns (Flower[] memory) {
        return flowers;
    }

    function getTotalFlowers() public view returns(uint256){
        if(totalFlowers > 1){
            console.log("we have collected total %s flowers!", totalFlowers);
        }
        else{
            console.log("we have collected total %s flower!", totalFlowers);
        }
        
        return totalFlowers;
    }

}
