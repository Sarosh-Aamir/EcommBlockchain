import {createContext, useContext, useEffect, useState} from "react";
import {setCookies, checkCookies, getCookies, getCookie, removeCookies} from 'cookies-next';
import Moralis from "moralis";

const AppUserContext = createContext();
const UpdateUserContext = createContext();
const GetUserContext = createContext();

export const useCustomUserContext = () => {
    return {
        appUser: useContext(AppUserContext),
        updateUser: useContext(UpdateUserContext),
        getAppUser: useContext(GetUserContext)
    }
}
export const UserContext = ({children}) => {
    const getMoralisUser = async (userId) => {
        const MoralisUser = Moralis.Object.extend("User");
        const query = new Moralis.Query(MoralisUser);
        query.equalTo("objectId", userId);
        const results = await query.find();
        console.log(results);
        return results.length > 0 ? results[0] : null;
    }

    const [appUserId, setAppUserId] = useState('');
    const [appUser, setAppUser] = useState('');
    const updateAppUser = async (id) => {
        let moralisAppUser = await getMoralisUser(id);
        if (!!moralisAppUser) {
            setAppUserId(appUserId);
            setAppUser(JSON.stringify(moralisAppUser));
            setCookies('appUserId', appUserId);
            setCookies('appUser', JSON.stringify(moralisAppUser));
        }

    }
    const getAppUser = () => {
        if (!!appUser) {
            return JSON.parse(appUser);
        }
        return {};
    }
    useEffect(() => {
        checkCookies('appUser') ? setAppUser(getCookie('appUser')) : '';
        checkCookies('appUser') ? setAppUserId(getCookie('appUserId')) : '';
    }, [appUser, appUserId])
    return (

        <AppUserContext.Provider value={appUser}>
            <UpdateUserContext.Provider value={updateAppUser}>
                <GetUserContext.Provider value={getAppUser}>
                    {children}
                </GetUserContext.Provider>
            </UpdateUserContext.Provider>
        </AppUserContext.Provider>

    )


}