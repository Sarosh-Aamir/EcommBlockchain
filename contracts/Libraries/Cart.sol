// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

library Cart {
    struct CartStruct {
        string cartId;
        string buyerId;
        bool orderProcessed;
        bool isActive;
    }

}
