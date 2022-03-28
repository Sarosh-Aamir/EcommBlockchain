/**
 * @author Sarosh Aamir
 * nextjs-blog
 */
import 'tailwindcss/tailwind.css';
import {useEffect, useState} from "react";
import {MoralisProvider, useMoralis} from "react-moralis";
import EcommContractJSON from "../ContractHelpers/EcommContract.json"
import Moralis from "moralis";
import {UserContext} from "../contexts/CustomUserContext/UserContext";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

function MyApp({Component, pageProps}) {

    return (
        <>
            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                <UserContext>
                    <div>
                        <Component {...pageProps} />
                    </div>
                </UserContext>
            </MoralisProvider>
        </>
    )
}

export default MyApp;