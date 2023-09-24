// SPDX-License-Identifier: MIT
// This is a standard license identifier for the contract, indicating the licensing terms.
pragma solidity ^0.8.0;
// This specifies the compiler version the contract is written for.

// Importing libraries from the OpenZeppelin framework.
import "@openzeppelin/contracts/utils/math/SafeMath.sol";  // SafeMath provides arithmetic functions that prevent integer overflow and underflow.
import "@openzeppelin/contracts/access/Ownable.sol";      // Ownable provides a basic access control mechanism for contract ownership.

// Declaring the main contract.
contract GameContract is Ownable {
    // Using the SafeMath library for uint256 types. This ensures that all arithmetic operations on uint256 are safe.
    using SafeMath for uint256;
    
    // Enum to represent the state of the game. It can either be Open or Closed.
    enum GameState { Open, Closed }
    // Struct to represent a game.
    struct Game {
        string name;                                   // Name of the game.
        uint256 id;                                    // Unique identifier for the game.
        mapping(address => uint256) players;           // Mapping to store the amount staked by each player.
        uint256 stakeAmount;                           // Amount required to join the game.
        GameState state;                               // Current state of the game (Open/Closed).
        address winner;                                // Address of the winner. Initially set to the zero address.
        uint256 poolAmount;                            // Total amount staked by all players.
    }

    // Variable to keep track of the total number of games.
    uint256 public gameCount = 0;
    // Mapping from game ID to the Game struct. Allows for easy retrieval of game details using its ID.
    mapping(uint256 => Game) public games;

    // Events that the contract emits. Frontends or backends can listen to these for updates.
    event GameCreated(uint256 indexed gameId, string name);      // Emitted when a new game is created.
    event PlayerJoined(uint256 indexed gameId, address player); // Emitted when a player joins a game.
    event GameClosed(uint256 indexed gameId, address winner);   // Emitted when a game is closed.

    // Modifiers to add precondition checks to functions.
    modifier gameExists(uint256 gameId) {
        require(games[gameId].id == gameId, "Game does not exist"); // Checks if the game with the given ID exists.
        _;  // Placeholder for the modified function's body.
    }

    modifier gameOpen(uint256 gameId) {
        require(games[gameId].state == GameState.Open, "Game is not open"); // Checks if the game is in the Open state.
        _;
    }

// Function to create a new game.
function createGame(string memory _name, uint256 _stakeAmount) external onlyOwner {
    gameCount++;  // Increment the game count.

    // Assign values to the individual fields of the struct.
    games[gameCount].name = _name;
    games[gameCount].id = gameCount;
    games[gameCount].stakeAmount = _stakeAmount;
    games[gameCount].state = GameState.Open;
    games[gameCount].winner = address(0);
    games[gameCount].poolAmount = 0;

    // Emit the GameCreated event.
    emit GameCreated(gameCount, _name);
}

    // Function to allow a player to join a game.
    function joinGame(uint256 gameId) external payable gameExists(gameId) gameOpen(gameId) {
        require(msg.value == games[gameId].stakeAmount, "Incorrect stake amount");  // Ensure the sent ETH amount is correct.

        // Update the game's state: store the player's staked amount and update the pool amount.
        games[gameId].players[msg.sender] = msg.value;
        games[gameId].poolAmount = games[gameId].poolAmount.add(msg.value);

        // Emit the PlayerJoined event.
        emit PlayerJoined(gameId, msg.sender);
    }

    // Function to close a game and declare a winner.
    function closeGame(uint256 gameId, address winnerAddress) external gameExists(gameId) gameOpen(gameId) onlyOwner {
        // Set the game's state to Closed and set the winner's address.
        games[gameId].state = GameState.Closed;
        games[gameId].winner = winnerAddress;

        // Transfer the pool amount to the winner.
        payable(winnerAddress).transfer(games[gameId].poolAmount);
        // Reset the pool amount to zero.
        games[gameId].poolAmount = 0;

        // Emit the GameClosed event.
        emit GameClosed(gameId, winnerAddress);
    }
}