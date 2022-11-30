import { createSlice } from "@reduxjs/toolkit";
import { addToLocalStorage,clearFromLocalStorage } from "../../utils/tokenHandle";
import { addUserToLocalStorage, clearUserFromLocalStorage } from "../../utils/userHanle";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:{
            id:"",
            email:"",
            name:"",
            avatar:"",
            gender:"",
            role:"",
            accessToken:""
        }
    },
    reducers:{
        login(state,action){
            let {id,email,name,avatar,gender,role,accessToken} = action.payload.data
            if(avatar===null)
            {
                avatar = 'https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png'
            }
            addUserToLocalStorage(id,email,name,avatar,gender,role)
            addToLocalStorage(accessToken)
        },
        logout(state,action){
            clearUserFromLocalStorage();
            clearFromLocalStorage();
            window.location.reload()
        }
    }
})
export const { login, logout } = authSlice.actions;

export const userSelector = state => state.auth.user;
export const accessToken = state => state.auth.user.accessToken;

export default authSlice.reducer;
