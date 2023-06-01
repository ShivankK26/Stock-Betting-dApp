//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StockPrediction {
    address public owner;
    uint256 public predictionStartTime;
    uint256 public predictionEndTime;
    int public currentPrice; // Allows for negative numbers using `int`

    mapping(address => int) public bets;
    address[] public bettors; // Array of all bettors.
    mapping(address => uint256) public betAmounts; // People who are betting we're going to be mapping the IDs of Bettors to these addresses and then the amount how much they betted will also be mapped to these addresses 

    uint256 public lastCheckedTime;
    bool public isBettingActive;
    address public lastWinner; // We'll be saving the last winner. 

    struct Bet { 
        address bettor;
        int amount;
    }

    struct BetInfo { // We'll be saving the bettor, bettor's address, and the amount so it could be positive and negative as well and then the bettor info again.
        address bettor;
        int amount;
        uint256 betAmount;
    }

    constructor() {
        owner = msg.sender;
        predictionEndTime = block.timestamp + 5 minutes; // Here 5 minutes means that after the contract is deployed the user will maximum 5 minutes to bet on the app.
        isBettingActive = false;
    }


    // Creating functions
    
    function getAllBets() public view returns (BetInfo[] memory) { // It will fetch all the bets which we have made currently. Through this we'll get all the bets.
        BetInfo[] memory allBets = new BetInfo[](bettors.length); // It will return the BetInfo array from the memory. 
        for(uint256 i = 0; i < bettors.length; i++){ // We'll be looping through allBets and then we're going to save all the attributes into allBets
            allBets[i].bettor = bettors[i]; 
            allBets[i].amount = bets[bettors[i]]; 
            allBets[i].betAmount = betAmounts[bettors[i]]; // We're going to save the amount of every single bet as we'll be later using them
        }
        return allBets;
    }


    function startPrediction(int _currentPrice) public {
        require(msg.owner == owner, "Only owner can start the prediction.");
        currentPrice = _currentPrice;
        predictionStartTime = block.timestamp;
        predictionEndTime = block.timestamp + 5 minutes;
        isBettingActive= true;
    }


    function enterBet(int _prediction) public payable {
        require(block.timestamp < predictionEndTime, 'Prediction has ended.');
        require(msg.value >= 0.0001 ether, 'Minimum bet amount is 0.0001 ETH.'); // This is the criteria which we're setting on our own wish.
        bets[msg.sender] = _prediction;
        bettors.push(msg.sender);
        betAmounts[msg.sender] = msg.value;
    }

    // Finalize Prediction


    function finalizePrediction(int _currentPrice) public {
        require(block.timestamp >= predictionEndTime, "Prediction has not ended ");
        require(isBettingActive, "Prediction is not active");


        currentPrice = _currentPrice;


        int closestPrediction = bets[bettors[0]];
        uint closestDistance = abs(currentPrice, closestPrediction);
        address payable winner = payable(bettors[0]);

        for(uint = 1; i < bettors.length; i++){
            int prediction = bets[bettors[i]];
            uint distance = abs(currentPrice, prediction);
            if (distance < closestDistance) {
                closestPrediction = prediction;
                closestDistance = distance;
                winner = payable(bettors[i]);
            } 
        }


        uint pool = address(this).balance;
        require(pool > 0, 'Pool is empty.');
        require(winner != address(0), 'No winner found.');
        winner.transfer(pool);
        lastWinner = winner;


        // Reset

        predictionStartTime = 0;
        predictionEndTime = 0;
        currentPrice = 0;
        isBettingActive = false;

        for(uint i = 0; i < bettors.length; i++){
            bets[bettors[i]] = 0;
        }

        bettors = new address[](0);
    }


    // Creating helper functions
    

    function resetLastWinner() public {
        require(msg.sender == owner, "Only owner can reset the last winner.");
        lastWinner = address(0);
    }


    function isPredictionOver() public view returns(bool) {
        if (block.timestamp >= predictionEndTime) {
            return true;
        } 
          return false;  
        }


    function getPoolAmount() public view returns(uint){
        return address(this).balance;
    }


    function abs(int x, int y) internal pure returns(uint) {
        return x >= y ? uint(x - y) : uint(y - x);
    }   
}
