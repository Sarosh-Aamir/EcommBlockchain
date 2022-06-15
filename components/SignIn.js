import {LockClosedIcon} from '@heroicons/react/solid'
import Moralis from "moralis";
import {useMoralis, useWeb3ExecuteFunction} from "react-moralis";
import {Seller} from "../ContractHelpers/Seller";
import {useEffect, useState} from "react";
import {useCustomUserContext} from "../contexts/CustomUserContext/UserContext";

export default function SignIn() {
    const {isAuthenticating, isAuthenticated, user, authenticate, account, login, logout} = useMoralis();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {getAppUser, updateUser} = useCustomUserContext();


    useEffect(() => {
        console.log('SignIn¬', getAppUser());
    }, []);

    const handleOnChange = async (e) => {
        console.log(e.target.name)
        switch (e.target.name) {
            case 'password':
                setPassword(e.target.value);
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

    async function handleSignIn() {
        try {
            let user = await login(userName, password);
            console.log(JSON.stringify(user));
            await updateUser(user.id);
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
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
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
                                onClick={handleSignIn}
                                disabled={!isAuthenticated}
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                </span>
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )


}


