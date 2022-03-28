//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Strings.sol";

library Seller {

    uint public constant GUARANTEE_AMOUNT = 5;
    struct SellerStruct{
        string id;
        string name;
        string email;
        address sellerAddress;
        bool isSupplier;
        bool isActive;
        bool isRegistered;
        bool hasPaidGuarantee;
        uint guranteePaid;

    }

    function hasPaidGurantee(SellerStruct storage seller) public view returns (bool hasPaid) {
        if (seller.hasPaidGuarantee && seller.guranteePaid >= GUARANTEE_AMOUNT){
            hasPaid = true;
        }
        else hasPaid = false;
    }

    function getGuaranteeFeeErrMsg() external pure returns (string memory message){

        message = string(abi.encodePacked("Please Pay ",Strings.toString(GUARANTEE_AMOUNT)," ","Eth To Register"));


    }

}