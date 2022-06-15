import {useMoralis} from "react-moralis";
import {useCustomUserContext} from "../contexts/CustomUserContext/UserContext";
import {useEffect, useState} from "react";
import {ProductModel} from "../MoralisDBHelpers/productModel";
import {Product} from "../ContractHelpers/Product";
import {MoralisHelpers} from "../MoralisDBHelpers/helpers";

export default function AddProduct() {

    const {isAuthenticated, isInitialized, isWeb3Enabled} = useMoralis();
    const {getAppUser} = useCustomUserContext();
    const appUser = getAppUser();
    console.log(appUser)
    const productModel = ProductModel();
    const contractProductMethods = Product();

    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [insStock, setInStock] = useState('');
    const [file, setFile] = useState();
    const [supplierPrice, setSupplierPrice] = useState(0);
    const [merchantPrice, setMerchantPrice] = useState(0);
    const [category, setCategory] = useState('');


    const addProduct = async () => {
        let imageUrl = await MoralisHelpers.uploadFile(`${file.name}`, file);
        let metaData = {
            name,
            description,
            insStock,
            merchantPrice,
            supplierPrice,
            category,
            imageUrl: imageUrl
        }
        let product = await productModel.addProduct(metaData);
        console.log(product);
        let contractProps = {
            id: product.id,
            sku: sku,
            metaDataUri: product.get('metadataUrl'),
            inStock: insStock,
            supplierPrice: supplierPrice,
            merchantPrice: merchantPrice,
            supplierId: appUser.objectId,
            merchantId: appUser.objectId
        }
        console.log(contractProps);
        let resp = contractProductMethods.addProduct(contractProps);
        console.log(resp);
    }

    const handleOnChange = async (e) => {
        console.log(e.target.name, e.target.value)
        switch (e.target.name) {
            case 'sku':
                setSku(e.target.value);
                break;
            case 'product_name':
                setName(e.target.value);
                break;
            case 'product_desc':
                setDescription(e.target.value);
                break;
            case 'product_file':
                console.log(e.target.files[0]);
                setFile(e.target.files[0]);
                break;
            case 'm_price':
                setMerchantPrice(e.target.value);
                break;
            case 's_price':
                setSupplierPrice(e.target.value);
                break;
            case 'in_stock':
                setInStock(e.target.value);
                break;
            case 'category':
                setCategory(e.target.value);
                break;
        }
    }

    if (!appUser.sellerType) {
        return (
            <></>
        )
    }

    return (

        <>
            <div className="max-w-2xl mx-auto m-5">

                <form>
                    <div className="relative z-0 mb-6 w-full group">
                        <input type="text" name="sku" id="sku" onChange={handleOnChange}
                               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                               placeholder="Product SKU" required/>
                        <label htmlFor="sku"
                               className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product
                            SKU</label>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <input type="number" name="in_stock" id="in_stock" onChange={handleOnChange}
                               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                               placeholder=" " required/>
                        <label htmlFor="in_stock"
                               className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">In
                            Stock</label>
                    </div>
                    <div className="relative z-0 mb-6 w-full group">
                        <select name="category" id="category" onChange={handleOnChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder="Product Category" required>
                            <option value="select">Select</option>
                            <option value="Shirt">Clothing</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Skin Care">Skin Care</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <label htmlFor="category"
                               className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product
                            Category</label>
                    </div>

                    <div className="grid xl:grid-cols-2 xl:gap-6">
                        <div className="relative z-0 mb-12 w-full group">
                            <input type="text" name="product_name" id="product_name" onChange={handleOnChange}
                                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                   placeholder=" " required/>
                            <label htmlFor="product_name"
                                   className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product
                                name</label>
                        </div>
                        <div className="relative z-0 mb-12 w-full group">
                            <input type="textarea" name="product_desc" onChange={handleOnChange}
                                   id="product_desc"
                                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                   placeholder=" " required/>
                            <label htmlFor="product_desc"
                                   className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Product
                                Description</label>
                        </div>
                    </div>
                    <div className="grid xl:grid-cols-2 xl:gap-6">
                        <div className="relative z-0 mb-12 w-full group">
                            <input type="number" name="m_price" id="m_price" onChange={handleOnChange}
                                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                   placeholder="Merchant Price In ETH" required/>
                            <label htmlFor="m_price"
                                   className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Merchant
                                Price In ETH</label>
                        </div>
                        <div className="relative z-0 mb-12 w-full group">
                            <input type="number" name="s_price" id="s_price" onChange={handleOnChange}
                                   className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                   placeholder="Supplier Price In ETH" required/>
                            <label htmlFor="m_price"
                                   className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Supplier
                                Price In ETH</label>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="mb-3 w-96">
                            <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Product
                                Image</label>
                            <input required={true} accept='image/*' onChange={handleOnChange} name='product_file'
                                   className="form-control
    block
    w-full
    px-3
    py-1.5
    text-base
    font-normal
    text-gray-700
    bg-white bg-clip-padding
    border border-solid border-gray-300
    rounded
    transition
    ease-in-out
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile"/>
                        </div>
                    </div>
                    <button type="button"
                            onClick={addProduct}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                    </button>
                </form>


            </div>
        </>

    )
}