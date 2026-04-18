// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ChainDealClears} from "../src/ChainDealStreak.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        ChainDealClears c = new ChainDealClears();
        console.log("ChainDealClears deployed at:", address(c));
        vm.stopBroadcast();
    }
}
