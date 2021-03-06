import React, {useEffect, useState} from "react";
import {Buyer} from "../../../ContractHelpers/Buyer";
import {useMoralis} from "react-moralis";
import {useCustomUserContext} from "../../../contexts/CustomUserContext/UserContext";
import {useRouter} from "next/router";
import {Product} from "../../../ContractHelpers/Product";
import {Order} from "../../../ContractHelpers/Order";

const OrderFulfilment = () => {
    const router = useRouter()
    const {id} = router.query;
    console.log(id);
    const contractBuyerMethods = Buyer();
    const contractProductMethods = Product();
    const contractOrderMethods = Order();

    const {isWeb3EnableLoading, isWeb3Enabled, enableWeb3} = useMoralis()
    const [order, setOrder] = useState();
    const [cartItems, setCartItems] = useState();
    const [orderTracking, setOrderTracking] = useState();

    const orderTotal = 0;

    const [isLoading, setIsLoading] = useState(true);
    const [url, setUrl] = useState();

    const {getAppUser, updateUser} = useCustomUserContext();
    const appUser = getAppUser();
    const orderItems = [];

    const handleOnChange = async (e) => {
        console.log(e.target.name, e.target.value)
        switch (e.target.name) {
            case 'tracking':
                setUrl(e.target.value);
                break;
        }
    }

    const fulfillOrder = async () => {

        let res = await contractOrderMethods.updateOrderStatus(id, 1);
        if (!!res) {
            alert(`Fulfilled, Hash:${res.hash}`);
            location.reload();

        }

    }

    const addTracking = async () => {

        let res = await contractOrderMethods.addTracking(id, url);
        if (!!res) {
            alert(`Tracking Added, Hash:${res.hash}`);
            location.reload();

        }

    }

    useEffect(async () => {
        if (!isWeb3Enabled && !isWeb3EnableLoading) {
            await enableWeb3()
        }

        if (isWeb3Enabled && !isWeb3EnableLoading) {
            let orderFromContract = await contractBuyerMethods.order(id);
            let cartProducts = await contractProductMethods.getCartProducts(orderFromContract.cartId);
            cartProducts.map(
                (async (cartProduct) => {
                    let uriSplit = cartProduct.metaDataURI.split('/');
                    let hash = uriSplit[uriSplit.length - 1];
                    let productInfo = await (await fetch(`https://gateway.moralisipfs.com/ipfs/${hash}`)).json()
                    orderItems.push({...productInfo, ...cartProduct})
                }));
            setOrder(orderFromContract);
            setCartItems(orderItems);
            setOrderTracking(await contractOrderMethods.getTracking(id))
            setIsLoading(false);
            console.log('cartItems', cartItems);
            console.log('Order', order);
            console.log('Tracking', orderTracking);

        }
    }, [isWeb3EnableLoading, isWeb3Enabled])

    if (isLoading) {
        return (
            <>Orders</>
        )
    }


    return (

        <>
            <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <div className="flex justify-start item-start space-y-2 flex-col ">
                    <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">Order
                        # {id} </h1>
                    <p className="text-base font-medium leading-6 text-gray-600">21st Mart 2021 at 10:34 PM</p>
                </div>
                <div
                    className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div
                            className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                            <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Customer???s
                                Cart</p>

                            {cartItems.map((item) => (
                                <div key={item.id}
                                     className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full ">
                                    <div className="pb-4 md:pb-8 w-full md:w-40">
                                        <img className="w-full hidden md:block"
                                             src={item.imageUrl}
                                             alt="dress"/>
                                        <img className="w-full md:hidden" src={item.imageUrl}
                                             alt="dress"/>
                                    </div>
                                    <div
                                        className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                                            <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">{item.name}</h3>
                                            <div className="flex justify-start items-start flex-col space-y-2">
                                                <p className="text-sm leading-none text-gray-800">
                                                    <span className="text-gray-300">SKU: </span> {item.sku}
                                                </p>
                                                <p className="text-sm leading-none text-gray-800">
                                                    <span className="text-gray-300">Category: </span> {item.category}
                                                </p>
                                                <p className="text-sm leading-none text-gray-800">
                                                    <span className="text-gray-300">Supplier: </span> {item.supplierId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between space-x-8 items-start w-full">
                                            <p className="text-base xl:text-lg leading-6">
                                                Eth {item.supplierPrice.toNumber()} <span
                                                className="text-red-300 line-through">Eth 11</span>
                                            </p>
                                            <p className="text-base xl:text-lg leading-6 text-gray-800">01</p>
                                            <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">{item.supplierPrice.toNumber()}</p>
                                        </div>
                                    </div>
                                </div>


                            ))}


                        </div>


                        <div
                            className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
                                {/*<div*/}
                                {/*    className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">*/}
                                {/*    /!*<div className="flex justify-between  w-full">*!/*/}
                                {/*    /!*    <p className="text-base leading-4 text-gray-800">Subtotal</p>*!/*/}
                                {/*    /!*    <p className="text-base leading-4 text-gray-600">$56.00</p>*!/*/}
                                {/*    /!*</div>*!/*/}
                                {/*    <div className="flex justify-between items-center w-full">*/}
                                {/*        <p className="text-base leading-4 text-gray-800">*/}
                                {/*            Discount <span*/}
                                {/*            className="bg-gray-200 p-1 text-xs font-medium leading-3  text-gray-800">STUDENT</span>*/}
                                {/*        </p>*/}
                                {/*        <p className="text-base leading-4 text-gray-600">-$28.00 (50%)</p>*/}
                                {/*    </div>*/}
                                {/*    <div className="flex justify-between items-center w-full">*/}
                                {/*        <p className="text-base leading-4 text-gray-800">Shipping</p>*/}
                                {/*        <p className="text-base leading-4 text-gray-600">$8.00</p>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
                                    <p className="text-base font-semibold leading-4 text-gray-600">{order.totalPaid.toNumber()} Eth</p>
                                </div>
                            </div>
                            <div
                                className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">{!!order.orderFulfilled ? 'Yay Order Fulfilled :)' : 'Fulfill Order'}</h3>
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="w-8 h-8">
                                            <img className="w-full h-full" alt="logo"
                                                 src="https://i.ibb.co/L8KSdNQ/image-3.png"/>
                                        </div>
                                        <div className="flex flex-col justify-start items-center">
                                            <p className="text-lg leading-6 font-semibold text-gray-800">
                                                DPD Delivery
                                                <br/>
                                                <span className="font-normal">Delivery with 24 Hours</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/*<p className="text-lg font-semibold leading-6 text-gray-800">$8.00</p>*/}
                                </div>

                                <div className="w-full flex justify-center items-center">
                                    <div className="relative z-0 mb-6 w-full group">
                                        <input type="text" name="tracking" id="tracking" onChange={handleOnChange}
                                               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                               placeholder="Tracking Url" required
                                               value={orderTracking}

                                        />
                                        <label htmlFor="sku"
                                               className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                            Tracking Url</label>
                                    </div>

                                    {!order.orderFulfilled && (
                                        <button
                                            onClick={fulfillOrder}
                                            className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white"> Fulfill
                                        </button>
                                    )}


                                    {!!true && (<button
                                        onClick={addTracking}
                                        className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white"> Add
                                        Tracking
                                    </button>)}


                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                        <div
                            className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                            <div className="flex flex-col justify-start items-start flex-shrink-0">
                                <div
                                    className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                    <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar"/>
                                    <div className=" flex justify-start items-start flex-col space-y-2">
                                        <p className="text-base font-semibold leading-4 text-left text-gray-800">David
                                            Kent</p>
                                        <p className="text-sm leading-5 text-gray-600">10 Previous Orders</p>
                                    </div>
                                </div>

                                <div
                                    className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                                            stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                    <p className="cursor-pointer text-sm leading-5 text-gray-800">david89@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                                <div
                                    className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                    <div
                                        className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                                        <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping
                                            Address</p>
                                        <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">180
                                            North King Street, Northhampton MA 1060</p>
                                    </div>
                                    <div
                                        className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 ">
                                        <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Billing
                                            Address</p>
                                        <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">180
                                            North King Street, Northhampton MA 1060</p>
                                    </div>
                                </div>
                                <div
                                    className="flex w-full justify-center items-center md:justify-start md:items-start">
                                    <button
                                        className="mt-6 md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800">Edit
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default OrderFulfilment;
