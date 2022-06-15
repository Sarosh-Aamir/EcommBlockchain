import {useRouter} from 'next/router'
import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import ProductInfo from "../../components/ProductInfo";

export default function productInfo() {
    const router = useRouter()
    const {uri} = router.query;
    const [metaData, setMetaData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const {user, isAuthenticated, account, isWeb3EnableLoading, isWeb3Enabled} = useMoralis();
    useEffect(async () => {
        if (isWeb3Enabled && !isWeb3EnableLoading && !metaData) {
            setMetaData(await (await fetch(uri)).json());
            setIsLoading(false);
        }
    }, [isWeb3EnableLoading, isWeb3Enabled], metaData)

    if (isLoading) {
        return (
            <>
                <ProductInfo {...{abc:'hello'}}></ProductInfo>
            </>
        )
    }
    return (<>
        <ProductInfo {...{abc:'hello'}}></ProductInfo>
    </>)


}