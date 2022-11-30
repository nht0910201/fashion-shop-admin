import {get,put,postImage} from '../api/axiosConfig'

export const getUserByID = async (id) =>{
    try{
        const response = await get(`/users/${id}`);
        return response
    }catch(error){
        return error.response
    }
}

export const updateUserByID = async (data,id) =>{
    try{
        const response = await put(`/users/${id}`,data);
        return response
    }catch(error){
        return error.response
    }
}

export const changePassword = async (data,id) =>{
    try{
        const response = await put(`/users/password/${id}`,data);
        return response
    }catch(error){
        return error.response
    }
}
export const forgotPassword = async (data,id) =>{
    try{
        const response = await put(`/users/reset/password/${id}`,data);
        return response
    }catch(error){
        return error.response
    }
}

export const updateAvatarUserByID = async (data,id) =>{
    try{
        const response = await postImage(`/users/avatar/${id}`,data);
        return response
    }catch(error){
        return error.response
    }
}
export const getOrders = async () =>{
    try{
        const response = await get('/users/order/history');
        return response
    }catch(error){
        return error.response
    }
}
export const getOrder = async (id) =>{
    try{
        const response = await get(`/orders/${id}`);
        return response
    }catch(error){
        return error.response
    }
}
export const cancelOrder = async (id) =>{
    try{
        const response = await put(`/orders/cancel/${id}`);
        return response
    }catch(error){
        return error.response
    }
}