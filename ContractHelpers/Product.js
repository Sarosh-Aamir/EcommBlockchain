import Moralis from "moralis";
import EcommContractJSON from "../ContractHelpers/EcommContract.json";
import {useMoralis, useWeb3Contract, useWeb3ExecuteFunction} from "react-moralis";
import {useEffect} from "react";
import {BigNumber} from "ethers";

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
                    const sellerOptions = {
                        functionName: "products",
                        params: {'': ids[i]}
                    }
                    let seller = await runContractFunction({
                        throwOnError: true,
                        params: {...contractOptions, ...sellerOptions}
                    });
                    products.push(seller);

                }
            } catch (e) {
                console.log(e);
            } finally {
                return products;
            }

        }


    }

    return PRODUCT_METHODS;


}