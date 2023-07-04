import {createSlice} from "@reduxjs/toolkit";
const authSlice=createSlice({
    name: "auth",
    initialState: {
        login:{
            currentUser:null,
            isFetching: false,
            error : false
        },
        register:{
            isFetching:null,
            error:false,
            success:false
        }

    },
    reducers:{
        loginStart: (state)=>{
            state.login.isFetching=true;
        },
        loginSuccess:(state,action)=>{
            state.login.isFetching=true;
            state.login.currentUser=action.payload;
            state.login.error=false;
        },
        loginFailed: (state)=>{
            state.login.isFetching=true;
            state.login.error=true
        },registerStart: (state)=>{
            state.register .isFetching=true;
        },registerSuccess:(state)=>{
            state.register.isFetching=true;
            state.register.success=false;
            state.register.error=false
        },registerFailed:(state)=> {
            state.register.isFetching=false;
            state.register.success=false;
            state.register.error=true
        }
    }
});
export const {loginSuccess
    ,loginFailed,
    loginStart,
    registerStart,
    registerSuccess,
    registerFailed

}=authSlice.actions;
export default authSlice.reducer;