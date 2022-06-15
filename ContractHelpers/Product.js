import EcommContractJSON from "../ContractHelpers/EcommContract.json";
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import {BigNumber} from "ethers";
import Moralis from "moralis";

export const Product = () => {
    const {runContractFunction} = useWeb3Contract();
    const {fetch} = useWeb3ExecuteFunction();
    const CONTRACT_ABI = EcommContractJSON.EcommContract.contractABI;
    const CONTRACT_ADDRESS = EcommContractJSON.EcommContract.contractAddress;
    const contractOptions = {abi: CONTRACT_ABI, contractAddress: CONTRACT_ADDRESS}
    const PRODUCT_METHODS = {
        /**
         *
         * @param props{{id,sku,metaDataUri,merchantId,supplierId,inStock,supplierPrice,merchantPrice,}}
         * @return props
         */
        addProduct: (props) => {
            console.log(props)
            let mc = BigNumber.from(props.merchantPrice);
            const options = {
                functionName: 'addProduct',
                params: {
                    id: props.id || 'b',
                    sku: props.sku,
                    inStock: BigNumber.from(props.inStock),
                    merchantPrice: BigNumber.from(props.merchantPrice),
                    supplierPrice: BigNumber.from(props.supplierPrice),
                    supplierId: props.supplierId || 'b',
                    metaDataURI: props.metaDataUri || false
                }
            }
            return fetch({throwOnError: true, params: {...options, ...contractOptions}})

        },
        productCount: async () => {
            let count = 0;
            try {
                const sellersCountOptions = {
                    functionName: "productsCount",
                }
                let options = {...contractOptions, ...sellersCountOptions}
                let res = await runContractFunction({throwOnError: true, params: options});
                count = res.toNumber();
                console.log('ProductCount', count)
            } catch (e) {
                console.log(e);
            } finally {
                return count;
            }

        },
        productIds: async () => {
            let ids = [];

            try {
                let count = await PRODUCT_METHODS.productCount();
                console.log(count);
                for (let i = 0; i < count; i++) {
                    const productIdsOptions = {
                        functionName: "productIds",
                        params: {'': i}
                    }
                    let id = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...productIdsOptions}
                    });
                    console.log('productIds:id:push', id);
                    ids.push(id);

                }
            } catch (e) {
                console.log('e', e);

            } finally {
                return ids;
            }


        },
        productList: async () => {
            let products = [];
            try {
                let ids = await PRODUCT_METHODS.productIds();
                for (let i = 0; i < ids.length; i++) {
                    const funcOptions = {
                        functionName: "products",
                        params: {'': ids[i]}
                    }
                    let product = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...funcOptions}
                    });
                    products.push(product);

                }
            } catch (e) {
                console.log(e);
            } finally {
                return products;
            }

        },
        getProduct: async (id) => {
            let productFromChain = null;
            try {
                let ids = await PRODUCT_METHODS.productIds();

                const funcOptions = {
                    functionName: "products",
                    params: {'': id}
                }
                let product = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });
                productFromChain = product;
            } catch (e) {
                console.log(e);
            } finally {
                return productFromChain;
            }

        },
        addToCart: async (cartId, productId) => {
            let hasAdded = false;
            try {
                const funcOptions = {
                    functionName: "addToCart",
                    params: {cartId: cartId, productId: productId}
                }
                hasAdded = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });
            } catch (e) {
                console.log(e);
            } finally {
                return hasAdded;
            }
        },
        cartInit: async (cartId, buyerId) => {
            let isInit = false;
            try {
                const funcOptions = {
                    functionName: "initializeBuyerCart",
                    params: {cartId: cartId, buyerId: buyerId}
                }
                isInit = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });
            } catch (e) {
                console.log(e);
            } finally {
                return isInit;
            }
        },
        getCartId: async (buyerId) => {
            let cartId = '';
            try {

            } catch (e) {

            } finally {

            }

        },


        getCartProductsCount: async (cartId) => {
            let count = 0
            try {

                const funcOptions = {
                    functionName: "cartProductsCount",
                    params: {'': cartId}
                }

                count = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });

            } catch (e) {
                console.log(e);
            } finally {
                return count;
            }
        },
        getCartProducts: async (cartId) => {
            let products = [];
            try {
                let cartCount = await PRODUCT_METHODS.getCartProductsCount(cartId);
                console.log(`Cart ID: ${cartId} Count`, cartCount.toNumber());
                if (!!cartCount) {
                    cartCount = cartCount.toNumber();
                    for (let c = 0; c < cartCount; c++) {
                        const funcOptions = {
                            functionName: "getCartProductId",
                            params: {'cartId': cartId, index: c}
                        }

                        let product = await runContractFunction({
                            throwOnError: true,
                            params: {...contractOptions, ...funcOptions}
                        });
                        products.push(product);

                    }
                }


            } catch (e) {
                console.log(e);
            } finally {
                return products;
            }
        },


        checkout: async (orderId, buyerId, cartId, totalPaid) => {
            let res = null;
            try {
                const funcOptions = {
                    functionName: "checkout",
                    params: {'orderId': orderId, 'buyerId': buyerId, 'cartId': cartId, 'totalPaid': totalPaid},
                    msgValue: Moralis.Units.ETH(totalPaid)
                }

                res = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });


            } catch (e) {
                console.log(e);
            } finally {
                return res;
            }

        }
    }

    return PRODUCT_METHODS;


}