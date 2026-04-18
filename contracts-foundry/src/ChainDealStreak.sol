// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChainDealStreak {
    mapping(address => uint256) public lastClearDay;
    mapping(address => uint256) public streak;

    event DayCleared(address indexed player, uint256 day, uint256 newStreak);

    /// @notice Record today's clear. Reverts if already recorded today.
    function clearDay() external {
        uint256 today = block.timestamp / 86400;
        uint256 last  = lastClearDay[msg.sender];
        require(last != today, "Already cleared today");

        uint256 next = (last + 1 == today) ? streak[msg.sender] + 1 : 1;
        streak[msg.sender]       = next;
        lastClearDay[msg.sender] = today;

        emit DayCleared(msg.sender, today, next);
    }

    /// @notice Returns (streak, lastClearDay) for a player.
    function getStreak(address player) external view returns (uint256, uint256) {
        return (streak[player], lastClearDay[player]);
    }
}
