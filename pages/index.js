import Head from 'next/head'
import Header from "../components/Header";
import StoreNav from '../components/StoreNav'
import {useEffect, useState} from "react";
import ProductInfo from "../components/ProductInfo";
import ProductListing from "../components/ProductListing";
import SellerList from "../components/Lists/SellerList";
import Script from "next/script";
import {useMoralis} from "react-moralis";
import Moralis from "moralis";
import AddProduct from "../components/AddProduct";
import CartList from "../components/Lists/CartList";
import {Dialog} from "@headlessui/react";
import {XIcon} from "@heroicons/react/outline";
import OrdersList from "../components/Lists/OrdersList";

Moralis.onAccountChanged((accounts) => {
    console.log(accounts)
});

export default function Home({children}) {
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


    return (


        <div className="container">
            <StoreNav/>
            <Header></Header>
            <AddProduct></AddProduct>
            <ProductListing/>
            <SellerList></SellerList>
            <CartList></CartList>
            <OrdersList></OrdersList>


            <Script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.1-rc.0/web3.min.js"/>


        </div>
    )
}
