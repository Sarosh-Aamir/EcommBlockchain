// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Libraries/Helpers.sol";
import "./Libraries/Product.sol";
import "./Libraries/Seller.sol";
import "./Libraries/Buyer.sol";
import "./Libraries/Cart.sol";
import "./Libraries/Order.sol";


contract Ecomm {
    //owner
    address public owner;

    /*
    Escrow Account Address
    */

    address public escrowAccountAddress;

    //Seller State Variables
    Seller.SellerStruct[] public merchants;
    Seller.SellerStruct[] public suppliers;
    mapping(string => Seller.SellerStruct) public sellers;
    mapping(string => Product.ProductStruct[]) public sellerProductsMapping;
    string [] public sellerIds;
    uint public sellersCount;
    uint public merchantsCount;
    uint public suppliersCount;


    //Product State Variables
    mapping(string => Product.ProductStruct) public products;
    mapping(string => Product.ProductStruct[]) public childMatrixItems;
    uint public productsCount;
    string [] public productIds;



    //Buyer
    mapping(string => Buyer.BuyerStruct) public buyers;
    mapping(string => Cart.CartStruct) public buyerCart;
    uint public buyersCount;
    string [] public buyerIds;


    //Cart State Variables
    mapping(string => Cart.CartStruct) public carts;
    mapping(string => Product.ProductStruct[]) public cartProducts;
    mapping(string => uint) public cartProductsCount;
    uint totalCarts;

    //Order State Variables
    mapping(string => Order.OrderStruct) public orders; //orderId => OrderStruct
    mapping(string => Order.OrderStruct[]) public buyerOrders; //buyerId => OrderStruct[]
    mapping(string => uint) public buyerOrdersCount; //buyerId=>OrderStruct[].length
    mapping(string => string) public orderTracking; //orderId => tracking url
    string []  public orderIds;
    uint public totalOrders;


    constructor(address _owner, address _escrowAccountAddress){
        owner = _owner;
        escrowAccountAddress = _escrowAccountAddress;
    }



    /**
    Check Guarantee Amount
    Transfer Token
    Register Seller
    */
    function registerSeller(string memory id, string memory name, string memory email, bool isSupplier) public payable returns (bool hasRegistered){
        //Check if token is enough for the registration
        require(Helpers.toEth(msg.value) == Seller.GUARANTEE_AMOUNT, Seller.getGuaranteeFeeErrMsg());
        (bool success,) = owner.call{value : msg.value}("");
        require(success, "Transaction Failed. Cannot Register");
        Seller.SellerStruct memory seller = Seller.SellerStruct(
            id,
            name,
            email,
            msg.sender,
            isSupplier,
            true,
            true,
            true,
            Helpers.toEth(msg.value)
        );
        sellers[id] = seller;
        hasRegistered = true;
        isSupplier ? suppliers.push(seller) : merchants.push(seller);
        isSupplier ? suppliersCount++ : merchantsCount++;
        sellerIds.push(id);
        sellersCount++;
    }

    function addProduct(string memory id,
        string memory sku,
        uint inStock,
        string memory supplierId,
        string memory metaDataURI,
        uint supplierPrice,
        uint merchantPrice
    ) external returns (bool isCreated){
        require(sellers[supplierId].isActive, "Seller Is Inactive Or Not Created");
        Product.ProductStruct memory product = Product.ProductStruct(
            id,
            sku,
            inStock,
            supplierId,
            metaDataURI,
            supplierPrice,
            merchantPrice,
            true
        );
        products[id] = product;
        productIds.push(id);
        sellerProductsMapping[supplierId].push(product);
        isCreated = true;
        productsCount++;

    }

    function addChildProduct(string memory parentId, string memory id,
        string memory sku,
        uint inStock,
        string memory supplierId,
        string memory metaDataURI,
        uint supplierPrice,
        uint merchantPrice
    ) external returns (bool isCreated){
        require(sellers[supplierId].isActive, "Seller Is Inactive Or Not Created");
        Product.ProductStruct memory product = Product.ProductStruct(
            id,
            sku,
            inStock,
            supplierId,
            metaDataURI,
            supplierPrice,
            merchantPrice,
            true
        );
        isCreated = true;
        products[id] = product;
        productIds.push(id);
        childMatrixItems[parentId].push(product);
        sellerProductsMapping[supplierId].push(product);
        productsCount++;
    }

    function initializeBuyerCart(string memory cartId, string memory buyerId) public returns (bool isInit){
        Cart.CartStruct memory cart = Cart.CartStruct(cartId, buyerId, false, true);
        carts[cartId] = cart;
        totalCarts++;
        isInit = true;
    }

    function registerBuyer(string memory buyerId, string memory name, string memory email, string memory, string memory cartId, address buyerAddress) external returns (bool isRegistered){

        require(buyers[buyerId].isActive, "Buyer Already Exist");
        Buyer.BuyerStruct memory buyer = Buyer.BuyerStruct(buyerId, name, email, buyerAddress, true);
        initializeBuyerCart(cartId, buyerId);
        buyers[buyerId] = buyer;
        buyersCount++;
        buyerIds.push(buyerId);
        isRegistered = true;
    }


    function addToCart(string memory cartId, string memory productId) external returns (bool hasAdded){
        //Check if cart has initialized
        require(carts[cartId].isActive, "Cart Not Found, Please Initialize Cart First");
        //check if product exist
        require(products[productId].isActive, "Product Not Found");
        //add to cart
        cartProducts[cartId].push(products[productId]);
        cartProductsCount[cartId] ++;
        hasAdded = true;
    }

    function checkout(string memory orderId, string memory buyerId, string memory cartId, uint totalPaid) external payable returns (bool orderProcessed){
        require(buyers[buyerId].isActive, "Cart Not Found, Please Initialize Cart First");
        require(carts[cartId].isActive, "Cart Not Found, Please Initialize Cart First");
        require(cartProductsCount[cartId] > 0, "Cart is empty");
        require(totalPaid > 0, "0 Ethers");
        require(totalPaid == Helpers.toEth(msg.value), "Eth Amount Not Balanced");
        Order.OrderStruct memory order = Order.OrderStruct(orderId, buyerId, cartId, msg.sender, Order.OrderStatus.PENDING_FULFILLMENT, totalPaid, false, false, false, false);
        (bool success,) = escrowAccountAddress.call{value : msg.value}("");
        require(success, "Escrow Transaction Failed. Cannot Proceed With Checkout");
        orders[orderId] = order;
        buyerOrders[buyerId].push(order);
        buyerOrdersCount[buyerId]++;
        totalOrders++;
        //reset cart
        delete buyerCart[cartId];
        orderProcessed = true;
    }

    function addTrackingUrl(string memory orderId, string memory url) external {
        require(orders[orderId].orderFulfilled, "Order not fulfilled");
        orderTracking[orderId] = url;
    }

}


