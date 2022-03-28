import Moralis from "moralis";
import EcommContractJSON from "../ContractHelpers/EcommContract.json";
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import {useEffect} from "react";
import {BigNumber} from "ethers";


export const Seller = () => {
    const {isWeb3Enabled, enableWeb3, web3, isAuthenticated, isWeb3EnableLoading} = useMoralis();
    const {runContractFunction, data, error, isLoading, isFetching} = useWeb3Contract();
    const CONTRACT_ABI = EcommContractJSON.EcommContract.contractABI;
    const CONTRACT_ADDRESS = EcommContractJSON.EcommContract.contractAddress;
    const contractOptions = {abi: CONTRACT_ABI, contractAddress: CONTRACT_ADDRESS}
    useEffect(async () => {
        if (!isWeb3Enabled && !isWeb3EnableLoading) {
            await enableWeb3()
        }

    }, [isWeb3Enabled, isWeb3EnableLoading, web3])
    const SELLER_METHODS = {
        /**
         *
         * @param props{{id,email,name,account,isSupplier}}
         * @return props
         */
        registerSeller: (props) => {
            const options = {
                abi: CONTRACT_ABI,
                contractAddress: CONTRACT_ADDRESS,
                functionName: "registerSeller",
                params: {
                    id: props.id || 'b',
                    name: props.name || 'b',
                    email: props.email || 'b',
                    accountAddress: props.account || '0xmmks',
                    isSupplier: props.isSupplier || false
                },
                msgValue: Moralis.Units.ETH(5)
            }
            return runContractFunction({params: options})

        },
        sellerCount: async () => {
            try {
                const sellersCountOptions = {
                    functionName: "sellersCount",
                }
                let options = {...contractOptions, ...sellersCountOptions}
                console.log(options)
                let res = await runContractFunction({throwOnError: true, params: options});
                return res.toNumber();
            } catch (e) {
                console.log(e);
            }

        },
        sellerIds: async () => {
            let ids = [];

            try {
                let count = await SELLER_METHODS.sellerCount();
                console.log(count);
                for (let i = 0; i < count; i++) {
                    const sellerIdsOptions = {
                        functionName: "sellerIds",
                        params: {'': i}
                    }
                    let id = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...sellerIdsOptions}
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
        sellerList: async () => {
            let sellers = [];
            try {
                let ids = await SELLER_METHODS.sellerIds();
                for (let i = 0; i < ids.length; i++) {
                    const sellerOptions = {
                        functionName: "sellers",
                        params: {'': ids[i]}
                    }
                    let seller = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...sellerOptions}
                    });
                    sellers.push(seller);

                }
            } catch (e) {
                console.log(e);
            } finally {
                return sellers;
            }

        }


    }

    return SELLER_METHODS


}