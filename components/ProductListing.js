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
                    <div className="text-4xl font-extrabold tracking-tight text-gray-900 justify-center">
                <span className="grid place-items-center ">
                    <h5>Products</h5>
                </span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (

                            <div key={product.id} className="group relative">
                                {console.log('fetch', product.id)}
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
    const productContractMethods = Product();
    const {getAppUser} = useCustomUserContext();
    const appUser = getAppUser();
    console.log('ProductTile:appUser', appUser);


    const addToCart = async () => {
        let cartId = appUser.cartId;
        let buyerId = appUser.objectId;
        let productId = product.id;
        console.log(cartId, buyerId, productId);
        let res = await productContractMethods.addToCart(cartId, productId);
        alert(`Added To Cart: hash:${res.hash}`);
        console.log(res);

    }

    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading && !metaData) {
            let uriSplit = product.metaDataURI.split('/');
            let hash = uriSplit[uriSplit.length-1];
            let productInfo = await (await fetch(`https://gateway.moralisipfs.com/ipfs/${hash}`)).json();
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
                            <span aria-hidden="true" className="absolute"/>
                            name: {metaData.name}
                        </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">sku:{product.sku}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.supplierPrice.toNumber()} ETH</p>
            </div>
            <div className="">
                <button onClick={addToCart}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add To Cart
                </button>
            </div>
        </>
    )
}