import {Moralis} from "moralis";
import {MoralisHelpers} from "./helpers";
import {useEffect} from "react";

export const ProductModel = () => {

    const OBJECT_NAME = 'Product';

    const ProductHelpers = {
        addProduct: async (metaData) => {
            const ProductObject = Moralis.Object.extend(OBJECT_NAME);
            const product = new ProductObject();
            console.log(product)
            const fileUrl = await MoralisHelpers.uploadJSONFile(`${metaData.name}`, metaData);
            product.set('metadataUrl', fileUrl);
            await product.save();
            return product;


        }

    }

    return ProductHelpers;

}