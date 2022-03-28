/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {LockClosedIcon} from '@heroicons/react/solid'
import Moralis from "moralis";
import {useMoralis, useWeb3ExecuteFunction} from "react-moralis";
import {Seller} from "../ContractHelpers/Seller";
import {useEffect, useState} from "react";
import {useCustomUserContext} from "../contexts/CustomUserContext/UserContext";

export default function Example() {
    const {isAuthenticating, isAuthenticated, user, authenticate, account} = useMoralis();
    const [email, setEmail] = useState()
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [sellerType, setSellerType] = useState('');
    const [password, setPassword] = useState('');
    const contractSellerMethods = Seller();
    const {getAppUser, updateUser} = useCustomUserContext();


    useEffect(() => {
        console.log('Signup¬', getAppUser());
    }, []);

    const handleOnChange = async (e) => {
        console.log(e.target.name)
        switch (e.target.name) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'full-name':
                setName(e.target.value);
                break;
            case 'seller-type':
                console.log(e.target.value);
                setSellerType(e.target.value);
                break;
            case 'user-name':
                setUserName(e.target.value);
                break;
        }
    }

    async function connectMetamask() {
        await authenticate();
        console.log("connectMetamask:User", user)


    }

    async function handleRegister() {
        const user = new Moralis.User();
        user.set("username", userName);
        user.set("password", password);
        user.set("email", email);
        user.set("type", "seller");
        user.set("sellerType", sellerType);


// other fields can be set just like with Moralis.Object
        user.set("phone", "415-392-0202");
        try {
            await user.signUp();
            await updateUser(user.id);
            const registerSeller = contractSellerMethods.registerSeller({
                id: user.id,
                isSupplier: sellerType == 'supplier',
                name: userName,
                email: email
            });
            console.log(true)
            registerSeller.then((res) => {
                console.log(res);
            })

        } catch (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    }

    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <input type="hidden" name="remember" defaultValue="true"/>

                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="user-name" className="sr-only">
                                    User Name
                                </label>
                                <input
                                    id="user-name"
                                    name="user-name"
                                    type="text"
                                    autoComplete="user-name"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="User Name"
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="full-name" className="sr-only">
                                    Full Name
                                </label>
                                <input
                                    id="full-name"
                                    name="full-name"
                                    type="text"
                                    autoComplete="full-name"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                    onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div>
                                <div className="form-check">
                                    <input
                                        defaultValue="Supplier"
                                        className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                        type="radio" name="seller-type" id="seller-type-1" onChange={handleOnChange}/>
                                    <label className="form-check-label inline-block text-gray-800"
                                           htmlFor="seller-type-1">
                                        Supplier
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        defaultValue="Merchant"
                                        className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                        type="radio" name="seller-type" id="seller-type-2" onChange={handleOnChange}/>
                                    <label className="form-check-label inline-block text-gray-800"
                                           htmlFor="seller-type-2">
                                        Merchant
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={connectMetamask}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                </span>
                                Connect Metamask
                            </button>
                            <span className="justify-center">{isAuthenticated ? 'Connected' : 'Disconnected'}</span>

                        </div>
                        <div>
                            <button
                                onClick={handleRegister}
                                //disabled={!isAuthenticated}
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                </span>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )


}


