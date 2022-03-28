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

Moralis.onAccountChanged((accounts) => {
    console.log(accounts)
});

export default function Home({children}) {



    return (


        <div className="container">
            <StoreNav/>
            <Header></Header>
            <AddProduct></AddProduct>
            <ProductListing/>
            <ProductInfo/>
            <SellerList></SellerList>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.1-rc.0/web3.min.js"/>


        </div>
    )
}
