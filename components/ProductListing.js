import {useMoralis} from "react-moralis";
import {useCustomUserContext} from "../contexts/CustomUserContext/UserContext";
import {useEffect, useState} from "react";
import {Product} from "../ContractHelpers/Product";

export default function ProductListing() {
    const {user, isAuthenticated, account, isWeb3EnableLoading, isWeb3Enabled} = useMoralis();
    const {getAppUser} = useCustomUserContext();
    const appUser = getAppUser();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const productContractMethods = Product();

    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading) {
            setProducts(await productContractMethods.productList());
            setIsLoading(false);
        }
    }, [isWeb3EnableLoading, isWeb3Enabled])

    if (isLoading) {
        return (
            <>Products</>
        )
    }

    return (
        <>
            {console.log(products)}
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Products</h2>

                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <div key={product.id} className="group relative">
                                {console.log('fetch',product.id)}
                                <ProductTile {...product}></ProductTile>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    )
}

function ProductTile(product) {
    const {user, isAuthenticated, account, isWeb3EnableLoading, isWeb3Enabled} = useMoralis();
    const [metaData, setMetaData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading && !metaData) {
            setMetaData(await (await fetch(product.metaDataURI)).json());
            setIsLoading(false);
        }
    }, [isWeb3EnableLoading, isWeb3Enabled], metaData)

    if (isLoading) {
        return (
            <></>
        )
    }
    return (

        <>
            <div
                className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                    src={metaData.imageUrl}
                    alt={product.imageAlt}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <a href={metaData.imageUrl}>
                            <span aria-hidden="true" className="absolute inset-0"/>
                            name: {metaData.name}
                        </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">sku:{product.sku}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.supplierPrice.toNumber()} ETH</p>
            </div>
        </>
    )
}