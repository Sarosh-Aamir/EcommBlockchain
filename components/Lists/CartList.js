/* This example requires Tailwind CSS v2.0+ */
import {Fragment, useEffect, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {XIcon} from '@heroicons/react/outline'
import {Product} from "../../ContractHelpers/Product";
import {useCustomUserContext} from "../../contexts/CustomUserContext/UserContext";
import {useMoralis} from "react-moralis";
import {BigNumber} from "ethers";
import Moralis from "moralis";
import {Buyer} from "../../ContractHelpers/Buyer";

const products = [
    {
        id: 1,
        name: 'Throwback Hip Bag',
        href: '#',
        color: 'Salmon',
        price: '$90.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
        imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
    },
    {
        id: 2,
        name: 'Medium Stuff Satchel',
        href: '#',
        color: 'Blue',
        price: '$32.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
        imageAlt:
            'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    },
    // More products...
]

export default function CartList() {
    const productContractMethods = Product();
    const buyerContractMethods = Buyer();
    const {user, isAuthenticated, account, isWeb3EnableLoading, isWeb3Enabled} = useMoralis();
    const [isLoading, setIsLoading] = useState(true);
    const {getAppUser, updateUser} = useCustomUserContext();
    const [count, setCount] = useState(0);
    const [cartProducts, setCartProducts] = useState();
    const [checkCount, setCheckCount] = useState(false);
    const [total, setTotal] = useState(0);

    var totalCartPrice = 0;

    const appUser = getAppUser();


    async function initOrder() {
        let orderObject = Moralis.Object.extend("Order");
        let order = new orderObject();
        order.set("buyerId", appUser.id);
        order.set("cartId", appUser.cartId);
        await order.save();
        console.log('initOrder', order);
        return order;
    }

    async function initNewCart() {
        let cartObject = Moralis.Object.extend("Cart");
        let cart = new cartObject();
        cart.set("buyerId", appUser.objectId);
        await cart.save();
        console.log(cart);
        let currUser = Moralis.User.current();
        currUser.set('cartId', cart.id);
        console.log('new cart id', cart.id);
        await currUser.save();
        console.log('currUser', currUser);
        await updateUser(currUser.id);
        console.log('appUser', appUser);
        let res = await buyerContractMethods.initBuyerCart(cart.id, appUser.objectId);
        console.log(res);

        return cart;
    }

    const checkout = async () => {
        let order = await initOrder();
        let orderId = order.id;
        let buyerId = appUser.objectId;
        let cartId = appUser.cartId;
        console.log('cartId', cartId)
        let res = await productContractMethods.checkout(orderId, buyerId, cartId, total);
        if (!!res.hash) {
            await initNewCart();
            // location.reload();

        }

        console.log('res', res);

    }

    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading && !checkCount && appUser.cartId) {
            let cartProducts = await productContractMethods.getCartProducts(appUser.cartId);
            console.log('cartProducts', cartProducts);
            setCartProducts(cartProducts);
            cartProducts.map(product => {
                totalCartPrice += product.supplierPrice.toNumber();
            })
            setIsLoading(false);
            console.log('totalCartPrice', totalCartPrice);
            setTotal(totalCartPrice);
            let bOrders = await buyerContractMethods.orders(appUser.objectId);
            console.log('OrderBs', bOrders);
        }
    }, [isWeb3EnableLoading, isWeb3Enabled], count, checkCount)

    if (isLoading || appUser.sellerType) {
        return (
            <></>
        )
    }
    return (
        <>

            <div className="text-4xl font-extrabold tracking-tight text-gray-900 justify-center">
                <span className="grid place-items-center ">
                    <h5>Cart</h5>
                </span>
            </div>

            <div className="mt-8">
                <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartProducts.map((product) => (

                            < div key={product.id}>
                                <CartProductTile {...product}></CartProductTile>
                            </div>

                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{total} Eth</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at
                    checkout.</p>
                <div className="mt-6">
                    <a
                        onClick={checkout}
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Checkout
                    </a>
                </div>

            </div>
        </>
    )

    function CartProductTile(product) {
        const {user, isAuthenticated, account, isWeb3EnableLoading, isWeb3Enabled} = useMoralis();
        const [metaData, setMetaData] = useState();
        const [isLoading, setIsLoading] = useState(true);
        const productContractMethods = Product();
        const {getAppUser} = useCustomUserContext();
        const appUser = getAppUser();
        console.log('ProductTile:appUser', appUser);


        useEffect(async () => {
            if (isWeb3Enabled && !isWeb3EnableLoading && !metaData) {
                let uriSplit = product.metaDataURI.split('/');
                let hash = uriSplit[uriSplit.length - 1];
                let productInfo = await (await fetch(`https://gateway.moralisipfs.com/ipfs/${hash}`)).json();
                console.log('productInfo', productInfo);
                setMetaData(productInfo);
                setIsLoading(false);
            }
        }, [isWeb3EnableLoading, isWeb3Enabled], metaData)

        if (isLoading || appUser.sellerType) {
            return (
                <></>
            )
        }
        return (

            <>
                <li key={product.id} className="flex py-6">
                    <div
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                            src={metaData.imageUrl}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                        <div>
                            <div
                                className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                    {metaData.name}
                                </h3>
                                <p className="ml-4">{product.supplierPrice.toNumber()} Eth</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                        </div>
                        <div
                            className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {product.quantity || 1}</p>

                            <div className="flex">
                                <button type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </li>

            </>
        )
    }
}
