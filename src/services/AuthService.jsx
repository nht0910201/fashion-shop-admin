import { post, getCountryPost} from '../api/axiosConfig'

export const userLogin = async (data={}) =>{
    try {
        const response = await post('/auth/login',data);
        return response
    } catch (error) { 
        return error.response
    };

}
export const userRegister = async (data={}) =>{
    try {
        const response = await post('/auth/register',data);
        return response
    } catch (error) {
         return error.response
    };

}
export const verifyUser = async (data={}) =>{
    try {
        const response = await post('/auth/verify',data);
        return response
    } catch (error) {
         return error.response
    };
}
export const resetPassword = async (data={}) =>{
    try {
        const response = await post('/auth/reset',data);
        return response
    } catch (error) {
         return error.response
    };
}

export const getProvince = async (data) =>{
    try {
        const response = await post('/shipping/province',data);
        return response.data
    } catch (error) {
         return error.response
    };
}

export const getDistrict = async (data={}) =>{
    try {
        const response = await post('/shipping/district',data);
        return response.data
    } catch (error) {
         return error.response
    };
}
export const getWard = async (data={}) =>{
    try {
        const response = await post('/shipping/ward',data);
        return response.data
    } catch (error) {
         return error.response
    };
}
export const calShipingFee = async (data={}) =>{
    try {
        const response = await post('/shipping/fee',data);
        return response.data
    } catch (error) {
         return error.response
    };
}
