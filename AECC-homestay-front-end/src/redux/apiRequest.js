import axios from "axios";
import {loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess} from "./authSlice";
import Swal from 'sweetalert2';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8080/login", user);
        dispatch(loginSuccess(res.data));
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
    } catch(err) {
        await Swal.fire({
            icon: 'error',
            title: 'Đã xảy ra sự cố !',
            text: `${err.response.data.message}`,
        });
        dispatch(loginFailed());
    }
}
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    await axios.post("http://localhost:8080/signup", user).then((res) => {
        Swal.fire({
            title: '<strong>Đăng ký thành công</strong>',
            icon: 'info',
            html: `${res.data.message}`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'https://mail.google.com';
            }
        });
        dispatch(registerSuccess());
        if (res.data.message === "Vui lòng truy cập email để xác nhận đăng ký") {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }).catch((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Đã xảy ra sự cố !',
            text: `${error.response.data.message}`,
        })
        dispatch(registerFailed())
    })
}
