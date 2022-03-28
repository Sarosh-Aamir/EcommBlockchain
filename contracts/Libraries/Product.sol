// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library Product {

    struct ProductStruct {
        string id;
        string sku;
        uint inStock;
        string supplierId;
        string metaDataURI;
        uint supplierPrice;
        uint merchantPrice;
        bool isActive;

    }
}