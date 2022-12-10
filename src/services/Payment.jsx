import { post,get, put} from '../api/axiosConfig'

export const makeAnOrder = async (type,id,data={}) =>{
    try {
        const response = await post(`/checkout/${type}/${id}`,data);
        return response
    } catch (error) { 
        return error.response
    };
}
export const confirmOrderByAdmin = async (id) =>{
    try {
        const response = await get(`/checkout/cod/success?paymentId=${id}`);
        return response
    } catch (error) { 
        return error.response
    };

}
export const cancelOrderByAdmin = async (id) =>{
    try {
        const response = await get(`/checkout/cod/cancel?paymentId=${id}`);
        return response
    } catch (error) { 
        return error.response
    };

}

export const createShipping = async (id,data={}) =>{
    try {
        const response = await post(`/manage/orders/ship/${id}`, data);
        return response
    } catch (error) { 
        return error.response
    };
}

export const changeStateOrder = async (id,state) =>{
    try {
        const response = await put(`/manage/orders/${state}/${id}`);
        return response
    } catch (error) { 
        return error.response
    };
}