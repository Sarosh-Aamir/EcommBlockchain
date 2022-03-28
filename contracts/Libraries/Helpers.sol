//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

library Helpers {

    function toEth(uint _c) internal pure returns (uint etherValue){
        etherValue = _c / (1 ether);
    }


}