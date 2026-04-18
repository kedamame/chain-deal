// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChainDealClears {
    mapping(address => uint256) public lastClearDay;
    mapping(address => uint256) public totalClears;

    event DayCleared(address indexed player, uint256 day, uint256 total);

    /// @notice Record today's clear. Reverts if already recorded today.
    function clearDay() external {
        uint256 today = block.timestamp / 86400;
        require(lastClearDay[msg.sender] != today, "Already cleared today");

        totalClears[msg.sender] += 1;
        lastClearDay[msg.sender] = today;

        emit DayCleared(msg.sender, today, totalClears[msg.sender]);
    }

    /// @notice Returns (totalClears, lastClearDay) for a player.
    function getClears(address player) external view returns (uint256, uint256) {
        return (totalClears[player], lastClearDay[player]);
    }
}
