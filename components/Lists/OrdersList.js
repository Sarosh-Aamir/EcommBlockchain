/* This example requires Tailwind CSS v2.0+ */
import {Seller} from "../../ContractHelpers/Seller";
import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {Contract} from "ethers";
import {Buyer} from "../../ContractHelpers/Buyer";
import {useCustomUserContext} from "../../contexts/CustomUserContext/UserContext";

const people = [
    {
        name: 'Jane Cooper',
        title: 'Regional Paradigm Technician',
        department: 'Optimization',
        role: 'Admin',
        email: 'jane.cooper@example.com',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    // More people...
]

export default function OrdersList() {
    const contractMethods = Buyer();
    const {isWeb3EnableLoading, isWeb3Enabled} = useMoralis()
    const [orders, setOrders] = useState([[]]);
    const [isLoading, setIsLoading] = useState(true);
    const {getAppUser, updateUser} = useCustomUserContext();
    const appUser = getAppUser();
    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading) {
            setOrders(await contractMethods.orders(appUser.objectId));
            setIsLoading(false);
        }
    }, [isWeb3EnableLoading, isWeb3Enabled])

    if (isLoading) {
        return (
            <>Orders</>
        )
    }

    return (
        <>
            <div className="text-4xl font-extrabold tracking-tight text-gray-900 justify-center">
                <span className="grid place-items-center ">
                    <h5>Orders</h5>
                </span>
            </div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Order Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Buyer Id
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Total
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Status</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {/*<img className="h-10 w-10 rounded-full"*/}
                                                    {/*     */}
                                                    {/*     alt="id"/>*/}
                                                </div>
                                                <div className="ml-4">
                                                    <div
                                                        className="text-sm font-medium text-gray-900">{order.orderId}</div>
                                                    <div
                                                        className="text-sm text-gray-500">{!order.orderFulfilled ? 'Pending Fulfilment' : 'Fulfilled'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.buyerId}</div>
                                            <div
                                                className="text-sm text-gray-500">{order.orderFulfilled ? '' : ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                      <span

                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {order.orderFulfilled ? 'Fulfilled' : 'Pending'}
                      </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalPaid.toNumber()} Eth</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                Cancel
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href={`/orders/fulfilment/${order.orderId}`} className="text-indigo-600 hover:text-indigo-900">
                                                View
                                            </a>
                                        </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}
