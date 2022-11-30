import { clearUserFromLocalStorage } from "./userHanle";
import { isExpired} from "react-jwt";

export const addToLocalStorage = (token) => {
    const curToken = window.localStorage.getItem('accessToken');
    if (curToken !== token && token) {
        // store access token in local storage
        window.localStorage.setItem('accessToken', JSON.stringify(token));
    } else {
        console.log("Add token failed")
        return null;
    }
}
export const getFromLocalStorage = () => {
    const curToken = window.localStorage.getItem('accessToken');
    if (curToken) {
        if (isExpired(curToken)) {
            clearUserFromLocalStorage()
            clearFromLocalStorage()
        } else {
            return JSON.parse(curToken);

        }
    } else {
        console.log("Get token failed")
        return null
    }
}
export const clearFromLocalStorage = () => {
    const curToken = JSON.parse(window.localStorage.getItem('accessToken'));
    if (curToken) {
        // store access token in local storage
        window.localStorage.removeItem('accessToken');
    } else {
        console.log("Clear token failed")
        return null
    }
}
