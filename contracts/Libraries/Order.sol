// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

library Order {

    enum OrderStatus{
        PENDING_FULFILLMENT, FULFILLED, CANCELED, RETURNED
    }

    struct OrderStruct {
        string orderId;
        string buyerId;
        string cartId;
        address sender;
        OrderStatus orderStatus;
        uint totalPaid; //in eth
        bool isCanceled;
        bool orderFulfilled;
        bool orderReturned;
        bool isOrderClosed;
        bool orderExists;
    }

}
