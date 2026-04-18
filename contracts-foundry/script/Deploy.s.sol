// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ChainDealStreak} from "../src/ChainDealStreak.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        ChainDealStreak c = new ChainDealStreak();
        console.log("ChainDealStreak deployed at:", address(c));
        vm.stopBroadcast();
    }
}
