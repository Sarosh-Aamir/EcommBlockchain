import Moralis from "moralis";
import EcommContractJSON from "../ContractHelpers/EcommContract.json";
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import {useEffect} from "react";
import {BigNumber} from "ethers";


export const Buyer = () => {
    const {isWeb3Enabled, enableWeb3, web3, isAuthenticated, isWeb3EnableLoading} = useMoralis();
    const {runContractFunction, data, error, isLoading, isFetching} = useWeb3Contract();
    const CONTRACT_ABI = EcommContractJSON.EcommContract.contractABI;
    const CONTRACT_ADDRESS = EcommContractJSON.EcommContract.contractAddress;
    const contractOptions = {abi: CONTRACT_ABI, contractAddress: CONTRACT_ADDRESS}

    const BUYER_METHODS = {
        /**
         *
         * @param props{{id,email,name,cartId}}
         * @return props
         */
        registerBuyer: (props) => {
            const options = {
                abi: CONTRACT_ABI,
                contractAddress: CONTRACT_ADDRESS,
                functionName: "registerBuyer",
                params: {
                    buyerId: props.id || 'b',
                    name: props.name || 'b',
                    email: props.email || 'b',
                    cartId: props.cartId || 'b',
                },
            }
            console.log('registerBuyer', options)
            return runContractFunction({params: options})

        },
        buyersCount: async () => {
            try {
                const buyersCountOptions = {
                    functionName: "buyersCount",
                }
                let options = {...contractOptions, ...buyersCountOptions}
                console.log(options)
                let res = await runContractFunction({throwOnError: true, params: options});
                return res.toNumber();
            } catch (e) {
                console.log(e);
            }

        },
        buyerIds: async () => {
            let ids = [];

            try {
                let count = await BUYER_METHODS.buyersCount();
                console.log(count);
                for (let i = 0; i < count; i++) {
                    const buyerIdsOptions = {
                        functionName: "buyerIds",
                        params: {'': i}
                    }
                    let id = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...buyerIdsOptions}
                    });
                    console.log('id', id);
                    ids.push(id);

                }
            } catch (e) {
                console.log('e', e);

            } finally {
                return ids;
            }


        },
        buyersList: async () => {
            let buyers = [];
            try {
                let ids = await BUYER_METHODS.buyerIds();
                for (let i = 0; i < ids.length; i++) {
                    const sellerOptions = {
                        functionName: "buyers",
                        params: {'': ids[i]}
                    }
                    let buyer = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...sellerOptions}
                    });
                    buyers.push(buyer);

                }
            } catch (e) {
                console.log(e);
            } finally {
                return buyers;
            }

        },

        initBuyerCart: async (cartId, buyerId) => {
            let res = null;
            try {
                const funcOptions = {
                    functionName: "initializeBuyerCart",
                    params: {'buyerId': buyerId, 'cartId': cartId},
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

        },
        ordersCount: async (buyerId) => {
            try {
                const buyersCountOptions = {
                    functionName: "buyerOrdersCount",
                    params: {
                        '': buyerId
                    }
                }
                let options = {...contractOptions, ...buyersCountOptions}
                console.log(options)
                let res = await runContractFunction({throwOnError: true, params: options});
                return res.toNumber();
            } catch (e) {
                console.log(e);
            }


        },


        orders: async (buyerId) => {
            let ids = [];

            try {
                let count = await BUYER_METHODS.ordersCount(buyerId);
                console.log(count);
                for (let i = 0; i < count; i++) {
                    const buyerIdsOptions = {
                        functionName: "getBuyerOrderByIdx",
                        params: {buyerId: buyerId, index: i}
                    }
                    let id = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...buyerIdsOptions}
                    });
                    console.log('id', id);
                    ids.push(id);

                }
            } catch (e) {
                console.log('e', e);

            } finally {
                return ids;
            }


        },

        order: async (orderId) => {
            let order = null;

            try {

                const funcOptions = {
                    functionName: "orders",
                    params: {'': orderId}
                }
                order = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });


            } catch (e) {
                console.log('e', e);

            } finally {
                return order;
            }


        },

    }

    return BUYER_METHODS;


}