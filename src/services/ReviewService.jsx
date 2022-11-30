import { post,get } from '../api/axiosConfig'

export const review = async (data={}) =>{
    try {
        const response = await post('/reviews',data);
        return response
    } catch (error) { 
        return error.response
    };
}
export const getReviewsByProduct = async (id,page) =>{
    try {
        const response = await get(`/reviews/${id}?size=1&page=${page}`);
        return response
    } catch (error) { 
        return error.response.data 
    };

}