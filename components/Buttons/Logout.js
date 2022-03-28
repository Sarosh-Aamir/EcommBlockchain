import {useCustomUserContext} from "../../contexts/CustomUserContext/UserContext";
import {useEffect} from "react";

export default function Logout() {
    const {getAppUser} = useCustomUserContext();
    let appUser = getAppUser()
    return (
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
            <span>{appUser.username || ''}</span>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                Log Out
            </a>
        </div>
    )
}