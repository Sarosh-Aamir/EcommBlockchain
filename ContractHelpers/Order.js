import Moralis from "moralis";
import EcommContractJSON from "../ContractHelpers/EcommContract.json";
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import {useEffect} from "react";
import {BigNumber} from "ethers";


export const Order = () => {

    const {runContractFunction, data, error, isLoading, isFetching} = useWeb3Contract();
    const CONTRACT_ABI = EcommContractJSON.EcommContract.contractABI;
    const CONTRACT_ADDRESS = EcommContractJSON.EcommContract.contractAddress;
    const contractOptions = {abi: CONTRACT_ABI, contractAddress: CONTRACT_ADDRESS}

    const ORDER_METHODS = {

        updateOrderStatus: async (orderId, status) => {
            let res = null;

            try {

                const funcOptions = {
                    functionName: "updateOrderStatus",
                    params: {'orderId': orderId, 'status': status}
                }
                res = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });


            } catch (e) {
                console.log('e', e);

            } finally {
                return res;
            }

        },

        addTracking: async (orderId, url) => {
            let res = null;

            try {

                const funcOptions = {
                    functionName: "addTrackingUrl",
                    params: {'orderId': orderId, 'url': url}
                }
                res = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });


            } catch (e) {
                console.log('e', e);

            } finally {
                return res;
            }

        },
        getTracking: async (orderId) => {
            let res = null;

            try {

                const funcOptions = {
                    functionName: "orderTracking",
                    params: {'': orderId}
                }
                res = await runContractFunction({
                    throwOnError: true,
                    params: {...contractOptions, ...funcOptions}
                });


            } catch (e) {
                console.log('e', e);

            } finally {
                return res;
            }

        }



    }

    return ORDER_METHODS;


}