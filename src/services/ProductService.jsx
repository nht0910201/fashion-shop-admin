import { get,post } from "../api/axiosConfig";

export const getProductByCategory = async (id,page,sort='') =>{
    try {
        const response = await get(`/products/category/${id}?size=6&page=${page}&sort=${sort}`);
        return response
    } catch (error) { 
        return error.response.data 
    };

}
export const getProductByID = async (id) =>{
    try {
        const response = await get(`/products/${id}`);
        return response
    } catch (error) { 
        return error.response.data 
    };

}
export const addProductToCart = async (data={}) => {
    try {
        const response = await post('/cart',data);
        return response
    } catch (error) { 
        return error.response.data 
    };
}

export const searchProduct = async (q,sort='') =>{
    try {
        const response = await get(`/products/search?q=${q}&sort=${sort}`);
        return response
    } catch (error) { 
        return error.response.data 
    };

}
export const getSortProducts = async (sort) =>{
    try {
        const response = await get(`/products?sort=${sort}&size=8`);
        return response
    } catch (error) { 
        return error.response.data 
    };

}
