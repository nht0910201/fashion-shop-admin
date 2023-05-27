import axios from 'axios';
import { API_ADDRESS, API_HOST, API_LOCAL, SHOP_ID, TOKEN_API_ADDRESS } from '../common/const';
import { clearFromLocalStorage, getFromLocalStorage } from '../utils/tokenHandle';
import { clearUserFromLocalStorage } from '../utils/userHanle';

const axiosConfig = axios.create({
    baseURL: API_LOCAL
});
const axiosCountry = axios.create({
    baseURL: API_ADDRESS,
})
axiosConfig.interceptors.request.use(
    function (req) {
        const token = getFromLocalStorage()
        if (token)
            req.headers['authorization'] = `Bearer ${token}`;
        return req;
    },
    function (error) {
        return Promise.reject(error);
    },
);
axiosConfig.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if(error.response.status === 401){
            clearFromLocalStorage()
            clearUserFromLocalStorage()
            window.location.href= '/'
        }
        return Promise.reject(error);
    });

export const getCountryPost = async (path, params = {}) => {
    const response = await axiosCountry.post(path, params, { headers: { "token": TOKEN_API_ADDRESS, "ShopId": SHOP_ID } });
    return response.data;
};
export const get = async (path, params = {}) => {
    const response = await axiosConfig.get(path, params);
    return response.data;
};
export const post = async (path, params = {}) => {
    const response = await axiosConfig.post(path, params);
    return response;
};
export const put = async (path, params = {}) => {
    const response = await axiosConfig.put(path, params);
    return response.data;
};
export const patch = async (path, params = {}) => {
    const response = await axiosConfig.patch(path, params);
    return response.data;
};
export const del = async (path, params = {}) => {
    const response = await axiosConfig.delete(path, params);
    return response.data;
};
export const postImage = async (path, params) => {
    const response = await axiosConfig.post(path, params, { headers: { "Content-Type": "multipart/form-data" } });
    return response;
};

export default axiosConfig;

